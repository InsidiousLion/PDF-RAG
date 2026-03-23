import express from 'express'
import cors from 'cors'
import multer from 'multer';
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

const queue = new Queue("pdf-upload-queue",{
    connection: {
        host: "localhost",
        port: "6379",
    }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
})

const upload = multer({ storage: storage });

const app = express();
app.use(cors());

// Simple Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
});

app.get("/",(req,res) => {
    res.send("Working!!!");
});

app.post("/upload/pdf",upload.single("pdf"),async (req,res) => {
    await queue.add("file-ready",JSON.stringify({
        filename: req.file.filename,
        destination: req.file.destination,
        path: req.file.path,
    }))
    if (!req.file) {
        console.log("No file received");
        return res.status(400).json({message: "No file uploaded"});
    }
    console.log("File received:", req.file.originalname);
    res.json({message:"uploaded"});
});

app.get("/chat",async (req,res) => {
    const query = req.query.message;

    const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GEMINI_API_KEY, 
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: "http://localhost:6333",
    collectionName: "pdf-docs",
    });
    
    const retriever = vectorStore.asRetriever({
    k: 10,
    });
    const result = await retriever.invoke(query);

    const SYSTEM_PROMPT =  `
    You are an helpfull assistant who is gonna answer the user queries with the help of the context provided from the pdf through a rag retireval.
    If the user needs a pdf summary ask him for which but if aldready mentioned no need.
    Context:
    ${JSON.stringify(result)}
    `;
    
    const chatResult = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {role: "system",content: SYSTEM_PROMPT},
            {role: "user",content: query},
        ]
    });

    res.json({content: chatResult.choices[0].message.content})

})

app.listen(8000, () => console.log(`Server started in port ${8000}`));

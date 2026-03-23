import { Job, Worker } from 'bullmq';
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { CharacterTextSplitter,RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import dotenv from 'dotenv';
dotenv.config();

const worker = new Worker('pdf-upload-queue', async job => {
    console.log("Job:",job.data);
    const data = JSON.parse(job.data);

    const loader = new PDFLoader(data.path);
    const docs = await loader.load();

    console.log("Loaded docs:", docs.length);

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    console.log("Chunks:", splitDocs.length);

    const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GEMINI_API_KEY, 
    });
    
    try {
        const vectorStore = await QdrantVectorStore.fromDocuments(
            [],
            embeddings,
            {
                url: "http://localhost:6333",
                collectionName: "pdf-docs",
            }
        );

        const BATCH_SIZE = 30;

        for (let i = 0; i < splitDocs.length; i += BATCH_SIZE) {
            const batch = splitDocs.slice(i, i + BATCH_SIZE);

            console.log(`Batch ${i / BATCH_SIZE + 1}`);

            await vectorStore.addDocuments(batch);
        }

        console.log("PDF Uploaded successfully!!");

    }catch(err) {
        console.log("Failed to upload:",err);
    }

}, { concurrency: 1, connection: {
    host: "localhost",
    port: "6379"
} });

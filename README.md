# PDF-Based RAG System

A simple RAG (Retrieval-Augmented Generation) application that allows users to ask questions about PDF documents and get relevant answers from their content.

## How It Works

1. Upload a PDF document.
2. The PDF is split into smaller chunks.
3. The chunks are converted into vector embeddings.
4. The embeddings are stored in Qdrant.
5. When a question is asked, relevant chunks are retrieved.
6. The retrieved information is sent to the LLaMA model to generate an answer.

## Tech Stack

- TypeScript
- LangChain
- openai/gpt-oss-120b
- Gemini Embeddings
- Qdrant
- BullMQ
- AWS

## Features

- Ask questions about PDF documents
- Retrieve relevant information from large documents
- Generate answers using an LLM
- Asynchronous PDF processing using BullMQ
- Vector search using Qdrant

## Architecture

```text
PDF
 ↓
PDF Processing
 ↓
Chunking
 ↓
Gemini Embeddings
 ↓
Qdrant
 ↓
User Question
 ↓
Similarity Search
 ↓
Relevant Chunks
 ↓
openai/gpt-oss-120b
 ↓
Answer

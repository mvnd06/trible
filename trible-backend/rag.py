import os
import openai
import chromadb
import numpy as np
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize ChromaDB client
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="knowledge_base")

def get_embedding(text):
    """Generates an embedding for a given text using OpenAI."""
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding  # Returns a list of floats

def add_document(text, doc_id):
    """Stores an embedded document in ChromaDB."""
    embedding = get_embedding(text)
    collection.add(embeddings=[embedding], documents=[text], ids=[doc_id])

def search_documents(query):
    """Finds the most relevant document using embedding similarity."""
    query_embedding = get_embedding(query)
    results = collection.query(query_embeddings=[query_embedding], n_results=1)
    
    if results["documents"] and len(results["documents"][0]) > 0:
        return results["documents"][0][0]  # Extracts top match
    
    print("No relevant info found.")
    return "No relevant info found."

def search_lattice_greenhouse(query):
    """Retrieves relevant info from the Lattice Greenhouse integration guide."""
    query_embedding = get_embedding(query)
    results = collection.query(query_embeddings=[query_embedding], n_results=1)
    
    if results["documents"]:
        return results["documents"][0][0]
    
    return "No relevant integration details found."
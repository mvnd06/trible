import requests
import os
import openai
import chromadb
from dotenv import load_dotenv
from bs4 import BeautifulSoup

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="lattice_greenhouse")

def get_embedding(text):
    """Generates an embedding for a given text using OpenAI."""
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def store_lattice_data():
    """Scrapes and stores Lattice HRIS + Greenhouse integration guide."""
    text = scrape_lattice_greenhouse()
    if not text:
        print("No text retrieved, skipping embedding.")
        return

    # Split into smaller chunks (so OpenAI can process)
    chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]

    for i, chunk in enumerate(chunks):
        embedding = get_embedding(chunk)
        collection.add(embeddings=[embedding], documents=[chunk], ids=[f"lattice_{i}"])

    print("✅ Lattice HRIS + Greenhouse data stored in ChromaDB!")

def scrape_lattice_greenhouse():
    """Scrapes the Lattice HRIS + Greenhouse integration guide."""
    url = "https://help.lattice.com/hc/en-us/articles/26481483456151-Integrate-Lattice-HRIS-with-Greenhouse"
    response = requests.get(url)

    if response.status_code != 200:
        print("Failed to retrieve the page")
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    
    # Extract main content
    content_div = soup.find("div", class_="article-body")  # Update class if needed
    if not content_div:
        print("Could not find main content")
        return None

    # Extract text while preserving structure
    paragraphs = content_div.find_all(["p", "h2", "h3", "ul", "ol"])
    text = "\n".join([p.get_text(strip=True) for p in paragraphs])

    return text

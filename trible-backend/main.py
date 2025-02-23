import os
import openai
import chromadb
import rag

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket
 
# Init - OpenAI Client
load_dotenv()  # Load API key from .env filez
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_ai_response(prompt):
    retrieved_info = rag.search_lattice_greenhouse(prompt)
    final_prompt = f"Context: {retrieved_info}\nUser: {prompt}"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": "You're a customer experiencing issues setting up your Lattice HRIS and Greenhouse integration. I'm a solutions engineer that will help you over chat support. Let me walk you through all the steps until setup is complete"},
                  {"role": "user", "content": final_prompt}]
    )
    return response.choices[0].message.content



app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        ai_response = await generate_ai_response(data)
        await websocket.send_text(ai_response)

@app.get("/")
def read_root():
    return {"message": "Trible backend is running!"}

# @app.on_event("startup")
# async def startup_event():
#     """Preload test data into ChromaDB when the app starts."""
#     rag.add_document("Trible was founded in 2005 and is the most successful startup accelerator.", "yc_1")
#     rag.add_document("FastAPI is a modern web framework for building APIs with Python.", "fastapi_1")
#     print("✅ Test data added to ChromaDB")
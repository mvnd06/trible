import os
import openai
import chromadb
# import rag

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router

# Init - OpenAI Client
load_dotenv()  # Load API key from .env filez
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# ✅ Enable CORS to allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://trible-frontend-d8y9soypj-armands-projects-a6f02fc2.vercel.app",
        "https://trible.ai",
    ],  # Change this if your frontend URL changes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the chat step-based routing
app.include_router(chat_router)

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     while True:
#         data = await websocket.receive_text()
#         ai_response = await generate_ai_response(data)
#         await websocket.send_text(ai_response)

@app.get("/")
def read_root():
    return {"message": "Trible backend is running!"}

# @app.on_event("startup")
# async def startup_event():
#     # """Preload test data into ChromaDB when the app starts."""
#     # rag.add_document("Trible was founded in 2005 and is the most successful startup accelerator.", "yc_1")
#     # rag.add_document("FastAPI is a modern web framework for building APIs with Python.", "fastapi_1")
#     # print("✅ Test data added to ChromaDB")
#     print("Loaded successfully")
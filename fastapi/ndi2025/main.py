# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ndi2025.chatbot import ChatRequest, ChatResponse, generate_reply

app = FastAPI(
    title="Chatbot FastAPI + LangChain + ChatGroq",
    version="1.0.0",
)

# CORS (facultatif, à restreindre en prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ex: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Chatbot FastAPI + LangChain + ChatGroq est en ligne 🚀"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Endpoint de chat :
    - reçoit l'historique des messages
    - appelle generate_reply du module chatbot
    - renvoie la réponse du LLM
    """
    return generate_reply(request)

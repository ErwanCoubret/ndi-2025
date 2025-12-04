# chatbot.py
from typing import List, Literal

from pydantic import BaseModel
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_groq import ChatGroq

# ========================
#  Config & modèle LLM
# ========================

SYSTEM_PROMPT = (
    "Tu es un assistant utile qui répond en français, "
    "de manière claire et concise."
)

# Instanciation du modèle Groq via LangChain
llm = ChatGroq(
    model="openai/gpt-oss-20b",  # adapte si besoin
    temperature=0.3,
    max_tokens=None,
    timeout=None,
    max_retries=2,
)

class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]


class ChatResponse(BaseModel):
    reply: str


def generate_reply(request: ChatRequest) -> ChatResponse:
    """
    Construit la liste de messages pour LangChain + Groq
    puis renvoie la réponse sous forme de ChatResponse.
    """

    lc_messages = [SystemMessage(content=SYSTEM_PROMPT)]

    for msg in request.messages:
        if msg.role == "user":
            lc_messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            lc_messages.append(AIMessage(content=msg.content))
        elif msg.role == "system":
            lc_messages.append(SystemMessage(content=msg.content))

    ai_msg = llm.invoke(lc_messages)

    return ChatResponse(reply=ai_msg.content)

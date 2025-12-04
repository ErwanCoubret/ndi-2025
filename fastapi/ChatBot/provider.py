import os
from openai import OpenAI
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()


class ChatProvider:
    def __init__(self):
        self.api_key = os.getenv("CHATBOT_API_KEY")
        self.base_url = os.getenv("CHATBOT_BASE_URL")
        self.model_name = os.getenv("CHATBOT_MODEL_NAME")

        if not self.api_key:
            raise ValueError("CHATBOT_API_KEY non définie dans le fichier .env")

        self.client = OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
        )

        self.messages = []

    def set_system_prompt(self, prompt: str):
        """Définit le prompt système pour le chatbot."""
        self.messages = [{"role": "system", "content": prompt}]

    def chat(self, user_message: str) -> str:
        """Envoie un message et retourne la réponse du modèle."""
        self.messages.append({"role": "user", "content": user_message})

        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=self.messages,
        )

        assistant_message = response.choices[0].message.content
        self.messages.append({"role": "assistant", "content": assistant_message})

        return assistant_message

    def reset_conversation(self):
        """Réinitialise la conversation."""
        system_msg = next(
            (msg for msg in self.messages if msg["role"] == "system"), None
        )
        self.messages = [system_msg] if system_msg else []

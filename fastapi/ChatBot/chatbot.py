#!/usr/bin/env python3
from provider import ChatProvider


def main():
    print("🤖 Chatbot Terminal")
    print("=" * 40)
    print("Tapez 'quit' ou 'exit' pour quitter")
    print("Tapez 'reset' pour réinitialiser la conversation")
    print("=" * 40)
    print()

    try:
        provider = ChatProvider()
    except ValueError as e:
        print(f"❌ Erreur: {e}")
        return

    # Optionnel: définir un prompt système
    provider.set_system_prompt(
        "Tu es un assistant IA serviable et amical. Réponds de manière concise et claire."
    )

    while True:
        try:
            user_input = input("Vous: ").strip()

            if not user_input:
                continue

            if user_input.lower() in ["quit", "exit"]:
                print("👋 Au revoir!")
                break

            if user_input.lower() == "reset":
                provider.reset_conversation()
                provider.set_system_prompt(
                    "Tu es un assistant IA serviable et amical. Réponds de manière concise et claire."
                )
                print("🔄 Conversation réinitialisée.\n")
                continue

            response = provider.chat(user_input)
            print(f"\n🤖 Assistant: {response}\n")

        except KeyboardInterrupt:
            print("\n👋 Au revoir!")
            break
        except Exception as e:
            print(f"❌ Erreur: {e}\n")


if __name__ == "__main__":
    main()

import ChatbotSection from "../components/chatbot/ChatbotSection";
import AssoSection from "../components/asso/AssoSection";
import HeroSection from "../components/hero/HeroSection";
import MineSwipperSection from "../components/mine-swipper/MineSwipperSection";
import SnakeSection from "../components/snake/SnakeSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ChatbotSection />
      <SnakeSection />
      <MineSwipperSection />
      <AssoSection />
    </div>
  );
}
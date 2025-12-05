"use client";

import ChatbotSection from "../components/chatbot/ChatbotSection";
import AssoSection from "../components/asso/AssoSection";
import HeroSection from "../components/hero/HeroSection";
import MineSwipperSection from "../components/mine-swipper/MineSwipperSection";
import SnakeSection from "../components/snake/SnakeSection";
import { useEffect, useState } from "react";
import ActivitySection from "../components/activity/ActivitySection";
import WinSection from "../components/win/WinSection";

export default function Home() {
  const [chatbotFlag, setChatbotFlag] = useState(false);
  const [snakeFlag, setSnakeFlag] = useState(false);
  const [mineFlag, setMineFlag] = useState(false);

  useEffect(() => {
    const chatbotFlagFromStorage = window.localStorage.getItem("chatbotFlag");
    const snakeFlagFromStorage = window.localStorage.getItem("snakeFlag");
    const mineFlagFromStorage = window.localStorage.getItem("mineFlag");

    if (chatbotFlagFromStorage === "1") setChatbotFlag(true);
    if (snakeFlagFromStorage === "1") setSnakeFlag(true);
    if (mineFlagFromStorage === "1") setMineFlag(true);
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <WinSection
        chatbotFlag={chatbotFlag}
        snakeFlag={snakeFlag}
        mineFlag={mineFlag}
        setChatbotFlag={setChatbotFlag}
        setSnakeFlag={setSnakeFlag}
        setMineFlag={setMineFlag}
      />
      <ActivitySection
        chatbotFlag={chatbotFlag}
        setChatbotFlag={setChatbotFlag}
        snakeFlag={snakeFlag}
        setSnakeFlag={setSnakeFlag}
        mineFlag={mineFlag}
        setMineFlag={setMineFlag}
      />
      <ChatbotSection chatbotFlag={chatbotFlag} />
      <SnakeSection snakeFlag={snakeFlag} />
      <MineSwipperSection mineFlag={mineFlag} />
      <AssoSection />
    </div>
  );
}

import React from "react";
import Experience from "@/components/Chatbot/Experience";
import { ChatbotProvider } from "@/context/ChatbotContext";

const ChatBot = () => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <ChatbotProvider>
        <Experience />
      </ChatbotProvider>
    </div>
  );
};

export default ChatBot;

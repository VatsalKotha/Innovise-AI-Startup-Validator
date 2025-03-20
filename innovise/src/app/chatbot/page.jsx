import React from "react";
import Experience from "@/components/Chatbot/Experience";
import { ChatbotProvider } from "@/context/ChatbotContext";

const ChatBot = () => {
  return (
    <div className="h-full w-full border rounded-lg border-gray-300">
      <ChatbotProvider>
        <Experience />
      </ChatbotProvider>
    </div>
  );
};

export default ChatBot;

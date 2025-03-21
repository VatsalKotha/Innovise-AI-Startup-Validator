"use client"; // Required for client-side interactivity
import { useRouter } from "next/navigation";
import { Home, User, MessageCircle, Settings, LogOut, Globe, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IconGraphFilled, IconReportAnalytics } from "@tabler/icons-react";

export default function Sidebar() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Dashboard");
  
  // Primary color for accents: oklch(0.208 0.042 265.755) - a deep blue-violet color
  const primaryColor = "oklch(0.208 0.042 265.755)";

  // Sidebar navigation items with enhanced icons
  const sidebarItems = [
    { label: "Dashboard", icon: <Home size={22} />, path: "/dashboard" },
    { label: "Competitor Analysis", icon: <IconReportAnalytics size={22} />, path: "/competitor-analysis" },
    { label: "Pathway", icon: <IconGraphFilled size={22} />, path: "/pathway" },
    { label: "Chatbot", icon: <MessageCircle size={22} />, path: "/chatbot" },
    { label: "Market Analysis", icon: <Settings size={22} />, path: "/market-gap-analysis" },
    { label: "Maps", icon: <Globe size={22} />, path: "/maps" },
    { label: "Profile", icon: <User2 size={22} />, path: "/profile" },
    { label: "Logout", icon: <LogOut size={22} />, path: "/login" },
  ];

  const handleNavigation = (item) => {
    setActiveItem(item.label);
    router.push(item.path);
  };

  return (
    <div className="w-72 bg-white text-gray-800 h-screen p-6 flex flex-col justify-between shadow-lg border-r border-gray-100">
      {/* Header with logo */}
      <div>
        <div className="flex items-center mb-10">
          <div className="h-10 w-10 rounded-lg bg-[oklch(0.208_0.042_265.755)] flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">I</span>
          </div>
          <div className="text-3xl font-bold tracking-tight text-[oklch(0.208_0.042_265.755)]">Innovise</div>
        </div>
        
        {/* Navigation items */}
        <div className="space-y-3">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full flex items-center justify-start text-lg space-x-4 p-4 rounded-xl transition-all duration-300 ${
                activeItem === item.label
                  ? "bg-gray-100 text-[oklch(0.208_0.042_265.755)] shadow-sm font-medium"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
              onClick={() => handleNavigation(item)}
            >
              <span className={activeItem === item.label ? "text-[oklch(0.208_0.042_265.755)]" : "text-gray-500"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {activeItem === item.label && (
                <div className="ml-auto h-2 w-2 rounded-full bg-[oklch(0.208_0.042_265.755)]"></div>
              )}
            </Button>
          ))}
        </div>
      </div>
      
      {/* User profile section */}
      <div>
        <div className="border-t border-gray-200 pt-4 mb-4"></div>
        <div className="flex items-center bg-gray-50 p-3 rounded-xl">
          <div className="h-12 w-12 rounded-lg bg-[oklch(0.208_0.042_265.755)] flex items-center justify-center text-white font-medium text-lg">
            FF
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-gray-800">FutureFounders</div>
            <div className="text-xs text-gray-500">© 2025 Innovise</div>
          </div>
        </div>
      </div>
    </div>
  );
}
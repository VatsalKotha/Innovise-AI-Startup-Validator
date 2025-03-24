"use client"; // Required for client-side interactivity
import { useRouter } from "next/navigation";
import { Home, Route, MessageCircle, Store, LogOut, FileChartPie, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { LogoNoText } from "../../public/images";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 


export default function Sidebar() {
  const SERVER_URL = process.env.NEXT_PUBLIC_API_URL; 
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [data, setData] = useState(null);
  
  // Primary color for accents: oklch(0.208 0.042 265.755) - a deep blue-violet color
  const primaryColor = "oklch(0.208 0.042 265.755)";

  // Sidebar navigation items with enhanced icons
  const sidebarItems = [
    { label: "Dashboard", icon: <Home size={22} />, path: "/dashboard" },
    { label: "Competitor Analysis", icon: <FileChartPie size={22} />, path: "/competitor-analysis" },
    { label: "Business  Pathway", icon: <Route size={22} />, path: "/pathway" },
    { label: "Market Gap Analysis", icon: <Store size={22} />, path: "/market-gap-analysis" },
    { label: "Investor Matching", icon: <Wallet size={22} />, path: "/maps" },
    // { label: "Profile", icon: <User2 size={22} />, path: "/profile" },
    { label: "Chatbot", icon: <MessageCircle size={22} />, path: "/chatbot" },
    { label: "Logout", icon: <LogOut size={22} />, path: "/"  },
  ];

  const handleNavigation = (item) => {

    if (item.label === "Logout") {
     Cookies.remove("uid");
     window.location.reload();
    }
    setActiveItem(item.label);
    router.push(item.path);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = "67dbeefc8b478f6de251a0de"; // Replace with dynamic UID if needed
        const response = await axios.get(`${SERVER_URL}/get_user/${uid}`);
        setData(response.data);
      } catch (err) {
      } finally {
      }
    };

    fetchData();
  }, []);


  return (
    <div className="w-80 bg-white text-gray-800 h-screen p-6 flex flex-col justify-between shadow-lg border-r border-gray-100">
      {/* Header with logo */}
      <div>
        <div className="flex items-center mb-10">
          <div className="h-10 w-10 rounded-lg bg-[#F3F0E7] flex items-center justify-center mr-3">
           <Image src={LogoNoText} alt="Innovise" className="h-8 w-auto" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-black">Innovise</div>
        </div>
        
        {/* Navigation items */}
        <div className="space-y-3">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full flex items-center justify-start text-lg space-x-4 p-4  transition-all duration-300 ${
                activeItem === item.label
                  ? "bg-[#F3F0E7]  text-[oklch(0.208_0.042_265.755)] font-medium"
                  : "hover:bg-gray-100 text-gray-600"
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
        <div className="border-t border-gray-200 pt-4 "></div>
        {data && data.data ? (
        <div className="flex items-center bg-gray-50 p-3 mb-3 rounded-xl">
          <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-black shadow-2xl font-medium text-lg">
            {data.data.name.split(" ").map((name) => name[0]).join("")}
          </div>
          
          <div className="ml-3">
            <div className="text-base font-medium text-gray-800">{data.data.name}</div>
            <div className="text-xs text-gray-500">{data.data.email}</div>
          </div>
        </div>
        ) : null}
         <div className="text-xs text-gray-500">2024-25, DJSCE IPD CS/G3</div>
      </div>




    </div>
  );
}
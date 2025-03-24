"use client";

import { Inter } from "next/font/google"; // Replace with a valid font
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import JsCookies from "js-cookie";
import { useEffect, useState } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});


export default function RootLayout({ children }) {
  const [hasUid, setHasUid] = useState(false);
  useEffect(() => {
    const uid = JsCookies.get("uid"); 
    setHasUid(!!uid); 
  }, []);

  return (
    <html lang="en">
      <body className="flex min-h-screen">
        {/* Sidebar */}
        {hasUid && (
          <div className="h-screen sticky top-0">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}

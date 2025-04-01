"use client"; // Ensure this runs on the client side

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Sidebar from "@/components/Sidebar";

export default function ClientWrapper({ children }) {
  const [hasUid, setHasUid] = useState(false);

  useEffect(() => {
    const uid = Cookies.get("uid"); 
    setHasUid(!!uid); // Converts to boolean
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar visible only if user has a UID */}
      {hasUid && (
        <div className="h-screen sticky top-0">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

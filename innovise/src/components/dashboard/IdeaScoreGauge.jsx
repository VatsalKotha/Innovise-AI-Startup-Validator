// components/dashboard/IdeaScoreGauge.jsx
"use client";
import { useState, useEffect } from "react";

const IdeaScoreGauge = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [score]);
  
  // Calculate the rotation of the gauge needle (from -90 to 90 degrees)
  const rotation = -90 + (animatedScore / 100) * 180;
  
  // Determine color based on score
  let color = "#22c55e"; // green for good
  if (animatedScore < 40) color = "#ef4444"; // red for poor
  else if (animatedScore < 70) color = "#f59e0b"; // amber for average
  
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Gauge background */}
        <div className="absolute w-full h-48 rounded-full bg-gray-200 bottom-0"></div>
        
        {/* Colored segment based on score */}
        <div 
          className="absolute w-full h-48 rounded-full bottom-0 transition-all duration-1000 ease-out"
          style={{ 
            background: `conic-gradient(${color} 0% ${animatedScore}%, #e5e7eb ${animatedScore}% 100%)`,
            transform: "rotate(-90deg)",
          }}
        ></div>
        
        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-24 bg-gray-800 origin-bottom transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        ></div>
        
        {/* Center circle */}
        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-700 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Score display */}
      <div className="mt-6 text-center">
        <div className="text-5xl font-bold">{Math.round(animatedScore)}</div>
        <div className="text-gray-500">out of 100</div>
      </div>
    </div>
  );
};

export default IdeaScoreGauge;
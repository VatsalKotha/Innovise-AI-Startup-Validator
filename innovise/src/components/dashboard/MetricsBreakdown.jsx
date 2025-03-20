// components/dashboard/MetricsBreakdown.jsx
"use client";
import { useState, useEffect } from "react";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#6366f1"];

const MetricsBreakdown = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animateChart, setAnimateChart] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Calculate the start and end angle for each segment
  let cumulativePercentage = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees (100% = 360 degrees)
    cumulativePercentage += percentage;
    const endAngle = cumulativePercentage * 3.6;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      color: COLORS[index % COLORS.length]
    };
  });

  // Calculate SVG path for each segment
  const calculatePath = (segment, index) => {
    const isFullCircle = segment.percentage >= 99.99;
    
    if (isFullCircle) {
      return `M 100 100 m 0 -80 a 80 80 0 1 1 0 160 a 80 80 0 1 1 0 -160`;
    }
    
    const startAngle = segment.startAngle * (Math.PI / 180);
    const endAngle = segment.endAngle * (Math.PI / 180);
    
    const startX = 100 + 80 * Math.sin(startAngle);
    const startY = 100 - 80 * Math.cos(startAngle);
    const endX = 100 + 80 * Math.sin(endAngle);
    const endY = 100 - 80 * Math.cos(endAngle);
    
    const largeArcFlag = segment.percentage > 50 ? 1 : 0;
    
    const pathData = [
      `M 100 100`,
      `L ${startX} ${startY}`,
      `A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `Z`
    ].join(' ');
    
    return pathData;
  };
  
  return (
    <div className="h-64 flex flex-col">
      <div className="flex gap-6">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 200 200">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={calculatePath(segment, index)}
                fill={segment.color}
                stroke="#ffffff"
                strokeWidth="1"
                opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.5}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ 
                  transformOrigin: 'center',
                  transform: animateChart ? 'scale(1)' : 'scale(0)',
                  transition: `transform 0.5s ease-out ${index * 0.1}s`
                }}
              />
            ))}
            <circle cx="100" cy="100" r="40" fill="white" />
          </svg>
        </div>
        
        <div className="flex flex-col gap-2 justify-center">
          {segments.map((segment, index) => (
            <div 
              key={index}
              className="flex items-center gap-2" 
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: segment.color }}></div>
              <span className="text-sm">{segment.name}</span>
              <span className="text-sm text-gray-500 ml-auto">{segment.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-gray-600">
          {hoveredIndex !== null ? (
            <div>
              <span className="font-medium">{segments[hoveredIndex].name}:</span> {segments[hoveredIndex].value} points of total {total}
            </div>
          ) : (
            <div>Total score: {total} points</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsBreakdown;
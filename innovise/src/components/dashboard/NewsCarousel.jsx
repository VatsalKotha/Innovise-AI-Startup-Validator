// components/dashboard/NewsCarousel.jsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

const NewsCarousel = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching news from an API
    const fetchNews = async () => {
      setLoading(true);
      // In a real app, this would be an actual API call
      // For demo purposes, we're using mock data
      setTimeout(() => {
        setNews([
          {
            id: 1,
            title: "New Market Trends for Startups in 2025",
            source: "Tech Insights",
            date: "2025-03-15",
            summary: "Recent study shows emerging opportunities in sustainable technology and AI-driven solutions for startups."
          },
          {
            id: 2,
            title: "Funding Environment Improving for Early-Stage Ventures",
            source: "Startup Daily",
            date: "2025-03-12",
            summary: "Venture capital firms reporting increased interest in early-stage funding following positive economic indicators."
          },
          {
            id: 3,
            title: "Innovation Index Shows Growth in Your Industry",
            source: "Industry Reports",
            date: "2025-03-10",
            summary: "The latest innovation index shows a 15% increase in new patents and product launches in your target market."
          },
          {
            id: 4,
            title: "Consumer Behavior Shifts Creating New Opportunities",
            source: "Market Analysis",
            date: "2025-03-08",
            summary: "Post-pandemic consumer preferences continue to evolve, creating openings for innovative solution providers."
          }
        ]);
        setLoading(false);
      }, 1000);
    };
    
    fetchNews();
  }, []);
  
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % news.length);
  };
  
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + news.length) % news.length);
  };
  
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (news.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">No relevant news found</p>
      </div>
    );
  }
  
  const currentNews = news[currentIndex];
  
  return (
    <div className="h-64 flex flex-col">
      <div className="flex-1">
        <h3 className="font-bold text-lg">{currentNews.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 mb-3">
          <span>{currentNews.source}</span>
          <span>•</span>
          <span>{new Date(currentNews.date).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-700">{currentNews.summary}</p>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          {currentIndex + 1} of {news.length}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPrevious}
            disabled={news.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToNext}
            disabled={news.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsCarousel;
"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const NewsCarousel = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&country=us&max=10&apikey=${process.env.NEXT_PUBLIC_GNEWS_API_KEY}`
      );
      const API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY || "fallback-key";
      console.log("API Key:", API_KEY);

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0]);
      }

      const validArticles = (data.articles || []).filter(
        (article) =>
          article.title &&
          article.description &&
          article.url &&
          article.publishedAt
      );

      const uniqueArticles = Array.from(
        new Map(validArticles.map((article) => [article.url, article])).values()
      );

      setNews(uniqueArticles);
    } catch (err) {
      setError("Failed to fetch news. Please try again later.");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading news...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <Carousel
            showArrows={true}
            showThumbs={false}
            showStatus={false}
            infiniteLoop={true}
            renderArrowPrev={(onClickHandler, hasPrev) => (
              <button
                onClick={onClickHandler}
                disabled={!hasPrev}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            )}
            renderArrowNext={(onClickHandler, hasNext) => (
              <button
                onClick={onClickHandler}
                disabled={!hasNext}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            )}
          >
            {news.map((article, index) => (
              <div key={index} className="p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img
                      src={
                        article.image ||
                        "https://via.placeholder.com/640x360?text=No+Image"
                      }
                      alt={article.title}
                      className="object-cover w-full h-48"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/640x360?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(article.publishedAt)}
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        {article.source.name}
                      </div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
                    >
                      Read full article{" "}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsCarousel;

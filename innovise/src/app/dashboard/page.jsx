// app/dashboard/page.jsx
import IdeaScoreGauge from "@/components/dashboard/IdeaScoreGauge";
import MonthlyScoreChart from "@/components/dashboard/MonthlyScoreChart";
import NewsCarousel from "@/components/dashboard/NewsCarousel";
import MetricsBreakdown from "@/components/dashboard/MetricsBreakdown";
import ParameterScores from "@/components/dashboard/ParameterScores";
import SwotAnalysis from "@/components/dashboard/SwotAnalysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  // This would typically come from your API
  const mockData = {
    ideaScore: 78,
    monthlyScores: [
      { month: "Jan", score: 65 },
      { month: "Feb", score: 68 },
      { month: "Mar", score: 72 },
      { month: "Apr", score: 75 },
      { month: "May", score: 78 },
      { month: "Jun", score: 80 },
    ],
    metrics: [
      { name: "Market Demand", value: 35 },
      { name: "Feasibility", value: 25 },
      { name: "Scalability", value: 20 },
      { name: "Sustainability", value: 20 },
    ],
    parameters: [
      { 
        name: "Market Demand", 
        score: 8, 
        recommendation: "Strong market demand observed. Consider early market entry."
      },
      { 
        name: "Feasibility", 
        score: 7, 
        recommendation: "Technically feasible but may require additional resources."
      },
      { 
        name: "Scalability", 
        score: 6, 
        recommendation: "Moderate scalability. Develop a phased growth plan."
      },
      { 
        name: "Sustainability", 
        score: 7, 
        recommendation: "Good sustainability metrics. Focus on long-term resource efficiency."
      }
    ],
    swot: {
      strengths: ["Innovative concept", "Strong value proposition", "Identified target audience"],
      weaknesses: ["Resource intensive", "Long development cycle", "Technical complexity"],
      opportunities: ["Growing market trend", "Partnership potential", "Expansion to related markets"],
      threats: ["Established competitors", "Regulatory changes", "Technology disruption"]
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Idea Validation Scorecard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top row */}
        <Card>
          <CardHeader>
            <CardTitle>Idea Score</CardTitle>
          </CardHeader>
          <CardContent>
            <IdeaScoreGauge score={mockData.ideaScore} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyScoreChart data={mockData.monthlyScores} />
          </CardContent>
        </Card>
        
        {/* Middle row */}
        <Card>
          <CardHeader>
            <CardTitle>Industry News</CardTitle>
          </CardHeader>
          <CardContent>
            <NewsCarousel />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Metrics Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricsBreakdown data={mockData.metrics} />
          </CardContent>
        </Card>
        
        {/* Parameter scores row */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Parameter Scores & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ParameterScores parameters={mockData.parameters} />
          </CardContent>
        </Card>
        
        {/* SWOT Analysis row */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>SWOT Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <SwotAnalysis data={mockData.swot} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


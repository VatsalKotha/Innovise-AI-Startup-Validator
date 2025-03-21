"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function CompetitorAnalysisDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the provided API
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.0.128:1001/analyze_competitors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: "67dbeefc8b478f6de251a0de",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  const { startup_info, similar_startups } = data;

  // Data for the bar chart (similarity scores)
  const barChartData = similar_startups.map((startup) => ({
    name: startup.startup_name,
    similarity_score: startup.similarity_score,
  }));

  // Data for the pie chart (target segments)
  const pieChartData = similar_startups.map((startup) => ({
    name: startup.target_segment,
    value: parseFloat((startup.similarity_score * 100).toFixed(2)), // Multiply by 100 and round to 2 decimal places
  }));

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Competitor Analysis Dashboard</h1>

      {/* Startup Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{startup_info.startup_name}</CardTitle>
          <CardDescription>{startup_info.usp}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Industry: {startup_info.industry}</p>
          <p>Location: {startup_info.location}</p>
          <p>Team Size: {startup_info.team_size}</p>
          <p>Stage: {startup_info.stage}</p>
        </CardContent>
      </Card>

      {/* Similar Startups Section */}
      <h2 className="text-2xl font-semibold mb-6">Similar Startups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {similar_startups.map((startup, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{startup.startup_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Industry: {startup.industry}</p>
              <p className="text-sm text-gray-600">Target Segment: {startup.target_segment}</p>
              <p className="text-sm text-gray-600">USP: {startup.usp}</p>
              <p className="text-sm text-gray-600">
                Similarity Score: {(startup.similarity_score * 100).toFixed(2)}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart for Similarity Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Similarity Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="similarity_score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart for Target Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Target Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { Building, Users, Lightbulb } from "lucide-react";
import JsCookies from "js-cookie";
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analyze_competitors`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: JsCookies.get("uid"),
            }),
          }
        );

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#9A9285] rounded-full animate-spin"></div>
      </div>
    );
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
  // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
  const COLORS = ["#F3F0E7", "#D6CBBE", "#C0B8A4", "#9A9285"];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="text-left mb-5">
        <h1 className="text-4xl font-bold">Competitor Analysis</h1>
        <p className="text-gray-600">
          Analyze your competitors and identify potential opportunities
        </p>
      </div>

      {/* Startup Info */}
      <Card className="mb-8 bg-white shadow-md border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {startup_info.startup_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {Object.entries(startup_info)
              .filter(([key]) => key !== "startup_name") // Exclude "startup_name"
              .map(([key, value]) => (
                <div key={key} className="flex">
                  {/* Key with Capitalized First Letter & Grey Background */}
                  <span className="bg-gray-100 text-gray-700 px-3 py-2 font-medium rounded-md w-1/3 sm:w-1/4">
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                    :
                  </span>
                  {/* Value */}
                  <span className="text-gray-900 px-3 py-2 w-2/3 font-medium sm:w-3/4">
                    {value}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Similar Startups Section */}
      <h2 className="text-xl font-semibold mb-3">Similar Startups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {similar_startups.map((startup, index) => (
          <Card
            key={index}
            className="bg-white shadow-md border border-gray-200 flex flex-col h-full"
          >
            <CardHeader>
              <CardTitle className="text-gray-900">
                {startup.startup_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="space-y-2">
                <p className="text-sm flex items-center">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    Industry:
                  </span>
                  <span className="ml-2 text-gray-900">{startup.industry}</span>
                </p>
                <p className="text-sm flex items-center">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Target Segment:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {startup.target_segment}
                  </span>
                </p>
                <p className="text-sm flex items-center">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium flex items-center">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    USPs:
                  </span>
                  <span className="ml-2 text-gray-900">{startup.usp}</span>
                </p>
              </div>
              {/* Similarity Score at Bottom */}
              <div className="bg-gray-100 p-3 rounded-lg text-center mt-auto">
                <p className="text-sm text-gray-600 font-medium">Similarity</p>
                <p className="text-lg font-bold text-gray-900">
                  {(startup.similarity_score * 100).toFixed(2)}%
                </p>
              </div>
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
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                {/* <Legend /> */}
                <Bar dataKey="similarity_score">
                  {barChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
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
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label={({ name, percent, x, y, cx }) => (
                    <text
                      x={x}
                      y={y}
                      fill="#000"
                      textAnchor={x >= cx ? "start" : "end"}
                      dominantBaseline="central"
                    >
                      {`${name}: ${(percent * 100).toFixed(0)}%`}
                    </text>
                  )}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "#000000" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

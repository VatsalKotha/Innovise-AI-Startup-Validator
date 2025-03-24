"use client"; // Required for client-side interactivity
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts"; // Import Recharts components
import {
  Check,
  AlertTriangle,
  Lightbulb,
  Zap,
  Heart,
  Leaf,
} from "lucide-react"; // Import icons for SWOT
import NewsCarousel from "./NewsCarousel";
import Cookies from "js-cookie";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL; // Server URL

export default function Dashboard({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = Cookies.get("uid"); // Replace with dynamic UID if needed
        const response = await axios.get(
          `${SERVER_URL}/get_latest_idea_validation?uid=${uid}`
        );
        setData(response.data);
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

  const {
    metrics,
    swot,
    past_scores,
    past_dates,
    success_score,
    detailed_analysis,
    final_verdict,
  } = data;

  // Data for Bar Chart (Metrics)
  const metricsData = Object.entries(metrics).map(([key, value]) => ({
    name: key.replace("_", " "),
    score: value.score,
  }));

  // Data for Pie Chart (SWOT)
  const swotData = Object.entries(swot).map(([key, value]) => ({
    name: key,
    value: value.length, // Number of items in each SWOT category
  }));

  // Colors for Pie Chart
  const COLORS = ["#F3F0E7", "#D6CBBE", "#C0B8A4", "#9A9285"];

  // Data for Gauge Chart (Success Score)
  const gaugeData = [
    {
      name: "Success Score",
      value: success_score,
      fill:
        success_score < 33
          ? "#FF6384"
          : success_score < 66
          ? "#FFCD56"
          : "#4BC0C0", // Red, Yellow, Green
    },
  ];

  // Icons for SWOT Categories
  const swotIcons = {
    strengths: <Check className="text-black" size={20} />,
    weaknesses: <AlertTriangle className="text-black" size={20} />,
    opportunities: <Lightbulb className="text-black" size={20} />,
    threats: <Zap className="text-black" size={20} />,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-left">
          <h1 className="text-4xl font-bold">Idea Validation Dashboard</h1>
          <p className="text-gray-600">
            Detailed analysis and metrics for your startup idea
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Success Score - Gauge Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Success Score</CardTitle>
              <CardDescription>
                Overall score based on feasibility, market demand, scalability,
                and sustainability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-[-5rem]">
                <RadialBarChart
                  width={300}
                  height={300}
                  innerRadius="70%"
                  outerRadius="100%"
                  data={gaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    fill="#8884d8"
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold"
                  >
                    {success_score}%
                  </text>
                </RadialBarChart>
              </div>
            </CardContent>
          </Card>

          {/* Past Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Past Scores</CardTitle>
              <CardDescription>
                Historical success scores over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {past_dates.slice(0, 5).map((date, index) => (
                    <TableRow key={index}>
                      <TableCell>{date}</TableCell>
                      <TableCell>{past_scores[index]}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Final Verdict */}
        <Card>
          <CardContent>
            <p className="text-gray-700">{final_verdict}</p>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(metrics).map(([key, value]) => (
            <Card key={key} className="flex flex-col h-full">
              <CardHeader className="flex flex-col gap-1">
                <CardTitle className="capitalize">
                  {key.replace("_", " ")}
                </CardTitle>
                <CardDescription>{value.explanation}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Progress value={value.score * 10} className="h-3" />
                <span className="text-lg font-bold">{value.score}/10</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bar Chart - Metrics Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Metrics Scores</CardTitle>
            <CardDescription>
              Visual representation of feasibility, market demand, scalability,
              and sustainability scores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <BarChart width={800} height={400} data={metricsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  itemStyle={{ color: "#000000" }}
                  labelStyle={{ color: "#000000" }}
                />

                <Bar dataKey="score">
                  {metricsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </CardContent>
        </Card>

        {/* SWOT Analysis - Beautiful Section */}
        <Card>
          <CardHeader>
            <CardTitle>SWOT Analysis</CardTitle>
            <CardDescription>
              Strengths, Weaknesses, Opportunities, and Threats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(swot).map(([key, value]) => (
                <Card key={key} className={"bg-gray-50"}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {swotIcons[key]}
                      <CardTitle className="capitalize">{key}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {value.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Badge
                            variant="outline"
                            className="capitalize bg-white mt-0.5"
                          >
                            {key}
                          </Badge>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - SWOT Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>SWOT Distribution</CardTitle>
            <CardDescription>
              Breakdown of strengths, weaknesses, opportunities, and threats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <PieChart width={600} height={400}>
                <Pie
                  data={swotData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  dataKey="value"
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
                  {swotData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "#000000" }}>{value}</span>
                  )}
                />
              </PieChart>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
            <CardDescription>{detailed_analysis}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

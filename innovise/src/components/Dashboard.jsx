// "use client"; // Required for client-side interactivity
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// const SERVER_URL = "http://192.168.0.128:1001"; // Server URL

// export default function Dashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const uid = "67dbeefc8b478f6de251a0de"; // Replace with dynamic UID if needed
//         const response = await axios.get(`${SERVER_URL}/get_latest_idea_validation?uid=${uid}`);
//         setData(response.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   const { metrics, swot, past_scores, past_dates, success_score, detailed_analysis, final_verdict } = data;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">Startup Validation Dashboard</h1>
//           <p className="text-gray-600">Detailed analysis and metrics for your startup idea</p>
//         </div>

//         {/* Success Score */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Success Score</CardTitle>
//             <CardDescription>Overall score based on feasibility, market demand, scalability, and sustainability.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center space-x-4">
//               <Progress value={success_score} className="h-3" />
//               <span className="text-xl font-bold">{success_score}%</span>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Metrics Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {Object.entries(metrics).map(([key, value]) => (
//             <Card key={key}>
//               <CardHeader>
//                 <CardTitle className="capitalize">{key.replace("_", " ")}</CardTitle>
//                 <CardDescription>{value.explanation}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Progress value={value.score * 10} className="h-3" />
//                 <span className="text-lg font-bold">{value.score}/10</span>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* SWOT Analysis */}
//         <Card>
//           <CardHeader>
//             <CardTitle>SWOT Analysis</CardTitle>
//             <CardDescription>Strengths, Weaknesses, Opportunities, and Threats</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {Object.entries(swot).map(([key, value]) => (
//                 <div key={key}>
//                   <h3 className="text-lg font-semibold capitalize">{key}</h3>
//                   <ul className="space-y-2">
//                     {value.map((item, index) => (
//                       <li key={index} className="flex items-center space-x-2">
//                         <Badge variant="outline" className="capitalize">
//                           {key}
//                         </Badge>
//                         <span>{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Past Scores */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Past Scores</CardTitle>
//             <CardDescription>Historical success scores over time</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Score</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {past_dates.map((date, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{date}</TableCell>
//                     <TableCell>{past_scores[index]}%</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {/* Detailed Analysis */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Detailed Analysis</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-700">{detailed_analysis}</p>
//           </CardContent>
//         </Card>

//         {/* Final Verdict */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Final Verdict</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-700">{final_verdict}</p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

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
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"; // Import Recharts components
import { Check, AlertTriangle, Lightbulb, Zap, Heart, Leaf } from "lucide-react"; // Import icons for SWOT

const SERVER_URL = "http://192.168.0.128:1001"; // Server URL

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = "67dbeefc8b478f6de251a0de"; // Replace with dynamic UID if needed
        const response = await axios.get(`${SERVER_URL}/get_latest_idea_validation?uid=${uid}`);
        setData(response.data);
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

  const { metrics, swot, past_scores, past_dates, success_score, detailed_analysis, final_verdict } = data;

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
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Data for Gauge Chart (Success Score)
  const gaugeData = [
    {
      name: "Success Score",
      value: success_score,
      fill: success_score < 33 ? "#FF6384" : success_score < 66 ? "#FFCD56" : "#4BC0C0", // Red, Yellow, Green
    },
  ];

  // Icons for SWOT Categories
  const swotIcons = {
    strengths: <Check className="text-green-500" size={20} />,
    weaknesses: <AlertTriangle className="text-red-500" size={20} />,
    opportunities: <Lightbulb className="text-yellow-500" size={20} />,
    threats: <Zap className="text-purple-500" size={20} />,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Idea Validation Dashboard</h1>
          <p className="text-gray-600">Detailed analysis and metrics for your startup idea</p>
        </div>

        {/* Success Score - Gauge Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Success Score</CardTitle>
            <CardDescription>Overall score based on feasibility, market demand, scalability, and sustainability.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <RadialBarChart
                width={300}
                height={300}
                innerRadius="70%"
                outerRadius="100%"
                data={gaugeData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(metrics).map(([key, value]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="capitalize">{key.replace("_", " ")}</CardTitle>
                <CardDescription>{value.explanation}</CardDescription>
              </CardHeader>
              <CardContent>
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
            <CardDescription>Visual representation of feasibility, market demand, scalability, and sustainability scores.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <BarChart width={800} height={400} data={metricsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#9A9285" />
              </BarChart>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - SWOT Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>SWOT Distribution</CardTitle>
            <CardDescription>Breakdown of strengths, weaknesses, opportunities, and threats.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <PieChart width={600} height={400}>
                <Pie
                  data={swotData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {swotData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </CardContent>
        </Card>

        {/* SWOT Analysis - Beautiful Section */}
        <Card>
          <CardHeader>
            <CardTitle>SWOT Analysis</CardTitle>
            <CardDescription>Strengths, Weaknesses, Opportunities, and Threats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(swot).map(([key, value]) => (
                <Card key={key}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {swotIcons[key]}
                      <CardTitle className="capitalize">{key}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {value.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Badge variant="outline" className="capitalize">
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

        {/* Past Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Past Scores</CardTitle>
            <CardDescription>Historical success scores over time</CardDescription>
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
                {past_dates.map((date, index) => (
                  <TableRow key={index}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{past_scores[index]}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{detailed_analysis}</p>
          </CardContent>
        </Card>

        {/* Final Verdict */}
        <Card>
          <CardHeader>
            <CardTitle>Final Verdict</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{final_verdict}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
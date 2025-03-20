// "use client"; // Required for client-side interactivity
// import { useState } from "react";
// import axios from "axios";
// import { Card } from "@/components/ui/card";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// export default function CompetitorAnalysis() {
//   const [startupData, setStartupData] = useState({
//     startup_name: "",
//     problem: "",
//     usp: "",
//     target_segment: "",
//     industry: "",
//     location: "",
//     team_size: "",
//     founding_team_background: "",
//     stage: "",
//     revenue_model: "",
//   });
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await axios.post("http://192.168.0.120:8025/analyze-competitors", startupData);
//       setResponse(res.data);
//     } catch (err) {
//       setError("Failed to fetch competitor analysis. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setStartupData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Data for Similarity Score Bar Chart
//   const similarityScoreData = response?.similar_startups?.map((startup) => ({
//     name: startup.startup_name,
//     score: startup.similarity_score,
//   }));

//   // Data for Industry Distribution Pie Chart
//   const industryData = response?.similar_startups?.reduce((acc, startup) => {
//     acc[startup.industry] = (acc[startup.industry] || 0) + 1;
//     return acc;
//   }, {});

//   const industryChartData = Object.entries(industryData || {}).map(([name, value]) => ({
//     name,
//     value,
//   }));

//   // Colors for Pie Chart
//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         <h1 className="text-3xl font-bold">Competitor Analysis Dashboard</h1>

//         {/* Input Form */}
//         <Card className="p-6">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="startup_name" className="block text-sm font-medium text-gray-700">
//                   Startup Name
//                 </label>
//                 <input
//                   type="text"
//                   id="startup_name"
//                   name="startup_name"
//                   value={startupData.startup_name}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter startup name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="problem" className="block text-sm font-medium text-gray-700">
//                   Problem
//                 </label>
//                 <input
//                   type="text"
//                   id="problem"
//                   name="problem"
//                   value={startupData.problem}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter problem"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="usp" className="block text-sm font-medium text-gray-700">
//                   Unique Selling Proposition (USP)
//                 </label>
//                 <input
//                   type="text"
//                   id="usp"
//                   name="usp"
//                   value={startupData.usp}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter USP"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="target_segment" className="block text-sm font-medium text-gray-700">
//                   Target Segment
//                 </label>
//                 <input
//                   type="text"
//                   id="target_segment"
//                   name="target_segment"
//                   value={startupData.target_segment}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter target segment"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
//                   Industry
//                 </label>
//                 <input
//                   type="text"
//                   id="industry"
//                   name="industry"
//                   value={startupData.industry}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter industry"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="location" className="block text-sm font-medium text-gray-700">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   id="location"
//                   name="location"
//                   value={startupData.location}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter location"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="team_size" className="block text-sm font-medium text-gray-700">
//                   Team Size
//                 </label>
//                 <input
//                   type="text"
//                   id="team_size"
//                   name="team_size"
//                   value={startupData.team_size}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter team size"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="founding_team_background" className="block text-sm font-medium text-gray-700">
//                   Founding Team Background
//                 </label>
//                 <input
//                   type="text"
//                   id="founding_team_background"
//                   name="founding_team_background"
//                   value={startupData.founding_team_background}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter founding team background"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
//                   Stage
//                 </label>
//                 <input
//                   type="text"
//                   id="stage"
//                   name="stage"
//                   value={startupData.stage}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter stage"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="revenue_model" className="block text-sm font-medium text-gray-700">
//                   Revenue Model
//                 </label>
//                 <input
//                   type="text"
//                   id="revenue_model"
//                   name="revenue_model"
//                   value={startupData.revenue_model}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                   placeholder="Enter revenue model"
//                   required
//                 />
//               </div>
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
//             >
//               {loading ? "Analyzing..." : "Analyze Competitors"}
//             </button>
//           </form>
//         </Card>

//         {/* Display Results */}
//         {error && <p className="text-red-500">{error}</p>}
//         {response && (
//           <div className="space-y-6">
//             {/* Startup Info */}
//             <Card className="p-6">
//               <h2 className="text-2xl font-bold mb-4">Startup Information</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {Object.entries(response.startup_info).map(([key, value]) => (
//                   <div key={key}>
//                     <p className="text-sm text-gray-500 capitalize">{key.replace(/_/g, " ")}</p>
//                     <p className="font-medium">{value}</p>
//                   </div>
//                 ))}
//               </div>
//             </Card>

//             {/* Similar Startups */}
//             <Card className="p-6">
//               <h2 className="text-2xl font-bold mb-4">Similar Startups</h2>
//               <div className="space-y-6">
//                 {/* Similarity Score Bar Chart */}
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Similarity Scores</h3>
//                   <BarChart width={800} height={300} data={similarityScoreData}>
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="score" fill="#9A9285" />
//                   </BarChart>
//                 </div>

//                 {/* Industry Distribution Pie Chart */}
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">Industry Distribution</h3>
//                   <PieChart width={400} height={300}>
//                     <Pie
//                       data={industryChartData}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {industryChartData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </div>

//                 {/* Similar Startups Table */}
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2">List of Similar Startups</h3>
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Startup Name</TableHead>
//                         <TableHead>Similarity Score</TableHead>
//                         <TableHead>USP</TableHead>
//                         <TableHead>Target Segment</TableHead>
//                         <TableHead>Industry</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {response.similar_startups.map((startup, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{startup.startup_name}</TableCell>
//                           <TableCell>{startup.similarity_score.toFixed(2)}</TableCell>
//                           <TableCell>{startup.usp}</TableCell>
//                           <TableCell>{startup.target_segment}</TableCell>
//                           <TableCell>{startup.industry}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             </Card>

//             {/* Direct Competitors */}
//             <Card className="p-6">
//               <h2 className="text-2xl font-bold mb-4">Direct Competitors</h2>
//               {response.direct_competitors.length > 0 ? (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Startup Name</TableHead>
//                       <TableHead>USP</TableHead>
//                       <TableHead>Target Segment</TableHead>
//                       <TableHead>Industry</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {response.direct_competitors.map((competitor, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{competitor.startup_name}</TableCell>
//                         <TableCell>{competitor.usp}</TableCell>
//                         <TableCell>{competitor.target_segment}</TableCell>
//                         <TableCell>{competitor.industry}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               ) : (
//                 <p className="text-gray-500">No direct competitors found.</p>
//               )}
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client"; // Required for client-side interactivity
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
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
} from "recharts";

export default function CompetitorAnalysis() {
  const [startupData, setStartupData] = useState({
    startup_name: "",
    problem: "",
    usp: "",
    target_segment: "",
    industry: "",
    location: "",
    team_size: "",
    founding_team_background: "",
    stage: "",
    revenue_model: "",
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user data automatically when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = "67dbeefc8b478f6de251a0de"; // Replace with dynamic UID if needed
        const res = await axios.get(
          `http://192.168.0.128:1001/get_user/${uid}`
        );
        const userData = res.data;

        console.log("Fetched user data:", userData); // Log the fetched data

        // Set startup data only if the response is not empty
        setStartupData({
          startup_name: userData.startup_name || "",
          problem: userData.problems_addressed?.join(", ") || "",
          usp: userData.startup_unique_reasons?.join(", ") || "",
          target_segment: userData.target_audiences?.join(", ") || "",
          industry: userData.industry_operated || "", // Fix typo if any
          location: userData.startup_location || "",
          team_size: userData.team_size || "",
          founding_team_background:
            userData.founding_team_background?.join(", ") || "",
          stage: userData.stage || "",
          revenue_model: userData.revenue_model?.join(", ") || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(`Failed to fetch user data: ${err.message}`);
      }
    };

    fetchUserData();
  }, []); // Runs once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://192.168.0.120:8025/analyze-competitors",
        startupData
      );
      setResponse(res.data);
    } catch (err) {
      console.error("Error analyzing competitors:", err);
      setError(`Failed to fetch competitor analysis: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Data for Similarity Score Bar Chart
  const similarityScoreData = response?.similar_startups?.map((startup) => ({
    name: startup.startup_name,
    score: startup.similarity_score,
  }));

  // Data for Industry Distribution Pie Chart
  const industryData = response?.similar_startups?.reduce((acc, startup) => {
    acc[startup.industry] = (acc[startup.industry] || 0) + 1;
    return acc;
  }, {});

  const industryChartData = Object.entries(industryData || {}).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Colors for Pie Chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Competitor Analysis Dashboard</h1>

        {/* Display Startup Data in Card Format */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Startup Information</h2>
          <div className="space-y-4">
            {Object.entries(startupData).map(([key, value]) => (
              <div key={key} className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-700">
                  {key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
                <span className="text-sm text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Analyze Competitors Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {loading ? "Analyzing..." : "Analyze Competitors"}
        </button>

        {/* Display Results */}
        {error && <p className="text-red-500">{error}</p>}
        {response && (
          <div className="space-y-6">
            {/* Similarity Score Bar Chart */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Similarity Scores</h2>
              <BarChart width={600} height={300} data={similarityScoreData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </Card>

            {/* Industry Distribution Pie Chart */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Industry Distribution</h2>
              <PieChart width={400} height={400}>
                <Pie
                  data={industryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(2)}%`}
                >
                  {industryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Card>

            {/* Table of Similar Startups */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Similar Startups</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Startup Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Similarity Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {response.similar_startups.map((startup, index) => (
                    <TableRow key={index}>
                      <TableCell>{startup.startup_name}</TableCell>
                      <TableCell>{startup.industry}</TableCell>
                      <TableCell>{startup.location}</TableCell>
                      <TableCell>{startup.similarity_score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
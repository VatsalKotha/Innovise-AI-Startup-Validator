"use client"; // Required for client-side interactivity
import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, MessageCircle, AlertCircle, BarChart3, Lightbulb } from "lucide-react";

// export default function MarketGapAnalysis() {
//   const [industry, setIndustry] = useState("");
//   const [insights, setInsights] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post("http://192.168.0.120:8008/analyze", {
//         industry: industry,
//       });
//       setInsights(response.data.insights);
//     } catch (err) {
//       setError("Failed to fetch insights. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to parse the insights into sections
//   const parseSections = (text) => {
//     const sections = text.split("\n\n").filter((section) => section.trim() !== "");
//     return sections.map((section) => {
//       const [title, ...content] = section.split("\n");
//       return {
//         title: title.trim(),
//         content: content.join("\n").trim(),
//       };
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Market Gap Analysis</h1>

//         {/* Industry Input Form */}
//         <Card className="p-6 mb-6">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
//                 Industry
//               </label>
//               <input
//                 type="text"
//                 id="industry"
//                 value={industry}
//                 onChange={(e) => setIndustry(e.target.value)}
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 placeholder="Enter industry (e.g., Fintech)"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
//             >
//               {loading ? "Analyzing..." : "Analyze"}
//             </button>
//           </form>
//         </Card>

//         {/* Display Insights */}
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         {insights && (
//           <ScrollArea className="mt-6 max-h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg border">
//             {parseSections(insights).map((section, index) => (
//               <Card key={index} className="mb-4 p-4 bg-white shadow-sm rounded-lg border border-gray-300">
//                 <div className="flex items-center gap-3 mb-2">
//                   {section.title.includes("Potential Unmet Needs") && <FileText className="text-indigo-500" />}
//                   {section.title.includes("Promising Market Segments") && <MessageCircle className="text-green-500" />}
//                   {section.title.includes("Areas where Current Solutions") && <AlertCircle className="text-red-500" />}
//                   {section.title.includes("Emerging Trends") && <BarChart3 className="text-blue-500" />}
//                   {section.title.includes("Patterns in Successful") && <Lightbulb className="text-yellow-500" />}

//                   <h3 className="text-lg font-semibold">{section.title}</h3>
//                 </div>
//                 <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
//               </Card>
//             ))}
//           </ScrollArea>
//         )}
//       </div>
//     </div>
//   );
// }
const API_URL = process.env.NEXT_PUBLIC_AI_URL || "https://innovise-ai.onrender.com" ;

export default function MarketGapAnalysis() {
  const [industry, setIndustry] = useState("");
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        industry: industry,
      });
      setInsights(response.data.insights);
    } catch (err) {
      setError("Failed to fetch insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to remove markdown bold syntax (**) and parse the insights into sections
  const parseSections = (text) => {
    // Remove ** from the text
    const cleanedText = text.replace(/\*\*/g, "");

    // Split the text into sections based on numbered headings
    const sections = cleanedText.split(/\n\d+\.\s+/).filter((section) => section.trim() !== "");

    return sections.map((section) => {
      const [title, ...content] = section.split("\n");
      return {
        title: title.trim(),
        content: content.join("\n").trim(),
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Market Gap Analysis</h1>

        {/* Industry Input Form */}
        <Card className="p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                type="text"
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter industry (e.g., Fintech)"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F3F0E7] text-black p-2 rounded-md disabled:bg-indigo-300"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </form>
        </Card>

        {/* Display Insights */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {insights && (
          <ScrollArea className="mt-6 max-h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg border">
            {parseSections(insights).map((section, index) => (
              <Card key={index} className="mb-4 p-4 bg-white shadow-sm rounded-lg border border-gray-300">
                <div className="flex items-center gap-3 mb-2">
                  {section.title.includes("Potential Unmet Needs") && <FileText className="text-indigo-500" />}
                  {section.title.includes("Promising Market Segments") && <MessageCircle className="text-green-500" />}
                  {section.title.includes("Areas where Current Solutions") && <AlertCircle className="text-red-500" />}
                  {section.title.includes("Emerging Trends") && <BarChart3 className="text-blue-500" />}
                  {section.title.includes("Patterns in Successful") && <Lightbulb className="text-yellow-500" />}

                  <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
              </Card>
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
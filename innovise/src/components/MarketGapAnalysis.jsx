"use client"; // Required for client-side interactivity
import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, MessageCircle, AlertCircle, BarChart3, Lightbulb } from "lucide-react";
const sampleBusinessInputs = [
'Technology','Healthcare','Finance','Education','Retail','Agriculture','Entertainment','E-Commerce'
]
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
const API_URL = process.env.NEXT_PUBLIC_AI_URL ;

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
      // console.log(response.data.insights);
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
    <div className="p-8 bg-gray-100 min-h-screen">
      <div >
          {/* Header */}
          <div className="text-left mb-5">
        <h1 className="text-4xl font-bold">Market Gap Analysis</h1>
        <p className="text-gray-600">
          Analyze the market gap in any industry to identify potential opportunities and unmet needs.
        </p>
      </div>
      <Card className="mb-2 bg-white shadow-md border border-gray-200 rounded-xl">
        <CardHeader>
          <CardTitle className="text-gray-900">Industry</CardTitle>
          <CardDescription>
            Choose a business industry to analyze the market gap and identify potential opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Sample Business Inputs */}
            <div className="flex flex-wrap gap-2">
              {sampleBusinessInputs.map((sample, index) => (
                <button
                  key={index}
                  onClick={(e) => {setIndustry(sample);
                    e.preventDefault();
                    handleSubmit(e);}}
                  className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg border border-gray-300 hover:border-gray-300   hover:bg-white transition-all duration-200"
                >
                  {sample}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
             
              <input
                type="text"
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full min-h-[30px] pl-6 pr-6 pt-3 pb-3 mb-2 mt-2 text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your industry ..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-lg font-medium ${
                !loading 
                  ? "bg-[#F3F0E7] from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-black hover:shadow-xl font-semibold "
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </form>
           
          </div>
        </CardContent>
      </Card>

      

       {/* Display Insights */}
{error && <p className="text-red-500 mb-4">{error}</p>}
{insights && (
  <ScrollArea className="mt-6 max-h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-lg border">
    {insights
      .split(/\n(?=\*\*.*?\*\*)/) // Split sections based on headings
      .map((section, index) => {
        const match = section.match(/\*\*(.*?)\*\*/); // Extract title
        let title = match ? match[1].trim() : "Untitled Section";
        const content = section.replace(/\*\*.*?\*\*\n?/, "").trim(); // Remove title from content

        // Remove Roman numerals from the title
        title = title.replace(/^[IVXLCDM]+\.\s*/, "");

        return (
          <Card key={index} className="mb-4 p-4 bg-white shadow-sm rounded-lg border border-gray-300">
            <div className="flex items-center gap-3 mb-2">
              {title.includes("Potential Unmet Needs") && <FileText className="text-black" />}
              {title.includes("Promising Market Segments") && <MessageCircle className="text-black" />}
              {title.includes("Areas where Current Solutions") && <AlertCircle className="text-black" />}
              {title.includes("Emerging Trends") && <BarChart3 className="text-black" />}
              {title.includes("Patterns in Successful") && <Lightbulb className="text-black" />}
              
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            {/* Properly render bold text inside list items */}
            <p className="text-gray-700 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          </Card>
        );
      })}
  </ScrollArea>
)}

      </div>
    </div>
  );
}
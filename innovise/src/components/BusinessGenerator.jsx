"use client";
import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Send, CheckCircle, Calendar, FileText } from "lucide-react";

const AI_SERVER_URL = "http://192.168.141.34:8000"

const sampleBusinessInputs = [
  {
    title: "Tech Startup",
    text: "I'm launching a SaaS product targeting small businesses. I need a business plan that includes financial projections, marketing strategies, and operational plans.",
  },
  {
    title: "E-commerce Business",
    text: "I want to start an online store selling eco-friendly products. Help me create a business plan with a focus on marketing and logistics.",
  },
  {
    title: "Food & Beverage",
    text: "I'm opening a café in a busy urban area. I need a business plan that covers financials, marketing, and operational workflows.",
  },
  {
    title: "Healthcare Startup",
    text: "I'm developing a telemedicine platform. I need a business plan that includes financial projections, regulatory compliance, and marketing strategies.",
  },
  {
    title: "Manufacturing Business",
    text: "I'm starting a small-scale manufacturing unit. Help me create a business plan with financials, supply chain management, and marketing.",
  },
];

const BusinessPathway = () => {
  const [activeTab, setActiveTab] = useState("financial");
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const textareaRef = useRef(null);
  const [serverData, setServerData] = useState(null);
  const flowchartRef = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleStrategySelect = (strategy) => {
    setActiveTab(strategy);
  };

  const handleTextareaInput = (e) => {
    setUserInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleSampleInput = (text) => {
    setUserInput(text);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleGenerate = async () => {
    if (!activeTab) return;

    setIsGenerating(true);
    setShowFlowchart(false);

    try {
      const payload = {
        user_input: userInput || `I need help creating a business plan for my startup. Please include:
    
          1. Financial projections.
          2. Marketing strategies.
          3. Operational plans.
          4. Industry-specific insights.
          5. A step-by-step flowchart representing the business planning process.`,
        focus_area: activeTab,
      };
    
      if (!AI_SERVER_URL) {
        console.error(
          "AI_SERVER_URL is not defined. Please set it in your environment."
        );
        setIsGenerating(false);
        return;
      }
    
      const response = await fetch(`${AI_SERVER_URL}/generate-business-pathway`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header
        },
        body: JSON.stringify(payload), // Convert payload to JSON
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    
      const data = await response.json();
      console.log("Response data:", data);
      // Handle the response data (e.g., update state, display the pathway)
    if (data && data.nodes && data.edges) {
        setServerData(data);

        setNodes(
          data.nodes.map((node) => ({
            ...node,
            className: `
                ${node.style.background} !important
                border-2
                ${node.style.border} !important
                rounded-lg
                p-4
                text-center
                font-medium
              `,
            data: {
              ...node.data,
              label: node.data.label,
            },
          }))
        );

        setEdges(
          data.edges.map((edge) => ({
            ...edge,
            className: edge.style.stroke,
            source: edge.source,
            target: edge.target,
            label: edge.label,
          }))
        );

        setShowFlowchart(true);

        setTimeout(() => {
          flowchartRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        console.warn("Invalid server response:", data);
      }
    } catch (error) {
      console.error("Error generating pathway:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    {
      id: "financial",
      label: "Financial Projections",
      color: "blue",
      description:
        "Create detailed financial forecasts, including revenue, expenses, and cash flow.",
      benefits: [
        "Clear understanding of funding needs",
        "Helps in securing investments",
        "Identifies break-even points",
        "Supports budgeting and planning",
      ],
      considerations: [
        "Requires accurate data inputs",
        "May need professional assistance",
        "Sensitive to market changes",
        "Time-consuming to prepare",
      ],
    },
    {
      id: "marketing",
      label: "Marketing Strategies",
      color: "green",
      description:
        "Develop a comprehensive marketing plan to reach your target audience.",
      benefits: [
        "Increases brand visibility",
        "Drives customer acquisition",
        "Supports product launches",
        "Builds long-term customer relationships",
      ],
      considerations: [
        "Requires market research",
        "Can be costly depending on channels",
        "Needs continuous optimization",
        "Competitive landscape impacts results",
      ],
    },
    {
      id: "operations",
      label: "Operational Plans",
      color: "cream",
      description:
        "Outline the day-to-day operations, including workflows, resources, and logistics.",
      benefits: [
        "Improves efficiency and productivity",
        "Reduces operational risks",
        "Ensures resource allocation",
        "Supports scalability",
      ],
      considerations: [
        "Requires detailed planning",
        "Needs regular updates",
        "Dependent on team coordination",
        "May require technology investments",
      ],
    },
    {
      id: "industry",
      label: "Industry Insights",
      color: "purple",
      description:
        "Provide industry-specific insights to tailor your business plan.",
      benefits: [
        "Aligns with market trends",
        "Identifies competitive advantages",
        "Supports regulatory compliance",
        "Enhances strategic decision-making",
      ],
      considerations: [
        "Requires up-to-date research",
        "May need expert consultation",
        "Industry-specific risks",
        "Can be time-intensive",
      ],
    },
  ];

  // Business Timeline Component
  const BusinessTimeline = ({ timeline }) => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Business Timeline</h3>
        </div>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{item.title}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-gray-500 text-xs mt-1">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Document Checklist Component
  const DocumentChecklist = ({ documents }) => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-900">
            Document Checklist
          </h3>
        </div>
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-gray-800">{doc.name}</p>
              <span className="text-sm text-gray-500">{doc.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto space-y-8 py-2 pr-2">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Sample Business Scenarios:
            </span>
            <span className="ml-2 text-xs text-gray-500">
              (Click to populate)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleBusinessInputs.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleInput(sample.text)}
                className="px-3 py-1.5 text-sm bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center group"
              >
                <span className="text-gray-600 group-hover:text-blue-600">
                  {sample.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={handleTextareaInput}
              placeholder="Describe your business idea, including industry, target market, and goals..."
              className="w-full min-h-[120px] p-5 text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              style={{ height: "auto" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleStrategySelect(tab.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 bg-gradient-to-br from-${tab.color}-50 to-${tab.color}-100 text-${tab.color}-700 shadow-md`
                    : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">{tab.label}</div>
              </button>
            ))}
          </div>

          {activeTab && (
            <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">
                {tabs.find((tab) => tab.id === activeTab)?.description}
              </p>
              <div className="mt-4">
                <p className="font-medium text-gray-800">Benefits:</p>
                <ul className="list-disc pl-5 text-gray-600">
                  {tabs
                    .find((tab) => tab.id === activeTab)
                    ?.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                </ul>
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-800">Considerations:</p>
                <ul className="list-disc pl-5 text-gray-600">
                  {tabs
                    .find((tab) => tab.id === activeTab)
                    ?.considerations.map((consideration, index) => (
                      <li key={index}>{consideration}</li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
          <button
            onClick={handleGenerate}
            disabled={!activeTab || isGenerating}
            className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-102 ${
              activeTab && !isGenerating
                ? "bg-[#F3F0E7] from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-black shadow-lg hover:shadow-xl font-semibold text-[#9A9285]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="h-6 w-6" />
            <span>
              {isGenerating
                ? "Generating Business Pathway..."
                : "Generate Business Pathway"}
            </span>
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <h3 className="mt-6 text-xl font-semibold text-gray-900">
            Creating Your Personalized Business Pathway
          </h3>
          <p className="mt-3 text-gray-600">
            Analyzing your business idea and generating tailored strategies...
          </p>
        </div>
      )}

      {showFlowchart && serverData && (
        <div
          ref={flowchartRef}
          className="space-y-6 animate-fade-in scroll-mt-8"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-[700px] w-full bg-gradient-to-br from-gray-50 to-gray-100">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                className="bg-gray-50"
                defaultEdgeOptions={{
                  type: "smoothstep",
                  animated: true,
                  style: { strokeWidth: 2 },
                }}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </div>

          {/* Business Timeline and Document Checklist Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BusinessTimeline
              timeline={[
                {
                  title: "Market Research",
                  description: "Conduct research to understand your target market.",
                  date: "2025-03-15",
                },
                {
                  title: "Financial Planning",
                  description: "Create financial projections and budgets.",
                  date: "2025-03-30",
                },
                {
                  title: "Marketing Strategy",
                  description: "Develop a comprehensive marketing plan.",
                  date: "2025-04-15",
                },
                {
                  title: "Operational Setup",
                  description: "Set up workflows and resources.",
                  date: "2025-04-20",
                },
              ]}
            />
            <DocumentChecklist
              documents={[
                { name: "Market Research Report", status: "Submitted" },
                { name: "Financial Projections", status: "Pending" },
                { name: "Marketing Plan", status: "Not Started" },
                { name: "Operational Workflow", status: "In Progress" },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPathway;
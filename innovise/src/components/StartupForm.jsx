"use client"; // Add this if you're using Next.js App Router
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Lightbulb,
  Star,
  Users,
  Briefcase,
  MapPin,
  UserPlus,
  GraduationCap,
  BarChart3,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  Zap,
  CircleDollarSign,
  BookOpen,
  Frown,
  Heart,
  Leaf,
  Cpu,
  Recycle,
  PiggyBank,
  Award,
  Target,
  HandHelping,
  Building,
  ShoppingBag,
  Building2 as SmallBusiness,
  Layers,
  User,
  Users as GenZ,
  Monitor,
  Stethoscope,
  Landmark,
  GraduationCap as Education,
  ShoppingCart,
  Wheat,
  Film,
  Store,
  Smartphone,
  User as SingleUser,
  Users as SmallTeam,
  UsersRound,
  UserRound,
  UserPlus as MediumTeam,
  UserCheck,
  Code,
  Briefcase as BusinessExp,
  BookOpen as Industry,
  BarChart,
  Lightbulb as IdeaStage,
  Code as EarlyStage,
  TrendingUp,
  Globe,
  CreditCard,
  ShoppingCart as Sales,
  Megaphone,
  DollarSign as TransactionFees,
  Gift,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios"; // Import axios
import Cookies from "js-cookie";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL; // Server URL

export default function StartupForm() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({
    startupName: "",
    problemNeed: [],
    uniqueReason: [],
    targetAudience: [],
    industry: "",
    location: "",
    teamSize: "",
    teamBackground: [],
    stage: "",
    revenueModel: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, value) => {
    setFormData((prev) => {
      const currentValues = prev[name] || [];
      const exists = currentValues.includes(value);

      if (exists) {
        return { ...prev, [name]: currentValues.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...currentValues, value] };
      }
    });
  };

  const handleSingleSelection = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextPage = () => {
    if (currentPage < ConstantData.total_pages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const submitForm = async () => {
    const storedUid = Cookies.get("uid"); // Fetch UID directly inside submitForm

    if (!storedUid) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      const requestData = {
        uid: storedUid,
        startup_name: formData.startupName,
        problems_addressed: formData.problemNeed,
        startup_unique_reasons: formData.uniqueReason,
        target_audiences: formData.targetAudience,
        industry_operated: formData.industry,
        startup_location: formData.location,
        team_size: formData.teamSize,
        founding_team_background: formData.teamBackground,
        stage: formData.stage,
        revenue_model: formData.revenueModel,
        is_data_filled: true,
      };

      console.log("Submitting Data:", requestData); // Debugging Log

      const response = await axios.post(
        `${SERVER_URL}/update_user`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Response:", response.data);
        toast.success("Form submitted successfully!");
        toast.info("Generating your report!");
        
        const response1 = await axios.post(
          `${SERVER_URL}/create_idea_validation`,
          {'uid':storedUid},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if(response1.status == 200){
          router.push("/dashboard");
          window.location.reload();
         } else {
          toast.error("Some error occurred while generating report");
         }
        
      } else {
        console.error("Error:", response.data);
        toast.success(response.data.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.success(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Enhanced Constants with icons
  const ConstantData = {
    total_pages: 10,

    appbar_titles: [
      "Startup Name",
      "Problem/Need",
      "Unique Selling Proposition",
      "Target Segment",
      "Industry",
      "Location",
      "Team Size",
      "Team Background",
      "Stage",
      "Revenue Model",
    ],

    questions: [
      "What's your startup name?",
      "What problem or need does your startup address?",
      "What makes your startup unique?",
      "Who is your target audience?",
      "What industry do you operate in?",
      "Where is your startup based?",
      "How many people are on your team?",
      "What is your founding team's background?",
      "What stage are you currently in?",
      "What revenue model does your startup use?",
    ],

    problems_addressed_choices: [
      { label: "Inefficient Processes", icon: <Zap size={18} /> },
      { label: "High Costs", icon: <CircleDollarSign size={18} /> },
      { label: "Lack of Access to Information", icon: <BookOpen size={18} /> },
      { label: "Poor User Experience", icon: <Frown size={18} /> },
      { label: "Health Issues", icon: <Heart size={18} /> },
      { label: "Environmental Concerns", icon: <Leaf size={18} /> },
    ],

    startup_unique_reasons_choices: [
      { label: "Innovative Technology", icon: <Cpu size={18} /> },
      { label: "Sustainability", icon: <Recycle size={18} /> },
      { label: "Cost-Effective Solution", icon: <PiggyBank size={18} /> },
      { label: "Superior Quality", icon: <Award size={18} /> },
      { label: "Niche Market Focus", icon: <Target size={18} /> },
      {
        label: "Exceptional Customer Service",
        icon: <HandHelping size={18} />,
      },
    ],

    target_audience_choices: [
      { label: "B2B - Business to Business", icon: <Building size={18} /> },
      { label: "B2C - Business to Consumer", icon: <ShoppingBag size={18} /> },
      {
        label: "SMEs - Small & Medium Enterprises",
        icon: <SmallBusiness size={18} />,
      },
      { label: "Enterprises", icon: <Layers size={18} /> },
      { label: "Millennials", icon: <User size={18} /> },
      { label: "Gen Z", icon: <GenZ size={18} /> },
    ],

    industry_operated_choices: [
      { label: "Technology", icon: <Monitor size={18} /> },
      { label: "Healthcare", icon: <Stethoscope size={18} /> },
      { label: "Finance", icon: <Landmark size={18} /> },
      { label: "Education", icon: <Education size={18} /> },
      { label: "Retail", icon: <ShoppingCart size={18} /> },
      { label: "Agriculture", icon: <Wheat size={18} /> },
      { label: "Entertainment", icon: <Film size={18} /> },
      { label: "E-Commerce", icon: <Store size={18} /> },
      { label: "Others", icon: <Smartphone size={18} /> },
    ],

    team_size_choices: [
      { label: "1-5", icon: <SingleUser size={18} /> },
      { label: "6-10", icon: <SmallTeam size={18} /> },
      { label: "11-20", icon: <UsersRound size={18} /> },
      { label: "21-50", icon: <UserRound size={18} /> },
      { label: "51-100", icon: <MediumTeam size={18} /> },
      { label: "100+", icon: <UserCheck size={18} /> },
    ],

    team_background_choices: [
      { label: "Technical Expertise", icon: <Code size={18} /> },
      {
        label: "Business/Entrepreneurial Experience",
        icon: <BusinessExp size={18} />,
      },
      { label: "Industry-Specific Knowledge", icon: <Industry size={18} /> },
      { label: "Marketing and Sales", icon: <BarChart size={18} /> },
    ],

    stage_choices: [
      {
        label: "Idea Stage - Conceptualization",
        icon: <IdeaStage size={18} />,
      },
      {
        label: "Early Stage - MVP Development",
        icon: <EarlyStage size={18} />,
      },
      {
        label: "Growth Stage - Scaling Operations",
        icon: <TrendingUp size={18} />,
      },
      { label: "Established - Market Expansion", icon: <Globe size={18} /> },
    ],

    revenue_model_choices: [
      { label: "Subscription Fees", icon: <CreditCard size={18} /> },
      { label: "Direct Sales", icon: <Sales size={18} /> },
      { label: "Advertising", icon: <Megaphone size={18} /> },
      { label: "Transaction Fees", icon: <TransactionFees size={18} /> },
      { label: "Freemium", icon: <Gift size={18} /> },
    ],

    tips: [
      "A catchy and memorable name helps boosts brand recognition.",
      "Clearly defining the problem helps in attracting the right customers.",
      "Highlighting your USP helps in standing out from the competition.",
      "Understanding your target segment ensures better product-market fit.",
      "Knowing your industry helps in understanding market trends.",
      "Location influences market access and operational costs.",
      "A well-sized team indicates the capacity to handle growth.",
      "A strong founding team attracts investors and partners.",
      "Identifying your stage helps in setting the right strategic goals.",
      "A clear revenue model is essential for financial sustainability.",
    ],
  };

  // Icons for each page
  const pageIcons = [
    <Building2 key="building" />,
    <Lightbulb key="lightbulb" />,
    <Star key="star" />,
    <Users key="users" />,
    <Briefcase key="briefcase" />,
    <MapPin key="mappin" />,
    <UserPlus key="userplus" />,
    <GraduationCap key="graduation" />,
    <BarChart3 key="barchart" />,
    <DollarSign key="dollar" />,
  ];

  // export default function StartupForm() {
  //   const [currentPage, setCurrentPage] = useState(0);
  //   const [formData, setFormData] = useState({

  //     startupName: '',
  //     problemNeed: [],
  //     uniqueReason: [],
  //     targetAudience: [],
  //     industry: [],
  //     location: '',
  //     teamSize: '',
  //     teamBackground: [],
  //     stage: '',
  //     revenueModel: []
  //   });

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData(prev => ({ ...prev, [name]: value }));
  //   };

  //   const handleArrayChange = (name, value) => {
  //     // Toggle selection for multi-select items
  //     setFormData(prev => {
  //       const currentValues = prev[name] || [];
  //       const exists = currentValues.includes(value);

  //       if (exists) {
  //         return { ...prev, [name]: currentValues.filter(v => v !== value) };
  //       } else {
  //         return { ...prev, [name]: [...currentValues, value] };
  //       }
  //     });
  //   };

  //   const handleSingleSelection = (name, value) => {
  //     setFormData(prev => ({ ...prev, [name]: value }));
  //   };

  //   const nextPage = () => {
  //     if (currentPage < ConstantData.total_pages - 1) {
  //       setCurrentPage(currentPage + 1);
  //     }
  //   };

  //   const prevPage = () => {
  //     if (currentPage > 0) {
  //       setCurrentPage(currentPage - 1);
  //     }
  //   };

  // const submitForm = () => {
  //   // Here you would typically submit the form data to your backend
  //   console.log('Form submitted:', formData);
  //   alert('Form submitted successfully!');
  // };

  // Helper function to render the appropriate form fields based on the current page
  const renderFormFields = () => {
    switch (currentPage) {
      case 0: // Startup Name
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startupName">Startup Name</Label>
              <Input
                id="startupName"
                name="startupName"
                value={formData.startupName}
                onChange={handleInputChange}
                placeholder="Enter your startup name"
                
              />
            </div>
          </div>
        );

      case 1: // Problem/Need
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ConstantData.problems_addressed_choices.map((problem, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer border transition-all ${
                    formData.problemNeed.includes(problem.label)
                      ? "bg-[#F3F0E7]"
                      : " hover:border-[#D6CBBE]"
                  }`}
                  onClick={() =>
                    handleArrayChange("problemNeed", problem.label)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        formData.problemNeed.includes(problem.label)
                          ? "bg-[#9A9285] text-white"
                          : "text-black"
                      }`}
                    >
                      {formData.problemNeed.includes(problem.label) && (
                        <Check size={16} />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#9A9285]">{problem.icon}</span>
                      <span className="font-medium">{problem.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2: // Unique Selling Proposition
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ConstantData.startup_unique_reasons_choices.map(
                (reason, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                      formData.uniqueReason.includes(reason.label)
                        ? " bg-[#F3F0E7]"
                        : " hover:border-[#D6CBBE]"
                    }`}
                    onClick={() =>
                      handleArrayChange("uniqueReason", reason.label)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center ${
                          formData.uniqueReason.includes(reason.label)
                            ? "bg-[#9A9285] text-white"
                            : "border border-[#E0E0E0]"
                        }`}
                      >
                        {formData.uniqueReason.includes(reason.label) && (
                          <Check size={16} />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#9A9285]">{reason.icon}</span>
                        <span className="font-medium">{reason.label}</span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        );

      case 3: // Target Segment
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ConstantData.target_audience_choices.map((audience, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer border transition-all ${
                    formData.targetAudience.includes(audience.label)
                      ? " bg-[#F3F0E7]"
                      : "hover:border-[#D6CBBE]"
                  }`}
                  onClick={() =>
                    handleArrayChange("targetAudience", audience.label)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        formData.targetAudience.includes(audience.label)
                          ? "bg-[#9A9285] text-white"
                          : "border border-[#E0E0E0]"
                      }`}
                    >
                      {formData.targetAudience.includes(audience.label) && (
                        <Check size={16} />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#9A9285]">{audience.icon}</span>
                      <span className="font-medium">{audience.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4: // Industry
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ConstantData.industry_operated_choices.map((industry, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer border transition-all ${
                    formData.industry.includes(industry.label)
                      ? "bg-[#F3F0E7]"
                      : " hover:border-[#D6CBBE]"
                  }`}
                  onClick={() =>
                    handleSingleSelection("industry", industry.label)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        formData.industry.includes(industry.label)
                          ? "bg-[#9A9285] text-white"
                          : "border border-[#E0E0E0]"
                      }`}
                    >
                      {formData.industry.includes(industry.label) && (
                        <Check size={16} />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#9A9285]">{industry.icon}</span>
                      <span className="font-medium">{industry.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5: // Location
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your startup location"
               
              />
            </div>
          </div>
        );

      case 6: // Team Size
        return (
          <div className="space-y-4">
            <RadioGroup
              value={formData.teamSize}
              onValueChange={(value) =>
                handleSingleSelection("teamSize", value)
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ConstantData.team_size_choices.map((size, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                      formData.teamSize === size.label
                        ? "bg-[#F3F0E7]"
                        : " hover:border-[#D6CBBE]"
                    }`}
                    onClick={() =>
                      handleSingleSelection("teamSize", size.label)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          formData.teamSize === size.label
                            ? "bg-[#9A9285] border-2 border-white outline outline-2 outline-[#9A9285]"
                            : "border-2 border-[#E0E0E0]"
                        }`}
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-[#9A9285]">{size.icon}</span>
                        <span className="font-medium">{size.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 7: // Team Background
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ConstantData.team_background_choices.map((background, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer border transition-all ${
                    formData.teamBackground.includes(background.label)
                      ? " bg-[#F3F0E7]"
                      : " hover:border-[#D6CBBE]"
                  }`}
                  onClick={() =>
                    handleArrayChange("teamBackground", background.label)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        formData.teamBackground.includes(background.label)
                          ? "bg-[#9A9285] text-white"
                          : "border border-[#E0E0E0]"
                      }`}
                    >
                      {formData.teamBackground.includes(background.label) && (
                        <Check size={16} />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#9A9285]">{background.icon}</span>
                      <span className="font-medium">{background.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 8: // Stage
        return (
          <div className="space-y-4">
            <RadioGroup
              value={formData.stage}
              onValueChange={(value) => handleSingleSelection("stage", value)}
            >
              <div className="grid grid-cols-1 gap-3">
                {ConstantData.stage_choices.map((stage, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                      formData.stage === stage.label
                        ? " bg-[#F3F0E7]"
                        : " hover:border-[#D6CBBE]"
                    }`}
                    onClick={() => handleSingleSelection("stage", stage.label)}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          formData.stage === stage.label
                            ? "bg-[#9A9285] border-2 border-white outline outline-2 outline-[#9A9285]"
                            : "border-2 border-[#E0E0E0]"
                        }`}
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-[#9A9285]">{stage.icon}</span>
                        <span className="font-medium">{stage.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 9: // Revenue Model
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ConstantData.revenue_model_choices.map((model, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer border transition-all ${
                    formData.revenueModel.includes(model.label)
                      ? " bg-[#F3F0E7]"
                      : " hover:border-[#D6CBBE]"
                  }`}
                  onClick={() => handleArrayChange("revenueModel", model.label)}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        formData.revenueModel.includes(model.label)
                          ? "bg-[#9A9285] text-white"
                          : "border border-[#E0E0E0]"
                      }`}
                    >
                      {formData.revenueModel.includes(model.label) && (
                        <Check size={16} />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#9A9285]">{model.icon}</span>
                      <span className="font-medium">{model.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex p-8 max-w-3xl mx-auto h-screen items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="flex items-stretch">
          <Card className="shadow-md h-full w-full flex flex-col gap-0 p-6">
            <div className=" mb-5 text-white rounded-t-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h1 className="text-2xl font-bold text-[#1E1E1E]">Innovise</h1>
                <div className="text-sm text-[#1E1E1E]/70">
                  Step {currentPage + 1} of {ConstantData.total_pages}
                </div>
              </div>
              <Progress
                value={(currentPage + 1) * 10}
                className="h-2 bg-gray-50"
              >
                <div className="h-full bg-black rounded-full" />
              </Progress>
            </div>
            <CardHeader className="bg-gray-50 text-black p-2  rounded-md flex flex-row items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full">
                {pageIcons[currentPage]}
              </div>
              <div>
                <CardTitle>{ConstantData.appbar_titles[currentPage]}</CardTitle>
                <CardDescription>
                  {ConstantData.questions[currentPage]}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-[-6]" >
              <div className="mb-4 mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 p-3 bg-[#F3F0E7] text-[#1E1E1E] rounded-lg">
                        <Info size={18} className="text-[#F3F0E7]" />
                        <span className="text-sm">
                          {ConstantData.tips[currentPage]}
                        </span>
                      </div>
                    </TooltipTrigger>
                   
                  </Tooltip>
                </TooltipProvider>
              </div>

              {renderFormFields()}
            </CardContent>

            <CardFooter className="p-[-6] mt-4 flex justify-between">
              <Button
                onClick={prevPage}
                disabled={currentPage === 0}
                variant="outline"
                className=" hover:bg-[#F3F0E7]"
              >
                <ChevronLeft className="mr-0 h-4 w-4" />
                Previous
              </Button>

              {currentPage === ConstantData.total_pages - 1 ? (
                <Button
                  onClick={submitForm}
                  className="bg-[#F3F0E7] hover:bg-gray-100 text-black"
                >
                  Submit
                  <Check className="ml-0 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={nextPage}
                  className="bg-[#F3F0E7] hover:bg-gray-100 text-black"
                >
                  Next
                  <ChevronRight className="ml-0 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

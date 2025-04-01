"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogoNoText, LogoNoTextWhite, Mobile } from "../../../public/images";
import Image from "next/image";
import {
  ChevronRight,
  BarChart,
  Target,
  Lightbulb,
  TrendingUp,
  Shield,
  Users,
  PieChart,
  Sliders,
  Check,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Index = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="p-8 flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Image src={LogoNoText} alt="Innovise" className="h-10 w-10" />
            <div className="flex flex-col ">
              <span className="text-xl font-bold">Innovise</span>
              {/* <span className="text-xs font-semibold text-[#9A9285] bg-[#F3F0E7] text-center rounded-full px-2 py-1">
                Welcome
              </span> */}
            </div>
          </div>
          <div className="flex items-center gap-4 justify-end flex-1">
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-medium hover:text-black transition-colors"
              >
                Features
              </a>

              <a
                href="#use-cases"
                className="text-sm font-medium hover:text-black transition-colors"
              >
                Use Cases
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium hover:text-black transition-colors"
              >
                How It Works
              </a>
            </nav>

            <Button
              variant="outline"
              className="bg-[#F3F0E7] hidden sm:flex gap-2"
              onClick={() => router.push("https://download.innovise.live")}
            >
              <Download className="h-4 w-4" />
              Download App
            </Button>
            <Button
              className="bg-black hover:bg-black/90 text-white hidden sm:flex gap-2"
              onClick={() => router.push("/login")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-8 bg-white ">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-black">
                AI-Powered Business Idea Validation
              </h1>
              <p className="text-lg md:text-xl text-black/70 max-w-lg">
                Innovise leverages advanced AI to evaluate and predict the
                success of your business ideas with data-driven insights and
                ethical considerations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  className="bg-black hover:bg-black/90 text-white px-8 py-6 "
                  onClick={() => router.push("/login")}
                >
                  Validate Your Idea
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="py-6 gap-2 bg-[#F3F0E7]"
                  onClick={() => router.push("https://download.innovise.live")}
                >
                  <Download className="h-4 w-4" />
                  Download App
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src={Mobile}
                alt="Innovise App Screenshot"
                className="w-3/4
                 h-auto rounded-xl items-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 bg-[#F3F0E7]/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black">Key Features</h2>
            <p className="mt-4 text-black/70 max-w-2xl mx-auto">
              Our platform's advanced capabilities provide comprehensive
              business validation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="flex flex-col items-start p-6 space-y-4">
                <div className="p-3 bg-[#F3F0E7] rounded-lg">
                  <BarChart className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-semibold text-lg">Market Analysis</h3>
                <p className="text-black/70">
                  Deep dive into market trends and competitive landscapes to
                  validate your business potential.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-start p-6 space-y-4">
                <div className="p-3 bg-[#F3F0E7] rounded-lg">
                  <Target className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-semibold text-lg">Success Prediction</h3>
                <p className="text-black/70">
                  AI-driven algorithms calculate your likelihood of success
                  based on historical data patterns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-start p-6 space-y-4">
                <div className="p-3 bg-[#F3F0E7] rounded-lg">
                  <TrendingUp className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-semibold text-lg">Growth Modeling</h3>
                <p className="text-black/70">
                  Project your growth trajectory with simulations based on
                  various market conditions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-start p-6 space-y-4">
                <div className="p-3 bg-[#F3F0E7] rounded-lg">
                  <Shield className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-semibold text-lg">Ethical Integration</h3>
                <p className="text-black/70">
                  Embedding ethical considerations into the evaluation process
                  to promote responsible innovation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-start p-6 space-y-4">
                <div className="p-3 bg-[#F3F0E7] rounded-lg">
                  <PieChart className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-semibold text-lg">
                  Competitor Benchmarking
                </h3>
                <p className="text-black/70">
                  Compare your idea against existing competitors to identify
                  your unique market position.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-start p-6 space-y-4">
                <div className="p-3 bg-[#F3F0E7] rounded-lg">
                  <Sliders className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-semibold text-lg">Actionable Insights</h3>
                <p className="text-black/70">
                  Get clear recommendations that empower you to make informed,
                  strategic decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black">Who Can Benefit</h2>
            <p className="mt-4 text-black/70 max-w-2xl mx-auto">
              Innovise helps various stakeholders make better decisions about
              innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F3F0E7] flex items-center justify-center">
                  <Users className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Startups & Entrepreneurs
                  </h3>
                  <p className="text-black/70">
                    Evaluate new business ideas, identify potential pitfalls and
                    opportunities, increase the success rate of ventures.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F3F0E7] flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Corporations & Established Businesses
                  </h3>
                  <p className="text-black/70">
                    Innovate within existing product lines, explore new markets,
                    identify potential acquisitions or partnerships, optimize
                    current processes.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F3F0E7] flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Investors & Venture Capitalists
                  </h3>
                  <p className="text-black/70">
                    Analyze potential investments, identify promising startups,
                    gain deeper insights into market trends and potential risks.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F3F0E7] flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Academic Researchers & Educators
                  </h3>
                  <p className="text-black/70">
                    Develop new research initiatives, improve the quality of
                    academic proposals, foster innovation within classrooms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-8 bg-[#F3F0E7]/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black">How It Works</h2>
            <p className="mt-4 text-black/70 max-w-2xl mx-auto">
              Our streamlined process makes business validation simple and
              effective
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Submit Your Idea</h3>
              <p className="text-black/70">
                Describe your business concept and provide key details through
                our intuitive interface.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
              <p className="text-black/70">
                Our AI evaluates your concept against market data, trends, and
                competitive landscapes.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Receive Insights</h3>
              <p className="text-black/70">
                Get comprehensive reports with actionable recommendations and
                success predictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-black">
                  Ready to validate your business idea?
                </h2>
                <p className="text-black/70">
                  Get started today and increase your chances of success with
                  data-driven insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="bg-black hover:bg-black/90 text-white"  onClick={() => router.push("/login")}>
                    Explore Now!
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => router.push("https://download.innovise.live")}>
                    <Download className="h-4 w-4" />
                    Download App
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-black" />
                  <p>AI-powered analysis of market potential</p>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-black" />
                  <p>Ethical and sustainability evaluation</p>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-black" />
                  <p>Competitive landscape insights</p>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-black" />
                  <p>Customized action plan with recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
              <Image src={LogoNoTextWhite} alt="Innovise" className="h-10 w-10" />
                <span className="text-xl font-bold">Innovise</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered business idea validation platform helping innovators
                succeed.
              </p>
            </div>
            {/* 
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Case Studies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div> */}
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024-2025 Innovative Product Development CS-G3 B.Tech, Dwarkadas J. Sanghvi
              College of Engineering, Mumbai.<br></br>
              Vatsal Kotha, Meet Chavan, Jeel Doshi, Mit Shah.
            </p>

            {/* <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

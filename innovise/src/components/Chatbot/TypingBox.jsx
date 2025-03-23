import { Mic} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { LogoNoText } from "../../../public/images";
import { CHATBOT_ROUTE } from "@/constants/utils";
// import { useChatbot } from "@/context/ChatbotContext";

export const TypingBox = ({
  setMessage,
  loading,
  setLoading,
  seblueimationNumber,
  currentBot,
}) => {
  const [question, setQuestion] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognition = useRef(null);
  const audioRef = useRef(null);
  // const { dict } = useLanguage();

  const AnimationTypes = {
    idle: { animation: 6, name: "idle", emoji: "👤" },
    suite: { animation: 5, name: "suite", emoji: "👨🏼‍💼" },
  };

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.lang = "en-US";
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const speechToText =
          event.results[event.results.length - 1][0].transcript;
        setQuestion(speechToText);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    recognition.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.current.stop();
  };

  const handleAsk = async () => {
    if (question.trim() === "") {
      toast({
        variant: "destructive",
        title: "amigo.ai",
        description: "Ask your doubts to our personalized chatbot",
      });
      return;
    }

    try {
      setLoading(true);
      seblueimationNumber(7);

      let formData = {};
      formData["query"] = question.trim();

      const response = await fetch(CHATBOT_ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("formData", formData);

      if (response.ok) {
        const result = await response.json();
        console.log("result", result);

        const assisbluetReply = result;

        setMessage(assisbluetReply);

        setQuestion("");
      } else {
        console.error("Request failed with status", response.status);
      }
    } catch (error) {
      console.error("Error fetching audio", error);
    } finally {
      setLoading(false);
      seblueimationNumber(6);
    }
  };

  return (
    <div className="z-10 w-[620px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div className="flex items-center gap-2"> 
        <Image src={LogoNoText} alt="innovise" className="h-10 w-auto" />
        <p className="text-black font-semibold">Innovise AI Chatbot</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-100"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex items-center">
        
          <input
            className="focus:outline focus:outline-white/80 flex-grow bg-gray-100 p-2 px-4 rounded-full text-black placeholder:text-black"
            placeholder= "Ask your doubts or type here ..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
          />
            <div className="flex gap-4">
            {isRecording ? (
              <button
                className="h-10 w-10 bg-[#F3F0E7]   p-2 rounded-full text-black flex items-center justify-center gap-x-0.5"
                onClick={stopRecording}
              >
                <div className="line h-1/2 w-1.5 bg-black rounded-xl animate-bounce" />
                <div className="line h-5/6 w-1.5 bg-black rounded-xl animate-bounce delay-100" />
                <div className="line h-3/5 w-1.5 bg-black rounded-xl animate-bounce delay-200" />
                <div className="line h-2/3 w-1.5 bg-black rounded-xl animate-bounce delay-300" />
                <div className="line h-1/2 w-1.5 bg-black rounded-xl animate-bounce delay-400" />
              </button>
            ) : (
              <button
                className="bg-[#F3F0E7] p-2 rounded-full text-black flex items-center justify-center"
                onClick={startRecording}
              >
                <Mic />
              </button>
            )}
          </div>
          <button
            className="bg-[#F3F0E7] p-2 px-6 rounded-full text-black"
            onClick={handleAsk}
          >
            Send
          </button>
          <audio ref={audioRef} />
        </div>
      )}

      {/* <div className="mt-2 w-full flex gap-3">
        {Object.values(AnimationTypes).map((anim) => (
          <div
            key={anim.name}
            className="flex items-center justify-center gap-2 bg-slate-800/60 p-2 px-4 rounded-full text-white shadow-inner shadow-slate-900/60 hover:cursor-pointer"
            onClick={() => seblueimationNumber(anim.animation)}
          >
            <span className="text-lg">{anim.emoji}</span>
            <span>{anim.name === "idle" ? "Idle Animation" : "Suite Animation"}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
};

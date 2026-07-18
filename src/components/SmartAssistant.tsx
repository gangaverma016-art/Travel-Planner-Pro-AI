import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Compass, HelpCircle } from "lucide-react";
import { WashiTape } from "./DoodleIcons";

interface Message {
  role: "user" | "model";
  text: string;
}

export const SmartAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "👋 Ahoy! I'm **Doodle Guide**, your handy journal assistant! 🎒\n\nWhere are we exploring today? Ask me for destination ideas, budget hacks, or suitcase advice!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Suggest a honeymoon destination",
    "Goa beach trip under ₹20,000",
    "I have only 3 days",
    "Adventure solo hike ideas",
  ];

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Map current messages to format expected by API (user/model)
      const chatHistory = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setMessages((prev) => [...prev, { role: "model", text: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: `⚠️ **Doodle Guide Error**: ${data.error || "Something went wrong with our paper map!"}. Make sure your Gemini API key is configured.`,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "🎒 *Oh no! The compass spun out of control.* Connection issue! Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <motion.button
        id="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: isOpen ? -90 : 8 }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full border-3 border-neutral-800 flex items-center justify-center shadow-lg relative ${
          isOpen ? "bg-[#FF6B6B] text-white" : "bg-[#FFD166] text-neutral-800"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-7 h-7 stroke-[2.5]" />
            {/* Guide Hat Detail on icon */}
            <div className="absolute -top-3 -left-2 text-xs select-none">🤠</div>
          </div>
        )}
      </motion.button>

      {/* Chat Window Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[550px] bg-[#FFFDF9] dark:bg-[#1A1A1A] sketch-border notebook-shadow overflow-hidden flex flex-col z-50"
            style={{
              backgroundImage: "linear-gradient(rgba(235, 248, 255, 0.4) 1px, transparent 1px)",
              backgroundSize: "100% 24px",
            }}
          >
            {/* Journal Header with Tape */}
            <div className="bg-[#4FACFE] text-white p-4 border-b-4 border-neutral-800 dark:border-neutral-700 relative">
              <WashiTape className="-top-2 left-1/3" angle={-3} color="rgba(255, 209, 102, 0.8)" />
              <div className="flex items-center gap-2.5">
                {/* Ranger Hat Avatar */}
                <div className="w-10 h-10 rounded-full bg-white border-2 border-neutral-800 flex items-center justify-center text-xl shadow-inner relative">
                  🤠
                  <div className="absolute -top-1 -right-1 text-[8px] bg-red-500 text-white font-mono px-1 rounded">GUIDE</div>
                </div>
                <div>
                  <h4 className="font-handwritten text-2xl tracking-tight leading-none text-neutral-900">
                    Doodle Guide 🗺️
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-800 opacity-90">
                    *Your Playful Journal Companion*
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isModel = msg.role === "model";
                return (
                  <div
                    key={index}
                    className={`flex ${isModel ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl border-2 border-neutral-800 dark:border-neutral-700 shadow-sm font-handwritten text-lg leading-relaxed relative ${
                        isModel
                          ? "bg-white dark:bg-[#2D2D2A] text-neutral-800 dark:text-[#FAF6EE] rounded-tl-none transform -rotate-1"
                          : "bg-[#FFD166] text-neutral-900 rounded-tr-none transform rotate-1"
                      }`}
                    >
                      {/* Scribble paper details inside bubble */}
                      {isModel && (
                        <div className="absolute -left-1.5 top-0 text-neutral-400 select-none text-xs">
                          ✍️
                        </div>
                      )}
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#2D2D2A] border-2 border-neutral-800 dark:border-neutral-700 rounded-2xl rounded-tl-none p-3 transform -rotate-1 shadow-sm">
                    <span className="font-handwritten text-neutral-500 flex items-center gap-2">
                      <Compass className="animate-spin w-4 h-4 text-neutral-800 dark:text-[#FAF6EE]" />
                      *Doodle Guide is drawing the map...*
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Pills */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-neutral-50/90 dark:bg-[#2D2D2A]/90 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700">
                <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block mb-1.5 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" /> Quick Travel Inquiries:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug)}
                      className="bg-white dark:bg-[#1A1A1A] hover:bg-[#A8E6CF] text-neutral-800 dark:text-[#FAF6EE] text-xs font-handwritten px-2.5 py-1 rounded-full border border-neutral-800 dark:border-neutral-700 shadow-sm transition-all text-left"
                    >
                      💡 {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-white dark:bg-[#1A1A1A] border-t-4 border-neutral-800 dark:border-neutral-700 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Where should we fly next?..."
                className="flex-1 bg-neutral-100 dark:bg-[#2D2D2A] border-2 border-neutral-800 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-sm font-mono focus:outline-none focus:bg-white dark:focus:bg-[#1A1A1A] text-neutral-800 dark:text-[#FAF6EE]"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-[#A8E6CF] hover:bg-[#86d9ba] text-neutral-800 rounded-xl border-2 border-neutral-800 dark:border-neutral-700 shadow-sm flex items-center justify-center"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

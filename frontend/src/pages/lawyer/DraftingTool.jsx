import React, { useState, useRef, useEffect } from "react";
import { Bot, FileText, Sparkles, Send, Scale, Loader2 } from "lucide-react";
import { useTheme } from "../../context/themeContext";
import { GoogleGenAI } from "@google/genai"; // NEW SDK IMPORT

export default function DraftingTool() {
  const { isDark } = useTheme();
  const scalesBgUrl = "/scale.png"; 

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-sans relative flex flex-col ${isDark ? "bg-[#0B1120] text-slate-100" : "bg-[#FFFAF0] text-slate-900"}`}>
      
      {/* Background Image Layer */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 bg-center bg-no-repeat bg-contain transition-opacity ${isDark ? "opacity-[0.03] invert" : "opacity-[0.05]"}`} 
        style={{ backgroundImage: `url(${scalesBgUrl})` }} 
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col">
        
        {/* Header */}
        <div className={`mb-6 flex items-center justify-between px-6 py-5 rounded-2xl border backdrop-blur-md ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isDark ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-serif-heading font-bold ${isDark ? "text-white" : "text-slate-900"}`}>AI Legal Chatbot</h1>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Drafting assistant and document generator</p>
            </div>
          </div>
          {/* <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isDark ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
            <Sparkles className="w-4 h-4" />
            Gemini 3 Flash
          </span> */}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px]">
          
          {/* Chat Section */}
          <div className={`flex flex-col rounded-2xl border lg:col-span-2 overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className={`px-6 py-4 border-b flex items-center gap-2 ${isDark ? "border-white/10" : "border-slate-200/60"}`}>
              <Bot className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Nyaya Assistant</h2>
            </div>
            <div className="flex-1 p-0 overflow-hidden">
               <ChatUI isDark={isDark} />
            </div>
          </div>

          {/* Sidebar / Tools */}
          <div className={`flex flex-col rounded-2xl border lg:col-span-1 ${isDark ? "bg-white/5 border-white/10" : "bg-white/80 border-white/40"}`}>
            <div className={`px-6 py-4 border-b flex items-center gap-2 ${isDark ? "border-white/10" : "border-slate-200/60"}`}>
              <FileText className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold">Written Drafts</h2>
            </div>
            
            <div className="p-6 flex-1">
              <div className={`h-full p-6 rounded-xl border flex flex-col items-center justify-center text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white/50 border-white/40"}`}>
                <Scale className={`w-12 h-12 mb-4 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
                <div className="text-base font-bold mb-2">Draft Generation</div>
                <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Generate petitions, affidavits, notices, and contracts with guided templates and compliance checks.
                </p>
                <div className="w-full space-y-3">
                    {["Templates Library", "Clause Suggestions", "Export PDF", "Client Sharing"].map((item) => (
                        <div key={item} className={`w-full py-2 px-4 rounded-lg text-sm font-medium text-left flex items-center gap-3 ${isDark ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600"}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            {item}
                        </div>
                    ))}
                </div>
                <button className="mt-auto w-full py-3 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl font-bold text-sm cursor-not-allowed mt-8">
                    Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ChatUI({ isDark }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    { 
        id: 1, 
        role: "system", 
        text: "Welcome to the NyayaSahayak Legal Chatbot. I can help you draft legal documents, summarize cases, or provide general legal guidance. How can I assist you today?" 
    }
  ]);

  // Auto-scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  // --- NEW GEMINI 3 SDK LOGIC ---
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to UI
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      // 1. Initialize new GoogleGenAI client (Uses Vite env variable)
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      
      // 2. Format history for the new SDK's 'contents' array requirement
      // The API requires roles to be strictly 'user' or 'model'
      const formattedContents = messages
        .filter(m => m.role !== 'system') 
        .map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

      // Append the brand new user message to the array
      formattedContents.push({ 
        role: 'user', 
        parts: [{ text: userMessage }] 
      });

      // 3. Make the call using generateContent with the systemInstruction in config
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // New Model
        contents: formattedContents,
        config: {
            systemInstruction: "You are the specialized AI Legal Drafting Assistant for advocates and legal professionals on the **NyayaSahayak** platform in India. Your primary goal is to accelerate the workflow of verified lawyers through high-level legal research, document drafting, and case analysis.Follow these core directives strictly:1. **Tone, Decorum & Professionalism:** Speak peer-to-peer as a highly competent, respectful junior associate assisting a senior advocate. Maintain strict professional decorum. Use precise legal terminology. Under no circumstances should you use slang, informal abbreviations, or patronizing language.2. **Indian Legal Context:** Base all drafts and research entirely on the Indian legal system. Accurately utilize the new criminal laws (BNS, BNSS, BSA) alongside existing frameworks like the IPC, CrPC, CPC, Indian Evidence Act, and Constitutional provisions.3. **Efficiency & Depth:** Assume the user is a qualified legal professional. Do not over-explain basic legal concepts. Focus immediately on citing relevant precedents, statutory provisions, procedural rules, and providing high-level legal analysis. 4. **Court-Ready Drafting:** When drafting documents (e.g., Bail Applications under BNSS/CrPC, Plaints, Written Statements, Legal Notices, Contracts), use standard Indian court formatting. Output clean Markdown with precise, professional placeholders (e.g., `[Name of the Hon'ble Court]`, `[Name of the Petitioner/Defendant]`, `[Insert Specific Grounds]`).5. **The Golden Rule (Verification Disclaimer):** You are an AI assistant designed to augment a lawyer's workflow, not replace their professional judgment. Always conclude your drafts or research with a brief, polite disclaimer reminding the advocate to independently verify case laws, citations, and latest statutory updates before filing any document before the Honble Court."
        }
      });

      // 4. Add AI response to UI
      // The new SDK accesses the text directly via response.text
      setMessages((prev) => [...prev, { id: Date.now(), role: "assistant", text: response.text }]);

    } catch (error) {
      console.error("Gemini 3 API Error:", error);
      setMessages((prev) => [...prev, { 
          id: Date.now(), 
          role: "assistant", 
          text: "I apologize, but I am having trouble connecting to the new Gemini 3 database right now. Please verify your API key or check your internet connection." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
             <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-orange-600 text-white rounded-tr-none"
                  : m.role === "assistant"
                    ? isDark ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700" : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                    : isDark ? "bg-slate-900/50 text-slate-400 w-full text-center text-xs mb-2 shadow-none" : "bg-slate-100 text-slate-500 w-full text-center text-xs mb-2 shadow-none"
              }`}>
              {m.text}
            </div>
          </div>
        ))}
        
        {/* Loading Animation */}
        {isLoading && (
            <div className="flex justify-start">
                <div className={`max-w-[85%] px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-3 border shadow-sm ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                    <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                    <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Analyzing legal parameters...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${isDark ? "border-white/10 bg-slate-900/50" : "border-slate-200 bg-slate-50/50"}`}>
        <form onSubmit={sendMessage} className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="E.g., Draft a bail application for..."
            className={`flex-1 px-5 py-3.5 rounded-xl outline-none border transition-all ${
                isDark 
                ? "bg-slate-800 text-white border-slate-700 placeholder:text-slate-500 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50" 
                : "bg-white border-slate-200 text-slate-900 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
            }`}
          />
          <button 
            disabled={isLoading || !input.trim()}
            className={`p-3.5 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                ${isDark ? "bg-orange-600 hover:bg-orange-500 text-white" : "bg-slate-900 hover:bg-black text-white active:scale-95"}
            `}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
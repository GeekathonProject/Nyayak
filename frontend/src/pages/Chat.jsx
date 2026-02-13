import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Upload, FileText, Loader2, X, Scale, ShieldCheck, Sparkles, Sun, Moon } from "lucide-react";

const Chat = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to NyaySetu AI. I am calibrated for Indian Legal procedures. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type === "text/plain")) {
      setUploadedFile(file);
      setFilePreview({
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: file.type === "application/pdf" ? "PDF" : "TXT",
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !uploadedFile) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      file: filePreview,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", inputText || "Analyze document");
      if (uploadedFile) formData.append("file", uploadedFile);

      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: data.answer || "Processing complete.",
        sender: "bot",
        source: data.source,
        confidence: data.confidence,
        disclaimer: data.disclaimer,
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: "Server error. Try again.", sender: "bot", isError: true }]);
    } finally {
      setLoading(false);
      setFilePreview(null);
    }
  };

  // Dynamic Theme Colors
  const theme = {
    bg: isDarkMode ? "#09090b" : "#f8fafc",
    text: isDarkMode ? "#ffffff" : "#0f172a",
    card: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.8)",
    border: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    accent: "#6366f1"
  };

  return (
    <div style={{ 
      backgroundColor: theme.bg, 
      color: theme.text, 
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" 
    }} className="relative min-h-screen overflow-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Dynamic Background Auras */}
      <div className={`absolute top-0 left-0 w-full h-full pointer-events-none opacity-30`}>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Interface Header */}
      <header className="relative z-20 flex justify-between items-center p-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl" style={{ backgroundColor: `${theme.accent}15`, border: `1px solid ${theme.accent}30` }}>
            <Scale size={24} color={theme.accent} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">NyaySetu <span style={{ color: theme.accent }}>AI</span></h1>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">V2.0 Core Intelligence</p>
          </div>
        </div>

        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 rounded-full transition-all hover:scale-110 active:scale-90"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}
        >
          {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>
      </header>

      {/* Main Chat Engine */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full flex flex-col px-4 pb-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-custom">
          <AnimatePresence mode="popLayout">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  style={{ 
                    backgroundColor: m.sender === "user" ? theme.accent : theme.card,
                    border: `1px solid ${m.sender === "user" ? "transparent" : theme.border}`,
                    backdropFilter: "blur(20px)",
                    boxShadow: m.sender === "user" ? `0 10px 30px -10px ${theme.accent}60` : "0 4px 20px rgba(0,0,0,0.05)"
                  }}
                  className={`relative p-5 rounded-[24px] max-w-[85%] md:max-w-[70%] ${m.sender === "user" ? "rounded-tr-none text-white" : "rounded-tl-none"}`}
                >
                  {m.sender === "bot" && (
                    <div className="absolute -top-3 -left-3 p-1.5 rounded-lg border shadow-sm" style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                      <Sparkles size={14} color={theme.accent} />
                    </div>
                  )}

                  <p className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap">{m.text}</p>

                  {m.file && (
                    <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-black/10 text-xs font-bold">
                      <FileText size={14} /> {m.file.name}
                    </div>
                  )}

                  {m.sender === "bot" && (m.source || m.confidence) && (
                    <div className="mt-4 pt-3 border-t flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider opacity-60" style={{ borderColor: theme.border }}>
                      <span className="flex items-center gap-1"><ShieldCheck size={12}/> {m.source || "System"}</span>
                      {m.confidence && <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">{m.confidence}% Match</span>}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* AI Thinking State */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start items-end gap-3"
              >
                <div 
                  style={{ 
                    backgroundColor: theme.card, 
                    border: `1px solid ${theme.border}`,
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                  }}
                  className="p-5 rounded-[24px] rounded-tl-none flex flex-col gap-3 min-w-[200px] max-w-[300px]"
                >
                  {/* Pulsing AI Core */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute w-4 h-4 rounded-full opacity-60" 
                        style={{ backgroundColor: theme.accent }} 
                      />
                      <div 
                        className="relative w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.accent }} 
                      />
                    </div>
                    
                    <span className="text-xs font-bold uppercase tracking-widest opacity-70 animate-pulse">
                      NyaySetu Analyzing...
                    </span>
                  </div>

                  {/* Animated Progress Skeletons */}
                  <div className="space-y-2">
                    <motion.div 
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="h-2 w-full rounded-full" 
                      style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                    />
                    <motion.div 
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                      className="h-2 w-[80%] rounded-full" 
                      style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                    />
                    <motion.div 
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                      className="h-2 w-[60%] rounded-full" 
                      style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                    />
                  </div>

                  {/* Status Message */}
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-50 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" />
                    {uploadedFile ? "📄 ANALYZING DOCUMENT..." : "🔍 SEARCHING LEGAL ARCHIVES..."}
                  </div>

                  {/* Animated Dots */}
                  <div className="flex gap-1">
                    <motion.div 
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <motion.div 
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <motion.div 
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Action Center */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.border }}>
          <AnimatePresence>
            {filePreview && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} 
                className="mb-4 p-3 rounded-2xl flex items-center justify-between" style={{ backgroundColor: `${theme.accent}10`, border: `1px solid ${theme.accent}30` }}>
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-500" />
                  <span className="text-sm font-bold">{filePreview.name}</span>
                </div>
                <button onClick={() => setFilePreview(null)} className="text-red-500 p-1 hover:bg-red-500/10 rounded-full transition-colors"><X size={18}/></button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSendMessage} className="relative group">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            
            <div 
              style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, backdropFilter: "blur(20px)" }}
              className="flex items-center gap-2 p-2 rounded-[28px] shadow-2xl transition-all duration-300 focus-within:ring-4 focus-within:ring-indigo-500/10"
            >
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className="p-3 rounded-full hover:bg-gray-500/10 transition-colors text-gray-500"
              >
                <Upload size={22} />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask NyaySetu anything about legal procedures..."
                className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium"
                style={{ color: theme.text }}
              />

              <button
                type="submit"
                disabled={loading || (!inputText.trim() && !uploadedFile)}
                style={{ backgroundColor: theme.accent }}
                className="p-3.5 text-white rounded-[22px] transition-all active:scale-90 disabled:opacity-30 shadow-lg"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </form>
          <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] mt-4 opacity-40">End-to-End Encrypted Legal Query</p>
        </div>
      </main>

      <style>{`
        .scrollbar-custom::-webkit-scrollbar { width: 4px; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 10px; }
        input::placeholder { opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default Chat;
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';

const AutoChatWidget = () => {
  // The script to loop through
  const SCRIPT = [
    { type: 'user', text: "Can I file an FIR online?" },
    { type: 'bot', text: "Yes. Under the e-FIR system, you can file complaints for cognizable offenses like theft or cybercrime via the official state police portal." },
    { type: 'user', text: "What documents do I need?" },
    { type: 'bot', text: "You typically need: 1. A valid ID proof (Aadhar/Pan) \n2. Incident details (Date, Time, Location) \n3. Any supporting evidence (Photos/Screenshots)." }
  ];

  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: "Namaste. I am NyayaSahayak's digital assistant. How may I aid your legal query today?" }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatBoxRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  useEffect(() => {
    let timeout;
    
    const runScript = async () => {
      if (currentStep >= SCRIPT.length) {
        // Reset loop after delay
        timeout = setTimeout(() => {
          setMessages([{ id: 0, role: 'bot', text: "Namaste. I am NyayaSahayak's digital assistant. How may I aid your legal query today?" }]);
          setCurrentStep(0);
        }, 5000);
        return;
      }

      const action = SCRIPT[currentStep];

      if (action.type === 'user') {
        // 1. Simulate User Typing
        for (let i = 0; i <= action.text.length; i++) {
          setDisplayText(action.text.slice(0, i));
          await new Promise(r => setTimeout(r, 50)); // Typing speed
        }
        await new Promise(r => setTimeout(r, 400)); // Pause before send

        // 2. Send Message
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: action.text }]);
        setDisplayText("");
        setIsBotTyping(true);
        
        // Move to next step (Bot Response)
        setCurrentStep(prev => prev + 1);
      
      } else if (action.type === 'bot') {
        // 3. Simulate Bot "Thinking"
        await new Promise(r => setTimeout(r, 1500)); 
        setIsBotTyping(false);
        setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: action.text }]);
        
        // Wait before next user interaction
        await new Promise(r => setTimeout(r, 2000));
        setCurrentStep(prev => prev + 1);
      }
    };

    runScript();
    return () => clearTimeout(timeout);
  }, [currentStep]);

  return (
    <div className="w-full h-full bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
      {/* Header */}
      <div className="p-4 bg-[#1F2937] border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/10 rounded-lg">
            <Bot className="w-4 h-4 text-orange-500" />
          </div>
          <span className="font-bold text-slate-200 text-sm tracking-wide">LEGAL ASSISTANT</span>
        </div>
        <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatBoxRef} className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300
                ${msg.role === 'user' 
                  ? 'bg-orange-600 text-white rounded-br-none' 
                  : 'bg-[#1F2937] text-slate-300 rounded-bl-none border border-slate-700'
                }`}
            >
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        {isBotTyping && (
          <div className="flex justify-start">
            <div className="bg-[#1F2937] border border-slate-700 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* Fake Input Area */}
      <div className="p-4 bg-[#1F2937] border-t border-slate-700">
        <div className="relative">
          <input 
            disabled
            type="text" 
            value={displayText}
            placeholder="Ask a legal question..."
            className="w-full bg-[#111827] text-slate-200 text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none placeholder:text-slate-600 cursor-default"
          />
          <button className={`absolute right-2 top-1.5 p-1.5 rounded-lg transition-all duration-300 ${displayText ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoChatWidget;
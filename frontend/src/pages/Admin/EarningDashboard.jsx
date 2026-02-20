import React from "react";
import { 
  TrendingUp, 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ChevronDown,
  Activity,
  Zap,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/themeContext";

// --- MINI HUMANIZED TOGGLE COMPONENT ---
const HumanizedToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-5 flex items-center bg-slate-200 dark:bg-slate-800 rounded-full p-0.5 cursor-pointer transition-colors duration-300"
    >
      <motion.div
        animate={{ x: isDark ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-3.5 h-3.5 bg-white dark:bg-orange-500 rounded-full shadow-sm flex items-center justify-center z-10"
      >
        {isDark ? <Moon size={8} className="text-white" /> : <Sun size={8} className="text-orange-500" />}
      </motion.div>
      <div className="absolute inset-0 flex justify-between items-center px-1.5 pointer-events-none">
        <Sun size={6} className={`${isDark ? 'opacity-0' : 'opacity-40'} text-orange-600 transition-opacity`} />
        <Moon size={6} className={`${isDark ? 'opacity-40' : 'opacity-0'} text-slate-400 transition-opacity`} />
      </div>
    </button>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const EarningDashboard = () => {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-500 bg-[#FFFAF0] dark:bg-[#050505] text-slate-900 dark:text-white p-8 font-sans">
      
      {/* 1. TOP NAVIGATION BAR */}
      <div className="max-w-[1440px] mx-auto flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Financial Command</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-2 uppercase tracking-widest">Legal Revenue Tracking</p>
        </div>
        
        {/* SMALL THEME CONTROL */}
        <div className="flex items-center gap-4 bg-white dark:bg-[#121212] px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/5 shadow-xl shadow-orange-950/5">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Night Mode</span>
          <HumanizedToggle />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8">
        
        {/* LEFT SECTION (8 UNITS) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* TOTAL BALANCE CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#121212] rounded-[40px] p-10 border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 blur-[120px] rounded-full -mr-32 -mt-32 opacity-0 dark:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Total Balance</h2>
                <div className="flex items-center gap-5">
                  <h1 className="text-5xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white">$10,120.50</h1>
                  <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl text-sm font-black">
                    <TrendingUp size={16} /> +2.92%
                  </div>
                </div>
              </div>

              <div className="flex bg-slate-100 dark:bg-black/40 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
                {['1Y', '6M', '3M', '1M'].map((t) => (
                  <button key={t} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${t === '1Y' ? 'bg-white dark:bg-[#1f1f1f] text-orange-600 dark:text-white shadow-lg' : 'text-slate-400'}`}>{t}</button>
                ))}
              </div>
            </div>

            <div className="h-48 w-full mt-12 relative">
               <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ea580c" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,150 Q100,120 200,160 T400,100 T600,130 T800,70 T1000,110 L1000,200 L0,200 Z" fill="url(#glow)" />
                  <motion.path 
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                    d="M0,150 Q100,120 200,160 T400,100 T600,130 T800,70 T1000,110" 
                    fill="none" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" 
                  />
               </svg>
               <div className="absolute top-[20%] left-[55%] flex flex-col items-center">
                  <div className="bg-orange-600 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-[10px] font-black shadow-2xl">9,780.90 USD</div>
                  <div className="w-3 h-3 bg-white dark:bg-orange-600 rounded-full mt-2 ring-4 ring-orange-500/20" />
               </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* 2. AD SECTION - TYPOGRAPHY SMALLER */}
             <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-[40px] p-10 shadow-2xl shadow-orange-600/20 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <Zap size={24} className="text-white fill-white mb-6" />
                    {/* Shrunk Title */}
                    <h3 className="text-xl font-black text-white leading-tight mb-2 uppercase tracking-tight">Trusted by 10k+ Legal Partners</h3>
                    {/* Small desc */}
                    <p className="text-white/70 text-[11px] font-bold tracking-wide uppercase">Join the premier legal revenue network today.</p>
                  </div>
                  <button className="bg-white text-orange-600 w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-8 shadow-xl transition-transform active:scale-95">Upgrade Pro</button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
             </div>

             <div className="bg-white dark:bg-[#121212] rounded-[40px] p-10 border border-slate-100 dark:border-white/5 shadow-xl">
                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">Investments</h3>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8">$3,200.00</h2>
                <div className="flex items-end justify-between h-32 gap-3">
                   {[40, 70, 50, 90, 60, 45].map((h, i) => (
                     <motion.div 
                        key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }}
                        className={`flex-1 rounded-xl ${i === 3 ? 'bg-orange-600 dark:bg-emerald-500 shadow-lg' : 'bg-slate-100 dark:bg-white/5'}`} 
                     />
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT SECTION (4 UNITS) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-[#121212] rounded-[40px] p-10 border border-slate-100 dark:border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
               <h3 className="font-black text-xl">My Card</h3>
               <button className="text-orange-600 text-[10px] font-black uppercase tracking-widest">+ Add New</button>
            </div>
            
            <div className="relative h-60 mb-10 group cursor-pointer">
               <div className="absolute top-4 left-0 w-full h-44 bg-slate-100 dark:bg-white/5 rounded-[32px] scale-[0.95] translate-y-2 transition-transform group-hover:translate-y-0" />
               <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-zinc-800 to-black rounded-[32px] p-8 border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 invert self-start" alt="Visa" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Balance</p>
                    <div className="flex justify-between items-end">
                       <h2 className="text-3xl font-black text-white">$12,850.00</h2>
                       <span className="text-emerald-500 text-[10px] font-black">+3.52%</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                  <ArrowDownLeft size={16} className="text-orange-500" /> Request
               </button>
               <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all">
                  <ArrowUpRight size={16} /> Transfer
               </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121212] rounded-[40px] p-10 border border-slate-100 dark:border-white/5 shadow-xl">
             <h3 className="font-black text-xl mb-8">Recent Activity</h3>
             <div className="space-y-8">
                {[
                  { name: 'Lucas Bennett', desc: 'Consultation Fee', amt: '+$25.00', color: 'text-emerald-500' },
                  { name: 'Google Workspace', desc: 'Office Subscription', amt: '-$5.00', color: 'text-slate-400 dark:text-slate-200' },
                  { name: 'Staples Store', desc: 'Case Files Print', amt: '-$55.00', color: 'text-slate-400 dark:text-slate-200' }
                ].map((tx, i) => (
                  <div key={i} className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <Activity size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black group-hover:text-orange-600 transition-colors">{tx.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{tx.desc}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-black ${tx.color}`}>{tx.amt}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningDashboard;
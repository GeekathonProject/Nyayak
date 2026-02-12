import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BentoGrid = ({ children, className }) => {
  return (
    <div className={cn("grid w-full auto-rows-[22rem] grid-cols-3 gap-6", className)}>
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  isDark // <--- NEW PROP: We force the theme here
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-[2rem]",
      // FORCE LIGHT MODE STYLES
      !isDark && "bg-white border border-orange-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10",
      // FORCE DARK MODE STYLES
      isDark && "bg-[#1E293B] border border-white/10",
      "transform-gpu transition-all duration-300",
      className
    )}
  >
    {/* Background Area */}
    <div className="absolute inset-0 z-0 transition-all duration-500 group-hover:scale-105 opacity-100">
        {background}
    </div>
    
    {/* Gradient Overlay for Text Readability */}
    <div className={`pointer-events-none absolute inset-0 z-10 flex flex-col gap-2 p-6 transition-all duration-300 group-hover:-translate-y-10 bg-gradient-to-b from-transparent via-transparent ${isDark ? 'to-[#1E293B]/90' : 'to-white/90'}`} />

    {/* Content */}
    <div className="pointer-events-none absolute bottom-0 z-20 flex w-full flex-col gap-1 p-6 transition-all duration-300 group-hover:translate-y-0 translate-y-2">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-orange-100 text-orange-600'}`}>
            <Icon className="h-5 w-5" />
        </div>
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {name}
        </h3>
      </div>
      <p className={`max-w-lg text-sm leading-relaxed mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        {description}
      </p>
    </div>

    {/* CTA Button */}
    <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-30">
      <button className={`pointer-events-auto flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold shadow-lg transition-transform hover:scale-105 ${isDark ? 'bg-white text-slate-900' : 'bg-orange-600 text-white'}`}>
        {cta}
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  </div>
);
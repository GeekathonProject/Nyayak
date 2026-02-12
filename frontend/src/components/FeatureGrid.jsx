import React from 'react';
import { useTheme } from '../context/themeContext';

// --- ASSETS (Premium 3D Icons) ---
const assets = {
  doc3d: "https://cdn3d.iconscout.com/3d/premium/thumb/contract-document-5650125-4707838.png",
  shield3d: "https://cdn3d.iconscout.com/3d/premium/thumb/security-shield-5590926-4652689.png",
  map3d: "https://cdn3d.iconscout.com/3d/premium/thumb/map-location-5481335-4581177.png",
  clock3d: "https://cdn3d.iconscout.com/3d/premium/thumb/clock-time-3260424-2725117.png",
  siren3d: "https://cdn3d.iconscout.com/3d/premium/thumb/siren-5617377-4673832.png",
  law3d: "https://cdn3d.iconscout.com/3d/premium/thumb/law-book-5650126-4707839.png",
};

const features = [
  {
    icon: assets.doc3d,
    title: "Automated Document Drafting",
    desc: "Create court-compliant legal documents instantly using our AI-powered drafting engine."
  },
  {
    icon: assets.shield3d,
    title: "Blockchain Evidence Vault",
    desc: "Securely store and verify digital evidence with tamper-proof blockchain technology."
  },
  {
    icon: assets.map3d,
    title: "Geospatial Crime Analytics",
    desc: "Visualize crime data on interactive maps to identify patterns and improve public safety."
  },
  {
    icon: assets.clock3d,
    title: "Real-time Case Tracking",
    desc: "Monitor the status of your legal cases and FIRs with live updates and timelines."
  },
  {
    icon: assets.siren3d,
    title: "Emergency Response System",
    desc: "Instant access to emergency services and location sharing in critical situations."
  },
  {
    icon: assets.law3d,
    title: "Legal Knowledge Base",
    desc: "Access a comprehensive library of legal resources, laws, and procedures."
  },
];

const FeatureGrid = () => {
  const { isDark } = useTheme();

  return (
    <section className={`py-24 px-6 relative z-10 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50/80'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
            System Modules
          </p>
          <h2 className={`text-3xl md:text-4xl font-serif-heading font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Key Features of the Portal
          </h2>
        </div>

        {/* The Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Individual Card Component
const FeatureCard = ({ feature, isDark }) => (
  <div className={`p-8 rounded-2xl border transition-all group hover:-translate-y-1 ${
    isDark
      ? 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'
      : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-sm'
  }`}>
    <div className={`mb-6 p-4 rounded-xl inline-block ${isDark ? 'bg-slate-700/50' : 'bg-orange-50'}`}>
      <img src={feature.icon} alt={feature.title} className="w-12 h-12 object-contain drop-shadow-sm" />
    </div>
    <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {feature.title}
    </h3>
    <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
      {feature.desc}
    </p>
  </div>
);

export default FeatureGrid;
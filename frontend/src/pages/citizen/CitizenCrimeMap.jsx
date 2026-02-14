import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Rectangle, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast, ToastContainer } from "react-toastify";
import { supabase } from "../../lib/supabase";
import { X, MapPin, Activity, Minus, Plus, Loader2, Sun, Moon, AlertTriangle } from "lucide-react";

// Aura Effect Component for Dangerous Zones
const DangerousAura = ({ lat, lng }) => {
  return (
    <Circle
      center={[lat, lng]}
      radius={200} // radius in meters
      pathOptions={{
        fillColor: '#ef4444',
        fillOpacity: 0.15,
        color: 'transparent',
        className: 'animate-pulse-slow' // Custom CSS for aura
      }}
    />
  );
};

const HeatmapGridDisplay = ({ locations, zoom, isDarkMode }) => {
  if (!locations || locations.length === 0) return null;
  const gridSize = 0.0005 * Math.pow(2, 15 - zoom);
  const grid = {};

  locations.forEach((loc) => {
    const key = `${Math.floor(loc.latitude / gridSize)}-${Math.floor(loc.longitude / gridSize)}`;
    if (!grid[key]) {
      grid[key] = { lat: loc.latitude, lng: loc.longitude, dangerous: 0, safe: 0 };
    }
    if (loc.type === 'dangerous') grid[key].dangerous += 1;
    else grid[key].safe += 1;
  });

  return (
    <>
      {Object.values(grid).map((cell, idx) => {
        const total = cell.dangerous + cell.safe;
        const dangerRatio = cell.dangerous / total;
        
        // Dynamic colors based on safety
        let color = dangerRatio > 0.7 ? '#ef4444' : dangerRatio > 0.4 ? '#f59e0b' : '#10b981';
        
        return (
          <Rectangle
            key={idx}
            bounds={[
              [cell.lat - gridSize / 2, cell.lng - gridSize / 2],
              [cell.lat + gridSize / 2, cell.lng + gridSize / 2],
            ]}
            pathOptions={{
              color: 'transparent',
              fillColor: color,
              fillOpacity: isDarkMode ? 0.3 : 0.2
            }}
          />
        );
      })}
    </>
  );
};

const CitizenCrimeMap = ({ isOpen, onClose }) => {
  const [markedLocations, setMarkedLocations] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      const { data } = await supabase.from('location_safety').select('*');
      if (data) setMarkedLocations(data);
      setLoading(false);
    };
    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`${isDarkMode ? 'dark' : ''} fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 transition-colors duration-500`}>
      <div className="w-full h-full max-w-7xl bg-white dark:bg-[#0B0F1A] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-slate-200 dark:border-white/5">
        
        {/* Floating Controls Overlay */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3">
          <header className="bg-white/90 dark:bg-[#161B26]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-white/10">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-emerald-500/20 text-emerald-500' : 'bg-emerald-100 text-emerald-600'}`}>
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white hidden sm:block">NyaySetu Intelligence</h2>
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all text-slate-600 dark:text-slate-400"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button onClick={onClose} className="p-2 hover:bg-red-500/10 rounded-xl group transition-all">
              <X className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
            </button>
          </header>
        </div>

        {/* Map */}
        <main className="flex-1 relative">
          <MapContainer center={[22.5726, 88.3639]} zoom={zoomLevel} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <TileLayer 
              url={isDarkMode 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              } 
            />
            
            {showHeatmap && <HeatmapGridDisplay locations={markedLocations} zoom={zoomLevel} isDarkMode={isDarkMode} />}

            {/* Aura for Dangerous Zones */}
            {markedLocations.filter(l => l.type === 'dangerous').map(loc => (
              <DangerousAura key={`aura-${loc.id}`} lat={loc.latitude} lng={loc.longitude} />
            ))}

            {markedLocations.map((loc) => (
              <Marker 
                key={loc.id} 
                position={[loc.latitude, loc.longitude]}
                icon={L.divIcon({
                  className: "custom-marker",
                  html: `
                    <div class="relative flex items-center justify-center">
                      ${loc.type === 'dangerous' ? '<div class="absolute inset-0 bg-red-500/40 blur-md rounded-full animate-ping"></div>' : ''}
                      <div class="w-4 h-4 rounded-full border-2 border-white shadow-xl ${loc.type === 'dangerous' ? 'bg-red-600' : 'bg-emerald-500'}"></div>
                    </div>`
                })}
              >
                <Popup>
                    <div className="font-sans">
                        <span className={`font-bold ${loc.type === 'dangerous' ? 'text-red-600' : 'text-emerald-600'}`}>
                            {loc.type === 'dangerous' ? '⚠ Danger Zone' : '✓ Secured Area'}
                        </span>
                    </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Right Side Stats Panel */}
          <aside className="absolute right-6 top-24 z-[500] flex flex-col gap-3">
             <div className="bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Threat Level</p>
                <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-bold dark:text-white">{markedLocations.filter(l => l.type === 'dangerous').length} Active Risks</span>
                </div>
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: '60%' }}></div>
                </div>
             </div>

             {/* Zoom & Layer Controls */}
             <div className="flex flex-col gap-2">
                <button onClick={() => setShowHeatmap(!showHeatmap)} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${showHeatmap ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-500'}`}>
                    <Activity className="w-5 h-5" />
                </button>
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 overflow-hidden">
                    <button onClick={() => setZoomLevel(z => z + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-white"><Plus /></button>
                    <button onClick={() => setZoomLevel(z => z - 1)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-white border-t border-slate-200 dark:border-white/10"><Minus /></button>
                </div>
             </div>
          </aside>
        </main>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .leaflet-container {
            background-color: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default CitizenCrimeMap;
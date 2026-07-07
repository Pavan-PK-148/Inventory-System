// client/components/WarehouseHeatmap.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { Layers, Thermometer, ShieldAlert, Activity } from 'lucide-react';

const WarehouseHeatmap = () => {
  const [warehouse, setWarehouse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    // Falls back gracefully if your environment variables are clearing out locally
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const socketUrl = apiUrl.replace('/api', '');
    
    const socket = io(socketUrl, { 
      transports: ['websocket', 'polling'],
      withCredentials: true 
    });

    // Request the data grid matrix mapping from the database log hook
    socket.emit('get_heatmap_init', 'Warehouse Alpha');

    socket.on('warehouse_update', (data) => {
      setWarehouse(data);
      // Synchronize selection tracking references if active
      if (selectedSection) {
        const freshData = data.sections.find(s => s.sectionId === selectedSection.sectionId);
        if (freshData) setSelectedSection(freshData);
      }
    });

    return () => socket.disconnect();
  }, [selectedSection]);

  const getColorConfig = (stock) => {
    if (stock < 10) return { bg: 'bg-rose-500/10 border-rose-500/40 text-rose-500', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]' };
    if (stock < 40) return { bg: 'bg-amber-500/10 border-amber-500/40 text-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]' };
    return { bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' };
  };

  return (
    <div className="w-full rounded-3xl border border-white/30 bg-white/70 p-6 shadow-lg backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers size={20} className="text-primary-500" />
            Telemetry Heatmap Matrix
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Real-time localized storage zone density</p>
        </div>
        
        <div className="flex gap-4 text-[11px] font-bold tracking-wide uppercase">
          <span className="flex items-center gap-1.5 text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500"/> Stable</span>
          <span className="flex items-center gap-1.5 text-amber-500"><span className="h-2 w-2 rounded-full bg-amber-500"/> Warning</span>
          <span className="flex items-center gap-1.5 text-rose-500"><span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"/> Low Stock</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* HEATMAP MATRIX GRID */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {warehouse?.sections.map((section) => {
            const config = getColorConfig(section.stockLevel);
            return (
              <motion.button
                key={section.sectionId}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSection(section)}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border cursor-pointer font-sans transition-all duration-300 ${config.bg} ${config.glow}`}
              >
                <span className="text-xl font-black tracking-tight">{section.sectionId}</span>
                <span className="text-xs font-bold opacity-80 mt-1">{section.stockLevel} Items</span>
                {section.activity === 'HIGH' && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* METRIC ANALYSIS INSPECTION DRAWER */}
        <div className="lg:col-span-5 min-h-[198px] rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
          <AnimatePresence mode="wait">
            {selectedSection ? (
              <motion.div
                key={selectedSection.sectionId}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <h4 className="text-sm font-black text-slate-800">Section {selectedSection.sectionId} Diagnostics</h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white border border-slate-200">BAY ACTIVE</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60 flex items-center gap-3">
                    <Layers size={16} className="text-primary-500" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Utilization</p>
                      <p className="text-sm font-black text-slate-800">{selectedSection.utilization}%</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60 flex items-center gap-3">
                    <Thermometer size={16} className="text-orange-500" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Temperature</p>
                      <p className="text-sm font-black text-slate-800">{selectedSection.temperature}°C</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Live Traffic Frequency</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    selectedSection.activity === 'HIGH' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-600'
                  }`}>{selectedSection.activity} INTENSITY</span>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShieldAlert size={26} className="text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-400 max-w-[240px]">Select a storage sector matrix box above to pull active telemetry diagnostics.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WarehouseHeatmap;
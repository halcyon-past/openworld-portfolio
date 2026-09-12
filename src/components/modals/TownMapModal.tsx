'use client';

import React, { useState } from 'react';
import { soundManager } from '@/game/audio/SoundManager';
import { MapPin, Navigation, X, Sparkles } from 'lucide-react';

interface TownMapModalProps {
  onWarp: (tileX: number, tileY: number) => void;
  onClose: () => void;
}

export const TownMapModal: React.FC<TownMapModalProps> = ({ onWarp, onClose }) => {
  const locations = [
    {
      id: 'house',
      name: "Aritro's Residence",
      zone: 'North-West Residential',
      desc: "Cozy 2-story house with SiliconSync AI blog, beatboxing station, and lawn football.",
      x: 6,
      y: 8,
      color: '#c2410c',
      icon: '🏡'
    },
    {
      id: 'lab',
      name: "Aritro AI Research Lab",
      zone: 'North-East Technology Hub',
      desc: "High-tech facility researching LangGraph multi-agent systems and Google Gemini Flash.",
      x: 21,
      y: 8,
      color: '#0284c7',
      icon: '🔬'
    },
    {
      id: 'center',
      name: "Innovation Pokédex Center",
      zone: 'Central Plaza',
      desc: "Showcasing Aritro's projects: Quarantine, Structurify, Luffy Laser Dodge, GlideConnect, and PAWsitive.",
      x: 7,
      y: 18,
      color: '#dc2626',
      icon: '🏥'
    },
    {
      id: 'mart',
      name: "Tech & Skill Mart",
      zone: 'Commercial District',
      desc: "Full inventory of Python, Next.js, TypeScript, GCP, Databricks, and Docker.",
      x: 19,
      y: 18,
      color: '#2563eb',
      icon: '🏪'
    },
    {
      id: 'arcade',
      name: "Developer Game Corner",
      zone: 'East Entertainment District',
      desc: "Playable retro minigames: Developer Speed Typing and Minimalist Python Snake.",
      x: 27,
      y: 18,
      color: '#8b5cf6',
      icon: '🕹️'
    },
    {
      id: 'gym',
      name: "Silicon Gym (BMS Arena)",
      zone: 'South Enterprise Summit',
      desc: "Battle arena of Bristol Myers Squibb Associate Developer & Hack4Bengal 3.0 Champion.",
      x: 16,
      y: 27,
      color: '#f59e0b',
      icon: '⚡'
    },
    {
      id: 'coast',
      name: "Verdant Coast & Lake",
      zone: 'South-West Coastline',
      desc: "Tranquil waters where Pixel Pup roams, celebrating PAWsitive pet healthcare.",
      x: 5,
      y: 22,
      color: '#10b981',
      icon: '🌊'
    }
  ];

  const [selectedLoc, setSelectedLoc] = useState(locations[0]);

  const handleWarp = (loc: typeof locations[0]) => {
    soundManager.playWarp();
    onWarp(loc.x, loc.y);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs font-pixel">
      {/* Emerald / FireRed Town Map Casing */}
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-teal-700 via-teal-800 to-emerald-900 border-4 sm:border-8 border-slate-900 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-teal-950 px-4 py-2 border-b-4 border-slate-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-teal-300" />
            <span className="text-xs md:text-sm font-bold text-white tracking-wider">
              TOWN MAP • PALLET CLOUD REGION
            </span>
          </div>
          <button
            onClick={() => {
              soundManager.playCancel();
              onClose();
            }}
            className="p-1 rounded bg-slate-900/60 hover:bg-slate-900 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 md:p-4 overflow-y-auto flex-1">
          
          {/* Left Column: Location List */}
          <div className="md:col-span-5 bg-[#1e2530] border-4 border-[#2b3340] rounded-lg p-2 flex flex-col gap-1 overflow-y-auto max-h-[220px] md:max-h-none">
            <div className="text-[9px] text-teal-300 font-silk px-2 py-1 uppercase tracking-wider">
              FAST TRAVEL DESTINATIONS
            </div>

            {locations.map((loc) => {
              const isCurrent = loc.id === selectedLoc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    soundManager.playMenuCursor();
                    setSelectedLoc(loc);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded flex items-center justify-between transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-teal-500 text-slate-900 font-bold shadow-md translate-x-1'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{loc.icon}</span>
                    <span className="text-xs truncate">{loc.name}</span>
                  </div>
                  <span className="text-[8px] font-silk text-slate-400">({loc.x},{loc.y})</span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Location Inspection & Warp Trigger */}
          <div className="md:col-span-7 bg-[#fcf8f2] text-slate-900 border-4 border-[#2b3340] rounded-lg p-4 flex flex-col justify-between gap-4">
            
            <div className="space-y-3">
              {/* Location Name & Zone */}
              <div className="border-b-2 border-slate-300 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedLoc.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedLoc.name}
                    </h3>
                    <p className="text-[10px] text-teal-700 font-bold font-silk">
                      ZONE: {selectedLoc.zone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  Landmark Intel
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-silk bg-slate-100 p-3 rounded border border-slate-200">
                  {selectedLoc.desc}
                </p>
              </div>

              {/* Coordinates */}
              <div className="text-[10px] font-silk text-slate-600 bg-teal-50 p-2 rounded border border-teal-200 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Map Coordinates: X={selectedLoc.x}, Y={selectedLoc.y}</span>
              </div>
            </div>

            {/* Instant Warp Button */}
            <button
              onClick={() => handleWarp(selectedLoc)}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded text-xs flex items-center justify-center gap-2 shadow-md active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>WARP TO DESTINATION (INSTANT TELEPORT)</span>
            </button>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-teal-950 px-4 py-1.5 text-[8px] text-teal-300 font-silk flex justify-between items-center border-t-2 border-slate-900 shrink-0">
          <span>TOWN MAP: Recruiter & Speedrunner Fast Travel</span>
          <span>B / ESC: Close Map</span>
        </div>

      </div>
    </div>
  );
};

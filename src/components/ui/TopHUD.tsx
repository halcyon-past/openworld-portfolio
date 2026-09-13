'use client';

import React from 'react';
import { soundManager } from '@/game/audio/SoundManager';
import {
  Settings,
  FileText,
  Menu,
  BookOpen,
  User,
  Briefcase,
  MapPin,
  Gamepad2,
} from 'lucide-react';

interface TopHUDProps {
  onOpenModal: (modal: string) => void;
  onToggleRecruiter: () => void;
  playerCoords: { x: number; y: number };
}

export const TopHUD: React.FC<TopHUDProps> = ({
  onOpenModal,
  onToggleRecruiter,
  playerCoords,
}) => {
  return (
    <header className="fixed top-2 left-2 right-2 md:top-3 md:left-4 md:right-4 z-30 flex items-center justify-between pointer-events-none font-pixel">
      
      {/* Left: Player Badge & Mini Coordinates */}
      <div className="flex items-center gap-2.5 pointer-events-auto bg-[#1e2530]/90 border-2 border-slate-700 backdrop-blur-xs px-3 py-1.5 rounded-md shadow-lg text-white">
        <div className="w-6 h-6 rounded bg-slate-900 border border-amber-400/50 p-0.5 shrink-0 flex items-center justify-center">
          <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs font-bold text-amber-300">ARITRO SAHA</span>
          <span className="text-[8px] text-slate-400 font-silk">
            PALLET CLOUD ({playerCoords.x},{playerCoords.y})
          </span>
        </div>
      </div>

      {/* Center: Quick Nav Buttons (Hidden on tiny screens, shown on md+) */}
      <div className="hidden lg:flex items-center gap-1.5 pointer-events-auto bg-[#1e2530]/90 border-2 border-slate-700 backdrop-blur-xs p-1 rounded-md shadow-lg">
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenModal('pokedex');
          }}
          className="px-2.5 py-1 rounded bg-red-600/80 hover:bg-red-500 text-white text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer"
        >
          <BookOpen className="w-3 h-3" />
          <span>PROJECTS</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenModal('trainercard');
          }}
          className="px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-500 text-white text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer"
        >
          <User className="w-3 h-3" />
          <span>ABOUT ME</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenModal('bag');
          }}
          className="px-2.5 py-1 rounded bg-amber-600/80 hover:bg-amber-500 text-white text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer"
        >
          <Briefcase className="w-3 h-3" />
          <span>SKILLS</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenModal('townmap');
          }}
          className="px-2.5 py-1 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer"
        >
          <MapPin className="w-3 h-3" />
          <span>MAP</span>
        </button>

        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenModal('arcade');
          }}
          className="px-2.5 py-1 rounded bg-purple-600/80 hover:bg-purple-500 text-white text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer"
        >
          <Gamepad2 className="w-3 h-3" />
          <span>ARCADE</span>
        </button>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-1.5 pointer-events-auto bg-[#1e2530]/90 border-2 border-slate-700 backdrop-blur-xs p-1 rounded-md shadow-lg text-slate-200">
        
        {/* Recruiter Dossier Button */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onToggleRecruiter();
          }}
          title="Recruiter Fast View"
          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
        >
          <FileText className="w-3 h-3" />
          <span className="hidden sm:inline">RECRUITER VIEW</span>
        </button>

        {/* Settings Menu Button */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenModal('settings');
          }}
          title="Game & Audio Settings"
          className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition-all cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Start Menu trigger */}
        <button
          onClick={() => {
            soundManager.playSelect();
            onOpenModal('startmenu');
          }}
          title="Open Start Menu (Esc/X)"
          className="p-1.5 rounded bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer"
        >
          <Menu className="w-3.5 h-3.5" />
        </button>

      </div>

    </header>
  );
};

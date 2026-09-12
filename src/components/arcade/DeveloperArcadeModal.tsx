'use client';

import React, { useState } from 'react';
import { SpeedTypingGame } from './SpeedTypingGame';
import { SnakeGame } from './SnakeGame';
import { soundManager } from '@/game/audio/SoundManager';
import { Gamepad2, Keyboard, Play, X } from 'lucide-react';

interface DeveloperArcadeModalProps {
  onClose: () => void;
}

export const DeveloperArcadeModal: React.FC<DeveloperArcadeModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'typing' | 'snake'>('typing');

  const handleTabChange = (tab: 'typing' | 'snake') => {
    soundManager.playMenuCursor();
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs font-pixel">
      {/* Retro Game Corner Cabinet Casing */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-950 border-4 sm:border-8 border-slate-900 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Neon Marquee Header */}
        <div className="bg-slate-950 px-4 py-2.5 border-b-4 border-slate-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-xs md:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 tracking-wider">
              DEVELOPER ARCADE • GAME CORNER
            </span>
          </div>
          <button
            onClick={() => {
              soundManager.playCancel();
              onClose();
            }}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Game Selection Buttons */}
        <div className="bg-purple-950/80 p-2 flex gap-2 border-b-2 border-slate-900 shrink-0">
          <button
            onClick={() => handleTabChange('typing')}
            className={`flex-1 py-2 px-3 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'typing'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>DEVELOPER SPEED TYPING</span>
          </button>

          <button
            onClick={() => handleTabChange('snake')}
            className={`flex-1 py-2 px-3 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'snake'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md'
                : 'bg-purple-900/60 text-purple-200 hover:bg-purple-800/60'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>MINIMALIST PYTHON SNAKE</span>
          </button>
        </div>

        {/* Game Stage Area */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center">
          {activeTab === 'typing' ? <SpeedTypingGame /> : <SnakeGame />}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-4 py-1.5 text-[8px] text-purple-300 font-silk flex justify-between items-center border-t-2 border-slate-900 shrink-0">
          <span>Insert Coin to Play • Coded with Next.js & React</span>
          <span>B / ESC: Leave Arcade</span>
        </div>

      </div>
    </div>
  );
};

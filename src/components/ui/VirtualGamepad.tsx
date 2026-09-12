'use client';

import React from 'react';
import { Direction } from '@/game/engine/types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface VirtualGamepadProps {
  onDirection: (dir: Direction | null) => void;
  onAction: (action: 'A' | 'B' | 'START') => void;
}

export const VirtualGamepad: React.FC<VirtualGamepadProps> = ({ onDirection, onAction }) => {
  return (
    <div className="fixed bottom-3 left-3 right-3 z-30 flex justify-between items-end pointer-events-none md:hidden select-none font-pixel">
      
      {/* Directional Pad (D-Pad) */}
      <div className="relative w-32 h-32 pointer-events-auto">
        {/* Background cross */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-28 bg-slate-900 border-2 border-slate-700 rounded-sm" />
          <div className="absolute w-28 h-10 bg-slate-900 border-2 border-slate-700 rounded-sm" />
        </div>

        {/* Up button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onDirection('up'); }}
          onTouchEnd={(e) => { e.preventDefault(); onDirection(null); }}
          onMouseDown={() => onDirection('up')}
          onMouseUp={() => onDirection(null)}
          className="absolute top-1 left-11 w-10 h-10 flex items-center justify-center text-slate-300 active:text-white active:bg-slate-800 rounded cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Down button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onDirection('down'); }}
          onTouchEnd={(e) => { e.preventDefault(); onDirection(null); }}
          onMouseDown={() => onDirection('down')}
          onMouseUp={() => onDirection(null)}
          className="absolute bottom-1 left-11 w-10 h-10 flex items-center justify-center text-slate-300 active:text-white active:bg-slate-800 rounded cursor-pointer"
        >
          <ArrowDown className="w-5 h-5" />
        </button>

        {/* Left button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onDirection('left'); }}
          onTouchEnd={(e) => { e.preventDefault(); onDirection(null); }}
          onMouseDown={() => onDirection('left')}
          onMouseUp={() => onDirection(null)}
          className="absolute top-11 left-1 w-10 h-10 flex items-center justify-center text-slate-300 active:text-white active:bg-slate-800 rounded cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Right button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); onDirection('right'); }}
          onTouchEnd={(e) => { e.preventDefault(); onDirection(null); }}
          onMouseDown={() => onDirection('right')}
          onMouseUp={() => onDirection(null)}
          className="absolute top-11 right-1 w-10 h-10 flex items-center justify-center text-slate-300 active:text-white active:bg-slate-800 rounded cursor-pointer"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Action Buttons (A / B / START) */}
      <div className="flex flex-col items-end gap-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          {/* B Button (Sprint / Cancel) */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onAction('B')}
              className="w-12 h-12 rounded-full bg-gradient-to-b from-rose-500 to-red-700 border-2 border-slate-900 active:scale-95 shadow-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            >
              B
            </button>
            <span className="text-[7px] text-slate-400 mt-0.5">RUN</span>
          </div>

          {/* A Button (Interact / Select) */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onAction('A')}
              className="w-13 h-13 rounded-full bg-gradient-to-b from-emerald-500 to-teal-700 border-2 border-slate-900 active:scale-95 shadow-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            >
              A
            </button>
            <span className="text-[7px] text-slate-400 mt-0.5">TALK</span>
          </div>
        </div>

        {/* START Button */}
        <button
          onClick={() => onAction('START')}
          className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-[8px] text-slate-300 font-silk active:bg-slate-700 shadow-md cursor-pointer"
        >
          START MENU
        </button>
      </div>

    </div>
  );
};

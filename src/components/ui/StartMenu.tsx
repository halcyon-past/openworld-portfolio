'use client';

import React, { useState, useEffect } from 'react';
import { soundManager } from '@/game/audio/SoundManager';
import { BookOpen, User, Briefcase, MapPin, Gamepad2, Save, X } from 'lucide-react';

interface StartMenuProps {
  onSelect: (menuItem: string) => void;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onSelect, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuItems = [
    { id: 'pokedex', label: 'POKÉDEX', desc: 'Projects & Innovations', icon: BookOpen, color: 'text-red-500' },
    { id: 'trainercard', label: 'TRAINER CARD', desc: 'About Me & 8 Badges', icon: User, color: 'text-sky-500' },
    { id: 'bag', label: 'BAG', desc: 'Skills & Tech Stack', icon: Briefcase, color: 'text-amber-500' },
    { id: 'townmap', label: 'TOWN MAP', desc: 'Fast Travel & Warps', icon: MapPin, color: 'text-emerald-500' },
    { id: 'arcade', label: 'ARCADE', desc: 'Playable Minigames', icon: Gamepad2, color: 'text-purple-500' },
    { id: 'save', label: 'SAVE', desc: 'Record Game Progress', icon: Save, color: 'text-blue-500' },
    { id: 'exit', label: 'EXIT', desc: 'Close Start Menu', icon: X, color: 'text-slate-400' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        soundManager.playMenuCursor();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1));
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        soundManager.playMenuCursor();
        setSelectedIndex((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'z') {
        e.preventDefault();
        const selected = menuItems[selectedIndex];
        if (selected.id === 'exit') {
          soundManager.playCancel();
          onClose();
        } else {
          soundManager.playSelect();
          onSelect(selected.id);
        }
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'x') {
        e.preventDefault();
        soundManager.playCancel();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, menuItems, onSelect, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 md:p-8 pointer-events-auto font-pixel">
      {/* Dim backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      {/* Retro GBA Start Menu Window */}
      <div className="relative z-10 w-72 bg-[#fcf8f2] border-4 border-[#2b3340] rounded shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header strip */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-3 py-2 text-xs flex justify-between items-center border-b-2 border-slate-800">
          <span>START MENU</span>
          <span className="text-[9px] text-red-200">LV. 99</span>
        </div>

        {/* Menu list */}
        <div className="p-2 space-y-1">
          {menuItems.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'exit') {
                    soundManager.playCancel();
                    onClose();
                  } else {
                    soundManager.playSelect();
                    onSelect(item.id);
                  }
                }}
                onMouseEnter={() => {
                  if (selectedIndex !== idx) {
                    soundManager.playMenuCursor();
                    setSelectedIndex(idx);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-500 text-white shadow-sm translate-x-1'
                    : 'text-slate-800 hover:bg-slate-200'
                }`}
              >
                {/* Pointer indicator */}
                <span className="text-xs w-2">{isSelected ? '►' : ''}</span>
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : item.color}`} />
                <div className="flex-1">
                  <div className="text-xs font-bold leading-none">{item.label}</div>
                  <div className={`text-[8px] font-silk mt-0.5 ${isSelected ? 'text-red-100' : 'text-slate-500'}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Controls footer */}
        <div className="bg-slate-200 border-t border-slate-300 px-3 py-1.5 text-[8px] text-slate-600 flex justify-between font-silk">
          <span>▲▼: Navigate</span>
          <span>Z/Enter: Select</span>
        </div>
      </div>
    </div>
  );
};

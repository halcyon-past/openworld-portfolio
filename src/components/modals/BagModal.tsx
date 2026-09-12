'use client';

import React, { useState } from 'react';
import { PORTFOLIO_DATA, SkillPocket } from '@/data/portfolioData';
import { soundManager } from '@/game/audio/SoundManager';
import { Briefcase, Key, Disc, Zap, Shield, ChevronRight, X, Sparkles } from 'lucide-react';

interface BagModalProps {
  onClose: () => void;
}

export const BagModal: React.FC<BagModalProps> = ({ onClose }) => {
  const [selectedPocketIdx, setSelectedPocketIdx] = useState(0);
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);

  const pockets = PORTFOLIO_DATA.skillPockets;
  const currentPocket: SkillPocket = pockets[selectedPocketIdx];
  const currentItem = currentPocket.items[selectedItemIdx] || currentPocket.items[0];

  const handlePocketTab = (idx: number) => {
    soundManager.playMenuCursor();
    setSelectedPocketIdx(idx);
    setSelectedItemIdx(0);
  };

  const handleItemClick = (idx: number) => {
    soundManager.playSelect();
    setSelectedItemIdx(idx);
  };

  const getPocketIcon = (iconName: string) => {
    switch (iconName) {
      case 'key': return Key;
      case 'disc': return Disc;
      case 'zap': return Zap;
      case 'shield': return Shield;
      default: return Briefcase;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs font-pixel">
      {/* Emerald / FireRed Bag Shell */}
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 border-4 sm:border-8 border-slate-900 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-amber-950 px-4 py-2 border-b-4 border-slate-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-300" />
            <span className="text-xs md:text-sm font-bold text-white tracking-wider">
              TRAINER&apos;S BAG • SKILLS INVENTORY
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

        {/* Pocket Navigation Tabs */}
        <div className="bg-amber-900/90 p-2 flex flex-wrap gap-2 border-b-2 border-slate-900 shrink-0">
          {pockets.map((p, idx) => {
            const isSelected = idx === selectedPocketIdx;
            const Icon = getPocketIcon(p.icon);

            return (
              <button
                key={p.category}
                onClick={() => handlePocketTab(idx)}
                className={`flex-1 min-w-[120px] py-1.5 px-3 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-900 shadow-md translate-y-0.5'
                    : 'bg-amber-950/80 text-amber-200 hover:bg-amber-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{p.pocketName}</span>
              </button>
            );
          })}
        </div>

        {/* Bag Dual Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 md:p-4 overflow-y-auto flex-1">
          
          {/* Left Column: Items in Pocket */}
          <div className="md:col-span-6 bg-[#1e2530] border-4 border-[#2b3340] rounded-lg p-2 flex flex-col gap-1 shrink-0 overflow-y-auto max-h-[220px] md:max-h-none">
            <div className="text-[9px] text-amber-400 font-silk px-2 py-1 uppercase tracking-wider flex justify-between">
              <span>{currentPocket.category}</span>
              <span>{currentPocket.items.length} ITEMS</span>
            </div>

            {currentPocket.items.map((item, idx) => {
              const isSelected = idx === selectedItemIdx;
              return (
                <button
                  key={item.name}
                  onClick={() => handleItemClick(idx)}
                  className={`w-full text-left px-2.5 py-2 rounded flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-900 font-bold shadow-md translate-x-1'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[9px]">{isSelected ? '►' : '•'}</span>
                    <span className="text-xs truncate">{item.name}</span>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-silk ${isSelected ? 'bg-slate-900 text-amber-300' : 'bg-slate-900 text-slate-400'}`}>
                    {item.level}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Item Inspection Box */}
          <div className="md:col-span-6 bg-[#fcf8f2] text-slate-900 border-4 border-[#2b3340] rounded-lg p-4 flex flex-col justify-between gap-4">
            
            <div className="space-y-3">
              {/* Item Title & Badge */}
              <div className="border-b-2 border-slate-300 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {currentItem.name}
                  </h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-900">
                    {currentItem.tag}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1 font-silk">
                  PROFICIENCY: {currentItem.level}
                </div>
              </div>

              {/* Item Description & Real-world Application */}
              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  Item Description
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-silk bg-slate-100 p-2.5 rounded border border-slate-200">
                  {currentItem.description}
                </p>
              </div>
            </div>

            {/* Bag Utility Tip */}
            <div className="bg-amber-100 p-2.5 rounded border border-amber-300 text-[9px] text-amber-900 font-silk">
              💡 <span className="font-bold">Tip:</span> This skill is actively employed across Aritro&apos;s enterprise systems at Bristol Myers Squibb and production projects like Quarantine and Structurify.
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-amber-950 px-4 py-1.5 text-[8px] text-amber-300 font-silk flex justify-between items-center border-t-2 border-slate-900 shrink-0">
          <span>POCKETS: Key Items • Poké Balls • TMs & HMs • Medicine</span>
          <span>B / ESC: Close Bag</span>
        </div>

      </div>
    </div>
  );
};

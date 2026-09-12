'use client';

import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { soundManager } from '@/game/audio/SoundManager';
import { Save, CheckCircle, X } from 'lucide-react';

interface SaveModalProps {
  playerX: number;
  playerY: number;
  onClose: () => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({ playerX, playerY, onClose }) => {
  const [savingState, setSavingState] = useState<'prompt' | 'saving' | 'saved'>('prompt');

  const handleSave = () => {
    soundManager.playSelect();
    setSavingState('saving');

    // Persist game state to localStorage
    try {
      if (typeof window !== 'undefined') {
        const data = {
          x: playerX,
          y: playerY,
          savedAt: new Date().toISOString(),
          version: '1.0.0',
        };
        localStorage.setItem('pokemon_portfolio_save', JSON.stringify(data));
      }
    } catch {
      // LocalStorage error fallback
    }

    setTimeout(() => {
      soundManager.playFanfare();
      setSavingState('saved');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-pixel">
      {/* Save Screen Box */}
      <div className="relative w-full max-w-md bg-[#fcf8f2] text-slate-900 border-4 border-[#2b3340] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 text-xs font-bold flex justify-between items-center border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>GAME CARTRIDGE MEMORY</span>
          </div>
          <button
            onClick={() => {
              soundManager.playCancel();
              onClose();
            }}
            className="p-1 rounded bg-slate-900/60 hover:bg-slate-900 text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4">
          {/* Current Game Status */}
          <div className="bg-slate-100 p-3 rounded border border-slate-300 space-y-1.5 text-xs">
            <div className="flex justify-between font-bold">
              <span>PLAYER:</span>
              <span className="text-indigo-700">{PORTFOLIO_DATA.trainer.name}</span>
            </div>
            <div className="flex justify-between font-silk text-slate-600">
              <span>BADGES:</span>
              <span className="text-amber-600 font-bold">{PORTFOLIO_DATA.trainer.badgesCount} BADGES</span>
            </div>
            <div className="flex justify-between font-silk text-slate-600">
              <span>POKÉDEX:</span>
              <span className="text-emerald-700 font-bold">{PORTFOLIO_DATA.trainer.pokedexCaught} DISCOVERED</span>
            </div>
            <div className="flex justify-between font-silk text-slate-600">
              <span>COORDINATES:</span>
              <span className="text-slate-800">X={playerX}, Y={playerY}</span>
            </div>
          </div>

          {/* State Display */}
          {savingState === 'prompt' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-800 leading-relaxed font-silk">
                Would you like to save your exploration progress in Pallet Cloud?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs transition-all cursor-pointer shadow-sm"
                >
                  YES (SAVE)
                </button>
                <button
                  onClick={() => {
                    soundManager.playCancel();
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold rounded text-xs transition-all cursor-pointer"
                >
                  NO
                </button>
              </div>
            </div>
          )}

          {savingState === 'saving' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-xs text-blue-700 font-bold animate-pulse">
                SAVING... DON&apos;T TURN OFF THE POWER.
              </div>
            </div>
          )}

          {savingState === 'saved' && (
            <div className="py-4 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="text-xs text-emerald-700 font-bold">
                {PORTFOLIO_DATA.trainer.name} saved the game!
              </div>
              <p className="text-[10px] text-slate-500 font-silk">
                Your coordinates and visited achievements have been recorded to local storage.
              </p>
              <button
                onClick={() => {
                  soundManager.playSelect();
                  onClose();
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-xs cursor-pointer"
              >
                RETURN TO ADVENTURE
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

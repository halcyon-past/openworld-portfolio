'use client';

import React, { useState, useEffect } from 'react';
import { soundManager } from '@/game/audio/SoundManager';
import { Sparkles, Play, FileText, Volume2 } from 'lucide-react';

interface LoadingScreenProps {
  onStartGame: () => void;
  onOpenRecruiter: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onStartGame, onOpenRecruiter }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing GBA Memory...');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const steps = [
      { p: 15, text: 'Generating Pallet Cloud Pixel Tiles...' },
      { p: 35, text: 'Synthesizing 8-Bit Web Audio Engine...' },
      { p: 55, text: 'Loading Pokédex Innovation Terminal...' },
      { p: 75, text: 'Connecting Bristol Myers Squibb Silicon Gym...' },
      { p: 90, text: 'Polishing 8 Badges of Honor...' },
      { p: 100, text: 'Ready for Adventure!' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          setTimeout(() => setShowPrompt(true), 400);
        }, 300);
      }
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const handleStart = React.useCallback(() => {
    soundManager.playFanfare();
    soundManager.startBGM();
    onStartGame();
  }, [onStartGame]);

  const handleRecruiterMode = React.useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundManager.playSelect();
    onOpenRecruiter();
  }, [onOpenRecruiter]);

  // Support pressing Enter or Space to start game immediately once loaded
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        if (isLoaded) {
          handleStart();
        } else {
          // If still loading and user presses Enter, fast-skip directly to game
          handleStart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isLoaded, handleStart]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b10] text-slate-100 overflow-hidden font-pixel">
      {/* Background Animated Retro Grid & Stars */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Soft color glow */}
      <div className="absolute top-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Retro Game Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6 text-center">
        
        {/* Official Aritro Saha Logo & Animated Pixel Pokéball Accent */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-24 h-24 rounded-2xl bg-[#0f172a]/90 border-2 border-amber-400/60 p-2 shadow-[0_0_30px_rgba(245,158,11,0.3)] relative flex items-center justify-center animate-bounce">
            <img
              src="/logo.webp"
              alt="Aritro Saha Official Logo"
              className="w-full h-full object-contain drop-shadow-md"
            />
            {/* Mini pixel pokeball badge in bottom-right corner */}
            <img
              src="/assets/pokeball.png"
              alt="Pokéball"
              className="absolute -bottom-2 -right-2 w-7 h-7 object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Title Logo (FireRed & Emerald GBA Style) */}
        <div className="mb-2">
          <span className="text-[10px] md:text-xs tracking-widest text-emerald-400 uppercase font-bold bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded">
            Game Boy Advance Edition
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-rose-400 font-extrabold tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-1">
          ARITRO SAHA
        </h1>
        <p className="text-xs md:text-sm text-sky-300 tracking-wider mb-6 font-silk">
          ASSOCIATE SOFTWARE ENGINEER @ BMS
        </p>

        {!isLoaded ? (
          /* Loading Bar Phase */
          <div className="w-full max-w-xs flex flex-col items-center gap-3">
            <div className="w-full h-4 bg-slate-900 border-2 border-slate-700 rounded-sm p-0.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-[9px] text-slate-400 font-silk">
              <span>{statusText}</span>
              <span className="text-emerald-400 font-bold">{progress}%</span>
            </div>
          </div>
        ) : (
          /* Title Screen Interactive Prompt Phase */
          <div className="flex flex-col items-center gap-4 w-full animate-fade-in">
            <button
              onClick={handleStart}
              className="w-full max-w-xs py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              <span className="text-xs md:text-sm tracking-wider">PRESS START / ENTER</span>
            </button>

            <button
              onClick={handleRecruiterMode}
              className="w-full max-w-xs py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700/80 text-sky-300 border border-sky-500/30 rounded text-[10px] md:text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-silk"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Recruiter Quick Dossier (Fast View)</span>
            </button>

            {showPrompt && (
              <div className="text-[9px] text-slate-400 flex items-center gap-1.5 mt-2 font-silk animate-pulse">
                <Volume2 className="w-3 h-3 text-emerald-400" />
                <span>Audio will play upon starting • Headphones recommended</span>
              </div>
            )}
          </div>
        )}

        {/* Feature badges footer */}
        <div className="mt-12 flex items-center gap-4 text-[8px] md:text-[9px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            Hack4Bengal 3.0 Winner
          </span>
          <span>•</span>
          <span>VIT Chennai &apos;25</span>
          <span>•</span>
          <span>Python & Next.js</span>
        </div>

      </div>
    </div>
  );
};

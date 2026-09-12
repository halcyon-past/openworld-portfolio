'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PORTFOLIO_DATA, Project } from '@/data/portfolioData';
import { soundManager } from '@/game/audio/SoundManager';
import { ExternalLink, FileText, ChevronRight, X, Sparkles, Code2 } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface PokedexModalProps {
  onClose: () => void;
}

export const PokedexModal: React.FC<PokedexModalProps> = ({ onClose }) => {
  const [selectedProject, setSelectedProject] = useState<Project>(PORTFOLIO_DATA.projects[0]);

  const handleSelect = (p: Project) => {
    soundManager.playMenuCursor();
    setSelectedProject(p);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs font-pixel">
      {/* Outer GBA Pokédex Shell (Signature Red Casing) */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-red-600 via-red-700 to-red-800 border-4 sm:border-8 border-slate-900 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Pokédex Sensor Lights Top Bar */}
        <div className="bg-red-800 px-4 py-2 border-b-4 border-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Big Blue Lens */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-blue-700 border-2 border-white shadow-[0_0_12px_rgba(56,189,248,0.8)] animate-pulse" />
            {/* Red, Yellow, Green status dots */}
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-slate-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900" />
            </div>
          </div>

          <div className="text-[10px] md:text-xs text-white font-bold tracking-wider flex items-center gap-2">
            <span>POKÉDEX • PROJECTS HUB</span>
            <button
              onClick={() => {
                soundManager.playCancel();
                onClose();
              }}
              className="p-1 rounded bg-slate-900/60 hover:bg-slate-900 text-white cursor-pointer ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Pokédex Dual View Screen */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 md:p-4 overflow-y-auto flex-1">
          
          {/* Left Column: Project Selector List */}
          <div className="md:col-span-4 bg-[#1e2530] border-4 border-[#2b3340] rounded-lg p-2 flex flex-col gap-1.5 shrink-0 overflow-y-auto max-h-[220px] md:max-h-none">
            <div className="text-[9px] text-slate-400 font-silk px-2 py-1 uppercase tracking-wider">
              INNOVATION ENTRIES ({PORTFOLIO_DATA.projects.length})
            </div>

            {PORTFOLIO_DATA.projects.map((p) => {
              const isCurrent = p.id === selectedProject.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className={`w-full text-left px-2.5 py-2 rounded flex items-center justify-between transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-red-500 text-white shadow-md translate-x-1'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[9px] text-amber-300 font-bold">{p.dexNumber}</span>
                    <span className="text-[11px] truncate font-bold">{p.title}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Project Detail Display */}
          <div className="md:col-span-8 bg-[#fcf8f2] text-slate-900 border-4 border-[#2b3340] rounded-lg p-3 md:p-4 overflow-y-auto flex flex-col gap-3">
            
            {/* Header: Title, Dex Number & Types */}
            <div className="border-b-2 border-slate-300 pb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 font-bold">{selectedProject.dexNumber}</span>
                  <h2 className="text-base md:text-lg font-bold tracking-tight text-slate-900">
                    {selectedProject.title}
                  </h2>
                </div>
                <p className="text-[10px] text-slate-600 font-silk mt-0.5">
                  {selectedProject.subtitle}
                </p>
              </div>

              {/* Pokémon Type Badges */}
              <div className="flex gap-1.5">
                {selectedProject.pokemonType.map((type) => (
                  <span
                    key={type}
                    className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white uppercase tracking-wider"
                  >
                    TYPE: {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Media Banner */}
            <div className="relative w-full h-44 sm:h-52 bg-slate-900 rounded-md overflow-hidden border-2 border-slate-400 shrink-0">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[9px] text-white/90 font-silk flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Engineering Specification & Live Telemetry
                </span>
              </div>
            </div>

            {/* Overview & Key Highlights */}
            <div className="space-y-1.5">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                System Overview
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-silk">
                {selectedProject.overview}
              </p>
            </div>

            {/* Features Bullet Points */}
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Core Architectural Features
              </h3>
              <ul className="space-y-1">
                {selectedProject.features.map((feat, idx) => (
                  <li key={idx} className="text-[10px] text-slate-700 flex items-start gap-1.5 font-silk">
                    <span className="text-red-500 font-bold shrink-0">►</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Tech Stack TM / HM
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[9px] px-2 py-0.5 bg-slate-200 text-slate-800 border border-slate-300 rounded font-silk"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Bars */}
            <div className="space-y-1.5 bg-slate-100 p-2.5 rounded border border-slate-300">
              <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                Base Battle Statistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedProject.stats.map((st) => (
                  <div key={st.label} className="space-y-0.5">
                    <div className="flex justify-between text-[8px] font-silk text-slate-600">
                      <span>{st.label}</span>
                      <span className="font-bold">{st.value}/100</span>
                    </div>
                    <div className="w-full h-2 bg-slate-300 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
                        style={{ width: `${st.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons (Live Demo, GitHub, Docs, Research) */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-300">
              {selectedProject.liveDemo && (
                <a
                  href={selectedProject.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>LAUNCH LIVE DEMO</span>
                </a>
              )}

              {selectedProject.github && (
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <GithubIcon className="w-3 h-3" />
                  <span>VIEW GITHUB REPO</span>
                </a>
              )}

              {selectedProject.pypi && (
                <a
                  href={selectedProject.pypi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>PYPI PACKAGE</span>
                </a>
              )}

              {selectedProject.researchPaper && (
                <a
                  href={selectedProject.researchPaper}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-[10px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>IJIRT RESEARCH PAPER</span>
                </a>
              )}
            </div>

          </div>

        </div>

        {/* Footer controls prompt */}
        <div className="bg-red-800 px-4 py-1.5 text-[8px] text-red-200 font-silk flex justify-between items-center border-t-2 border-slate-900 shrink-0">
          <span>SELECT: ▲▼ Navigate entries</span>
          <span>B / ESC: Close Pokédex</span>
        </div>

      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PORTFOLIO_DATA, GymBadge } from '@/data/portfolioData';
import { soundManager } from '@/game/audio/SoundManager';
import { Award, Briefcase, GraduationCap, X, Sparkles, Trophy } from 'lucide-react';

interface TrainerCardModalProps {
  onClose: () => void;
}

export const TrainerCardModal: React.FC<TrainerCardModalProps> = ({ onClose }) => {
  const [selectedBadge, setSelectedBadge] = useState<GymBadge | null>(null);

  const handleBadgeClick = (badge: GymBadge) => {
    soundManager.playFanfare();
    setSelectedBadge(badge);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs font-pixel">
      {/* GBA Trainer Card Container */}
      <div className="relative w-full max-w-3xl bg-[#f5efe6] text-slate-900 border-4 sm:border-8 border-[#3b4252] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Card Header Strip */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white px-4 py-2.5 border-b-4 border-slate-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="text-xs md:text-sm font-bold tracking-wider">OFFICIAL TRAINER CARD</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-sky-200 font-silk">IDNo. {PORTFOLIO_DATA.trainer.idNo}</span>
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
        </div>

        {/* Card Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Top Section: Photo, Stats, and Bio */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-white/70 p-4 rounded-lg border-2 border-slate-300">
            {/* Profile Avatar */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-lg border-4 border-slate-800 shadow-md overflow-hidden shrink-0 bg-slate-900">
              <Image
                src={PORTFOLIO_DATA.trainer.avatar}
                alt={PORTFOLIO_DATA.trainer.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Trainer Stats & Identity */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h1 className="text-lg md:text-xl font-extrabold text-slate-900">
                  {PORTFOLIO_DATA.trainer.name}
                </h1>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 inline-block">
                  LV. {PORTFOLIO_DATA.trainer.level}
                </span>
              </div>

              <p className="text-xs text-indigo-700 font-bold">
                {PORTFOLIO_DATA.trainer.title} @ {PORTFOLIO_DATA.trainer.company}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-silk text-slate-600 pt-1">
                <div>POKÉDEX: <span className="font-bold text-slate-900">{PORTFOLIO_DATA.trainer.pokedexCaught} CAUGHT</span></div>
                <div>CGPA: <span className="font-bold text-indigo-700">{PORTFOLIO_DATA.trainer.cgpa}</span></div>
                <div>LEETCODE: <span className="font-bold text-amber-600">{PORTFOLIO_DATA.trainer.leetcode.rank} ({PORTFOLIO_DATA.trainer.leetcode.rating})</span></div>
                <div>STATUS: <span className="font-bold text-emerald-600">ACTIVE PRODUCTION</span></div>
              </div>

              <p className="text-xs text-slate-700 font-silk leading-relaxed pt-2 border-t border-slate-200">
                {PORTFOLIO_DATA.trainer.bio}
              </p>
            </div>
          </div>

          {/* 8 Gym Badges Case */}
          <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-lg border-4 border-amber-600 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs sm:text-sm font-bold text-amber-300 tracking-wider">
                  8 GYM BADGES OF HONOR
                </h2>
              </div>
              <span className="text-[8px] text-slate-400 font-silk">Click badge for inspection</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {PORTFOLIO_DATA.badges.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleBadgeClick(b)}
                  className="flex flex-col items-center p-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 transition-all cursor-pointer group"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-white/60 shadow-[0_0_10px_rgba(251,191,36,0.3)] group-hover:scale-110 transition-transform mb-1"
                    style={{ backgroundColor: b.iconColor }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[7px] text-slate-300 text-center truncate w-full font-silk">
                    {b.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Badge Lore Box */}
            {selectedBadge && (
              <div className="mt-3 p-2.5 bg-slate-800/90 border border-amber-400/60 rounded text-slate-200 text-xs font-silk flex items-start gap-2.5 animate-fade-in">
                <div
                  className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center border border-white"
                  style={{ backgroundColor: selectedBadge.iconColor }}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="text-amber-300 font-bold font-pixel text-[10px]">
                    {selectedBadge.name} ({selectedBadge.gymCity})
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5">{selectedBadge.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Experience Timeline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-slate-300 pb-1">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider">
                CAREER TIMELINE & QUESTS
              </h2>
            </div>

            <div className="space-y-2.5">
              {PORTFOLIO_DATA.experience.map((exp) => (
                <div key={exp.id} className="bg-white p-3 rounded border-2 border-slate-300 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                    <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                    <span className="text-[9px] text-indigo-600 font-silk font-bold">{exp.duration}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 font-silk">
                    {exp.company} • {exp.location}
                  </div>
                  <ul className="space-y-1 pt-1">
                    {exp.description.map((line, idx) => (
                      <li key={idx} className="text-[9px] text-slate-700 font-silk flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold shrink-0">►</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {exp.technologies.map((t) => (
                      <span key={t} className="text-[8px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-silk">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-slate-300 pb-1">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider">
                ACADEMIC CREDENTIALS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PORTFOLIO_DATA.education.map((edu, idx) => (
                <div key={idx} className="bg-white p-3 rounded border-2 border-slate-300 space-y-1">
                  <div className="text-[11px] font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-[9px] text-emerald-700 font-silk font-bold">{edu.institution} ({edu.year})</div>
                  <ul className="space-y-0.5 pt-1">
                    {edu.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="text-[8px] text-slate-600 font-silk flex items-start gap-1">
                        <span className="text-emerald-500 font-bold shrink-0">►</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer controls prompt */}
        <div className="bg-slate-300 px-4 py-1.5 text-[8px] text-slate-700 font-silk flex justify-between items-center border-t-2 border-slate-900 shrink-0">
          <span>Official Bristol Myers Squibb Developer License</span>
          <span>B / ESC: Close Card</span>
        </div>

      </div>
    </div>
  );
};

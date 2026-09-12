'use client';

import React from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { soundManager } from '@/game/audio/SoundManager';
import { Mail, Music, ExternalLink, X, Send, Sparkles } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const handleBeatbox = (type: 'kick' | 'snare' | 'hihat' | 'scratch' | 'throatbass' | 'click') => {
    soundManager.playBeatboxSound(type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs font-pixel">
      {/* House & Mailbox Shell */}
      <div className="relative w-full max-w-2xl bg-[#fcf8f2] text-slate-900 border-4 sm:border-8 border-[#3b4252] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white px-4 py-2.5 border-b-4 border-slate-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-200" />
            <span className="text-xs md:text-sm font-bold tracking-wider">
              ARITRO&apos;S RESIDENCE & CONTACT
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

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Welcome Message */}
          <div className="bg-amber-50 border-2 border-amber-300 p-3.5 rounded-lg text-xs font-silk leading-relaxed text-amber-900">
            <span className="font-bold font-pixel text-[10px] text-amber-800 block mb-1">
              📬 Mailbox Terminal
            </span>
            Feel free to reach out for engineering roles, technical architecture collaborations, or discussing AI distributed systems and full-stack products!
          </div>

          {/* Social Channels */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              COMMUNICATION FREQUENCIES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PORTFOLIO_DATA.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playSelect()}
                  className="p-3 bg-white hover:bg-slate-100 border-2 border-slate-300 hover:border-slate-800 rounded-lg flex items-center justify-between transition-all group cursor-pointer shadow-xs"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {s.platform}
                    </div>
                    <div className="text-[9px] text-slate-500 font-silk mt-0.5">
                      {s.username}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Direct Email */}
          <div className="bg-white p-3.5 rounded-lg border-2 border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900">Direct Developer Dispatch</div>
              <div className="text-[10px] text-slate-600 font-silk">aritrosaha2025@gmail.com</div>
            </div>
            <a
              href="mailto:aritrosaha2025@gmail.com"
              onClick={() => soundManager.playSelect()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>SEND EMAIL</span>
            </a>
          </div>

          {/* Beatboxing Sound Station (Aritro's Hobby) */}
          <div className="bg-slate-900 text-white p-4 rounded-lg border-2 border-rose-500 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-rose-300">
                  ARITRO&apos;S BEATBOX SOUNDBOARD
                </span>
              </div>
              <span className="text-[8px] text-slate-400 font-silk">Acoustic Hobby Studio</span>
            </div>

            <p className="text-[9px] text-slate-300 font-silk">
              When taking breaks between engineering pipelines, Aritro creates vocal rhythms and beatbox drops. Tap each pad below to synthesize retro drum hits!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleBeatbox('kick')}
                className="py-2.5 px-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white rounded font-pixel text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer shadow-sm flex flex-col items-center gap-0.5"
              >
                <span>LIP KICK 💥</span>
                <span className="text-[7px] text-red-200 font-silk">&quot;B&quot; Plosive</span>
              </button>
              <button
                onClick={() => handleBeatbox('snare')}
                className="py-2.5 px-2 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white rounded font-pixel text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer shadow-sm flex flex-col items-center gap-0.5"
              >
                <span>K-SNARE ⚡</span>
                <span className="text-[7px] text-amber-200 font-silk">&quot;Psh&quot; Snap</span>
              </button>
              <button
                onClick={() => handleBeatbox('hihat')}
                className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded font-pixel text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer shadow-sm flex flex-col items-center gap-0.5"
              >
                <span>HI-HAT 🎵</span>
                <span className="text-[7px] text-emerald-200 font-silk">&quot;Ts&quot; Crisp</span>
              </button>
              <button
                onClick={() => handleBeatbox('scratch')}
                className="py-2.5 px-2 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white rounded font-pixel text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer shadow-sm flex flex-col items-center gap-0.5"
              >
                <span>SCRATCH 💿</span>
                <span className="text-[7px] text-purple-200 font-silk">Vocal Turntable</span>
              </button>
              <button
                onClick={() => handleBeatbox('throatbass')}
                className="py-2.5 px-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded font-pixel text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer shadow-sm flex flex-col items-center gap-0.5"
              >
                <span>THROAT BASS 🔊</span>
                <span className="text-[7px] text-blue-200 font-silk">Sub Harmonic</span>
              </button>
              <button
                onClick={() => handleBeatbox('click')}
                className="py-2.5 px-2 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white rounded font-pixel text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer shadow-sm flex flex-col items-center gap-0.5"
              >
                <span>TONGUE CLICK 🎯</span>
                <span className="text-[7px] text-pink-200 font-silk">&quot;Ka&quot; Rimshot</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-200 px-4 py-1.5 text-[8px] text-slate-600 font-silk flex justify-between items-center border-t-2 border-slate-900 shrink-0">
          <span>Pallet Cloud Postal Code: 2025</span>
          <span>B / ESC: Leave House</span>
        </div>

      </div>
    </div>
  );
};

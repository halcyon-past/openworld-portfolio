import React, { useState, useEffect, useCallback } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { soundManager } from '@/game/audio/SoundManager';
import { Mail, Music, ExternalLink, X, Send, Play, Square, Timer, Volume2 } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
}

type BeatboxPadType = 'kick' | 'snare' | 'hihat' | 'scratch' | 'throatbass' | 'click';

interface PadConfig {
  id: BeatboxPadType;
  keyLabel: string;
  altKey: string;
  name: string;
  subtitle: string;
  icon: string;
  bgClass: string;
  activeClass: string;
  borderClass: string;
}

const BEATBOX_PADS: PadConfig[] = [
  {
    id: 'kick',
    keyLabel: 'Q',
    altKey: '1',
    name: 'LIP KICK',
    subtitle: '"B" Plosive & Chest Thump',
    icon: '💥',
    bgClass: 'from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600',
    activeClass: 'bg-red-400 ring-4 ring-red-300 shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-95',
    borderClass: 'border-red-800',
  },
  {
    id: 'snare',
    keyLabel: 'W',
    altKey: '2',
    name: 'K-SNARE',
    subtitle: '"Psh" Tongue-Palate Crack',
    icon: '⚡',
    bgClass: 'from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600',
    activeClass: 'bg-amber-400 ring-4 ring-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.8)] scale-95',
    borderClass: 'border-amber-800',
  },
  {
    id: 'hihat',
    keyLabel: 'E',
    altKey: '3',
    name: 'HI-HAT',
    subtitle: '"Ts" Crisp Dental Attack',
    icon: '🎵',
    bgClass: 'from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600',
    activeClass: 'bg-emerald-400 ring-4 ring-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.8)] scale-95',
    borderClass: 'border-emerald-800',
  },
  {
    id: 'scratch',
    keyLabel: 'A',
    altKey: '4',
    name: 'SCRATCH',
    subtitle: 'Vocal Turntable "Wikki"',
    icon: '💿',
    bgClass: 'from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600',
    activeClass: 'bg-purple-400 ring-4 ring-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.8)] scale-95',
    borderClass: 'border-purple-800',
  },
  {
    id: 'throatbass',
    keyLabel: 'S',
    altKey: '5',
    name: 'THROAT BASS',
    subtitle: 'Sub-Harmonic Guttural Growl',
    icon: '🔊',
    bgClass: 'from-blue-600 to-cyan-700 hover:from-blue-500 hover:to-cyan-600',
    activeClass: 'bg-blue-400 ring-4 ring-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.8)] scale-95',
    borderClass: 'border-blue-800',
  },
  {
    id: 'click',
    keyLabel: 'D',
    altKey: '6',
    name: 'TONGUE POP',
    subtitle: '"Ka" Inward Rimshot Snap',
    icon: '🎯',
    bgClass: 'from-pink-600 to-fuchsia-700 hover:from-pink-500 hover:to-fuchsia-600',
    activeClass: 'bg-pink-400 ring-4 ring-pink-300 shadow-[0_0_25px_rgba(236,72,153,0.8)] scale-95',
    borderClass: 'border-pink-800',
  },
];

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [activePads, setActivePads] = useState<Record<string, boolean>>({});
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metronomeBeat, setMetronomeBeat] = useState(0);

  // Trigger drum pad with zero latency + visual LED flash
  const triggerPad = useCallback((type: BeatboxPadType) => {
    soundManager.playBeatboxSound(type);
    setActivePads((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setActivePads((prev) => ({ ...prev, [type]: false }));
    }, 130);
  }, []);

  // Keyboard MPC Finger Drumming
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'q' || key === '1') {
        e.preventDefault();
        triggerPad('kick');
      } else if (key === 'w' || key === '2') {
        e.preventDefault();
        triggerPad('snare');
      } else if (key === 'e' || key === '3') {
        e.preventDefault();
        triggerPad('hihat');
      } else if (key === 'a' || key === '4') {
        e.preventDefault();
        triggerPad('scratch');
      } else if (key === 's' || key === '5') {
        e.preventDefault();
        triggerPad('throatbass');
      } else if (key === 'd' || key === '6') {
        e.preventDefault();
        triggerPad('click');
      } else if (key === 'b' || key === 'escape') {
        e.preventDefault();
        soundManager.playCancel();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerPad, onClose]);

  // Demo Beatbox Jam (90 BPM 16-step hip-hop groove)
  useEffect(() => {
    if (!isDemoPlaying) return;
    let step = 0;
    // 90 BPM = 166.6ms per 16th note
    const stepInterval = 166.7;
    const groove: Array<BeatboxPadType[]> = [
      ['kick', 'hihat'],       // 0 (beat 1)
      ['hihat'],               // 1
      ['hihat'],               // 2
      ['hihat'],               // 3
      ['snare', 'hihat'],      // 4 (beat 2)
      ['hihat'],               // 5
      ['kick'],                // 6
      ['kick', 'hihat'],       // 7
      ['kick', 'throatbass'],  // 8 (beat 3)
      ['hihat'],               // 9
      ['scratch'],             // 10
      ['hihat'],               // 11
      ['snare', 'hihat'],      // 12 (beat 4)
      ['hihat'],               // 13
      ['scratch'],             // 14
      ['click', 'hihat'],      // 15
    ];

    const timer = setInterval(() => {
      const hits = groove[step % groove.length];
      hits.forEach((hit) => triggerPad(hit));
      step++;
    }, stepInterval);

    return () => clearInterval(timer);
  }, [isDemoPlaying, triggerPad]);

  // Metronome (90 BPM rhythm keeper)
  useEffect(() => {
    if (!isMetronomeActive) {
      setMetronomeBeat(0);
      return;
    }
    let beat = 0;
    const intervalMs = 60000 / 90; // ~666.6ms

    soundManager.playMetronomeTick(true);
    setMetronomeBeat(1);

    const timer = setInterval(() => {
      beat = (beat % 4) + 1;
      setMetronomeBeat(beat);
      soundManager.playMetronomeTick(beat === 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isMetronomeActive]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs font-pixel">
      {/* House & Mailbox Shell */}
      <div className="relative w-full max-w-2xl bg-[#fcf8f2] text-slate-900 border-4 sm:border-8 border-[#3b4252] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[94vh]">
        
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

          {/* Beatboxing Sound Station & Drum Pad (Aritro's Hobby) */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 text-white p-4 sm:p-5 rounded-xl border-3 border-rose-500 shadow-xl space-y-3">
            
            {/* Header with Title and Control Knobs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-rose-500/20 border border-rose-500/40 rounded-lg">
                  <Music className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-rose-300 flex items-center gap-1.5">
                    <span>BEATBOX DRUM PAD MPC-2025</span>
                    <span className="px-1.5 py-0.2 bg-rose-950 text-rose-400 text-[8px] rounded border border-rose-800">
                      LOUD & PUNCHY
                    </span>
                  </div>
                  <p className="text-[8px] text-slate-400 font-silk">
                    Vocal Percussion Synthesizer • Keyboard Keys [Q, W, E, A, S, D] or Tap Pads
                  </p>
                </div>
              </div>

              {/* Action Buttons: Demo Beat & Metronome */}
              <div className="flex items-center gap-2">
                {/* Metronome */}
                <button
                  type="button"
                  onClick={() => setIsMetronomeActive((prev) => !prev)}
                  className={`px-2.5 py-1 rounded text-[9px] font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                    isMetronomeActive
                      ? 'bg-amber-600 text-white border-amber-400 ring-2 ring-amber-400/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="Toggle 90 BPM Metronome"
                >
                  <Timer className="w-3 h-3 text-amber-300" />
                  <span>90 BPM</span>
                  {isMetronomeActive && (
                    <span className="inline-flex items-center gap-0.5 ml-0.5">
                      {[1, 2, 3, 4].map((b) => (
                        <span
                          key={b}
                          className={`w-1.5 h-1.5 rounded-full ${
                            metronomeBeat === b ? 'bg-amber-200 scale-125' : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </span>
                  )}
                </button>

                {/* Auto Demo Jam */}
                <button
                  type="button"
                  onClick={() => setIsDemoPlaying((prev) => !prev)}
                  className={`px-2.5 py-1 rounded text-[9px] font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                    isDemoPlaying
                      ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-400/50 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="Listen to an automated beatbox rhythm groove"
                >
                  {isDemoPlaying ? (
                    <>
                      <Square className="w-3 h-3 fill-current" />
                      <span>STOP BEAT</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current text-rose-400" />
                      <span>DEMO BEAT</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Drum Pads Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 select-none">
              {BEATBOX_PADS.map((pad) => {
                const isActive = activePads[pad.id];
                return (
                  <button
                    key={pad.id}
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      triggerPad(pad.id);
                    }}
                    className={`relative p-3 rounded-xl border-b-4 border-r-2 ${pad.borderClass} bg-gradient-to-br ${
                      pad.bgClass
                    } text-white font-pixel transition-transform select-none touch-none cursor-pointer flex flex-col justify-between min-h-[72px] sm:min-h-[82px] shadow-lg active:translate-y-1 active:border-b-2 ${
                      isActive ? pad.activeClass : 'hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Top Row: Key Badge & Icon */}
                    <div className="flex items-center justify-between w-full pointer-events-none">
                      <span className="text-base sm:text-lg">{pad.icon}</span>
                      <span className="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold bg-black/50 text-white rounded border border-white/20 font-silk">
                        [{pad.keyLabel}]
                      </span>
                    </div>

                    {/* Bottom Row: Sound Name & Human Technique */}
                    <div className="text-left pointer-events-none mt-1">
                      <div className="text-[10px] sm:text-[11px] font-bold tracking-tight text-white drop-shadow-sm">
                        {pad.name}
                      </div>
                      <div className="text-[7px] sm:text-[8px] text-white/80 font-silk leading-tight">
                        {pad.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Rhythm Guides & Beat Recipes */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 text-[8px] sm:text-[9px] font-silk text-slate-300 space-y-1">
              <div className="text-rose-400 font-bold font-pixel flex items-center gap-1 text-[8px]">
                <Volume2 className="w-3 h-3" />
                <span>HOW TO MAKE BEATS (FINGER DRUMMING CHEAT SHEET):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-400">
                <div>
                  <span className="text-amber-300 font-semibold">Boom-Bap:</span> Tap <code className="bg-black/50 px-1 py-0.2 rounded text-white">[Q]</code> ➔ <code className="bg-black/50 px-1 py-0.2 rounded text-white">[E]</code> ➔ <code className="bg-black/50 px-1 py-0.2 rounded text-white">[W]</code> ➔ <code className="bg-black/50 px-1 py-0.2 rounded text-white">[E]</code>
                </div>
                <div>
                  <span className="text-blue-300 font-semibold">Bass Drop:</span> Tap <code className="bg-black/50 px-1 py-0.2 rounded text-white">[Q]</code> ➔ <code className="bg-black/50 px-1 py-0.2 rounded text-white">[S]</code> ➔ <code className="bg-black/50 px-1 py-0.2 rounded text-white">[W]</code>
                </div>
                <div>
                  <span className="text-purple-300 font-semibold">Turntable Scratch:</span> Rapidly hit <code className="bg-black/50 px-1 py-0.2 rounded text-white">[A]</code> ➔ <code className="bg-black/50 px-1 py-0.2 rounded text-white">[A]</code> ➔ <code className="bg-black/50 px-1 py-0.2 rounded text-white">[W]</code>
                </div>
                <div>
                  <span className="text-pink-300 font-semibold">16th-Note Roll:</span> Tap <code className="bg-black/50 px-1 py-0.2 rounded text-white">[E]</code> rapidly while dropping <code className="bg-black/50 px-1 py-0.2 rounded text-white">[Q]</code> & <code className="bg-black/50 px-1 py-0.2 rounded text-white">[W]</code>
                </div>
              </div>
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

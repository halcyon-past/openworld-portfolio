'use client';

import React, { useState, useEffect } from 'react';
import { soundManager } from '@/game/audio/SoundManager';
import { Settings, Volume2, VolumeX, Music, Mic, Tv, X } from 'lucide-react';

interface SettingsModalProps {
  showScanlines: boolean;
  onToggleScanlines: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  showScanlines,
  onToggleScanlines,
  onClose,
}) => {
  // Audio states initialized directly from soundManager
  const [bgmVol, setBgmVol] = useState(() => Math.round(soundManager.getBgmVolume() * 100));
  const [bgmMuted, setBgmMuted] = useState(() => soundManager.getBgmMuted());

  const [sfxVol, setSfxVol] = useState(() => Math.round(soundManager.getSfxVolume() * 100));
  const [sfxMuted, setSfxMuted] = useState(() => soundManager.getSfxMuted());

  const [voiceVol, setVoiceVol] = useState(() => Math.round(soundManager.getVoiceVolume() * 100));
  const [voiceMuted, setVoiceMuted] = useState(() => soundManager.getVoiceMuted());

  // Close on Escape or X
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'x') {
        e.preventDefault();
        soundManager.playCancel();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBgmToggle = () => {
    const next = soundManager.toggleBgmMute();
    setBgmMuted(next);
    if (!next) soundManager.playSelect();
  };

  const handleBgmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBgmVol(val);
    soundManager.setBgmVolume(val / 100);
    if (bgmMuted && val > 0) {
      soundManager.setBgmMuted(false);
      setBgmMuted(false);
    }
  };

  const handleSfxToggle = () => {
    const next = soundManager.toggleSfxMute();
    setSfxMuted(next);
    if (!next) soundManager.playSelect();
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSfxVol(val);
    soundManager.setSfxVolume(val / 100);
    if (sfxMuted && val > 0) {
      soundManager.setSfxMuted(false);
      setSfxMuted(false);
    }
    // Play test cursor sound
    soundManager.playMenuCursor();
  };

  const handleVoiceToggle = () => {
    const next = soundManager.toggleVoiceMute();
    setVoiceMuted(next);
    if (!next) soundManager.playSelect();
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVoiceVol(val);
    soundManager.setVoiceVolume(val / 100);
    if (voiceMuted && val > 0) {
      soundManager.setVoiceMuted(false);
      setVoiceMuted(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-pixel">
      {/* Retro Window Frame */}
      <div className="relative w-full max-w-lg bg-[#fcf8f2] text-slate-900 border-4 border-[#2b3340] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-slate-800 text-white px-4 py-2.5 text-xs font-bold flex justify-between items-center border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-300" />
            <span>GAME SETTINGS & AUDIO CHANNELS</span>
          </div>
          <button
            onClick={() => {
              soundManager.playCancel();
              onClose();
            }}
            className="p-1 rounded bg-slate-900/60 hover:bg-slate-900 text-white cursor-pointer transition-all"
            title="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 space-y-5">
          
          {/* 1. Background Music (BGM) */}
          <div className="bg-slate-100/90 border border-slate-300 rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">BACKGROUND MUSIC</span>
              </div>
              <button
                onClick={handleBgmToggle}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                  bgmMuted
                    ? 'bg-red-500/20 text-red-600 border-red-300 hover:bg-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-700 border-emerald-400 hover:bg-emerald-500/30'
                }`}
              >
                {bgmMuted ? 'MUTED' : 'ENABLED'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={bgmMuted ? 0 : bgmVol}
                onChange={handleBgmChange}
                disabled={bgmMuted}
                className="flex-1 accent-emerald-600 h-2 bg-slate-300 rounded-lg cursor-pointer disabled:opacity-40"
              />
              <span className="text-[10px] font-bold text-slate-600 w-10 text-right font-silk">
                {bgmMuted ? '0%' : `${bgmVol}%`}
              </span>
            </div>
            <div className="text-[9px] text-slate-500 font-silk">
              Chiptune melody synthesized in real-time via Web Audio API.
            </div>
          </div>

          {/* 2. Sound Effects (SFX) */}
          <div className="bg-slate-100/90 border border-slate-300 rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {sfxMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
                <span className="text-xs font-bold text-slate-800">SOUND EFFECTS (SFX)</span>
              </div>
              <button
                onClick={handleSfxToggle}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                  sfxMuted
                    ? 'bg-red-500/20 text-red-600 border-red-300 hover:bg-red-500/30'
                    : 'bg-sky-500/20 text-sky-700 border-sky-400 hover:bg-sky-500/30'
                }`}
              >
                {sfxMuted ? 'MUTED' : 'ENABLED'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={sfxMuted ? 0 : sfxVol}
                onChange={handleSfxChange}
                disabled={sfxMuted}
                className="flex-1 accent-sky-600 h-2 bg-slate-300 rounded-lg cursor-pointer disabled:opacity-40"
              />
              <span className="text-[10px] font-bold text-slate-600 w-10 text-right font-silk">
                {sfxMuted ? '0%' : `${sfxVol}%`}
              </span>
            </div>
            <div className="text-[9px] text-slate-500 font-silk">
              Menu beeps, footstep rustles, warp chimes, and puppy barks.
            </div>
          </div>

          {/* 3. Character Voices (Speech / TTS) */}
          <div className="bg-slate-100/90 border border-slate-300 rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">CHARACTER VOICES (TTS)</span>
              </div>
              <button
                onClick={handleVoiceToggle}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                  voiceMuted
                    ? 'bg-red-500/20 text-red-600 border-red-300 hover:bg-red-500/30'
                    : 'bg-amber-500/20 text-amber-700 border-amber-400 hover:bg-amber-500/30'
                }`}
              >
                {voiceMuted ? 'MUTED' : 'ENABLED'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={voiceMuted ? 0 : voiceVol}
                onChange={handleVoiceChange}
                disabled={voiceMuted}
                className="flex-1 accent-amber-600 h-2 bg-slate-300 rounded-lg cursor-pointer disabled:opacity-40"
              />
              <span className="text-[10px] font-bold text-slate-600 w-10 text-right font-silk">
                {voiceMuted ? '0%' : `${voiceVol}%`}
              </span>
            </div>
            <div className="text-[9px] text-slate-500 font-silk">
              Spoken dialogues for Prof. Oak, Aritro, Nurse Joy, and Shop Clerk.
            </div>
          </div>

          {/* 4. CRT Television Scanlines */}
          <div className="bg-slate-100/90 border border-slate-300 rounded-lg p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Tv className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-xs font-bold text-slate-800">RETRO CRT TV SCANLINES</div>
                <div className="text-[9px] text-slate-500 font-silk mt-0.5">
                  Simulates a classic CRT arcade monitor overlay
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playMenuCursor();
                onToggleScanlines();
              }}
              className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                showScanlines
                  ? 'bg-purple-500/20 text-purple-700 border-purple-400 hover:bg-purple-500/30'
                  : 'bg-slate-200 text-slate-500 border-slate-300 hover:bg-slate-300'
              }`}
            >
              {showScanlines ? 'ON' : 'OFF'}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-200 border-t border-slate-300 px-4 py-2.5 flex justify-between items-center text-[9px] text-slate-600 font-silk">
          <span>Settings automatically saved to browser storage.</span>
          <button
            onClick={() => {
              soundManager.playSelect();
              onClose();
            }}
            className="px-4 py-1 rounded bg-slate-900 text-white font-bold hover:bg-slate-800 cursor-pointer transition-all"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};

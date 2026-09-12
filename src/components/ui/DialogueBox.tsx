'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { soundManager } from '@/game/audio/SoundManager';
import { ChevronDown } from 'lucide-react';

interface DialogueBoxProps {
  speaker: string;
  lines: string[];
  avatar?: string;
  onClose: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ speaker, lines, avatar, onClose }) => {
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const fullText = lines[currentLineIdx] || '';

  // Typewriter effect
  useEffect(() => {
    let charIdx = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (charIdx < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(charIdx));
        if (charIdx % 2 === 0) {
          soundManager.playTextBeep();
        }
        charIdx++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [currentLineIdx, fullText]);

  const handleAdvance = useCallback(() => {
    if (isTyping) {
      // Instantly finish typing current line
      setDisplayedText(fullText);
      setIsTyping(false);
      soundManager.playMenuCursor();
    } else {
      // Advance to next line or close
      if (currentLineIdx < lines.length - 1) {
        soundManager.playSelect();
        setCurrentLineIdx((prev) => prev + 1);
      } else {
        soundManager.playCancel();
        onClose();
      }
    }
  }, [isTyping, fullText, currentLineIdx, lines.length, onClose]);

  // Keyboard navigation for dialogue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleAdvance();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'x') {
        e.preventDefault();
        soundManager.playCancel();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAdvance, onClose]);

  return (
    <div
      onClick={handleAdvance}
      className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[680px] z-40 cursor-pointer font-pixel"
    >
      {/* Speaker Tag */}
      <div className="inline-block bg-gradient-to-r from-red-600 to-rose-700 text-white text-[10px] md:text-xs px-3 py-1 rounded-t-md border-t-2 border-x-2 border-slate-900 shadow-md">
        {speaker}
      </div>

      {/* Main GBA Dialogue Frame */}
      <div className="bg-[#fcf8f2] text-slate-900 border-4 border-[#2b3340] rounded-b-md rounded-tr-md p-4 md:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] relative min-h-[96px] flex items-start gap-4">
        {/* Avatar badge if available */}
        {avatar && (
          <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded bg-slate-200 border-2 border-slate-400 shrink-0 overflow-hidden">
            <span className="text-xl">
              {avatar === 'scientist' && '🔬'}
              {avatar === 'nurse' && '💖'}
              {avatar === 'clerk' && '🏪'}
              {avatar === 'gymleader' && '⚡'}
              {avatar === 'arcade' && '🕹️'}
              {avatar === 'pet' && '🐶'}
            </span>
          </div>
        )}

        {/* Dialogue Text */}
        <div className="flex-1 text-xs md:text-sm leading-relaxed tracking-wide select-none">
          {displayedText}
        </div>

        {/* Bouncing red advance arrow */}
        {!isTyping && (
          <div className="absolute bottom-3 right-4 flex items-center text-red-600 animate-dialog-arrow">
            <ChevronDown className="w-5 h-5 fill-red-600" />
          </div>
        )}

        {/* Action prompt hint */}
        <div className="absolute bottom-1 right-12 text-[8px] text-slate-400 font-silk">
          Press Space / Enter / Tap
        </div>
      </div>
    </div>
  );
};

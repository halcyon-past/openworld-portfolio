'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Direction } from '@/game/engine/types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Disc, Crosshair } from 'lucide-react';
import { soundManager } from '@/game/audio/SoundManager';

interface VirtualGamepadProps {
  onDirection: (dir: Direction | null) => void;
  onAction: (action: 'A' | 'B' | 'START') => void;
}

export const VirtualGamepad: React.FC<VirtualGamepadProps> = ({ onDirection, onAction }) => {
  const [controlMode, setControlMode] = useState<'joystick' | 'dpad'>('joystick');

  // Virtual Joystick State
  const [joystickActive, setJoystickActive] = useState(false);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const currentDirRef = useRef<Direction | null>(null);

  // Trigger tactile vibration if supported on mobile device
  const triggerHaptic = useCallback((ms: number = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Ignore if vibration is restricted
      }
    }
  }, []);

  const updateJoystickDirection = useCallback((dir: Direction | null) => {
    if (currentDirRef.current !== dir) {
      currentDirRef.current = dir;
      onDirection(dir);
      if (dir) triggerHaptic(12);
    }
  }, [onDirection, triggerHaptic]);

  const handleJoystickTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (touchIdRef.current !== null) return;

    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setJoystickActive(true);
    triggerHaptic(15);
    processJoystickMovement(touch.clientX, touch.clientY);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (touchIdRef.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        processJoystickMovement(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (touchIdRef.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setJoystickActive(false);
        setKnobPos({ x: 0, y: 0 });
        updateJoystickDirection(null);
        break;
      }
    }
  };

  const processJoystickMovement = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const maxRadius = rect.width / 2 - 10; // clamp radius

    let limitedX = dx;
    let limitedY = dy;
    if (distance > maxRadius) {
      limitedX = (dx / distance) * maxRadius;
      limitedY = (dy / distance) * maxRadius;
    }

    setKnobPos({ x: limitedX, y: limitedY });

    // Deadzone check (14px threshold)
    if (distance < 14) {
      updateJoystickDirection(null);
      return;
    }

    // Determine 4-way direction based on angle
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // -180 to 180

    if (angle >= -45 && angle <= 45) {
      updateJoystickDirection('right');
    } else if (angle > 45 && angle < 135) {
      updateJoystickDirection('down');
    } else if (angle < -45 && angle > -135) {
      updateJoystickDirection('up');
    } else {
      updateJoystickDirection('left');
    }
  };

  // Mouse fallback for testing joystick on desktop browser devtools emulation
  const handleJoystickMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setJoystickActive(true);
    processJoystickMovement(e.clientX, e.clientY);

    const onMouseMove = (ev: MouseEvent) => {
      processJoystickMovement(ev.clientX, ev.clientY);
    };

    const onMouseUp = () => {
      setJoystickActive(false);
      setKnobPos({ x: 0, y: 0 });
      updateJoystickDirection(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-30 flex justify-between items-end pointer-events-none md:hidden select-none font-pixel pb-[env(safe-area-inset-bottom)]">
      
      {/* Left Controller: Floating Analog Joystick or Classic D-Pad */}
      <div className="pointer-events-auto flex flex-col items-start gap-1">
        {/* Switch Control Mode Toggle (Joystick / D-Pad) */}
        <button
          onClick={() => {
            soundManager.playMenuCursor();
            setControlMode((prev) => (prev === 'joystick' ? 'dpad' : 'joystick'));
            updateJoystickDirection(null);
          }}
          className="px-2 py-0.5 mb-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded text-[7px] text-slate-300 backdrop-blur-xs flex items-center gap-1 cursor-pointer shadow-md"
        >
          {controlMode === 'joystick' ? (
            <>
              <Disc className="w-2.5 h-2.5 text-emerald-400" />
              <span>JOYSTICK MODE</span>
            </>
          ) : (
            <>
              <Crosshair className="w-2.5 h-2.5 text-sky-400" />
              <span>D-PAD MODE</span>
            </>
          )}
        </button>

        {controlMode === 'joystick' ? (
          /* Analog 360° Joystick */
          <div
            ref={joystickBaseRef}
            onTouchStart={handleJoystickTouchStart}
            onTouchMove={handleJoystickTouchMove}
            onTouchEnd={handleJoystickTouchEnd}
            onTouchCancel={handleJoystickTouchEnd}
            onMouseDown={handleJoystickMouseDown}
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-950/70 border-3 border-slate-700/80 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm touch-none flex items-center justify-center cursor-grab ${
              joystickActive ? 'border-emerald-500/80 cursor-grabbing' : ''
            }`}
          >
            {/* Inner Ring Guide Marks */}
            <div className="absolute inset-3 rounded-full border border-dashed border-slate-600/40 pointer-events-none" />
            <div className="absolute w-1 h-3 bg-slate-600/60 top-1 rounded-full pointer-events-none" />
            <div className="absolute w-1 h-3 bg-slate-600/60 bottom-1 rounded-full pointer-events-none" />
            <div className="absolute w-3 h-1 bg-slate-600/60 left-1 rounded-full pointer-events-none" />
            <div className="absolute w-3 h-1 bg-slate-600/60 right-1 rounded-full pointer-events-none" />

            {/* Central Thumbstick Knob */}
            <div
              className={`w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-2 ${
                joystickActive
                  ? 'border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]'
                  : 'border-slate-500 shadow-md'
              } flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out`}
              style={{
                transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
              }}
            >
              {/* Grip Indent */}
              <div className="w-5 h-5 rounded-full bg-slate-950/60 border border-slate-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
              </div>
            </div>
          </div>
        ) : (
          /* Classic GBA D-Pad */
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 touch-none">
            {/* Background Cross Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-9 h-26 sm:w-10 sm:h-28 bg-slate-900/90 border-2 border-slate-700 rounded-sm shadow-lg" />
              <div className="absolute w-26 h-9 sm:w-28 sm:h-10 bg-slate-900/90 border-2 border-slate-700 rounded-sm shadow-lg" />
            </div>

            {/* Up Button */}
            <button
              onTouchStart={(e) => { e.preventDefault(); triggerHaptic(); onDirection('up'); }}
              onTouchEnd={(e) => { e.preventDefault(); onDirection(null); }}
              onMouseDown={() => onDirection('up')}
              onMouseUp={() => onDirection(null)}
              className="absolute top-1 left-9 sm:left-11 w-10 h-10 flex items-center justify-center text-slate-300 active:text-white active:bg-slate-700/80 rounded cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            {/* Down Button */}
            <button
              onTouchStart={(e) => { e.preventDefault(); triggerHaptic(); onDirection('down'); }}
              onTouchEnd={(e) => { e.preventDefault(); onDirection(null); }}
              onMouseDown={() => onDirection('down')}
              onMouseUp={() => onDirection(null)}
              className="absolute bottom-1 left-9 sm:left-11 w-10 h-10 flex items-center justify-center text-slate-300 active:text-white active:bg-slate-700/80 rounded cursor-pointer"
            >
              <ArrowDown className="w-4 h-4" />
            </button>

            {/* Left Button */}
            <button
              onTouchStart={(e) => { e.preventDefault(); triggerHaptic(); onDirection('left'); }}
              onTouchEnd={(e) => { e.preventDefault(); onDirection(null); }}
              onMouseDown={() => onDirection('left')}
              onMouseUp={() => onDirection(null)}
              className="absolute top-9 sm:top-11 left-1 w-10 h-10 flex items-center justify-center text-slate-300 active:text-white active:bg-slate-700/80 rounded cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Right Button */}
            <button
              onTouchStart={(e) => { e.preventDefault(); triggerHaptic(); onDirection('right'); }}
              onTouchEnd={(e) => { e.preventDefault(); onDirection(null); }}
              onMouseDown={() => onDirection('right')}
              onMouseUp={() => onDirection(null)}
              className="absolute top-9 sm:top-11 right-1 w-10 h-10 flex items-center justify-center text-slate-300 active:text-white active:bg-slate-700/80 rounded cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Right Controller: Tactical Action Buttons (A, B, START) */}
      <div className="flex flex-col items-end gap-2 sm:gap-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          {/* B Button (Sprint / Cancel / Back) */}
          <div className="flex flex-col items-center">
            <button
              onTouchStart={(e) => { e.preventDefault(); triggerHaptic(20); onAction('B'); }}
              onClick={() => { triggerHaptic(20); onAction('B'); }}
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-b from-rose-500 via-rose-600 to-red-700 border-2 border-slate-900 active:scale-95 shadow-[0_4px_12px_rgba(225,29,72,0.4)] flex items-center justify-center text-white text-xs font-bold cursor-pointer touch-manipulation"
            >
              B
            </button>
            <span className="text-[7px] text-slate-300 font-bold mt-1 tracking-wider">RUN / B</span>
          </div>

          {/* A Button (Interact / Select / Confirm) */}
          <div className="flex flex-col items-center">
            <button
              onTouchStart={(e) => { e.preventDefault(); triggerHaptic(20); onAction('A'); }}
              onClick={() => { triggerHaptic(20); onAction('A'); }}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700 border-2 border-slate-900 active:scale-95 shadow-[0_4px_14px_rgba(16,185,129,0.5)] flex items-center justify-center text-white text-xs font-bold cursor-pointer touch-manipulation"
            >
              A
            </button>
            <span className="text-[7px] text-emerald-300 font-bold mt-1 tracking-wider">TALK / A</span>
          </div>
        </div>

        {/* START Button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); triggerHaptic(15); onAction('START'); }}
          onClick={() => { triggerHaptic(15); onAction('START'); }}
          className="px-3.5 py-1.5 bg-slate-900/90 border border-slate-600 rounded-md text-[8px] text-slate-200 font-silk active:bg-slate-800 shadow-md cursor-pointer backdrop-blur-xs flex items-center gap-1.5 touch-manipulation"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>START MENU</span>
        </button>
      </div>

    </div>
  );
};

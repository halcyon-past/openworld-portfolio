'use client';

import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '@/game/audio/SoundManager';
import { Keyboard, RotateCcw, Trophy } from 'lucide-react';

const CODE_WORDS = [
  'async', 'await', 'import', 'quarantine', 'structurify', 'decorator',
  'gemini', 'langgraph', 'pipeline', 'fault_tolerance', 'python', 'nextjs',
  'typescript', 'react', 'fastapi', 'tailwind', 'cloudrun', 'databricks',
  'mediapipe', 'threejs', 'pypi', 'pytest', 'docker', 'mongodb', 'serverless'
];

export const SpeedTypingGame: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetGame = () => {
    // Shuffle words
    const shuffled = [...CODE_WORDS].sort(() => 0.5 - Math.random()).slice(0, 18);
    setWords(shuffled);
    setInputVal('');
    setCurrentWordIdx(0);
    setCorrectWords(0);
    setStartTime(null);
    setTimeLeft(30);
    setIsGameOver(false);
    setWpm(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    resetGame();
  }, []);

  // Timer loop
  useEffect(() => {
    if (!startTime || isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          soundManager.playFanfare();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isGameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!startTime) setStartTime(Date.now());

    if (val.endsWith(' ')) {
      const trimmed = val.trim();
      const currentTarget = words[currentWordIdx];

      if (trimmed === currentTarget) {
        soundManager.playSelect();
        const newCorrect = correctWords + 1;
        setCorrectWords(newCorrect);

        // Calculate current WPM
        const elapsedMin = Math.max((30 - timeLeft) / 60, 0.05);
        setWpm(Math.round(newCorrect / elapsedMin));
      } else {
        soundManager.playBump();
      }

      setInputVal('');
      if (currentWordIdx < words.length - 1) {
        setCurrentWordIdx((prev) => prev + 1);
      } else {
        setIsGameOver(true);
        soundManager.playFanfare();
      }
    } else {
      soundManager.playTextBeep();
      setInputVal(val);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {/* Game Stats HUD */}
      <div className="flex justify-between w-full max-w-md bg-slate-900 text-slate-100 px-4 py-2 rounded-lg border-2 border-slate-700 text-xs font-pixel">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Trophy className="w-4 h-4" />
          <span>WPM: {wpm}</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span>TIME: {timeLeft}s</span>
        </div>
        <div className="text-sky-400">
          <span>WORDS: {correctWords}</span>
        </div>
      </div>

      {/* Target Word Stream */}
      <div className="flex flex-wrap justify-center gap-2 p-4 bg-slate-950/80 rounded-lg border-2 border-slate-700 max-w-lg min-h-[90px] items-center">
        {words.map((w, idx) => {
          const isCurrent = idx === currentWordIdx;
          const isDone = idx < currentWordIdx;

          return (
            <span
              key={idx}
              className={`px-2 py-1 rounded text-xs font-silk transition-all ${
                isCurrent
                  ? 'bg-amber-400 text-slate-950 font-bold scale-110 shadow-md font-pixel'
                  : isDone
                  ? 'text-emerald-500 line-through opacity-60'
                  : 'text-slate-400'
              }`}
            >
              {w}
            </span>
          );
        })}
      </div>

      {/* Input Field */}
      {!isGameOver ? (
        <div className="w-full max-w-sm">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            placeholder="Type word and press SPACE..."
            className="w-full px-4 py-3 bg-slate-900 text-emerald-400 border-2 border-emerald-500 rounded text-center text-sm font-pixel focus:outline-none focus:ring-2 focus:ring-emerald-400"
            autoFocus
          />
        </div>
      ) : (
        <div className="space-y-3 bg-slate-900 p-4 rounded-lg border-2 border-amber-500 max-w-xs w-full">
          <div className="text-amber-400 font-bold text-sm font-pixel">CHALLENGE COMPLETE!</div>
          <div className="text-xl font-bold text-white font-pixel">{wpm} WPM</div>
          <p className="text-[10px] text-slate-300 font-silk">
            {wpm > 60 ? 'Master Engineer Typing Speed!' : 'Solid coding cadence! Keep hacking!'}
          </p>
          <button
            onClick={resetGame}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs flex items-center justify-center gap-2 font-pixel cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      )}

      {/* Footer hint */}
      <div className="text-[9px] text-slate-400 font-silk flex items-center gap-1">
        <Keyboard className="w-3 h-3 text-slate-400" />
        <span>Type the highlighted word and press SPACEBAR to confirm</span>
      </div>
    </div>
  );
};

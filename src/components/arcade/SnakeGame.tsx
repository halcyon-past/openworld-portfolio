'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '@/game/audio/SoundManager';
import { RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 16;
const CELL_SIZE = 18;

interface Point {
  x: number;
  y: number;
}

const TECH_ITEMS = ['🐍', '⚛️', '📦', '🤖', '⚡', '💎'];

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 8, y: 8 }, { x: 8, y: 9 }]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 4, y: 4 });
  const [foodIcon, setFoodIcon] = useState('🐍');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirRef = useRef(direction);
  dirRef.current = direction;

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
    setFoodIcon(TECH_ITEMS[Math.floor(Math.random() * TECH_ITEMS.length)]);
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 8, y: 8 }, { x: 8, y: 9 }];
    setSnake(initialSnake);
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setIsRunning(true);
    spawnFood(initialSnake);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const cur = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') && cur.y === 0) {
        e.preventDefault();
        setDirection({ x: 0, y: -1 });
      } else if ((e.key === 'ArrowDown' || e.key.toLowerCase() === 's') && cur.y === 0) {
        e.preventDefault();
        setDirection({ x: 0, y: 1 });
      } else if ((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') && cur.x === 0) {
        e.preventDefault();
        setDirection({ x: -1, y: 0 });
      } else if ((e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') && cur.x === 0) {
        e.preventDefault();
        setDirection({ x: 1, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game loop
  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y,
        };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          soundManager.playBump();
          setIsGameOver(true);
          setIsRunning(false);
          return prev;
        }

        // Self collision
        if (prev.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          soundManager.playBump();
          setIsGameOver(true);
          setIsRunning(false);
          return prev;
        }

        // Food collision
        const ateFood = newHead.x === food.x && newHead.y === food.y;
        const newSnake = [newHead, ...prev];

        if (ateFood) {
          soundManager.playSelect();
          setScore((s) => s + 10);
          spawnFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 130);

    return () => clearInterval(interval);
  }, [isRunning, isGameOver, food, spawnFood]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear board
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Render Food Icon
    ctx.font = '14px monospace';
    ctx.fillText(foodIcon, food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 14);

    // Render Snake
    snake.forEach((seg, idx) => {
      ctx.fillStyle = idx === 0 ? '#10b981' : '#34d399';
      ctx.fillRect(seg.x * CELL_SIZE + 1, seg.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);

      if (idx === 0) {
        // Eyes
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(seg.x * CELL_SIZE + 4, seg.y * CELL_SIZE + 4, 3, 3);
        ctx.fillRect(seg.x * CELL_SIZE + 11, seg.y * CELL_SIZE + 4, 3, 3);
      }
    });
  }, [snake, food, foodIcon]);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* HUD */}
      <div className="flex justify-between w-full max-w-[288px] bg-slate-900 text-slate-100 px-3 py-1.5 rounded border border-slate-700 text-xs font-pixel">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Trophy className="w-3.5 h-3.5" />
          <span>SCORE: {score}</span>
        </div>
        <div className="text-emerald-400">PYTHON EDITION</div>
      </div>

      {/* Canvas */}
      <div className="relative border-4 border-[#2b3340] rounded shadow-md overflow-hidden bg-slate-950">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block"
        />

        {(!isRunning || isGameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4 font-pixel">
            <div className="text-sm font-bold text-amber-400">
              {isGameOver ? 'GAME OVER!' : 'MINIMALIST SNAKE'}
            </div>
            {isGameOver && (
              <div className="text-xs text-white">Final Score: {score}</div>
            )}
            <button
              onClick={resetGame}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isGameOver ? 'RETRY' : 'START GAME'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Touch D-Pad for Mobile */}
      <div className="flex flex-col items-center gap-1 sm:hidden">
        <button
          onClick={() => direction.y === 0 && setDirection({ x: 0, y: -1 })}
          className="p-2 bg-slate-800 text-white rounded active:bg-slate-700"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => direction.x === 0 && setDirection({ x: -1, y: 0 })}
            className="p-2 bg-slate-800 text-white rounded active:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => direction.y === 0 && setDirection({ x: 0, y: 1 })}
            className="p-2 bg-slate-800 text-white rounded active:bg-slate-700"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => direction.x === 0 && setDirection({ x: 1, y: 0 })}
            className="p-2 bg-slate-800 text-white rounded active:bg-slate-700"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

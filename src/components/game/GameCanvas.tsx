'use client';

import React, { useRef, useEffect } from 'react';
import { gameEngine } from '@/game/engine/GameEngine';

interface GameCanvasProps {
  onModalOpen: (modal: string) => void;
  onDialogue: (dialogue: { speaker: string; lines: string[]; avatar?: string }) => void;
  onWildEncounter: (text: string) => void;
  onCoordUpdate: (coords: { x: number; y: number }) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onModalOpen,
  onDialogue,
  onWildEncounter,
  onCoordUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameEngine.onModalOpen = onModalOpen;
    gameEngine.onDialogue = onDialogue;
    gameEngine.onWildEncounter = onWildEncounter;

    // Viewport resize handling
    const updateCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    gameEngine.init(canvas);

    // Coord update timer for HUD
    const coordInterval = setInterval(() => {
      onCoordUpdate({
        x: gameEngine.state.player.x,
        y: gameEngine.state.player.y,
      });
    }, 200);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      clearInterval(coordInterval);
      gameEngine.destroy();
    };
  }, [onModalOpen, onDialogue, onWildEncounter, onCoordUpdate]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    gameEngine.handleCanvasClick(e.clientX, e.clientY, rect);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="fixed inset-0 w-full h-full block bg-[#0d131a] pixelated cursor-crosshair select-none"
    />
  );
};

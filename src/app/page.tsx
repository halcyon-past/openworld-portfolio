'use client';

import React, { useState, useCallback } from 'react';
import { GameCanvas } from '@/components/game/GameCanvas';
import { LoadingScreen } from '@/components/game/LoadingScreen';
import { DialogueBox } from '@/components/ui/DialogueBox';
import { StartMenu } from '@/components/ui/StartMenu';
import { TopHUD } from '@/components/ui/TopHUD';
import { VirtualGamepad } from '@/components/ui/VirtualGamepad';
import { PokedexModal } from '@/components/modals/PokedexModal';
import { TrainerCardModal } from '@/components/modals/TrainerCardModal';
import { BagModal } from '@/components/modals/BagModal';
import { TownMapModal } from '@/components/modals/TownMapModal';
import { SaveModal } from '@/components/modals/SaveModal';
import { ContactModal } from '@/components/modals/ContactModal';
import { DeveloperArcadeModal } from '@/components/arcade/DeveloperArcadeModal';
import { RecruiterDossierView } from '@/components/recruiter/RecruiterDossierView';
import { gameEngine } from '@/game/engine/GameEngine';
import { soundManager } from '@/game/audio/SoundManager';
import { Direction } from '@/game/engine/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showScanlines, setShowScanlines] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [playerCoords, setPlayerCoords] = useState<{ x: number; y: number }>({ x: 6, y: 8 });
  const [wildEncounterText, setWildEncounterText] = useState<string | null>(null);

  const [activeDialogue, setActiveDialogue] = useState<{
    speaker: string;
    lines: string[];
    avatar?: string;
  } | null>(null);

  const handleStartGame = () => {
    setIsLoading(false);
    setIsRecruiterMode(false);
  };

  const handleOpenRecruiter = () => {
    setIsLoading(false);
    setIsRecruiterMode(true);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleScanlines = () => {
    setShowScanlines((prev) => !prev);
  };

  const handleOpenModal = useCallback((modal: string) => {
    setActiveModal(modal);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleDialogue = useCallback(
    (dialogue: { speaker: string; lines: string[]; avatar?: string }) => {
      setActiveDialogue(dialogue);
    },
    []
  );

  const handleCloseDialogue = useCallback(() => {
    setActiveDialogue(null);
  }, []);

  const handleWildEncounter = useCallback((text: string) => {
    setWildEncounterText(text);
    setTimeout(() => {
      setWildEncounterText(null);
    }, 4500);
  }, []);

  const handleWarp = useCallback((tileX: number, tileY: number) => {
    gameEngine.warpPlayer(tileX, tileY);
    setPlayerCoords({ x: tileX, y: tileY });
  }, []);

  const handleVirtualDirection = (dir: Direction | null) => {
    gameEngine.handleVirtualDirection(dir);
  };

  const handleVirtualAction = (action: 'A' | 'B' | 'START') => {
    gameEngine.handleVirtualAction(action);
  };

  // 1. If Loading Screen is active
  if (isLoading) {
    return (
      <LoadingScreen
        onStartGame={handleStartGame}
        onOpenRecruiter={handleOpenRecruiter}
      />
    );
  }

  // 2. If Recruiter Dossier View is active
  if (isRecruiterMode) {
    return (
      <RecruiterDossierView
        onReturnToGame={() => {
          setIsRecruiterMode(false);
          soundManager.startBGM();
        }}
      />
    );
  }

  // 3. Main Open World RPG Game Screen
  return (
    <div className={`relative w-full h-full overflow-hidden ${showScanlines ? 'crt-scanlines' : ''}`}>
      
      {/* HTML5 Canvas Game Engine */}
      <GameCanvas
        onModalOpen={handleOpenModal}
        onDialogue={handleDialogue}
        onWildEncounter={handleWildEncounter}
        onCoordUpdate={setPlayerCoords}
      />

      {/* Top HUD with Quick Links & Preferences */}
      <TopHUD
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        showScanlines={showScanlines}
        onToggleScanlines={handleToggleScanlines}
        onOpenModal={handleOpenModal}
        onToggleRecruiter={() => {
          soundManager.stopBGM();
          setIsRecruiterMode(true);
        }}
        playerCoords={playerCoords}
      />

      {/* Wild Encounter Banner in Tall Grass */}
      {wildEncounterText && (
        <div className="fixed top-16 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-40 bg-slate-900/95 border-2 border-amber-400 text-amber-300 p-3 rounded-lg shadow-2xl text-xs font-pixel text-center animate-bounce">
          {wildEncounterText}
        </div>
      )}

      {/* Interactive GBA Dialogue Box */}
      {activeDialogue && (
        <DialogueBox
          speaker={activeDialogue.speaker}
          lines={activeDialogue.lines}
          avatar={activeDialogue.avatar}
          onClose={handleCloseDialogue}
        />
      )}

      {/* Start Menu */}
      {activeModal === 'startmenu' && (
        <StartMenu
          onSelect={(item) => {
            setActiveModal(item);
          }}
          onClose={handleCloseModal}
        />
      )}

      {/* Pokédex Modal (Projects) */}
      {activeModal === 'pokedex' && (
        <PokedexModal onClose={handleCloseModal} />
      )}

      {/* Trainer Card Modal (About Me & Badges) */}
      {activeModal === 'trainercard' && (
        <TrainerCardModal onClose={handleCloseModal} />
      )}

      {/* Bag Modal (Skills & Tech Stack) */}
      {activeModal === 'bag' && (
        <BagModal onClose={handleCloseModal} />
      )}

      {/* Town Map Modal (Fast Travel) */}
      {activeModal === 'townmap' && (
        <TownMapModal
          onWarp={handleWarp}
          onClose={handleCloseModal}
        />
      )}

      {/* Save Modal */}
      {activeModal === 'save' && (
        <SaveModal
          playerX={playerCoords.x}
          playerY={playerCoords.y}
          onClose={handleCloseModal}
        />
      )}

      {/* Contact / House Modal */}
      {activeModal === 'contact' && (
        <ContactModal onClose={handleCloseModal} />
      )}

      {/* Developer Arcade Modal */}
      {activeModal === 'arcade' && (
        <DeveloperArcadeModal onClose={handleCloseModal} />
      )}

      {/* Virtual On-Screen Gamepad for Mobile */}
      <VirtualGamepad
        onDirection={handleVirtualDirection}
        onAction={handleVirtualAction}
      />

    </div>
  );
}

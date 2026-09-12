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
    gameEngine.isModalActive = true;
    setActiveModal(modal);
  }, []);

  const handleCloseModal = useCallback(() => {
    gameEngine.isModalActive = false;
    setActiveModal(null);
  }, []);

  const handleDialogue = useCallback(
    (dialogue: { speaker: string; lines: string[]; avatar?: string }) => {
      gameEngine.isDialogueActive = true;
      setActiveDialogue(dialogue);
    },
    []
  );

  const handleCloseDialogue = useCallback(() => {
    gameEngine.isDialogueActive = false;
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

      {/* Semantic Crawlable Content for Search Engines & Assistive Technologies */}
      <article className="sr-only">
        <h1>Aritro Saha - Associate Software Developer at Bristol Myers Squibb</h1>
        <p>
          Welcome to the open-world retro RPG portfolio of Aritro Saha (Megh). Aritro is an Associate Software Developer at Bristol Myers Squibb, Winner of Hack4Bengal 3.0, and a graduate of Vellore Institute of Technology (VIT Chennai, 2025).
        </p>

        <section>
          <h2>Featured Software Projects</h2>
          <ul>
            <li>
              <h3>Quarantine</h3>
              <p>Zero-dependency dead-letter queue and fault-tolerance library for Python loops published on PyPI. Isolates exceptions safely without crashing batch data pipelines.</p>
              <a href="https://pypi.org/project/quarantine-py/">Quarantine PyPI Package</a>
              <a href="https://github.com/halcyon-past/quarantine">Quarantine GitHub Repository</a>
            </li>
            <li>
              <h3>Structurify</h3>
              <p>Event-driven B2B SaaS data transformation platform utilizing Google Gemini and GCP serverless fan-out architecture for schema enforcement.</p>
              <a href="https://structurify.aritro.cloud">Structurify Live Demo</a>
              <a href="https://github.com/halcyon-past/Structurify">Structurify GitHub Repository</a>
            </li>
            <li>
              <h3>Luffy Laser Dodge</h3>
              <p>Interactive 3D browser reflex game utilizing Google MediaPipe WASM face tracking and Three.js procedural rigged animations.</p>
              <a href="https://onepiece.aritro.cloud/">Luffy Laser Dodge Live Demo</a>
              <a href="https://github.com/halcyon-past/Luffy-Laser-Dodge">Luffy Laser Dodge GitHub Repository</a>
            </li>
            <li>
              <h3>GlideConnect</h3>
              <p>VIT Capstone research project published in IJIRT featuring contactless virtual mouse control via hand gesture tracking and Gemini voice assistant Krishna.</p>
              <a href="https://github.com/halcyon-past/Glide-Connect">GlideConnect GitHub Repository</a>
              <a href="https://ijirt.org/article?manuscript=180711">IJIRT Research Paper</a>
            </li>
            <li>
              <h3>PAWsitive</h3>
              <p>Overall 1st place winner at Hack4Bengal 3.0. Centralized platform for pet healthcare, blood donor coordination, and emergency rescue clinics.</p>
              <a href="https://www.bepawsitive.xyz">PAWsitive Platform</a>
              <a href="https://github.com/halcyon-past/PAW-sitive">PAWsitive GitHub Repository</a>
            </li>
            <li>
              <h3>SiliconSync & Veripyed</h3>
              <p>Daily AI research breakdown blog and video engineering tutorials on YouTube.</p>
              <a href="https://siliconsync.aritro.cloud/">SiliconSync AI News</a>
              <a href="https://www.youtube.com/@veripyed">Veripyed YouTube Channel</a>
            </li>
          </ul>
        </section>

        <section>
          <h2>Professional Experience</h2>
          <ul>
            <li>Associate Software Developer, Bristol Myers Squibb (July 2025 - Present)</li>
            <li>Data Science Intern, Bajaj Finserv Health (February 2025 - June 2025)</li>
            <li>Full Stack Developer Intern, Wipro (October 2023 - December 2023)</li>
          </ul>
        </section>

        <section>
          <h2>Education & Credentials</h2>
          <p>B.Tech in Electronics and Computer Engineering, Vellore Institute of Technology (VIT Chennai), 2021 - 2025.</p>
          <p>High School, Birla Bharati, 2021.</p>
        </section>

        <section>
          <h2>Technical Skills</h2>
          <p>Python, TypeScript, JavaScript, SQL, Next.js, React, FastAPI, Three.js, Tailwind CSS, Google Gemini API, LangGraph, GCP, Databricks, Docker, MongoDB, Firestore, MediaPipe.</p>
        </section>

        <section>
          <h2>Contact Aritro Saha</h2>
          <p>Email: aritrosaha2025@gmail.com</p>
          <p>LinkedIn: https://linkedin.com/in/aritro-saha</p>
          <p>GitHub: https://github.com/halcyon-past</p>
        </section>
      </article>

    </div>
  );
}

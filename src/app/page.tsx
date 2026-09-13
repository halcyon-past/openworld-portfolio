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
import { SettingsModal } from '@/components/modals/SettingsModal';
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

  const [recruiterOrigin, setRecruiterOrigin] = useState<'home' | 'game'>('game');

  const handleStartGame = () => {
    setIsLoading(false);
    setIsRecruiterMode(false);
  };

  const handleOpenRecruiter = (origin: 'home' | 'game' = 'game') => {
    setRecruiterOrigin(origin);
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
        onOpenRecruiter={() => handleOpenRecruiter('home')}
      />
    );
  }

  // 2. If Recruiter Dossier View is active
  if (isRecruiterMode) {
    return (
      <RecruiterDossierView
        returnLabel={recruiterOrigin === 'home' ? 'RETURN TO HOME SCREEN' : 'RETURN TO POKÉMON RPG'}
        onReturn={() => {
          setIsRecruiterMode(false);
          if (recruiterOrigin === 'home') {
            setIsLoading(true);
            soundManager.stopBGM();
          } else {
            soundManager.startBGM();
          }
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
        onOpenModal={handleOpenModal}
        onToggleRecruiter={() => {
          soundManager.stopBGM();
          handleOpenRecruiter('game');
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

      {/* Settings & Audio Channels Modal */}
      {activeModal === 'settings' && (
        <SettingsModal
          showScanlines={showScanlines}
          onToggleScanlines={handleToggleScanlines}
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
        <h1>Aritro Saha - Associate Software Engineer at Bristol Myers Squibb</h1>
        <p>
          Welcome to the open-world retro RPG portfolio of Aritro Saha (Megh). Aritro is an Associate Software Engineer at Bristol Myers Squibb, Winner of Hack4Bengal 3.0, LeetCode Knight (Peak Rating: 1868), and an Electronics and Computer Engineering graduate of Vellore Institute of Technology (VIT Chennai, CGPA: 8.53/10.0).
        </p>

        <section>
          <h2>Featured Software Projects</h2>
          <ul>
            <li>
              <h3>Quarantine</h3>
              <p>Fault-tolerant loop execution and exception isolation library in Python published to PyPI and Conda-Forge. Zero external dependencies, thread-safe, with dead-letter queue recovery mechanism.</p>
              <a href="https://pypi.org/project/quarantine-py/">Quarantine PyPI Package</a>
              <a href="https://github.com/halcyon-past/quarantine">Quarantine GitHub Repository</a>
            </li>
            <li>
              <h3>Structurify</h3>
              <p>Scalable AI pipeline converting unstructured documents into structured relational formats utilizing GCP Cloud Run, Pub/Sub, LangGraph, Gemini, DuckDB, Firestore, and Next.js.</p>
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
              <h3>KrishnaVision: Contactless Multimodal Virtual Interface</h3>
              <p>VIT Capstone research project published in IJIRT (International Journal of Innovative Research in Technology). Contactless virtual HCI system with 97.3% gesture accuracy at 22ms latency and Gemini-powered assistant.</p>
              <a href="https://github.com/halcyon-past/Glide-Connect">KrishnaVision GitHub Repository</a>
              <a href="https://ijirt.org/article?manuscript=180711">IJIRT Research Paper (Paper ID: 180711)</a>
            </li>
            <li>
              <h3>PAWsitive</h3>
              <p>Overall 1st place winner at Hack4Bengal 3.0 among 400+ participants. Centralized platform for pet healthcare, blood donor coordination, and emergency rescue clinics.</p>
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
            <li>
              <strong>Bristol Myers Squibb — Associate Software Engineer (July 2025 – Present) | Hyderabad, India</strong>
              <p>Reduced diagnostic review time for Non-Small Cell Lung Cancer (NSCLC) cases by 30% by developing an internal medical diagnostic assistant with LLM-driven clinical decision support. Reduced release cycle time by 40+ engineering hours per cycle via Databricks accelerator with standardized ETL/ELT microservices and YAML CI/CD pipelines. Delivered self-service LLM marketplace plugin adopted by 20+ internal teams. Scaled data ingestion to 5M+ records/hour via serverless AWS Lambda, Glue crawler, and DynamoDB.</p>
            </li>
            <li>
              <strong>Bajaj Finserv Health — Data Science Engineer Intern (February 2025 – June 2025) | Pune, India</strong>
              <p>Cut OPD claims failure rate by 60% through a distributed vision NER pipeline scaled to 40,000+ claims/day. Engineered regex NER mapping service for ICD-10 codes eliminating 3rd party APIs and accelerating throughput by 98%. Improved P99 backend latency by 35% (800ms to 520ms) via FastAPI endpoint serialization and unit tests.</p>
            </li>
            <li>
              <strong>WIPRO — Software Engineering Intern (October 2023 – December 2023) | Kolkata, India</strong>
              <p>Developed 3D visualization engine in Three.js with optimized asset loading reducing client-side render time by 3x. Increased deployment frequency by 50% via automated Docker + Azure DevOps CI/CD pipelines.</p>
            </li>
          </ul>
        </section>

        <section>
          <h2>Education & Credentials</h2>
          <p>B.Tech in Electronics and Computer Engineering, Vellore Institute of Technology (VIT Chennai), September 2021 – July 2025. CGPA: 8.53 / 10.0.</p>
          <p>Competitive Programming: LeetCode Knight Badge, Peak Rating: 1868, 630+ problems solved, Top 6% globally.</p>
          <p>Hack4Bengal 3.0 Winner (PAWsitive - 1st / 400+ participants).</p>
          <p>Published Paper: KrishnaVision in IJIRT (Paper ID: 180711, May 2025).</p>
        </section>

        <section>
          <h2>Technical Skills</h2>
          <p>Languages: Python, TypeScript, JavaScript, SQL, C++, C, HTML5/CSS3.</p>
          <p>Frameworks & Libs: Next.js, React, FastAPI, Node.js, Three.js, Tailwind CSS, LangGraph, PyTorch, MediaPipe, Pandas, NumPy.</p>
          <p>Cloud & Distributed: AWS (Lambda, S3, DynamoDB, Glue, Bedrock, SageMaker, OpenSearch, Redshift), GCP (Cloud Run, Pub/Sub), Spark Databricks, Docker, Azure DevOps, MongoDB, Elasticsearch, Firestore, DuckDB.</p>
        </section>

        <section>
          <h2>Contact Aritro Saha</h2>
          <p>Email: aritrosaha2025@gmail.com</p>
          <p>Phone: +919043150635</p>
          <p>LinkedIn: https://linkedin.com/in/aritro-saha</p>
          <p>GitHub: https://github.com/halcyon-past</p>
        </section>
      </article>

    </div>
  );
}

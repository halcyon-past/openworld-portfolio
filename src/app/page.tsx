'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { GymBattleModal } from '@/components/battle/GymBattleModal';
import { RecruiterDossierView } from '@/components/recruiter/RecruiterDossierView';
import { gameEngine } from '@/game/engine/GameEngine';
import { soundManager } from '@/game/audio/SoundManager';
import { Direction } from '@/game/engine/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('openworld_game_started') !== 'true';
      } catch {
        return true;
      }
    }
    return true;
  });
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

  // Sync Overlay State from URL Hash
  // URL Hash is natively supported across all mobile browsers on Back button/gesture
  // and does NOT cause Next.js App Router to reset or re-mount the component!
  const syncOverlaysFromHash = useCallback(() => {
    if (typeof window === 'undefined') return;
    const rawHash = window.location.hash.replace(/^#/, '').trim();

    if (!rawHash) {
      // Back button navigated to base URL -> close any open overlays!
      soundManager.playCancel();
      setActiveModal(null);
      gameEngine.isModalActive = false;
      setActiveDialogue(null);
      gameEngine.isDialogueActive = false;
      setIsRecruiterMode(false);
    } else if (rawHash === 'recruiter') {
      soundManager.playSelect();
      setIsRecruiterMode(true);
    } else if (rawHash === 'dialogue') {
      gameEngine.isDialogueActive = true;
    } else {
      // Modal name (startmenu, pokedex, trainercard, bag, townmap, save, settings, contact, arcade)
      soundManager.playSelect();
      setActiveModal(rawHash);
      gameEngine.isModalActive = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('hashchange', syncOverlaysFromHash);
    window.addEventListener('popstate', syncOverlaysFromHash);

    // Initial check if page loaded with a modal hash
    if (window.location.hash) {
      syncOverlaysFromHash();
    }

    return () => {
      window.removeEventListener('hashchange', syncOverlaysFromHash);
      window.removeEventListener('popstate', syncOverlaysFromHash);
    };
  }, [syncOverlaysFromHash]);

  const handleStartGame = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('openworld_game_started', 'true');
      } catch {
        // ignore
      }
    }
    setIsLoading(false);
    setIsRecruiterMode(false);
  };

  const handleOpenRecruiter = useCallback((origin: 'home' | 'game' = 'game') => {
    setRecruiterOrigin(origin);
    setIsLoading(false);
    setIsRecruiterMode(true);
    if (origin === 'game' && typeof window !== 'undefined') {
      if (window.location.hash !== '#recruiter') {
        window.location.hash = 'recruiter';
      }
    }
  }, []);

  const handleCloseRecruiter = useCallback(() => {
    setIsRecruiterMode(false);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }
    if (recruiterOrigin === 'home') {
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem('openworld_game_started');
        } catch {
          // ignore
        }
      }
      setIsLoading(true);
      soundManager.stopBGM();
    } else {
      soundManager.startBGM();
    }
  }, [recruiterOrigin]);

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
    if (typeof window !== 'undefined') {
      if (window.location.hash !== `#${modal}`) {
        window.location.hash = modal;
      }
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    gameEngine.isModalActive = false;
    setActiveModal(null);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }
  }, []);

  const handleDialogue = useCallback(
    (dialogue: { speaker: string; lines: string[]; avatar?: string }) => {
      gameEngine.isDialogueActive = true;
      setActiveDialogue(dialogue);
      if (typeof window !== 'undefined') {
        if (window.location.hash !== '#dialogue') {
          window.location.hash = 'dialogue';
        }
      }
    },
    []
  );

  const handleCloseDialogue = useCallback(() => {
    gameEngine.isDialogueActive = false;
    setActiveDialogue(null);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }
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

  return (
    <>
      {/* 1. If Loading Screen is active */}
      {isLoading && (
        <LoadingScreen
          onStartGame={handleStartGame}
          onOpenRecruiter={() => handleOpenRecruiter('home')}
        />
      )}

      {/* 2. If Recruiter Dossier View is active */}
      {!isLoading && isRecruiterMode && (
        <RecruiterDossierView
          returnLabel={recruiterOrigin === 'home' ? 'RETURN TO HOME SCREEN' : 'RETURN TO POKÉMON RPG'}
          onReturn={handleCloseRecruiter}
        />
      )}

      {/* 3. Main Open World RPG Game Screen */}
      {!isLoading && !isRecruiterMode && (
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
            handleOpenModal(item);
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

      {/* Silicon Gym Boss Battle Modal */}
      {activeModal === 'gymbattle' && (
        <GymBattleModal
          onClose={handleCloseModal}
          onOpenRecruiter={() => handleOpenRecruiter('game')}
        />
      )}

      {/* Virtual On-Screen Gamepad for Mobile */}
      <VirtualGamepad
        onDirection={handleVirtualDirection}
        onAction={handleVirtualAction}
      />
        </div>
      )}

      {/* Semantic Crawlable Content for Search Engines (Googlebot) & Assistive Technologies */}
      <article className="sr-only">
        <header>
          <h1>Aritro Saha | Associate Software Engineer at Bristol Myers Squibb & Full-Stack AI Developer</h1>
          <p>
            Official portfolio and interactive Pokémon RPG open world of Aritro Saha (Megh). Associate Software Engineer at Bristol Myers Squibb (BMS), Hack4Bengal 3.0 Winner, LeetCode Knight (Peak Rating: 1868, Top 6% globally), and Electronics and Computer Engineering graduate from Vellore Institute of Technology (VIT Chennai, CGPA: 8.53/10.0).
          </p>
          <nav>
            <a href="/dossier">View Full Text Resume & Professional Engineering Dossier</a>
            <a href="/">Play Interactive 2D Pokémon RPG Game Portfolio</a>
          </nav>
        </header>

        <section>
          <h2>Core Specialties & Technical Domains</h2>
          <p>
            Specialized in resilient backend systems, distributed Python architectures, LLM workflow automation (LangGraph, Gemini, Bedrock), high-throughput data engineering (AWS Lambda, Glue, Databricks Spark, DynamoDB), and interactive web experiences (Next.js, TypeScript, Three.js).
          </p>
        </section>

        <section>
          <h2>Featured Engineering Projects</h2>
          <ul>
            <li>
              <h3>Quarantine — Python Exception Isolation & Fault-Tolerant Loop Library</h3>
              <p>
                Published open-source library on PyPI and Conda-Forge. Zero external dependencies, thread-safe execution isolation, dead-letter queue diagnostics, and resilient batch data pipelines.
              </p>
              <a href="https://pypi.org/project/quarantine-py/">Quarantine on PyPI</a>
              <a href="https://github.com/halcyon-past/quarantine">Quarantine GitHub Source Code</a>
            </li>
            <li>
              <h3>Structurify — Scalable Document to Relational AI Pipeline</h3>
              <p>
                Production cloud pipeline transforming unstructured PDF/Docx files into relational SQL schemas via GCP Cloud Run, Pub/Sub, LangGraph, Gemini multimodal parsing, DuckDB, and Next.js.
              </p>
              <a href="https://structurify.aritro.cloud">Structurify Web Application</a>
              <a href="https://github.com/halcyon-past/Structurify">Structurify GitHub Source Code</a>
            </li>
            <li>
              <h3>Luffy Laser Dodge — Real-Time 3D Browser Reflex Game</h3>
              <p>
                Computer vision web game with Google MediaPipe WASM head tracking and Three.js custom rigged animations running at 60 FPS in browser.
              </p>
              <a href="https://onepiece.aritro.cloud/">Luffy Laser Dodge Web Game</a>
              <a href="https://github.com/halcyon-past/Luffy-Laser-Dodge">Luffy Laser Dodge GitHub Source Code</a>
            </li>
            <li>
              <h3>KrishnaVision: Contactless Multimodal Virtual Interface (Published Research)</h3>
              <p>
                Published research paper in IJIRT (International Journal of Innovative Research in Technology, Paper ID: 180711). Contactless human-computer interface achieving 97.3% gesture classification accuracy at 22ms latency with Google Gemini multimodal agent integration.
              </p>
              <a href="https://ijirt.org/article?manuscript=180711">IJIRT Research Publication (Paper ID: 180711)</a>
              <a href="https://github.com/halcyon-past/Glide-Connect">KrishnaVision GitHub Source Code</a>
            </li>
            <li>
              <h3>PAWsitive — Hack4Bengal 3.0 Grand Champion</h3>
              <p>
                1st Place Overall Champion among 400+ developers at Hack4Bengal 3.0. Emergency blood donor coordination network and real-time medical clinic locator for animal healthcare.
              </p>
              <a href="https://www.bepawsitive.xyz">PAWsitive Platform</a>
              <a href="https://github.com/halcyon-past/PAW-sitive">PAWsitive GitHub Source Code</a>
            </li>
            <li>
              <h3>SiliconSync & Veripyed</h3>
              <p>Daily AI research publications and systems engineering video walkthroughs.</p>
              <a href="https://siliconsync.aritro.cloud/">SiliconSync AI Research</a>
              <a href="https://www.youtube.com/@veripyed">Veripyed on YouTube</a>
            </li>
          </ul>
        </section>

        <section>
          <h2>Professional Work Experience</h2>
          <ul>
            <li>
              <strong>Bristol Myers Squibb (BMS) — Associate Software Engineer</strong> (July 2025 – Present | Hyderabad, India)
              <p>
                Architected internal medical diagnostic assistant for Non-Small Cell Lung Cancer (NSCLC) accelerating clinician review throughput by 30%. Streamlined Databricks ETL/ELT pipelines cutting release cycles by 40+ engineering hours. Delivered self-service enterprise LLM marketplace microservice adopted across 20+ functional groups. Scaled data ingestion pipelines to 5M+ events/hour using AWS Lambda, Glue, and DynamoDB.
              </p>
            </li>
            <li>
              <strong>Bajaj Finserv Health — Data Science Engineer Intern</strong> (February 2025 – June 2025 | Pune, India)
              <p>
                Engineered distributed vision NER pipeline processing 40,000+ daily OPD claims with a 60% failure rate reduction. Built in-house ICD-10 medical ontology mapping service boosting throughput by 98%. Reduced P99 backend response latency by 35% across high-load microservices.
              </p>
            </li>
            <li>
              <strong>Wipro — Software Engineering Intern</strong> (October 2023 – December 2023 | Kolkata, India)
              <p>
                Developed high-performance 3D visualization components in Three.js and accelerated deployment velocity by 50% using Dockerized Azure DevOps CI/CD pipelines.
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h2>Academic Background & Certifications</h2>
          <p>
            Bachelor of Technology (B.Tech) in Electronics and Computer Engineering from Vellore Institute of Technology, Chennai (VIT Chennai, 2021–2025, CGPA: 8.53 / 10.0).
          </p>
          <p>
            Competitive Programming: LeetCode Knight Badge (Max Rating: 1868, 630+ algorithmic problems solved, Top 6% worldwide).
          </p>
        </section>

        <section>
          <h2>Full Technology Stack</h2>
          <p>Languages: Python, TypeScript, JavaScript, SQL, C++, C, HTML5, CSS3.</p>
          <p>Web & Backend: Next.js, React, FastAPI, Node.js, Express, Three.js, Tailwind CSS, WebSockets, REST APIs.</p>
          <p>AI & Data Science: LangGraph, Google Gemini API, PyTorch, MediaPipe, Pandas, NumPy, OpenCV, RAG Pipelines.</p>
          <p>Cloud & DevOps: Amazon Web Services (AWS Lambda, S3, DynamoDB, Glue, Bedrock, SageMaker), Google Cloud Platform (Cloud Run, Pub/Sub), Databricks Apache Spark, Docker, Git, GitHub Actions, CI/CD, Azure DevOps.</p>
        </section>

        <section>
          <h2>Contact & Professional Links</h2>
          <p>Email: <a href="mailto:aritrosaha2025@gmail.com">aritrosaha2025@gmail.com</a></p>
          <p>LinkedIn: <a href="https://linkedin.com/in/aritro-saha">https://linkedin.com/in/aritro-saha</a></p>
          <p>GitHub: <a href="https://github.com/halcyon-past">https://github.com/halcyon-past</a></p>
          <p>YouTube: <a href="https://www.youtube.com/@veripyed">https://www.youtube.com/@veripyed</a></p>
        </section>
      </article>
    </>
  );
}

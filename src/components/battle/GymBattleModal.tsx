'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { soundManager } from '@/game/audio/SoundManager';
import { Zap, X, Award, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GymBattleModalProps {
  onClose: () => void;
  onOpenRecruiter?: () => void;
}

interface EnemyPokemon {
  id: string;
  name: string;
  title: string;
  level: number;
  maxHp: number;
  currentHp: number;
  types: [string, string];
  sprite: string;
  accentColor: string;
  moves: {
    name: string;
    type: string;
    power: number;
    description: string;
  }[];
  dialogueIntro: string;
}

interface PlayerMove {
  id: string;
  name: string;
  type: string;
  category: 'Special' | 'Physical' | 'Status';
  power: number;
  pp: number;
  maxPp: number;
  description: string;
  flavor: string;
}

const PLAYER_MOVES: PlayerMove[] = [
  {
    id: 'sys_design',
    name: 'SYSTEM DESIGN PROBE',
    type: 'Psychic',
    category: 'Special',
    power: 45,
    pp: 15,
    maxPp: 15,
    description: 'Inquires about event-driven serverless architecture & high-throughput scaling.',
    flavor: "Recruiter probed Aritro's distributed system architecture!"
  },
  {
    id: 'code_review',
    name: 'STRICT CODE AUDIT',
    type: 'Dark',
    category: 'Physical',
    power: 40,
    pp: 20,
    maxPp: 20,
    description: 'Audits production error isolation, unit test coverage, and strict typing.',
    flavor: 'Recruiter launched a rigorous production code audit!'
  },
  {
    id: 'whiteboard',
    name: 'LEETCODE ALGO ROUND',
    type: 'Fighting',
    category: 'Physical',
    power: 55,
    pp: 10,
    maxPp: 10,
    description: 'Presents complex graph & dynamic programming algorithmic puzzles.',
    flavor: 'Recruiter presented an O(N log N) graph optimization puzzle!'
  },
  {
    id: 'offer_boost',
    name: 'OFFER PACKAGE BUFF',
    type: 'Normal',
    category: 'Status',
    power: 0,
    pp: 5,
    maxPp: 5,
    description: 'Presents an exciting competitive engineering package. Boosts mutual alignment!',
    flavor: 'Recruiter highlighted exciting engineering culture & compensation!'
  }
];

export const GymBattleModal: React.FC<GymBattleModalProps> = ({ onClose, onOpenRecruiter }) => {
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [playerMaxHp] = useState<number>(100);
  const [playerCoffeeCount, setPlayerCoffeeCount] = useState<number>(2);

  const [opponents, setOpponents] = useState<EnemyPokemon[]>([
    {
      id: 'quarantine',
      name: 'QUARANTINE',
      title: 'Python Dead-Letter Sentinel',
      level: 65,
      maxHp: 90,
      currentHp: 90,
      types: ['Steel', 'Poison'],
      sprite: '/assets/battle/quarantine_front.png',
      accentColor: '#f43f5e',
      moves: [
        { name: 'Dead-Letter Isolation', type: 'Steel', power: 22, description: 'Catches batch loop exceptions and isolates 10,000+ malformed items!' },
        { name: 'PyPI Replay CLI', type: 'Poison', power: 18, description: 'Replays quarantined records with >90% surgical accuracy.' }
      ],
      dialogueIntro: 'Gym Leader Aritro sent out QUARANTINE! (PyPI Resilient ETL Guardian)'
    },
    {
      id: 'lambda_spark',
      name: 'LAMBDA-SPARK',
      title: 'Distributed Cloud Leviathan',
      level: 80,
      maxHp: 110,
      currentHp: 110,
      types: ['Electric', 'Dragon'],
      sprite: '/assets/battle/lambda_spark_front.png',
      accentColor: '#3b82f6',
      moves: [
        { name: '5M Serverless Surge', type: 'Electric', power: 28, description: 'AWS Lambda streams process 5M+ records/hr into DynamoDB!' },
        { name: 'Databricks Warp', type: 'Dragon', power: 24, description: 'Standardized ETL microservices saved 40+ engineering hours per cycle.' }
      ],
      dialogueIntro: 'Leader Aritro summoned LAMBDA-SPARK! (AWS Serverless & Databricks Ingestion)'
    },
    {
      id: 'leader_aritro',
      name: 'GYM LEADER ARITRO',
      title: 'Associate Software Engineer @ BMS',
      level: 99,
      maxHp: 140,
      currentHp: 140,
      types: ['Psychic', 'Steel'],
      sprite: '/assets/battle/gym_leader_aritro.png',
      accentColor: '#f59e0b',
      moves: [
        { name: 'LeetCode Knight Strike', type: 'Fighting', power: 34, description: 'Top 6% worldwide precision (1868 Peak Rating, 630+ solved).' },
        { name: 'Clinical Decision LLM', type: 'Psychic', power: 30, description: 'Reduced NSCLC diagnostic review turnaround time by 30%!' }
      ],
      dialogueIntro: 'Gym Leader Aritro took the arena! "Let\'s see your team\'s architectural stamina!"'
    }
  ]);

  const currentOpponent = opponents[phaseIndex] || opponents[opponents.length - 1];

  const [battleMenu, setBattleMenu] = useState<'main' | 'fight' | 'bag'>('main');
  const [battleLog, setBattleLog] = useState<string>(
    'A competitive challenge begun! Gym Leader Aritro is waiting on the arena platform!'
  );
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [shakeTarget, setShakeTarget] = useState<'none' | 'opponent' | 'player'>('none');
  const [screenFlash, setScreenFlash] = useState<boolean>(false);

  useEffect(() => {
    soundManager.playWildAlert();
    setBattleLog(currentOpponent.dialogueIntro);
  }, []);

  useEffect(() => {
    if (isVictory) {
      soundManager.playFanfare();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [isVictory]);

  const handlePlayerAttack = (move: PlayerMove) => {
    if (isAnimating || isVictory) return;
    setIsAnimating(true);
    setBattleMenu('main');

    soundManager.playSelect();
    setBattleLog(move.flavor);

    setTimeout(() => {
      if (move.power > 0) {
        if (move.power >= 50) {
          soundManager.playBattleSuperEffective();
        } else {
          soundManager.playBattleHit();
        }
        setShakeTarget('opponent');
        setScreenFlash(true);
        setTimeout(() => {
          setShakeTarget('none');
          setScreenFlash(false);
        }, 350);

        const damage = Math.max(18, Math.round(move.power * 0.75 + Math.random() * 8));
        const nextHp = Math.max(0, currentOpponent.currentHp - damage);

        setOpponents((prev) =>
          prev.map((opp, idx) => (idx === phaseIndex ? { ...opp, currentHp: nextHp } : opp))
        );

        if (nextHp <= 0) {
          setTimeout(() => {
            handleOpponentFainted();
          }, 800);
          return;
        } else {
          setBattleLog(
            `It's super effective! ${currentOpponent.name} took ${damage} damage! (${nextHp}/${currentOpponent.maxHp} HP)`
          );
        }
      } else {
        soundManager.playBattleBuff();
        setPlayerHp((prev) => Math.min(playerMaxHp, prev + 25));
        setBattleLog('Offer package presented! Recruiter and Aritro gained +25 Motivation & Stamina!');
      }

      setTimeout(() => {
        handleEnemyTurn();
      }, 1400);
    }, 900);
  };

  const handleEnemyTurn = () => {
    const randomMove =
      currentOpponent.moves[Math.floor(Math.random() * currentOpponent.moves.length)];
    soundManager.playBattleHit();
    setBattleLog(`${currentOpponent.name} deployed ${randomMove.name}!`);

    setShakeTarget('player');
    setTimeout(() => setShakeTarget('none'), 350);

    const enemyDmg = Math.max(12, Math.round(randomMove.power * 0.6 + Math.random() * 6));
    setPlayerHp((prev) => Math.max(10, prev - enemyDmg));

    setTimeout(() => {
      setBattleLog(`"${randomMove.description}" (Recruiter took ${enemyDmg} damage!)`);
      setIsAnimating(false);
    }, 900);
  };

  const handleOpponentFainted = () => {
    soundManager.playFanfare();
    setBattleLog(`${currentOpponent.name} was successfully benchmarked & certified!`);

    if (phaseIndex < opponents.length - 1) {
      setTimeout(() => {
        const nextIdx = phaseIndex + 1;
        setPhaseIndex(nextIdx);
        soundManager.playWildAlert();
        setBattleLog(opponents[nextIdx].dialogueIntro);
        setIsAnimating(false);
      }, 1500);
    } else {
      setTimeout(() => {
        setIsVictory(true);
        setIsAnimating(false);
      }, 1200);
    }
  };

  const handleUseCoffee = () => {
    if (playerCoffeeCount <= 0 || isAnimating || isVictory) return;
    soundManager.playBattleBuff();
    setPlayerCoffeeCount((prev) => prev - 1);
    setPlayerHp(playerMaxHp);
    setBattleMenu('main');
    setBattleLog('Recruiter drank Dark Roast Coffee! Stamina restored to 100%!');
  };

  const handleThrowOfferBall = () => {
    if (isAnimating || isVictory) return;
    setIsAnimating(true);
    setBattleMenu('main');
    soundManager.playSelect();
    setBattleLog('Recruiter presented the MASTER JOB OFFER PACKAGE!');

    setTimeout(() => {
      soundManager.playBattleBuff();
      setBattleLog('Calculating mutual architectural and compensation alignment...');

      setTimeout(() => {
        soundManager.playBallCatch();
        setBattleLog('Synchronizing engineering vision with Leader Aritro...');

        setTimeout(() => {
          setIsVictory(true);
          setIsAnimating(false);
        }, 1800);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xs font-pixel select-none">
      <div className="relative w-full max-w-3xl bg-slate-950 border-4 sm:border-8 border-[#1e293b] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-slate-950 px-3 sm:px-4 py-2 border-b-4 border-slate-900 flex justify-between items-center shrink-0 font-bold">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 fill-current text-yellow-200 animate-pulse" />
            <span className="text-xs sm:text-sm tracking-wider">
              SILICON GYM • BOSS BATTLE ARENA
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] sm:text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded font-silk">
              ROUND {phaseIndex + 1} OF 3
            </span>
            <button
              onClick={() => {
                soundManager.playCancel();
                onClose();
              }}
              className="p-1 rounded bg-slate-950/60 hover:bg-slate-950 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Battle Field Stage (GBA Dual Arena) */}
        <div className={`relative flex-1 bg-gradient-to-b from-[#172554] via-[#0f172a] to-[#020617] p-4 flex flex-col justify-between overflow-hidden min-h-[320px] sm:min-h-[360px] ${screenFlash ? 'brightness-200' : ''}`}>
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* TOP HALF: OPPONENT PLATFORM & STATUS HUD */}
          <div className="relative z-10 flex justify-between items-start pt-2 px-2 sm:px-6">
            
            <div className="bg-[#1e293b]/90 border-2 border-amber-400/80 rounded-lg p-2.5 sm:p-3 text-white shadow-xl max-w-[240px] sm:max-w-[280px] w-full animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                <span className="text-[11px] sm:text-xs font-bold tracking-wide text-amber-300 truncate">
                  {currentOpponent.name}
                </span>
                <span className="text-[9px] sm:text-[10px] text-amber-200 font-silk shrink-0 ml-1">
                  Lv.{currentOpponent.level}
                </span>
              </div>

              <div className="text-[8px] text-slate-300 font-silk mt-0.5 truncate">
                {currentOpponent.title}
              </div>

              {/* HP Bar */}
              <div className="mt-2 space-y-0.5">
                <div className="flex justify-between text-[8px] text-slate-300 font-silk">
                  <span>HP</span>
                  <span>{currentOpponent.currentHp} / {currentOpponent.maxHp}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentOpponent.currentHp / currentOpponent.maxHp > 0.5
                        ? 'bg-emerald-500'
                        : currentOpponent.currentHp / currentOpponent.maxHp > 0.2
                        ? 'bg-amber-400'
                        : 'bg-rose-500 animate-pulse'
                    }`}
                    style={{
                      width: `${Math.max(0, (currentOpponent.currentHp / currentOpponent.maxHp) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Opponent Sprite Platform */}
            <div className="relative flex flex-col items-center">
              <div className="w-32 sm:w-44 h-8 bg-slate-800/80 border border-slate-600 rounded-[100%] shadow-[0_0_20px_rgba(59,130,246,0.3)] absolute bottom-0 translate-y-3" />

              <div
                className={`relative w-28 h-28 sm:w-36 sm:h-36 transition-transform duration-300 ${
                  shakeTarget === 'opponent' ? 'animate-shake' : 'animate-pulse-slow'
                }`}
              >
                <Image
                  src={currentOpponent.sprite}
                  alt={currentOpponent.name}
                  fill
                  className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* BOTTOM HALF: PLAYER SPRITE & RECRUITER HUD */}
          <div className="relative z-10 flex justify-between items-end pb-2 px-2 sm:px-6">
            
            <div className="relative flex flex-col items-center">
              <div className="w-32 sm:w-44 h-8 bg-emerald-950/80 border border-emerald-700 rounded-[100%] shadow-[0_0_20px_rgba(16,185,129,0.3)] absolute bottom-0 translate-y-2" />

              <div
                className={`relative w-28 h-28 sm:w-36 sm:h-36 transition-transform duration-300 ${
                  shakeTarget === 'player' ? 'animate-shake' : ''
                }`}
              >
                <Image
                  src="/assets/battle/recruiter_bot_back.png"
                  alt="Talent Partner"
                  fill
                  className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  unoptimized
                />
              </div>
            </div>

            <div className="bg-[#1e293b]/90 border-2 border-emerald-400/80 rounded-lg p-2.5 sm:p-3 text-white shadow-xl max-w-[240px] sm:max-w-[280px] w-full animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                <span className="text-[11px] sm:text-xs font-bold tracking-wide text-emerald-300">
                  RECRUITER SQUAD
                </span>
                <span className="text-[9px] sm:text-[10px] text-emerald-200 font-silk">
                  Lv.85
                </span>
              </div>

              <div className="text-[8px] text-slate-300 font-silk mt-0.5">
                Talent & Engineering Leadership
              </div>

              {/* Player HP Bar */}
              <div className="mt-2 space-y-0.5">
                <div className="flex justify-between text-[8px] text-slate-300 font-silk">
                  <span>STAMINA</span>
                  <span>{playerHp} / {playerMaxHp}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      playerHp / playerMaxHp > 0.5
                        ? 'bg-emerald-500'
                        : playerHp / playerMaxHp > 0.2
                        ? 'bg-amber-400'
                        : 'bg-rose-500 animate-pulse'
                    }`}
                    style={{
                      width: `${Math.max(0, (playerHp / playerMaxHp) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* LOWER SECTION: GBA BATTLE LOG & COMMAND SELECTION PAD */}
        <div className="bg-[#0f172a] border-t-4 border-slate-900 p-3 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 shrink-0 min-h-[140px]">
          
          <div className="md:col-span-6 bg-slate-900 border-2 border-slate-700 rounded-lg p-3 text-white flex flex-col justify-between shadow-inner">
            <div className="text-[10px] text-amber-300 font-bold border-b border-slate-800 pb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>BATTLE ANNOUNCER:</span>
            </div>
            <p className="text-xs sm:text-sm font-silk leading-relaxed text-slate-200 pt-1.5 flex-1 flex items-center">
              {battleLog}
            </p>
          </div>

          <div className="md:col-span-6 flex flex-col justify-center">
            
            {battleMenu === 'main' && !isVictory && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={isAnimating}
                  onClick={() => {
                    soundManager.playSelect();
                    setBattleMenu('fight');
                  }}
                  className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 border border-red-400"
                >
                  <span>⚔️ FIGHT</span>
                </button>

                <button
                  disabled={isAnimating}
                  onClick={() => {
                    soundManager.playSelect();
                    setBattleMenu('bag');
                  }}
                  className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 border border-amber-400"
                >
                  <span>🎒 BAG ({playerCoffeeCount})</span>
                </button>

                <button
                  disabled={isAnimating}
                  onClick={handleThrowOfferBall}
                  className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 border border-purple-400"
                  title="Throw Master Offer Ball to Hire Directly"
                >
                  <span>✨ OFFER BALL</span>
                </button>

                <button
                  disabled={isAnimating}
                  onClick={() => {
                    soundManager.playCancel();
                    onClose();
                  }}
                  className="p-2.5 sm:p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <span>🏃 RUN / RETREAT</span>
                </button>
              </div>
            )}

            {battleMenu === 'fight' && !isVictory && (
              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  {PLAYER_MOVES.map((move) => (
                    <button
                      key={move.id}
                      disabled={isAnimating}
                      onClick={() => handlePlayerAttack(move)}
                      className="p-2 rounded bg-slate-800 hover:bg-blue-900/80 text-left border border-slate-700 hover:border-blue-400 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      <div className="text-[10px] sm:text-xs font-bold text-white flex justify-between">
                        <span>{move.name}</span>
                        <span className="text-[8px] text-amber-300">{move.type}</span>
                      </div>
                      <div className="text-[8px] text-slate-400 font-silk truncate">
                        Pwr: {move.power || 'Buff'} • PP: {move.pp}/{move.maxPp}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    soundManager.playCancel();
                    setBattleMenu('main');
                  }}
                  className="text-[9px] text-slate-400 hover:text-white font-silk text-right cursor-pointer pt-0.5"
                >
                  ◄ Back to Battle Commands
                </button>
              </div>
            )}

            {battleMenu === 'bag' && !isVictory && (
              <div className="flex flex-col gap-2">
                <div className="bg-slate-900 border border-slate-700 rounded p-2 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-300">☕ Dark Roast Coffee</div>
                    <div className="text-[9px] text-slate-400 font-silk">Restores 100% Recruiter Stamina</div>
                  </div>
                  <button
                    disabled={playerCoffeeCount <= 0 || isAnimating}
                    onClick={handleUseCoffee}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded text-[10px] font-bold cursor-pointer"
                  >
                    USE ({playerCoffeeCount} LEFT)
                  </button>
                </div>

                <button
                  onClick={() => {
                    soundManager.playCancel();
                    setBattleMenu('main');
                  }}
                  className="text-[9px] text-slate-400 hover:text-white font-silk text-right cursor-pointer"
                >
                  ◄ Back to Battle Commands
                </button>
              </div>
            )}

            {isVictory && (
              <div className="flex flex-col gap-2 animate-fade-in">
                <div className="bg-emerald-950/80 border-2 border-emerald-400 rounded-lg p-2.5 text-center space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-amber-300 flex items-center justify-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>SILICON GYM BADGE WON!</span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-emerald-200 font-silk">
                    Leader Aritro acknowledged your team&apos;s architectural prowess and engineering standards!
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      soundManager.playSelect();
                      onClose();
                      onOpenRecruiter?.();
                    }}
                    className="flex-1 py-2 px-3 rounded bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>VIEW DOSSIER & RESUME</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playCancel();
                      onClose();
                    }}
                    className="py-2 px-4 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                  >
                    CLOSE GYM
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-4 py-1.5 text-[8px] text-slate-500 font-silk flex justify-between items-center border-t border-slate-900 shrink-0">
          <span>Bristol Myers Squibb Arena • Official Pokémon GBA Engine</span>
          <span>B / ESC: Retreat</span>
        </div>

      </div>
    </div>
  );
};

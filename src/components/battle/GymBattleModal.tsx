'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PORTFOLIO_DATA, GymBadge } from '@/data/portfolioData';
import { soundManager } from '@/game/audio/SoundManager';
import { Zap, X, Award, Trophy, Sparkles, Coffee, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GymBattleModalProps {
  onClose: () => void;
  onOpenRecruiter?: () => void;
}

interface OpponentMove {
  name: string;
  type: string;
  power: number;
  description: string;
  flavor: string;
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
  counterMoveIdx: number; // The specific Gym Leader counter move triggered!
}

// Exactly the 4 options specified in Option 2:
// 1. System Design Challenge (Psychic)
// 2. Code Review Trap (Dark)
// 3. Live Coding Whiteboard (Fighting)
// 4. Competitive Offer Package (Normal / High Power)
const PLAYER_MOVES: PlayerMove[] = [
  {
    id: 'sys_design',
    name: 'SYSTEM DESIGN CHALLENGE',
    type: 'Psychic',
    category: 'Special',
    power: 48,
    pp: 15,
    maxPp: 15,
    description: 'Presents high-throughput streaming challenge (5M+ events/hr).',
    flavor: 'Recruiter probed Aritro with a 5M records/hr distributed pipeline challenge!',
    counterMoveIdx: 0,
  },
  {
    id: 'code_review',
    name: 'CODE REVIEW TRAP',
    type: 'Dark',
    category: 'Physical',
    power: 42,
    pp: 20,
    maxPp: 20,
    description: 'Audits production error handling, memory leaks, and dead-letter queues.',
    flavor: 'Recruiter set a rigorous code review trap with malformed batch payloads!',
    counterMoveIdx: 1,
  },
  {
    id: 'whiteboard',
    name: 'LIVE CODING WHITEBOARD',
    type: 'Fighting',
    category: 'Physical',
    power: 56,
    pp: 10,
    maxPp: 10,
    description: 'Presents hard graph complexity and algorithmic optimization puzzles.',
    flavor: 'Recruiter presented an O(N log N) graph optimization whiteboard puzzle!',
    counterMoveIdx: 2,
  },
  {
    id: 'comp_offer',
    name: 'COMPETITIVE OFFER PACKAGE',
    type: 'Normal',
    category: 'Special',
    power: 60,
    pp: 5,
    maxPp: 5,
    description: 'Presents an exciting engineering leadership package with high mutual alignment.',
    flavor: 'Recruiter presented a high-impact Senior Engineering package!',
    counterMoveIdx: 3,
  },
];

// Opponent Counter Moves matching the exact spec:
// - AWS Serverless Event-Driven Architecture (DynamoDB metadata enrichment)
// - Strict Typing & Clean Architecture (Zero vulnerabilities)
// - LeetCode Knight Precision 1868 (Solved in O(N log N))
// - Clinical LLM Sync (30% diagnostic review reduction)
const OPPONENT_COUNTER_MOVES: OpponentMove[] = [
  {
    name: 'AWS Serverless Architecture',
    type: 'Electric',
    power: 24,
    description: 'AWS Lambda + Glue metadata enrichment processes 5M+ records/hr smoothly!',
    flavor: 'Aritro countered with AWS Event-Driven Serverless Architecture!',
  },
  {
    name: 'Quarantine Dead-Letter DLQ',
    type: 'Steel',
    power: 22,
    description: 'Isolated 10,000+ corrupt items without crashing the batch ETL loop!',
    flavor: 'Aritro deployed Quarantine DLQ: Zero production downtime!',
  },
  {
    name: 'LeetCode Knight Strike (1868)',
    type: 'Fighting',
    power: 26,
    description: 'Solved the problem with O(N log N) time & O(1) space complexity! Top 6% worldwide.',
    flavor: 'Aritro countered with LeetCode Knight Precision!',
  },
  {
    name: 'Executive Sign-Off & Tech Vision',
    type: 'Dragon',
    power: 22,
    description: 'Aritro reviewed the scope, tech roadmap, and growth trajectory. Mutual interest peaked!',
    flavor: 'Aritro reviewed the tech stack & delivered an inspired engineering roadmap!',
  },
];

export const GymBattleModal: React.FC<GymBattleModalProps> = ({ onClose, onOpenRecruiter }) => {
  // Option 2: True GBA 4-button menu: FIGHT, BAG, POKÉMON, RECRUIT
  const [battleMenu, setBattleMenu] = useState<'main' | 'fight' | 'bag' | 'pokemon'>('main');

  // Opponent: Gym Leader Aritro Lv. 99
  const [opponentHp, setOpponentHp] = useState<number>(160);
  const maxOpponentHp = 160;

  // Recruiter Team Stats
  const [playerHp, setPlayerHp] = useState<number>(100);
  const maxPlayerHp = 100;

  // Bag Items from Option 2:
  // - Dark Roast Coffee (Heals visitor team)
  // - Senior Role Req (Boosts agreement rate)
  // - Hack4Bengal Trophy (Triggers victory lore)
  const [coffeeCount, setCoffeeCount] = useState<number>(2);
  const [roleReqUsed, setRoleReqUsed] = useState<boolean>(false);

  // Selected Badge inside [POKÉMON] / Roster view
  const [selectedBadge, setSelectedBadge] = useState<GymBadge | null>(null);

  // Animation & Battle FX
  const [battleLog, setBattleLog] = useState<string>(
    'Gym Leader Aritro steps onto the arena platform! "Let\'s see if your team has the architectural stamina!"'
  );
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [shakeTarget, setShakeTarget] = useState<'none' | 'opponent' | 'player'>('none');
  const [screenFlash, setScreenFlash] = useState<boolean>(false);
  const [isCatching, setIsCatching] = useState<boolean>(false);

  useEffect(() => {
    soundManager.playWildAlert();
  }, []);

  useEffect(() => {
    if (isVictory) {
      soundManager.playFanfare();
      try {
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, [isVictory]);

  // Execute Player Attack
  const handlePlayerAttack = (move: PlayerMove) => {
    if (isAnimating || isVictory) return;
    setIsAnimating(true);
    setBattleMenu('main');

    soundManager.playSelect();
    setBattleLog(move.flavor);

    setTimeout(() => {
      // Audio & Shake Impact
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

      // Calculate Damage
      const damage = Math.max(22, Math.round(move.power * 0.7 + Math.random() * 8));
      const nextHp = Math.max(0, opponentHp - damage);
      setOpponentHp(nextHp);

      if (nextHp <= 0) {
        setTimeout(() => {
          handleVictoryAchievement();
        }, 800);
        return;
      }

      setBattleLog(
        `It's super effective! Leader Aritro took ${damage} challenge impact! (${nextHp}/${maxOpponentHp} HP)`
      );

      // Opponent Counter-Turn
      setTimeout(() => {
        handleOpponentCounter(move.counterMoveIdx);
      }, 1400);
    }, 900);
  };

  // Opponent Specific Counter Attack
  const handleOpponentCounter = (moveIdx: number) => {
    const counterMove = OPPONENT_COUNTER_MOVES[moveIdx] || OPPONENT_COUNTER_MOVES[0];
    soundManager.playBattleHit();
    setBattleLog(counterMove.flavor);

    setShakeTarget('player');
    setTimeout(() => setShakeTarget('none'), 350);

    const enemyDmg = Math.max(12, Math.round(counterMove.power * 0.65 + Math.random() * 6));
    setPlayerHp((prev) => Math.max(15, prev - enemyDmg));

    setTimeout(() => {
      setBattleLog(`"${counterMove.description}" (Recruiter took ${enemyDmg} damage!)`);
      setIsAnimating(false);
    }, 1000);
  };

  // Victory Handler
  const handleVictoryAchievement = () => {
    soundManager.playFanfare();
    setBattleLog(
      'Victory! Gym Leader Aritro acknowledged your architectural stamina! "Outstanding technical standards."'
    );
    setIsVictory(true);
    setIsAnimating(false);
  };

  // [BAG] Item: Drink Dark Roast Coffee
  const handleDrinkCoffee = () => {
    if (coffeeCount <= 0 || isAnimating || isVictory) return;
    soundManager.playBattleBuff();
    setCoffeeCount((prev) => prev - 1);
    setPlayerHp(maxPlayerHp);
    setBattleMenu('main');
    setBattleLog('Recruiter drank Dark Roast Coffee! Stamina fully restored to 100%!');
  };

  // [BAG] Item: Present Senior Role Req
  const handlePresentRoleReq = () => {
    if (roleReqUsed || isAnimating || isVictory) return;
    soundManager.playBattleBuff();
    setRoleReqUsed(true);
    setBattleMenu('main');
    setBattleLog('Presented Senior Role Req! Leader Aritro\'s agreement rate boosted to 100%!');
  };

  // [BAG] Item: Inspect Hack4Bengal Trophy
  const handleShowTrophy = () => {
    soundManager.playFanfare();
    setBattleMenu('main');
    setBattleLog('Hack4Bengal 3.0 Champion Trophy displayed! PAWsitive pet health platform lore recalled!');
  };

  // [RECRUIT]: Instant Master Ball / Job Offer Animation Catch
  const handleRecruitMasterBall = () => {
    if (isAnimating || isVictory) return;
    setIsAnimating(true);
    setIsCatching(true);
    setBattleMenu('main');
    soundManager.playSelect();
    setBattleLog('Recruiter dispatched the MASTER JOB OFFER BALL!');

    setTimeout(() => {
      soundManager.playBattleBuff();
      setBattleLog('Checking cultural, technical, and compensation alignment...');

      setTimeout(() => {
        soundManager.playBallCatch();
        setBattleLog('Wiggle... Wiggle... Wiggle... Click!');

        setTimeout(() => {
          setIsCatching(false);
          setBattleLog('Gotcha! Aritro Saha joined your Engineering Organization as Associate Software Engineer!');
          handleVictoryAchievement();
        }, 1800);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xs font-pixel select-none">
      {/* GBA FireRed/Emerald Battle Window */}
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
              LEADER ARITRO LV.99
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
        <div
          className={`relative flex-1 bg-gradient-to-b from-[#172554] via-[#0f172a] to-[#020617] p-4 flex flex-col justify-between overflow-hidden min-h-[320px] sm:min-h-[360px] ${
            screenFlash ? 'brightness-200' : ''
          }`}
        >
          {/* Subtle Grid / Stadium Lights */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* ========================================================= */}
          {/* TOP HALF: GYM LEADER ARITRO PLATFORM & STATUS HUD */}
          {/* ========================================================= */}
          <div className="relative z-10 flex justify-between items-start pt-2 px-2 sm:px-6">
            
            {/* Opponent Status HUD (Top-Left) */}
            <div className="bg-[#1e293b]/90 border-2 border-amber-400/80 rounded-lg p-2.5 sm:p-3 text-white shadow-xl max-w-[240px] sm:max-w-[280px] w-full animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                <span className="text-[11px] sm:text-xs font-bold tracking-wide text-amber-300">
                  LEADER ARITRO
                </span>
                <span className="text-[9px] sm:text-[10px] text-amber-200 font-silk">
                  Lv.99
                </span>
              </div>

              <div className="text-[8px] text-slate-300 font-silk mt-0.5">
                Associate Software Developer @ BMS
              </div>

              {/* HP Bar */}
              <div className="mt-2 space-y-0.5">
                <div className="flex justify-between text-[8px] text-slate-300 font-silk">
                  <span>HP</span>
                  <span>{opponentHp} / {maxOpponentHp}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      opponentHp / maxOpponentHp > 0.5
                        ? 'bg-emerald-500'
                        : opponentHp / maxOpponentHp > 0.2
                        ? 'bg-amber-400'
                        : 'bg-rose-500 animate-pulse'
                    }`}
                    style={{
                      width: `${Math.max(0, (opponentHp / maxOpponentHp) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Gym Leader Aritro Sprite Platform (Top-Right) */}
            <div className="relative flex flex-col items-center">
              {/* Stadium Ground Platform */}
              <div className="w-32 sm:w-44 h-8 bg-slate-800/80 border border-slate-600 rounded-[100%] shadow-[0_0_20px_rgba(59,130,246,0.3)] absolute bottom-0 translate-y-3" />

              {/* Detailed Sprite with Animation */}
              <div
                className={`relative w-28 h-28 sm:w-36 sm:h-36 transition-transform duration-300 ${
                  shakeTarget === 'opponent' ? 'animate-shake' : 'animate-pulse-slow'
                }`}
              >
                <Image
                  src="/assets/battle/gym_leader_aritro.png"
                  alt="Gym Leader Aritro"
                  fill
                  className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM HALF: RECRUITER SPRITE & STATUS HUD */}
          {/* ========================================================= */}
          <div className="relative z-10 flex justify-between items-end pb-2 px-2 sm:px-6">
            
            {/* Recruiter Partner Sprite (Bottom-Left) */}
            <div className="relative flex flex-col items-center">
              <div className="w-32 sm:w-44 h-8 bg-emerald-950/80 border border-emerald-700 rounded-[100%] shadow-[0_0_20px_rgba(16,185,129,0.3)] absolute bottom-0 translate-y-2" />

              <div
                className={`relative w-28 h-28 sm:w-36 sm:h-36 transition-transform duration-300 ${
                  shakeTarget === 'player' ? 'animate-shake' : ''
                }`}
              >
                <Image
                  src="/assets/battle/recruiter_bot_back.png"
                  alt="Recruiter Squad"
                  fill
                  className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  unoptimized
                />
              </div>
            </div>

            {/* Recruiter Status HUD (Bottom-Right) */}
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
                  <span>{playerHp} / {maxPlayerHp}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      playerHp / maxPlayerHp > 0.5
                        ? 'bg-emerald-500'
                        : playerHp / maxPlayerHp > 0.2
                        ? 'bg-amber-400'
                        : 'bg-rose-500 animate-pulse'
                    }`}
                    style={{
                      width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* LOWER SECTION: GBA BATTLE LOG & 4 EXACT BUTTONS */}
        {/* ========================================================= */}
        <div className="bg-[#0f172a] border-t-4 border-slate-900 p-3 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 shrink-0 min-h-[140px]">
          
          {/* Left: Dialogue / Battle Announcer Box */}
          <div className="md:col-span-6 bg-slate-900 border-2 border-slate-700 rounded-lg p-3 text-white flex flex-col justify-between shadow-inner">
            <div className="text-[10px] text-amber-300 font-bold border-b border-slate-800 pb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>BATTLE ANNOUNCER:</span>
            </div>
            <p className="text-xs sm:text-sm font-silk leading-relaxed text-slate-200 pt-1.5 flex-1 flex items-center">
              {battleLog}
            </p>
          </div>

          {/* Right: GBA Action Decision Menu */}
          <div className="md:col-span-6 flex flex-col justify-center">
            
            {/* OPTION 2 - MAIN 4-BUTTON MENU: [FIGHT], [BAG], [POKÉMON], [OFFER / RECRUIT] */}
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
                  <span>🎒 BAG</span>
                </button>

                <button
                  disabled={isAnimating}
                  onClick={() => {
                    soundManager.playSelect();
                    setBattleMenu('pokemon');
                  }}
                  className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 border border-blue-400"
                >
                  <span>🛡️ POKÉMON / BADGES</span>
                </button>

                <button
                  disabled={isAnimating}
                  onClick={handleRecruitMasterBall}
                  className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-400"
                >
                  <span>✨ OFFER / RECRUIT</span>
                </button>
              </div>
            )}

            {/* SUB-MENU 1: [FIGHT] - 4 ATTACK ACTIONS */}
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
                        Power: {move.power} • PP: {move.pp}/{move.maxPp}
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

            {/* SUB-MENU 2: [BAG] - TACTICAL ITEMS */}
            {battleMenu === 'bag' && !isVictory && (
              <div className="flex flex-col gap-1.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {/* Coffee */}
                  <button
                    disabled={coffeeCount <= 0 || isAnimating}
                    onClick={handleDrinkCoffee}
                    className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-left cursor-pointer disabled:opacity-40"
                  >
                    <div className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                      <Coffee className="w-3 h-3" />
                      <span>Dark Roast Coffee</span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-silk">Heal 100% ({coffeeCount} Left)</div>
                  </button>

                  {/* Senior Role Req */}
                  <button
                    disabled={roleReqUsed || isAnimating}
                    onClick={handlePresentRoleReq}
                    className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-left cursor-pointer disabled:opacity-40"
                  >
                    <div className="text-[10px] font-bold text-sky-300 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Senior Role Req</span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-silk">
                      {roleReqUsed ? 'Active (Boosted)' : 'Boost Agreement Rate'}
                    </div>
                  </button>

                  {/* Hack4Bengal Trophy */}
                  <button
                    onClick={handleShowTrophy}
                    className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-left cursor-pointer"
                  >
                    <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>Hack4Bengal Trophy</span>
                    </div>
                    <div className="text-[8px] text-slate-400 font-silk">1st Place Victor Lore</div>
                  </button>
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

            {/* SUB-MENU 3: [POKÉMON] - INSPECT 8 GYM BADGES OF HONOR */}
            {battleMenu === 'pokemon' && !isVictory && (
              <div className="flex flex-col gap-1.5">
                <div className="text-[9px] font-bold text-sky-300 flex items-center justify-between border-b border-slate-800 pb-1">
                  <span>ARITRO&apos;S 8 GYM BADGES OF HONOR:</span>
                  <span className="text-[8px] text-slate-400 font-silk">Click to inspect</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                  {PORTFOLIO_DATA.badges.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        soundManager.playSelect();
                        setSelectedBadge(b);
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 flex flex-col items-center cursor-pointer"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center border border-white"
                        style={{ backgroundColor: b.iconColor }}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-[7px] text-slate-300 truncate w-full text-center mt-0.5">
                        {b.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedBadge && (
                  <div className="p-1.5 bg-slate-900 border border-amber-400/60 rounded text-[9px] text-slate-300 font-silk">
                    <span className="font-bold text-amber-300">{selectedBadge.name}</span> ({selectedBadge.gymCity}): {selectedBadge.description}
                  </div>
                )}

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

            {/* VICTORY & RECRUITER OFFER PANEL */}
            {isVictory && (
              <div className="flex flex-col gap-2 animate-fade-in">
                <div className="bg-emerald-950/80 border-2 border-emerald-400 rounded-lg p-2.5 text-center space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-amber-300 flex items-center justify-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>SILICON ENTERPRISE BADGE WON!</span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-emerald-200 font-silk">
                    Leader Aritro agreed to collaborate! Bristol Myers Squibb Associate Developer joins your engineering network.
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
          <span>Bristol Myers Squibb Arena • Tactical Recruiter Battle Engine</span>
          <span>B / ESC: Close</span>
        </div>

      </div>
    </div>
  );
};

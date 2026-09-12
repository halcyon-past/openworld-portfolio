import { Direction, GameState, Position, BuildingTrigger, Entity } from './types';
import { tileMap, MAP_WIDTH, MAP_HEIGHT } from './TileMap';
import { TILE_SIZE, spriteGenerator } from './SpriteGenerator';
import { soundManager } from '../audio/SoundManager';

export class GameEngine {
  public state: GameState;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private keysPressed: Set<string> = new Set();
  private targetTile: Position | null = null;

  // UI Event Callbacks
  public onModalOpen?: (modal: string) => void;
  public onDialogue?: (dialogue: { speaker: string; lines: string[]; avatar?: string }) => void;
  public onWildEncounter?: (text: string) => void;
  public isDialogueActive: boolean = false;
  public isModalActive: boolean = false;
  private virtualDirection: Direction | null = null;

  public getZoom(): number {
    if (!this.canvas) return 1.5;
    // On mobile (< 640px wide or < 600px high), use 1.35x - 1.5x so the world is readable without clipping
    const h = this.canvas.height;
    return Math.max(1.25, Math.min(1.85, Math.round((h / 480) * 10) / 10));
  }

  constructor() {
    this.state = {
      player: {
        x: 6,
        y: 8, // Spawns outside Aritro's House
        subX: 0,
        subY: 0,
        direction: 'down',
        isMoving: false,
        isSprinting: false,
        stepFrame: 0,
        animTimer: 0,
      },
      camera: {
        x: 6 * TILE_SIZE,
        y: 8 * TILE_SIZE,
      },
      football: {
        x: 8 * TILE_SIZE + 4,
        y: 6 * TILE_SIZE + 4,
        vx: 0,
        vy: 0,
      },
      interactTarget: null,
      activeModal: null,
      activeDialogue: null,
    };
  }

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;

    this.setupInputs();
    this.startLoop();
  }

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  private setupInputs() {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e) => {
      // Don't capture keys if typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      const key = e.key.toLowerCase();
      this.keysPressed.add(key);

      // Interact key (Space, Enter, Z)
      if (key === ' ' || key === 'enter' || key === 'z') {
        e.preventDefault();
        this.handleInteract();
      }

      // Sprint toggle (Shift or B)
      if (key === 'shift' || key === 'b') {
        this.state.player.isSprinting = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      this.keysPressed.delete(key);

      if (key === 'shift' || key === 'b') {
        this.state.player.isSprinting = false;
      }
    });
  }

  /**
   * Virtual touch / button input support for mobile
   */
  public handleVirtualDirection(dir: Direction | null) {
    this.virtualDirection = dir;
    this.keysPressed.delete('arrowup');
    this.keysPressed.delete('arrowdown');
    this.keysPressed.delete('arrowleft');
    this.keysPressed.delete('arrowright');
    this.keysPressed.delete('w');
    this.keysPressed.delete('s');
    this.keysPressed.delete('a');
    this.keysPressed.delete('d');

    if (dir) {
      if (dir === 'up') this.keysPressed.add('arrowup');
      if (dir === 'down') this.keysPressed.add('arrowdown');
      if (dir === 'left') this.keysPressed.add('arrowleft');
      if (dir === 'right') this.keysPressed.add('arrowright');
    }
  }

  public handleVirtualAction(action: 'A' | 'B' | 'START') {
    if (action === 'A') {
      this.handleInteract();
    } else if (action === 'B') {
      this.state.player.isSprinting = !this.state.player.isSprinting;
      soundManager.playMenuCursor();
    } else if (action === 'START') {
      if (this.onModalOpen) {
        soundManager.playSelect();
        this.onModalOpen('startmenu');
      }
    }
  }

  /**
   * Tap / Click to walk pathfinding
   */
  public handleCanvasClick(clientX: number, clientY: number, rect: DOMRect) {
    if (!this.canvas) return;

    // Convert screen coordinates to world tile coordinates with zoom scaling
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const screenX = (clientX - rect.left) * scaleX;
    const screenY = (clientY - rect.top) * scaleY;

    const zoom = this.getZoom();

    const worldX = (screenX - this.canvas.width / 2) / zoom + this.state.camera.x;
    const worldY = (screenY - this.canvas.height / 2) / zoom + this.state.camera.y;

    const tileX = Math.floor(worldX / TILE_SIZE);
    const tileY = Math.floor(worldY / TILE_SIZE);

    if (tileX >= 0 && tileX < MAP_WIDTH && tileY >= 0 && tileY < MAP_HEIGHT) {
      this.targetTile = { x: tileX, y: tileY };
      soundManager.playMenuCursor();
    }
  }

  /**
   * Player fast travel teleportation
   */
  public warpPlayer(tileX: number, tileY: number) {
    this.state.player.x = tileX;
    this.state.player.y = tileY;
    this.state.player.subX = 0;
    this.state.player.subY = 0;
    this.state.player.isMoving = false;
    this.targetTile = null;
    soundManager.playWarp();
  }

  private handleInteract() {
    if (this.isDialogueActive || this.isModalActive) {
      return;
    }
    const { player } = this.state;
    // Check target tile directly in front of player
    let targetX = player.x;
    let targetY = player.y;

    if (player.direction === 'down') targetY += 1;
    else if (player.direction === 'up') targetY -= 1;
    else if (player.direction === 'left') targetX -= 1;
    else if (player.direction === 'right') targetX += 1;

    // 1. Check NPC in front
    const npc = tileMap.getNpcAt(targetX, targetY);
    if (npc) {
      // Turn NPC to face player
      const oppositeDir: Record<Direction, Direction> = {
        down: 'up',
        up: 'down',
        left: 'right',
        right: 'left',
      };
      npc.direction = oppositeDir[player.direction];
      this.triggerNpcDialogue(npc);
      return;
    }

    // 2. Check trigger in front or standing on
    const trigger = tileMap.getTriggerAt(targetX, targetY) || tileMap.getTriggerAt(player.x, player.y);
    if (trigger) {
      this.triggerBuilding(trigger);
      return;
    }

    // 3. Kick football if nearby
    const distToBall = Math.hypot(
      player.x * TILE_SIZE - this.state.football.x,
      player.y * TILE_SIZE - this.state.football.y
    );
    if (distToBall < 36) {
      this.kickFootball();
      return;
    }

    soundManager.playBump();
  }

  private triggerNpcDialogue(npc: Entity) {
    soundManager.playSelect();

    const dialogues: Record<string, { speaker: string; lines: string[]; avatar?: string }> = {
      dialogue_oak: {
        speaker: 'Prof. Oak (Research Mentor)',
        lines: [
          "Hello there, traveler! Welcome to Pallet Cloud!",
          "I mentor Aritro Saha in cutting-edge distributed computing and AI architectures.",
          "He has won Hack4Bengal 3.0 and engineered tools like 'Quarantine' and 'Structurify'.",
          "Head into the Pokédex Center or Silicon Gym to inspect his achievements!"
        ],
        avatar: 'scientist'
      },
      dialogue_joy: {
        speaker: 'Nurse Joy (Projects Center)',
        lines: [
          "Welcome to the Innovation Pokédex Center!",
          "We maintain all of Aritro's full-stack and data science creations.",
          "Inspect our main terminal to launch live demos for Quarantine, Structurify, and Luffy Laser Dodge!"
        ],
        avatar: 'nurse'
      },
      dialogue_clerk: {
        speaker: 'Tech Mart Clerk',
        lines: [
          "Welcome to the Tech & Skills Mart!",
          "We keep a fully stocked Bag of technical abilities.",
          "Our highest rated items include Python, TypeScript, LangGraph, and Google Gemini API!"
        ],
        avatar: 'clerk'
      },
      dialogue_gymlead: {
        speaker: 'Aritro Saha (Associate Developer @ BMS)',
        lines: [
          "Welcome to the Silicon Gym!",
          "I'm an Associate Software Developer at Bristol Myers Squibb.",
          "I specialize in bridging the gap between resilient backend logic, machine learning, and intuitive design.",
          "Check out my 8 Gym Badges of Honor on my Trainer Card!"
        ],
        avatar: 'gymleader'
      },
      dialogue_arcade: {
        speaker: 'Arcade Host',
        lines: [
          "Yo! Welcome to the Developer Game Corner!",
          "Aritro coded these retro games to test your typing speed and Python reflexes.",
          "Step right in and aim for the high score!"
        ],
        avatar: 'arcade'
      },
      dialogue_pet: {
        speaker: 'Pixel Pup (PAWsitive Mascot)',
        lines: [
          "Woof! *wags pixel tail excitedly*",
          "Pixel Pup is healthy and happy thanks to Aritro's Hack4Bengal winner project 'PAWsitive'!",
          "PAWsitive connects pet owners with emergency blood donors and verified clinics."
        ],
        avatar: 'pet'
      }
    };

    const dialogue = dialogues[npc.dialogueId || ''] || {
      speaker: npc.name,
      lines: ["Good luck on your developer journey!"]
    };

    if (this.onDialogue) {
      this.onDialogue(dialogue);
    }
  }

  private triggerBuilding(trigger: BuildingTrigger) {
    soundManager.playWarp();

    if (trigger.targetModal && this.onModalOpen) {
      this.onModalOpen(trigger.targetModal);
    } else if (trigger.dialogueText && this.onDialogue) {
      this.onDialogue({
        speaker: trigger.name,
        lines: trigger.dialogueText
      });
    }
  }

  private kickFootball() {
    soundManager.playFanfare();
    const { player, football } = this.state;
    const force = 9;
    if (player.direction === 'right') football.vx = force;
    else if (player.direction === 'left') football.vx = -force;
    else if (player.direction === 'down') football.vy = force;
    else if (player.direction === 'up') football.vy = -force;

    if (this.onDialogue) {
      this.onDialogue({
        speaker: "Football Match",
        lines: [
          "GOOOOAL! You kicked the soccer ball across Aritro's lawn!",
          "When Aritro isn't coding enterprise pipelines, he's on the football pitch or beatboxing!"
        ]
      });
    }
  }

  private startLoop() {
    const loop = (time: number) => {
      if (!this.lastTime) this.lastTime = time;
      const dt = Math.min((time - this.lastTime) / 1000, 0.1);
      this.lastTime = time;

      this.update(dt);
      this.render();

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  private update(dt: number) {
    if (this.isDialogueActive || this.isModalActive) {
      this.keysPressed.clear();
      this.targetTile = null;
      return;
    }
    const { player, camera, football } = this.state;

    // Movement speed: walking = 3.5 tiles/sec, sprinting = 6 tiles/sec
    const speed = player.isSprinting ? 6.5 : 3.8;

    if (player.isMoving) {
      // Advance sub-tile movement
      let stepAmount = speed * dt;

      if (player.direction === 'right') player.subX += stepAmount;
      else if (player.direction === 'left') player.subX -= stepAmount;
      else if (player.direction === 'down') player.subY += stepAmount;
      else if (player.direction === 'up') player.subY -= stepAmount;

      // Animate walking steps
      player.animTimer += dt * (player.isSprinting ? 16 : 10);
      player.stepFrame = Math.floor(player.animTimer);

      // Check if finished tile step
      if (Math.abs(player.subX) >= 1 || Math.abs(player.subY) >= 1) {
        player.x += Math.sign(player.subX);
        player.y += Math.sign(player.subY);
        player.subX = 0;
        player.subY = 0;
        player.isMoving = false;

        // Check if stepped into door or wild grass
        const cell = tileMap.grid[player.y]?.[player.x];
        if (cell?.type === 'tallgrass' && Math.random() < 0.08) {
          this.triggerGrassEncounter();
        }

        const trigger = tileMap.getTriggerAt(player.x, player.y);
        if (trigger && trigger.targetModal) {
          this.triggerBuilding(trigger);
        }
      }
    } else {
      // Handle player input to initiate move
      let wantDir: Direction | null = this.virtualDirection;

      if (!wantDir) {
        if (this.keysPressed.has('arrowup') || this.keysPressed.has('w')) wantDir = 'up';
        else if (this.keysPressed.has('arrowdown') || this.keysPressed.has('s')) wantDir = 'down';
        else if (this.keysPressed.has('arrowleft') || this.keysPressed.has('a')) wantDir = 'left';
        else if (this.keysPressed.has('arrowright') || this.keysPressed.has('d')) wantDir = 'right';
      }

      // Tap to walk direction
      if (!wantDir && this.targetTile) {
        const dx = this.targetTile.x - player.x;
        const dy = this.targetTile.y - player.y;

        if (dx === 0 && dy === 0) {
          this.targetTile = null;
        } else if (Math.abs(dx) > Math.abs(dy)) {
          wantDir = dx > 0 ? 'right' : 'left';
        } else {
          wantDir = dy > 0 ? 'down' : 'up';
        }
      }

      if (wantDir) {
        player.direction = wantDir;
        let nextX = player.x;
        let nextY = player.y;

        if (wantDir === 'down') nextY += 1;
        else if (wantDir === 'up') nextY -= 1;
        else if (wantDir === 'left') nextX -= 1;
        else if (wantDir === 'right') nextX += 1;

        // Collision check
        if (!tileMap.isSolid(nextX, nextY)) {
          player.isMoving = true;
          player.subX = 0;
          player.subY = 0;
        } else {
          soundManager.playBump();
          this.targetTile = null;
        }
      }
    }

    // Camera follow lerp
    const targetCamX = (player.x + player.subX) * TILE_SIZE + TILE_SIZE / 2;
    const targetCamY = (player.y + player.subY) * TILE_SIZE + TILE_SIZE / 2;
    camera.x += (targetCamX - camera.x) * 0.12;
    camera.y += (targetCamY - camera.y) * 0.12;

    // Clamp camera to map bounds with zoom scaling
    if (this.canvas) {
      const zoom = this.getZoom();
      const visibleHalfW = (this.canvas.width / 2) / zoom;
      const visibleHalfH = (this.canvas.height / 2) / zoom;
      const totalMapW = MAP_WIDTH * TILE_SIZE;
      const totalMapH = MAP_HEIGHT * TILE_SIZE;

      if (totalMapW <= visibleHalfW * 2) {
        camera.x = totalMapW / 2;
      } else {
        camera.x = Math.max(visibleHalfW, Math.min(totalMapW - visibleHalfW, camera.x));
      }

      if (totalMapH <= visibleHalfH * 2) {
        camera.y = totalMapH / 2;
      } else {
        camera.y = Math.max(visibleHalfH, Math.min(totalMapH - visibleHalfH, camera.y));
      }
    }

    // Football physics simulation
    football.x += football.vx;
    football.y += football.vy;
    football.vx *= 0.94; // friction
    football.vy *= 0.94;
    if (Math.abs(football.vx) < 0.05) football.vx = 0;
    if (Math.abs(football.vy) < 0.05) football.vy = 0;

    // Bounce football off map borders
    if (football.x < 32 || football.x > (MAP_WIDTH - 2) * TILE_SIZE) football.vx *= -1;
    if (football.y < 32 || football.y > (MAP_HEIGHT - 2) * TILE_SIZE) football.vy *= -1;
  }

  private triggerGrassEncounter() {
    soundManager.playWildAlert();
    const encounters = [
      "A wild Uncaught Exception appeared! Player invoked Quarantine decorator! It's super effective!",
      "A wild Legacy Monolith appeared! Player used Next.js Server Components! Clean architecture established!",
      "A wild Memory Leak appeared! Player used Databricks & Pytest! The pipeline ran smoothly!",
      "A wild Hack4Bengal Challenge appeared! Aritro formed a team and won 1st Place overall!",
      "A wild Beatbox Rhythm appeared! Aritro dropped an acoustic 8-bit drum solo!"
    ];
    const text = encounters[Math.floor(Math.random() * encounters.length)];
    if (this.onWildEncounter) {
      this.onWildEncounter(text);
    }
  }

  private render() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const { player, camera, football } = this.state;

    // Clear canvas
    ctx.fillStyle = '#070b10';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply Camera Transform with HD Pixel-Art Zoom
    const zoom = this.getZoom();

    ctx.save();
    // Center viewport and scale
    ctx.translate(Math.floor(this.canvas.width / 2), Math.floor(this.canvas.height / 2));
    ctx.scale(zoom, zoom);
    ctx.translate(Math.floor(-camera.x), Math.floor(-camera.y));

    // 1. Render Flat Base Terrain (Grass, Paths, Water, Flowers, Cliffs, Stairs)
    const animFrame = Math.floor(performance.now() / 33);
    tileMap.renderTerrain(ctx, animFrame);

    // 2. Collect all 2.5D Depth-Sorted Renderables (Buildings, Trees, NPCs, Player, Football)
    interface Renderable {
      baseY: number;
      draw: (c: CanvasRenderingContext2D) => void;
    }

    const renderables: Renderable[] = [];

    // Scenery: Buildings & Trees from TileMap
    renderables.push(...tileMap.getSceneryObjects());

    // Football
    const ballTile = spriteGenerator.getFootballTile();
    renderables.push({
      baseY: football.y + 16,
      draw: (c) => {
        // Football ground shadow
        c.fillStyle = 'rgba(15, 23, 42, 0.35)';
        c.beginPath();
        c.ellipse(football.x + 12, football.y + 20, 8, 3, 0, 0, Math.PI * 2);
        c.fill();
        c.drawImage(ballTile, Math.floor(football.x), Math.floor(football.y));
      },
    });

    // NPCs
    for (const npc of tileMap.npcs) {
      const npcSprite = spriteGenerator.getCharacterSprite(npc.spriteType, npc.direction, 0);
      const npcBaseY = (npc.y + 1) * TILE_SIZE;
      renderables.push({
        baseY: npcBaseY,
        draw: (c) => {
          c.drawImage(npcSprite, npc.x * TILE_SIZE, npc.y * TILE_SIZE);

          // Render interact hint icon "!"
          const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
          if (dist <= 1.5) {
            c.fillStyle = '#ef4444';
            c.font = 'bold 12px monospace';
            c.fillText('!', npc.x * TILE_SIZE + 14, npc.y * TILE_SIZE - 4);
          }
        },
      });
    }

    // Player
    const playerPx = (player.x + player.subX) * TILE_SIZE;
    const playerPy = (player.y + player.subY) * TILE_SIZE;
    const playerSprite = spriteGenerator.getCharacterSprite(
      'player',
      player.direction,
      player.isMoving ? player.stepFrame : 0
    );
    const playerBaseY = playerPy + TILE_SIZE;

    renderables.push({
      baseY: playerBaseY,
      draw: (c) => {
        c.drawImage(playerSprite, Math.floor(playerPx), Math.floor(playerPy));
      },
    });

    // 3. True 2.5D Depth Sorting (Painter's Algorithm by baseY)
    renderables.sort((a, b) => a.baseY - b.baseY);

    for (const item of renderables) {
      item.draw(ctx);
    }

    // 4. Atmospheric 2.5D Vignette & Cinematic Ambient Lighting
    ctx.restore();

    // Subtle radial light vignette over camera
    const grad = ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width * 0.25,
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width * 0.75
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(3, 7, 18, 0.45)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export const gameEngine = new GameEngine();

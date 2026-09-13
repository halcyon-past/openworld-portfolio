import { Direction, GameState, Position, BuildingTrigger, Entity } from './types';
import { tileMap, MAP_WIDTH, MAP_HEIGHT } from './TileMap';
import { TILE_SIZE, spriteGenerator } from './SpriteGenerator';
import { soundManager } from '../audio/SoundManager';

export interface ShowcaseProject {
  title: string;
  category: string;
  imageSrc: string;
  img?: HTMLImageElement;
  tagline: string;
  badge: string;
}

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    title: 'Quarantine',
    category: 'Python ETL Resilience',
    imageSrc: '/assets/Quarantine.webp',
    tagline: 'Dynamic dead-letter queue for 10K+ loops',
    badge: 'PYPI • 10K+ LOOPS'
  },
  {
    title: 'Structurify',
    category: 'GCP Serverless ETL Pipeline',
    imageSrc: '/assets/Structurify.webp',
    tagline: 'LangGraph & Gemini Map-Reduce architecture',
    badge: 'GCP • 1M ROWS'
  },
  {
    title: 'PAWsitive',
    category: 'Pet Emergency Healthcare',
    imageSrc: '/assets/Pawsitive.webp',
    tagline: 'Hack4Bengal 3.0 Champion Blood Donor Hub',
    badge: 'WINNER • EMERGENCY'
  },
  {
    title: 'GlideConnect',
    category: 'Accessible Public Transit Hub',
    imageSrc: '/assets/GlideConnect.webp',
    tagline: 'Live crowdsourced transit navigation & routes',
    badge: 'TRANSIT • MAPS'
  },
  {
    title: 'Luffy Laser Dodge',
    category: 'Interactive 3D WASM Game',
    imageSrc: '/assets/luffy-laser-dodge.webp',
    tagline: 'Webcam AI head-tracking via MediaPipe WASM',
    badge: 'THREE.JS • WASM'
  },
  {
    title: 'EduHelper',
    category: 'Multi-Agent AI Study Assistant',
    imageSrc: '/assets/Eduhelper.webp',
    tagline: 'Adaptive AI tutor with structured memory',
    badge: 'AI • EDTECH'
  }
];

export interface LakeDuck {
  id: string;
  x: number; // world pixel coordinates
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  direction: 'left' | 'right';
  variant: 'yellow' | 'mallard';
  swimTimer: number;
  quackTimer: number;
}

export class GameEngine {
  public state: GameState;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private keysPressed: Set<string> = new Set();
  private targetTile: Position | null = null;
  private currentPath: Position[] = [];
  private lastBumpTime: number = 0;

  // Lake Ducks
  public lakeDucks: LakeDuck[] = [];

  // Live Jumbotron TV Showcase State
  public tvIndex: number = 0;
  public tvTimer: number = 0;
  public showcaseProjects: ShowcaseProject[] = SHOWCASE_PROJECTS;

  // Interactive Lawn Football State
  public hasKickedFootball: boolean = false;
  public footballRollAngle: number = 0;

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

    this.initLakeDucks();
  }

  private initLakeDucks() {
    // Lake boundaries: x: 1..4 (32px to 160px), y: 21..28 (672px to 928px)
    // Water surface area: x: 40 to 140 px, y: 680 to 910 px
    this.lakeDucks = [
      {
        id: 'duck_1',
        x: 55,
        y: 710,
        targetX: 90,
        targetY: 760,
        speed: 12 + Math.random() * 8, // 12-20 px/sec gentle leisurely swimming
        direction: 'right',
        variant: 'yellow',
        swimTimer: 0,
        quackTimer: 2 + Math.random() * 5,
      },
      {
        id: 'duck_2',
        x: 120,
        y: 790,
        targetX: 60,
        targetY: 820,
        speed: 10 + Math.random() * 8,
        direction: 'left',
        variant: 'mallard',
        swimTimer: 0.5,
        quackTimer: 4 + Math.random() * 5,
      },
      {
        id: 'duck_3',
        x: 80,
        y: 870,
        targetX: 115,
        targetY: 840,
        speed: 11 + Math.random() * 7,
        direction: 'right',
        variant: 'yellow',
        swimTimer: 1.0,
        quackTimer: 6 + Math.random() * 5,
      },
      {
        id: 'duck_4',
        x: 65,
        y: 830,
        targetX: 75,
        targetY: 730,
        speed: 9 + Math.random() * 6,
        direction: 'left',
        variant: 'yellow',
        swimTimer: 1.5,
        quackTimer: 3 + Math.random() * 5,
      },
    ];
  }

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;

    // Preload project thumbnail images for outdoor Mega Jumbotron TV
    if (typeof window !== 'undefined') {
      this.showcaseProjects.forEach((proj) => {
        const img = new Image();
        img.src = proj.imageSrc;
        proj.img = img;
      });
    }

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
   * Breadth-First Search (BFS) shortest pathfinding to navigate around obstacles and long distances
   */
  private findPath(startX: number, startY: number, destX: number, destY: number): Position[] {
    if (startX === destX && startY === destY) return [];

    // If destination itself is solid (e.g. clicked on a building or NPC), find the nearest accessible neighbor
    let targetX = destX;
    let targetY = destY;

    if (tileMap.isSolid(targetX, targetY)) {
      const neighbors = [
        { x: targetX, y: targetY + 1 },
        { x: targetX, y: targetY - 1 },
        { x: targetX + 1, y: targetY },
        { x: targetX - 1, y: targetY },
        { x: targetX + 1, y: targetY + 1 },
        { x: targetX - 1, y: targetY + 1 },
        { x: targetX + 1, y: targetY - 1 },
        { x: targetX - 1, y: targetY - 1 },
      ];

      // Pick accessible neighbor closest to the player
      const valid = neighbors.filter(n => !tileMap.isSolid(n.x, n.y));
      if (valid.length === 0) return [];
      valid.sort((a, b) => Math.hypot(a.x - startX, a.y - startY) - Math.hypot(b.x - startX, b.y - startY));
      targetX = valid[0].x;
      targetY = valid[0].y;
    }

    if (startX === targetX && startY === targetY) return [];

    // Queue stores: current position
    const queue: Position[] = [{ x: startX, y: startY }];
    const visited = new Set<string>();
    visited.add(`${startX},${startY}`);

    // CameFrom map to reconstruct path: 'x,y' -> Position
    const cameFrom = new Map<string, Position>();

    const dirs = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
    ];

    let found = false;

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.x === targetX && curr.y === targetY) {
        found = true;
        break;
      }

      for (const d of dirs) {
        const nx = curr.x + d.x;
        const ny = curr.y + d.y;
        const key = `${nx},${ny}`;

        if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
          if (!visited.has(key) && !tileMap.isSolid(nx, ny)) {
            visited.add(key);
            cameFrom.set(key, curr);
            queue.push({ x: nx, y: ny });
          }
        }
      }
    }

    if (!found) return [];

    // Reconstruct path from target back to start
    const path: Position[] = [];
    let stepKey = `${targetX},${targetY}`;

    while (stepKey !== `${startX},${startY}`) {
      const [sx, sy] = stepKey.split(',').map(Number);
      path.unshift({ x: sx, y: sy });
      const prev = cameFrom.get(stepKey);
      if (!prev) break;
      stepKey = `${prev.x},${prev.y}`;
    }

    return path;
  }

  /**
   * Tap / Click to walk pathfinding with full BFS routing
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
      // Find shortest path from current player position to clicked destination
      const playerTileX = this.state.player.x;
      const playerTileY = this.state.player.y;
      const path = this.findPath(playerTileX, playerTileY, tileX, tileY);

      if (path.length > 0) {
        this.currentPath = path;
        this.targetTile = { x: tileX, y: tileY };
        soundManager.playMenuCursor();
      } else {
        // Direct target attempt as fallback
        this.currentPath = [];
        this.targetTile = { x: tileX, y: tileY };
        soundManager.playMenuCursor();
      }
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
    this.currentPath = [];
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
    const playerCenterX = (player.x + player.subX) * TILE_SIZE + 16;
    const playerCenterY = (player.y + player.subY) * TILE_SIZE + 16;
    const ballCenterX = this.state.football.x + 12;
    const ballCenterY = this.state.football.y + 12;
    const distToBall = Math.hypot(playerCenterX - ballCenterX, playerCenterY - ballCenterY);
    if (distToBall <= 42) {
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
          "Woof! Arf-arf! *wags pixel tail excitedly*",
          "Pixel Pup is healthy and happy thanks to Aritro's Hack4Bengal champion project 'PAWsitive'!",
          "PAWsitive connects pet owners with emergency blood donors and verified clinics. Woof!"
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
    // 1. Mega Jumbotron TV Interaction: cycle showcase on demand & announce broadcast
    if (trigger.type === 'tv') {
      this.tvIndex = (this.tvIndex + 1) % this.showcaseProjects.length;
      this.tvTimer = 0;
      soundManager.playFanfare();
      const proj = this.showcaseProjects[this.tvIndex];
      if (this.onDialogue) {
        this.onDialogue({
          speaker: 'Town Square Jumbotron',
          lines: [
            `⚡ NOW BROADCASTING: ${proj.title} [${proj.badge}] ⚡`,
            `"${proj.tagline}"`,
            `Category: ${proj.category}`,
            "Press [A] to cycle channels, or enter the Pokédex Center to explore live demos and source code!"
          ],
          avatar: 'arcade'
        });
      }
      return;
    }

    // 2. Wishing Fountain Interaction: toss coin & receive developer blessing
    if (trigger.type === 'fountain') {
      soundManager.playFanfare();
      if (this.onDialogue) {
        this.onDialogue({
          speaker: 'Pallet Cloud Wishing Fountain',
          lines: trigger.dialogueText || [
            "You approached the sparkling Pallet Cloud Wishing Fountain.",
            "You tossed in 100 PokéDollars and made a wish for bug-free production deployments!",
            "✨ A refreshing azure mist restored your Pokémon and coding spirit to 100%! ✨"
          ],
          avatar: 'nurse'
        });
      }
      return;
    }

    // 3. Park Benches: take a relaxing breather
    if (trigger.type === 'bench') {
      soundManager.playSelect();
      if (this.onDialogue) {
        this.onDialogue({
          speaker: trigger.name,
          lines: trigger.dialogueText || [
            "You sat down on the comfortable bench and enjoyed the serene view."
          ],
          avatar: 'sign'
        });
      }
      return;
    }

    // Standard building doors & signposts
    if (trigger.targetModal && this.onModalOpen) {
      soundManager.playWarp();
      this.onModalOpen(trigger.targetModal);
    } else if (trigger.dialogueText && this.onDialogue) {
      soundManager.playSelect();
      this.onDialogue({
        speaker: trigger.name,
        lines: trigger.dialogueText,
        avatar: trigger.type === 'sign' ? 'sign' : trigger.type
      });
    }
  }

  private kickFootball() {
    const { player, football } = this.state;
    soundManager.playFanfare();

    const playerCenterX = (player.x + player.subX) * TILE_SIZE + 16;
    const playerCenterY = (player.y + player.subY) * TILE_SIZE + 16;
    const ballCenterX = football.x + 12;
    const ballCenterY = football.y + 12;

    // Relative displacement from player to ball
    let dx = ballCenterX - playerCenterX;
    let dy = ballCenterY - playerCenterY;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;

    // Facing direction vector
    let dirX = 0;
    let dirY = 0;
    if (player.direction === 'right') dirX = 1;
    else if (player.direction === 'left') dirX = -1;
    else if (player.direction === 'down') dirY = 1;
    else if (player.direction === 'up') dirY = -1;

    // Blend facing direction (70%) with direct angle (30%)
    const force = 9.5;
    football.vx = (dirX * 0.7 + dx * 0.3) * force;
    football.vy = (dirY * 0.7 + dy * 0.3) * force;

    // First kick triggers full celebratory commentary with ElevenLabs voice clip
    if (!this.hasKickedFootball && this.onDialogue) {
      this.hasKickedFootball = true;
      this.onDialogue({
        speaker: "Football Match",
        lines: [
          "GOOOOAL! You kicked the soccer ball across Aritro's lawn!",
          "When Aritro isn't coding enterprise pipelines, he's on the football pitch or beatboxing!"
        ],
        avatar: 'arcade'
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
    // Continuous TV showcase timer rotation
    this.tvTimer += dt;
    if (this.tvTimer >= 5.0) {
      this.tvTimer = 0;
      this.tvIndex = (this.tvIndex + 1) % this.showcaseProjects.length;
    }

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

        // Check if stepped into wild grass
        const cell = tileMap.grid[player.y]?.[player.x];
        if (cell?.type === 'tallgrass' && Math.random() < 0.08) {
          this.triggerGrassEncounter();
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

      // If manual directional input exists, cancel automated pathfinding
      if (wantDir) {
        this.currentPath = [];
        this.targetTile = null;
      }

      // Pathfinding: follow precomputed BFS shortest-path nodes
      if (!wantDir && this.currentPath.length > 0) {
        const nextNode = this.currentPath[0];
        const dx = nextNode.x - player.x;
        const dy = nextNode.y - player.y;

        if (dx === 0 && dy === 0) {
          this.currentPath.shift(); // Already at node, move to next
        } else if (dx === 1 && dy === 0) {
          wantDir = 'right';
        } else if (dx === -1 && dy === 0) {
          wantDir = 'left';
        } else if (dx === 0 && dy === 1) {
          wantDir = 'down';
        } else if (dx === 0 && dy === -1) {
          wantDir = 'up';
        } else {
          // Recompute path if player drifted off-course
          if (this.targetTile) {
            this.currentPath = this.findPath(player.x, player.y, this.targetTile.x, this.targetTile.y);
          } else {
            this.currentPath = [];
          }
        }
      }

      // Fallback: direct tap-to-walk direction if no path
      if (!wantDir && this.targetTile) {
        const dx = this.targetTile.x - player.x;
        const dy = this.targetTile.y - player.y;

        if (dx === 0 && dy === 0) {
          this.targetTile = null;
          this.currentPath = [];
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
          // Pop step from path if moving onto it
          if (this.currentPath.length > 0 && this.currentPath[0].x === nextX && this.currentPath[0].y === nextY) {
            this.currentPath.shift();
          }
        } else {
          const now = performance.now();
          if (now - this.lastBumpTime > 300) {
            soundManager.playBump();
            this.lastBumpTime = now;
          }
          this.targetTile = null;
          this.currentPath = [];
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

    // Football physics & obstacle hitbox collision simulation
    const ballSpeed = Math.hypot(football.vx, football.vy);
    if (ballSpeed > 0) {
      this.footballRollAngle += (football.vx + football.vy) * 0.12;

      // Axis-separated movement and obstacle collision detection
      // 1. Move X axis
      const stepX = football.vx;
      if (Math.abs(stepX) > 0.01) {
        const targetX = football.x + stepX;
        const left = targetX + 3;
        const right = targetX + 21;
        const top = football.y + 4;
        const bottom = football.y + 20;

        const minTileX = Math.floor(left / TILE_SIZE);
        const maxTileX = Math.floor(right / TILE_SIZE);
        const minTileY = Math.floor(top / TILE_SIZE);
        const maxTileY = Math.floor(bottom / TILE_SIZE);

        let collidedX = false;
        for (let ty = minTileY; ty <= maxTileY; ty++) {
          for (let tx = minTileX; tx <= maxTileX; tx++) {
            if (tileMap.isSolid(tx, ty)) {
              collidedX = true;
              break;
            }
          }
          if (collidedX) break;
        }

        if (collidedX) {
          if (Math.abs(football.vx) > 1.2) {
            soundManager.playBump();
          }
          football.vx = -football.vx * 0.7;
          if (stepX > 0) {
            football.x = maxTileX * TILE_SIZE - 21 - 0.1;
          } else {
            football.x = (minTileX + 1) * TILE_SIZE - 3 + 0.1;
          }
        } else {
          football.x = targetX;
        }
      }

      // 2. Move Y axis
      const stepY = football.vy;
      if (Math.abs(stepY) > 0.01) {
        const targetY = football.y + stepY;
        const left = football.x + 3;
        const right = football.x + 21;
        const top = targetY + 4;
        const bottom = targetY + 20;

        const minTileX = Math.floor(left / TILE_SIZE);
        const maxTileX = Math.floor(right / TILE_SIZE);
        const minTileY = Math.floor(top / TILE_SIZE);
        const maxTileY = Math.floor(bottom / TILE_SIZE);

        let collidedY = false;
        for (let ty = minTileY; ty <= maxTileY; ty++) {
          for (let tx = minTileX; tx <= maxTileX; tx++) {
            if (tileMap.isSolid(tx, ty)) {
              collidedY = true;
              break;
            }
          }
          if (collidedY) break;
        }

        if (collidedY) {
          if (Math.abs(football.vy) > 1.2) {
            soundManager.playBump();
          }
          football.vy = -football.vy * 0.7;
          if (stepY > 0) {
            football.y = maxTileY * TILE_SIZE - 21 - 0.1;
          } else {
            football.y = (minTileY + 1) * TILE_SIZE - 3 + 0.1;
          }
        } else {
          football.y = targetY;
        }
      }

      // Apply ground friction damping
      football.vx *= 0.93;
      football.vy *= 0.93;
      if (Math.abs(football.vx) < 0.08) football.vx = 0;
      if (Math.abs(football.vy) < 0.08) football.vy = 0;

      // Absolute safety clamp to playable bounds
      football.x = Math.max(33, Math.min((MAP_WIDTH - 2) * TILE_SIZE - 21, football.x));
      football.y = Math.max(33, Math.min((MAP_HEIGHT - 2) * TILE_SIZE - 21, football.y));
    }

    // Player body contact / gentle dribble nudge when walking into ball
    const playerCenterX = (player.x + player.subX) * TILE_SIZE + 16;
    const playerCenterY = (player.y + player.subY) * TILE_SIZE + 16;
    const ballCenterX = football.x + 12;
    const ballCenterY = football.y + 12;
    const distToBall = Math.hypot(playerCenterX - ballCenterX, playerCenterY - ballCenterY);

    if (distToBall < 18 && player.isMoving) {
      if (player.direction === 'right') football.vx = Math.max(football.vx, 3.2);
      else if (player.direction === 'left') football.vx = Math.min(football.vx, -3.2);
      else if (player.direction === 'down') football.vy = Math.max(football.vy, 3.2);
      else if (player.direction === 'up') football.vy = Math.min(football.vy, -3.2);
    }

    // Lake Ducks gentle random swimming simulation
    // Bounds of lake water: x in [42, 148], y in [684, 916]
    const minLakeX = 42;
    const maxLakeX = 146;
    const minLakeY = 684;
    const maxLakeY = 916;

    for (const duck of this.lakeDucks) {
      duck.swimTimer += dt;

      const dx = duck.targetX - duck.x;
      const dy = duck.targetY - duck.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        // Pick new random waypoint in water
        duck.targetX = minLakeX + Math.random() * (maxLakeX - minLakeX);
        duck.targetY = minLakeY + Math.random() * (maxLakeY - minLakeY);
        // Vary speed gently between 9 and 18 px/s
        duck.speed = 9 + Math.random() * 9;
      } else {
        const moveStep = Math.min(dist, duck.speed * dt);
        duck.x += (dx / dist) * moveStep;
        duck.y += (dy / dist) * moveStep;

        if (dx > 1) duck.direction = 'right';
        else if (dx < -1) duck.direction = 'left';
      }
    }
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

        // Render rotating rolling ball
        c.save();
        c.translate(football.x + 12, football.y + 12);
        c.rotate(this.footballRollAngle);
        c.drawImage(ballTile, -12, -12, 24, 24);
        c.restore();
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

    // Swimming Lake Ducks (animated with water ripples and gentle bobbing)
    for (const duck of this.lakeDucks) {
      const duckFrame = Math.floor(duck.swimTimer * 3);
      const duckSprite = spriteGenerator.getDuckSprite(duck.direction, duckFrame, duck.variant);
      const duckBaseY = duck.y + 16;

      renderables.push({
        baseY: duckBaseY,
        draw: (c) => {
          c.drawImage(duckSprite, Math.floor(duck.x), Math.floor(duck.y));
        },
      });
    }

    // 3. True 2.5D Depth Sorting (Painter's Algorithm by baseY)
    renderables.sort((a, b) => a.baseY - b.baseY);

    for (const item of renderables) {
      item.draw(ctx);
    }

    // Render live dynamic outdoor Mega Jumbotron TV screen
    this.renderTvScreen(ctx);

    // Render animated Town Fountain water spray & ripples
    this.renderFountainSpray(ctx);

    // Floating interaction prompt badge when facing/standing at building or NPC
    let targetX = player.x;
    let targetY = player.y;
    if (player.direction === 'up') targetY -= 1;
    else if (player.direction === 'down') targetY += 1;
    else if (player.direction === 'left') targetX -= 1;
    else if (player.direction === 'right') targetX += 1;

    const nearbyTrigger = tileMap.getTriggerAt(targetX, targetY) || tileMap.getTriggerAt(player.x, player.y);
    const nearbyNpc = tileMap.npcs.find(
      (npc) => (npc.x === targetX && npc.y === targetY) || (Math.hypot(npc.x - player.x, npc.y - player.y) <= 1)
    );

    if (nearbyTrigger || nearbyNpc) {
      let promptText = '▲ [A] INTERACT';
      if (nearbyNpc) {
        promptText = '▲ [A] TALK';
      } else if (nearbyTrigger?.type === 'tv') {
        promptText = '▲ [A] CYCLE TV';
      } else if (nearbyTrigger?.type === 'fountain') {
        promptText = '▲ [A] WISH';
      } else if (nearbyTrigger?.type === 'bench') {
        promptText = '▲ [A] REST';
      } else if (nearbyTrigger?.type === 'sign') {
        promptText = '▲ [A] READ';
      } else if (nearbyTrigger?.targetModal) {
        promptText = '▲ [A] ENTER';
      }

      const promptX = playerPx + 16;
      const promptY = playerPy - 10 + Math.sin(performance.now() / 200) * 2;

      ctx.save();
      ctx.font = 'bold 8px monospace';
      const textWidth = ctx.measureText(promptText).width;
      const pad = 4;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(promptX - textWidth / 2 - pad, promptY - 8, textWidth + pad * 2, 12, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(promptText, promptX, promptY - 2);
      ctx.restore();
    }

    // Floating kick prompt badge when player is near the soccer ball
    const distToBallPrompt = Math.hypot(
      playerPx + 16 - (football.x + 12),
      playerPy + 16 - (football.y + 12)
    );
    if (distToBallPrompt <= 44 && !this.isDialogueActive && !this.isModalActive) {
      const promptText = '⚽ [A] KICK';
      const promptX = football.x + 12;
      const promptY = football.y - 12 + Math.sin(performance.now() / 180) * 2.5;

      ctx.save();
      ctx.font = 'bold 8px monospace';
      const textWidth = ctx.measureText(promptText).width;
      const pad = 5;

      // Soft drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.roundRect(promptX - textWidth / 2 - pad + 1, promptY - 7 + 1, textWidth + pad * 2, 13, 4);
      ctx.fill();

      // Pill background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(promptX - textWidth / 2 - pad, promptY - 7, textWidth + pad * 2, 13, 4);
      ctx.fill();
      ctx.stroke();

      // Downward pointer arrow towards the ball
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(promptX - 3, promptY + 6);
      ctx.lineTo(promptX + 3, promptY + 6);
      ctx.lineTo(promptX, promptY + 9);
      ctx.closePath();
      ctx.fill();

      // Badge label
      ctx.fillStyle = '#4ade80';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(promptText, promptX, promptY - 0.5);
      ctx.restore();
    }

    // Render tap-to-walk target waypoint marker if traveling
    if (this.targetTile) {
      const pulse = Math.sin(performance.now() / 150) * 3;
      const targetCenterX = this.targetTile.x * TILE_SIZE + 16;
      const targetCenterY = this.targetTile.y * TILE_SIZE + 16;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetCenterX, targetCenterY, 8 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(targetCenterX, targetCenterY, 3, 0, Math.PI * 2);
      ctx.fill();
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

  /**
   * Renders the live project showcase content inside the outdoor Mega Jumbotron TV
   */
  private renderTvScreen(ctx: CanvasRenderingContext2D) {
    const screenX = 11 * TILE_SIZE + 6;  // 358
    const screenY = 12 * TILE_SIZE + 12; // 396
    const screenW = 116;
    const screenH = 52;

    const proj = this.showcaseProjects[this.tvIndex];
    if (!proj) return;

    ctx.save();

    // Enable high-quality image smoothing for Retina-clear downscaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Screen clipping with rounded corners
    ctx.beginPath();
    ctx.roundRect(screenX, screenY, screenW, screenH, 3);
    ctx.clip();

    // 1. Draw Project Thumbnail Image or High-Tech Circuit Gradient
    if (proj.img && proj.img.complete && proj.img.naturalWidth > 0) {
      ctx.drawImage(proj.img, screenX, screenY, screenW, screenH);
    } else {
      const grad = ctx.createLinearGradient(screenX, screenY, screenX, screenY + screenH);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad;
      ctx.fillRect(screenX, screenY, screenW, screenH);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      for (let x = screenX; x < screenX + screenW; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, screenY);
        ctx.lineTo(x, screenY + screenH);
        ctx.stroke();
      }
    }

    // 2. High-Contrast Bottom Broadcast Banner (deep glass overlay)
    const bannerH = 18;
    ctx.fillStyle = 'rgba(7, 11, 22, 0.94)';
    ctx.fillRect(screenX, screenY + screenH - bannerH, screenW, bannerH);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(screenX, screenY + screenH - bannerH, screenW, 1);

    // Project Title (Clear bold typography)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px system-ui, -apple-system, sans-serif';
    const displayTitle = proj.title.length > 20 ? proj.title.slice(0, 18) + '..' : proj.title;
    ctx.fillText(displayTitle, screenX + 4, screenY + screenH - 10);

    // Project Tech Highlight Badge (Golden tag)
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 6.5px monospace';
    ctx.fillText(proj.badge, screenX + 4, screenY + screenH - 3);

    // 3. Top Status Header: Channel Pill & Live Indicator
    const isBlinkOn = Math.floor(performance.now() / 450) % 2 === 0;

    // Channel badge left
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(screenX + 3, screenY + 3, 34, 8);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 5.5px monospace';
    ctx.fillText(`CH 0${this.tvIndex + 1}/0${this.showcaseProjects.length}`, screenX + 5, screenY + 9);

    // Live badge right
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(screenX + screenW - 28, screenY + 3, 25, 8);
    if (isBlinkOn) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(screenX + screenW - 23, screenY + 7, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 5.5px monospace';
    ctx.fillText('LIVE', screenX + screenW - 18, screenY + 9);

    // 4. Slide Countdown Progress Bar
    const progress = Math.min(1, this.tvTimer / 5.0);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(screenX, screenY + screenH - 2, screenW, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(screenX, screenY + screenH - 2, Math.floor(screenW * progress), 2);

    ctx.restore();
    ctx.imageSmoothingEnabled = false;
  }

  /**
   * Renders animated water spray and pool ripples for the Pallet Cloud Wishing Fountain
   */
  private renderFountainSpray(ctx: CanvasRenderingContext2D) {
    const apexX = 11 * TILE_SIZE + 32; // 208
    const apexY = 5 * TILE_SIZE + 10;  // 90
    const time = performance.now() / 180;

    ctx.save();

    // 1. Spouting Water Droplets (shooting upward and arching down into basin)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const loop = (time + i * 0.4) % 2;
      const progress = loop / 2;
      const r = progress * 10;
      const x = apexX + Math.cos(angle) * r;
      const y = apexY - Math.sin(progress * Math.PI) * 6 + progress * 9;

      ctx.fillRect(Math.floor(x), Math.floor(y), 1.5, 1.5);
    }

    // 2. Sparkling Gem Highlight at Top
    const sparkle = (Math.sin(time * 3) + 1) * 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + sparkle * 0.6})`;
    ctx.fillRect(apexX - 1, apexY - 2, 2, 2);

    // 3. Basin Water Ripples
    const rippleTime = (time * 0.8) % 3;
    const rippleR = 8 + rippleTime * 5;
    ctx.strokeStyle = `rgba(186, 230, 253, ${Math.max(0, 0.4 - rippleTime * 0.12)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(apexX, 5 * TILE_SIZE + 35, rippleR, rippleR * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}

export const gameEngine = new GameEngine();

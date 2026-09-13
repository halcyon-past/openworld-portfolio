import { BuildingTrigger, Entity } from './types';
import { TILE_SIZE, spriteGenerator } from './SpriteGenerator';

export const MAP_WIDTH = 36;
export const MAP_HEIGHT = 30;

export interface TileData {
  type: 'grass' | 'path' | 'water' | 'tallgrass' | 'fence' | 'flower_red' | 'flower_blue' | 'flower_yellow' | 'sign' | 'cliff' | 'stairs';
  solid: boolean;
}

export class TileMap {
  public width = MAP_WIDTH;
  public height = MAP_HEIGHT;
  public grid: TileData[][] = [];
  public triggers: BuildingTrigger[] = [];
  public npcs: Entity[] = [];

  constructor() {
    this.initMap();
    this.initTriggers();
    this.initNpcs();
  }

  private initMap() {
    // 1. Initialize ground with grass
    for (let y = 0; y < MAP_HEIGHT; y++) {
      this.grid[y] = [];
      for (let x = 0; x < MAP_WIDTH; x++) {
        // Outer boundaries solid trees / fences
        const isBorder = x === 0 || y === 0 || x === MAP_WIDTH - 1 || y === MAP_HEIGHT - 1;
        this.grid[y][x] = {
          type: 'grass',
          solid: isBorder,
        };
      }
    }

    // 2. Cobblestone / Sandy main paths connecting all buildings
    // Horizontal highway
    for (let x = 4; x <= 31; x++) {
      this.grid[10][x] = { type: 'path', solid: false };
      this.grid[11][x] = { type: 'path', solid: false };
      this.grid[19][x] = { type: 'path', solid: false };
      this.grid[20][x] = { type: 'path', solid: false };
    }

    // Vertical pathways
    for (let y = 4; y <= 26; y++) {
      // Path by House & Center
      this.grid[y][6] = { type: 'path', solid: false };
      this.grid[y][7] = { type: 'path', solid: false };

      // Central avenue to Silicon Gym & Lab
      this.grid[y][16] = { type: 'path', solid: false };
      this.grid[y][17] = { type: 'path', solid: false };

      // Path to Arcade & Mart
      this.grid[y][27] = { type: 'path', solid: false };
      this.grid[y][28] = { type: 'path', solid: false };
    }

    // 3. Flower beds
    const flowers: [number, number, 'flower_red' | 'flower_blue' | 'flower_yellow'][] = [
      [3, 8, 'flower_red'], [4, 8, 'flower_yellow'], [3, 9, 'flower_blue'],
      [10, 8, 'flower_yellow'], [11, 8, 'flower_red'], [12, 8, 'flower_blue'],
      [24, 8, 'flower_red'], [25, 8, 'flower_yellow'],
      [4, 18, 'flower_blue'], [12, 18, 'flower_yellow'], [24, 18, 'flower_red'],
      [13, 27, 'flower_blue'], [21, 27, 'flower_yellow'],
    ];
    for (const [fx, fy, ftype] of flowers) {
      this.grid[fy][fx] = { type: ftype, solid: false };
    }

    // 4. Tall wild grass patches for encounters
    for (let x = 30; x <= 34; x++) {
      for (let y = 3; y <= 8; y++) {
        this.grid[y][x] = { type: 'tallgrass', solid: false };
      }
      for (let y = 22; y <= 27; y++) {
        this.grid[y][x] = { type: 'tallgrass', solid: false };
      }
    }

    // 5. Scenic South-West Lake / Ocean
    for (let x = 1; x <= 4; x++) {
      for (let y = 21; y <= 28; y++) {
        this.grid[y][x] = { type: 'water', solid: true };
      }
    }

    // 5b. 2.5D North-East Elevated Plateau (Cliff ridge at y: 2 with stairs at x: 27..28)
    for (let x = 25; x <= 34; x++) {
      if (x === 27 || x === 28) {
        this.grid[2][x] = { type: 'stairs', solid: false };
      } else {
        this.grid[2][x] = { type: 'cliff', solid: true };
      }
    }

    // 6. Signposts
    const signs: [number, number][] = [
      [8, 8], [15, 8], [10, 18], [22, 18], [15, 27]
    ];
    for (const [sx, sy] of signs) {
      this.grid[sy][sx] = { type: 'sign', solid: true };
    }

    // 7. Mark solid building footprints
    // House (4x3): x: 3..6, y: 4..6
    this.markSolidBox(3, 4, 4, 3);
    // Lab (5x3): x: 19..23, y: 4..6
    this.markSolidBox(19, 4, 5, 3);
    // Center (4x3): x: 5..8, y: 14..16
    this.markSolidBox(5, 14, 4, 3);
    // Mart (4x3): x: 17..20, y: 14..16
    this.markSolidBox(17, 14, 4, 3);
    // Arcade (4x3): x: 26..29, y: 14..16
    this.markSolidBox(26, 14, 4, 3);
    // Gym (5x4): x: 14..18, y: 22..25
    this.markSolidBox(14, 22, 5, 4);

    // 8. Mark minimal accurate solid footprints for new interactive town scenery
    // Mega Jumbotron TV: only the 4x1 base pillar footprint at row 14 (rows 12, 13, 15, 16, 17, 18 completely open!)
    this.markSolidBox(11, 14, 4, 1);
    // Northern Park Grand Fountain: 3x2 central basin (rows 4, 5, 8, 9 and side columns open)
    this.markSolidBox(11, 6, 3, 2);
    // Town Square Bench: tucked against Center wall at x: 9, y: 13 (1x1)
    this.markSolidBox(9, 13, 1, 1);
    // Northern Garden Bench: x: 15, y: 5 (1x1)
    this.markSolidBox(15, 5, 1, 1);
    // Lakeside Scenic Bench: lake shore at x: 3, y: 23 (1x1, completely clear of column 6-7 pathways!)
    this.markSolidBox(3, 23, 1, 1);
  }

  private markSolidBox(startX: number, startY: number, w: number, h: number) {
    for (let y = startY; y < startY + h; y++) {
      for (let x = startX; x < startX + w; x++) {
        if (this.grid[y] && this.grid[y][x]) {
          this.grid[y][x].solid = true;
        }
      }
    }
  }

  private initTriggers() {
    this.triggers = [
      // House door trigger (x: 5, y: 7)
      {
        id: 'house_door',
        name: "Aritro's Residence",
        x: 5,
        y: 7,
        type: 'house',
        targetModal: 'contact',
        dialogueText: [
          "Welcome to Aritro's House!",
          "Inside you'll find his daily AI news blog 'SiliconSync', beatboxing audio studio, and contact terminal."
        ]
      },
      // Research Lab door trigger (x: 21, y: 7)
      {
        id: 'lab_door',
        name: "Aritro's AI Research Lab",
        x: 21,
        y: 7,
        type: 'lab',
        targetModal: 'trainercard',
        dialogueText: [
          "Entering Aritro's AI Research Lab.",
          "Inspect the mainframe to view Aritro's Trainer Card, research papers, and background!"
        ]
      },
      // Poké Center door trigger (x: 7, y: 17)
      {
        id: 'center_door',
        name: "Innovation Pokédex Center",
        x: 7,
        y: 17,
        type: 'pokedex',
        targetModal: 'pokedex',
        dialogueText: [
          "Welcome to the Innovation Pokédex Center!",
          "Accessing project database: Quarantine, Structurify, Luffy Laser Dodge, GlideConnect, PAWsitive..."
        ]
      },
      // Poké Mart door trigger (x: 19, y: 17)
      {
        id: 'mart_door',
        name: "Skill & Tech Stack Mart",
        x: 19,
        y: 17,
        type: 'mart',
        targetModal: 'bag',
        dialogueText: [
          "Welcome to the Tech Mart!",
          "Browse Aritro's full inventory of Key Items (Python, Next.js), TMs (Docker, GCP), and Battle Tools."
        ]
      },
      // Arcade door trigger (x: 27, y: 17)
      {
        id: 'arcade_door',
        name: "Developer Arcade Corner",
        x: 27,
        y: 17,
        type: 'arcade',
        targetModal: 'arcade',
        dialogueText: [
          "Welcome to the Developer Arcade Corner!",
          "Choose a retro minigame: Developer Speed Test or Minimalist Python Snake!"
        ]
      },
      // Silicon Gym door trigger (x: 16, y: 26)
      {
        id: 'gym_door',
        name: "Silicon Gym (BMS Arena)",
        x: 16,
        y: 26,
        type: 'gym',
        targetModal: 'trainercard',
        dialogueText: [
          "Silicon Gym - Bristol Myers Squibb Arena!",
          "Leader: Aritro Saha (Associate Software Developer & Hack4Bengal 3.0 Champion)."
        ]
      },
      // Sign 1: House
      {
        id: 'sign_house',
        name: 'Notice Board',
        x: 8,
        y: 8,
        type: 'sign',
        dialogueText: [
          "NOTICE: Aritro Saha's House.",
          "'Passionate about building resilient distributed systems and intuitive user interfaces.'"
        ]
      },
      // Sign 2: Lab
      {
        id: 'sign_lab',
        name: 'Notice Board',
        x: 15,
        y: 8,
        type: 'sign',
        dialogueText: [
          "NOTICE: AI & Systems Research Lab.",
          "'Authorized researchers only. Current experiments: LangGraph multi-agent pipelines and Gemini Flash.'"
        ]
      },
      // Sign 3: Center
      {
        id: 'sign_center',
        name: 'Notice Board',
        x: 10,
        y: 18,
        type: 'sign',
        dialogueText: [
          "NOTICE: Innovation Pokédex Center.",
          "'Heal your codebases with zero-crash dead-letter queues like Quarantine!'"
        ]
      },
      // Sign 4: Mart & Arcade
      {
        id: 'sign_mart',
        name: 'Notice Board',
        x: 22,
        y: 18,
        type: 'sign',
        dialogueText: [
          "NOTICE: East District -> Tech Mart & Developer Game Corner.",
          "'Top up on skills and test your typing speed!'"
        ]
      },
      // Sign 5: Gym
      {
        id: 'sign_gym',
        name: 'Notice Board',
        x: 15,
        y: 27,
        type: 'sign',
        dialogueText: [
          "NOTICE: Silicon Gym - Bristol Myers Squibb.",
          "'Home of 8 coveted badges, enterprise pipelines, and Hack4Bengal champions!'"
        ]
      },
      // Town Square Mega Jumbotron TV (Front triggers at x: 12 & 13, y: 15)
      {
        id: 'trigger_tv_1',
        name: 'Mega Jumbotron TV',
        x: 12,
        y: 15,
        type: 'tv',
        targetModal: 'pokedex',
        dialogueText: [
          "⚡ PALLET CLOUD MEGA JUMBOTRON ⚡",
          "Broadcasting live project showcases from Aritro's software engineering portfolio!",
          "Press [A] to cycle channels, or access the terminal inside the Pokédex Center for live demos."
        ]
      },
      {
        id: 'trigger_tv_2',
        name: 'Mega Jumbotron TV',
        x: 13,
        y: 15,
        type: 'tv',
        targetModal: 'pokedex',
        dialogueText: [
          "⚡ PALLET CLOUD MEGA JUMBOTRON ⚡",
          "Broadcasting live project showcases from Aritro's software engineering portfolio!",
          "Press [A] to cycle channels, or access the terminal inside the Pokédex Center for live demos."
        ]
      },
      // Pallet Cloud Wishing Fountain (Front triggers at x: 12 & 13, y: 8)
      {
        id: 'trigger_fountain_1',
        name: 'Pallet Cloud Wishing Fountain',
        x: 12,
        y: 8,
        type: 'fountain',
        dialogueText: [
          "You approached the sparkling Pallet Cloud Wishing Fountain.",
          "You tossed in 100 PokéDollars and made a wish for bug-free production deployments!",
          "✨ A refreshing azure mist restored your Pokémon and coding spirit to 100%! ✨"
        ]
      },
      {
        id: 'trigger_fountain_2',
        name: 'Pallet Cloud Wishing Fountain',
        x: 13,
        y: 8,
        type: 'fountain',
        dialogueText: [
          "You approached the sparkling Pallet Cloud Wishing Fountain.",
          "You tossed in 100 PokéDollars and made a wish for bug-free production deployments!",
          "✨ A refreshing azure mist restored your Pokémon and coding spirit to 100%! ✨"
        ]
      },
      // Town Square Viewing Bench (Beside Center at x: 9, y: 14)
      {
        id: 'trigger_bench_town',
        name: 'Town Square Bench',
        x: 9,
        y: 14,
        type: 'bench',
        dialogueText: [
          "You took a seat on the cozy Town Square Bench.",
          "From here you have a front-row view of the outdoor Mega Jumbotron showcasing Aritro's projects!"
        ]
      },
      // Northern Garden Bench (Front trigger at x: 15, y: 6)
      {
        id: 'trigger_bench_garden',
        name: 'Northern Garden Bench',
        x: 15,
        y: 6,
        type: 'bench',
        dialogueText: [
          "You rested on the wooden garden bench by the fountain.",
          "Listening to the gentle splash of water melts away all stress. Focus and clarity fully restored!"
        ]
      },
      // Lakeside Scenic Bench (Front trigger at x: 3, y: 24)
      {
        id: 'trigger_bench_lake',
        name: 'Lakeside Scenic Bench',
        x: 3,
        y: 24,
        type: 'bench',
        dialogueText: [
          "You sat on the scenic bench overlooking the tranquil blue waters.",
          "'In distributed systems as in life: isolate faults, embrace resilience, and keep moving forward.'"
        ]
      }
    ];
  }

  private initNpcs() {
    this.npcs = [
      {
        id: 'npc_oak',
        name: 'Prof. Oak',
        x: 22,
        y: 8,
        direction: 'down',
        spriteType: 'scientist',
        isMoving: false,
        interactable: true,
        dialogueId: 'dialogue_oak'
      },
      {
        id: 'npc_joy',
        name: 'Nurse Joy',
        x: 8,
        y: 17,
        direction: 'down',
        spriteType: 'nurse',
        isMoving: false,
        interactable: true,
        dialogueId: 'dialogue_joy'
      },
      {
        id: 'npc_clerk',
        name: 'Mart Clerk',
        x: 20,
        y: 18,
        direction: 'left',
        spriteType: 'clerk',
        isMoving: false,
        interactable: true,
        dialogueId: 'dialogue_clerk'
      },
      {
        id: 'npc_gymlead',
        name: 'Aritro Saha (Tech Lead)',
        x: 17,
        y: 27,
        direction: 'down',
        spriteType: 'gymleader',
        isMoving: false,
        interactable: true,
        dialogueId: 'dialogue_gymlead'
      },
      {
        id: 'npc_arcade',
        name: 'Arcade Host',
        x: 28,
        y: 18,
        direction: 'down',
        spriteType: 'arcade',
        isMoving: false,
        interactable: true,
        dialogueId: 'dialogue_arcade'
      },
      {
        id: 'npc_pet',
        name: 'Pixel Pup',
        x: 4,
        y: 7,
        direction: 'right',
        spriteType: 'pet',
        isMoving: false,
        interactable: true,
        dialogueId: 'dialogue_pet'
      }
    ];
  }

  public isSolid(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return true;
    if (this.grid[y][x].solid) return true;

    // Check NPC positions
    for (const npc of this.npcs) {
      if (npc.x === x && npc.y === y) return true;
    }

    return false;
  }

  public getTriggerAt(x: number, y: number): BuildingTrigger | null {
    return this.triggers.find(t => t.x === x && t.y === y) || null;
  }

  public getNpcAt(x: number, y: number): Entity | null {
    return this.npcs.find(n => n.x === x && n.y === y) || null;
  }

  /**
   * Renders flat ground terrain layer onto canvas (grass, paths, water, flowers, cliffs, stairs)
   */
  public renderTerrain(ctx: CanvasRenderingContext2D, animFrame: number) {
    const waterFrame = Math.floor(animFrame / 15);
    const tallgrassFrame = Math.floor(animFrame / 30);

    // 1. Render ground tiles
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const cell = this.grid[y][x];
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        switch (cell.type) {
          case 'path':
            ctx.drawImage(spriteGenerator.getPathTile(), px, py);
            break;
          case 'water':
            ctx.drawImage(spriteGenerator.getWaterTile(waterFrame), px, py);
            break;
          case 'tallgrass':
            ctx.drawImage(spriteGenerator.getTallGrassTile(tallgrassFrame), px, py);
            break;
          case 'fence':
            ctx.drawImage(spriteGenerator.getFenceTile(), px, py);
            break;
          case 'sign':
            ctx.drawImage(spriteGenerator.getSignTile(), px, py);
            break;
          case 'flower_red':
            ctx.drawImage(spriteGenerator.getFlowerTile('red'), px, py);
            break;
          case 'flower_blue':
            ctx.drawImage(spriteGenerator.getFlowerTile('blue'), px, py);
            break;
          case 'flower_yellow':
            ctx.drawImage(spriteGenerator.getFlowerTile('yellow'), px, py);
            break;
          case 'cliff':
            ctx.drawImage(spriteGenerator.getCliffTile('middle'), px, py);
            break;
          case 'stairs':
            ctx.drawImage(spriteGenerator.getStairsTile(), px, py);
            break;
          default:
            ctx.drawImage(spriteGenerator.getGrassTile(), px, py);
            break;
        }
      }
    }
  }

  /**
   * Returns list of all 2.5D scenery objects (trees & buildings) with their Y-depth baseline for sorting
   */
  public getSceneryObjects(): Array<{
    baseY: number;
    draw: (ctx: CanvasRenderingContext2D) => void;
  }> {
    const tree = spriteGenerator.getTreeTile();
    const items: Array<{ baseY: number; draw: (ctx: CanvasRenderingContext2D) => void }> = [];

    // Perimeter trees
    // Top border trees (Y = 0)
    for (let x = 0; x < MAP_WIDTH; x += 2) {
      items.push({
        baseY: 0.8 * TILE_SIZE,
        draw: (ctx) => ctx.drawImage(tree, x * TILE_SIZE - 8, -12),
      });
      // Bottom border trees
      items.push({
        baseY: (MAP_HEIGHT - 0.2) * TILE_SIZE,
        draw: (ctx) => ctx.drawImage(tree, x * TILE_SIZE - 8, (MAP_HEIGHT - 2) * TILE_SIZE),
      });
    }

    // Side border trees
    for (let y = 2; y < MAP_HEIGHT - 2; y += 2) {
      items.push({
        baseY: (y + 1.8) * TILE_SIZE,
        draw: (ctx) => ctx.drawImage(tree, -16, y * TILE_SIZE),
      });
      items.push({
        baseY: (y + 1.8) * TILE_SIZE,
        draw: (ctx) => ctx.drawImage(tree, (MAP_WIDTH - 2) * TILE_SIZE, y * TILE_SIZE),
      });
    }

    // Decorative natural trees (framed around town plaza and fountain)
    const decorativeTrees: [number, number][] = [
      [9, 3], [16, 3], [28, 3],
      [2, 13], [22, 13],
      [8, 22], [22, 22], [28, 24]
    ];
    for (const [tx, ty] of decorativeTrees) {
      items.push({
        baseY: (ty + 1.8) * TILE_SIZE,
        draw: (ctx) => ctx.drawImage(tree, tx * TILE_SIZE, ty * TILE_SIZE),
      });
    }

    // Buildings (baseY set to bottom edge of footprint)
    // House (x: 3, y: 4, width: 4, height: 3 -> base Y is 7 * TILE_SIZE)
    items.push({
      baseY: 7 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getHouseBuilding(), 3 * TILE_SIZE, 4 * TILE_SIZE),
    });

    // Research Lab (x: 19, y: 4, width: 5, height: 3 -> base Y is 7 * TILE_SIZE)
    items.push({
      baseY: 7 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getResearchLab(), 19 * TILE_SIZE, 4 * TILE_SIZE),
    });

    // Poké Center (x: 5, y: 14, width: 4, height: 3 -> base Y is 17 * TILE_SIZE)
    items.push({
      baseY: 17 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getPokemonCenter(), 5 * TILE_SIZE, 14 * TILE_SIZE),
    });

    // Poké Mart (x: 17, y: 14, width: 4, height: 3 -> base Y is 17 * TILE_SIZE)
    items.push({
      baseY: 17 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getPokeMart(), 17 * TILE_SIZE, 14 * TILE_SIZE),
    });

    // Arcade (x: 26, y: 14, width: 4, height: 3 -> base Y is 17 * TILE_SIZE)
    items.push({
      baseY: 17 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getArcadeBuilding(), 26 * TILE_SIZE, 14 * TILE_SIZE),
    });

    // Silicon Gym (x: 14, y: 22, width: 5, height: 4 -> base Y is 26 * TILE_SIZE)
    items.push({
      baseY: 26 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getSiliconGym(), 14 * TILE_SIZE, 22 * TILE_SIZE),
    });

    // --- Interactive Scenery Objects ---
    // Town Square Mega Jumbotron TV (x: 10, y: 12, width: 96px = 6 tiles, base Y: 15 * TILE_SIZE)
    items.push({
      baseY: 15 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getMegaJumbotronTV(), 10 * TILE_SIZE, 12 * TILE_SIZE),
    });

    // Northern Park Grand Wishing Fountain (x: 11, y: 5, width: 64px = 4 tiles, base Y: 8 * TILE_SIZE)
    items.push({
      baseY: 8 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getTownFountain(), 11 * TILE_SIZE, 5 * TILE_SIZE),
    });

    // Town Square Viewing Bench (beside Poké Center at x: 9, y: 13)
    items.push({
      baseY: 14 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getParkBench(), 9 * TILE_SIZE, 13 * TILE_SIZE),
    });

    // Northern Garden Rest Bench (x: 15, y: 5)
    items.push({
      baseY: 6 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getParkBench(), 15 * TILE_SIZE, 5 * TILE_SIZE),
    });

    // Lakeside Scenic Bench (lake shore at x: 3, y: 23, completely clear of path)
    items.push({
      baseY: 24 * TILE_SIZE,
      draw: (ctx) => ctx.drawImage(spriteGenerator.getParkBench(), 3 * TILE_SIZE, 23 * TILE_SIZE),
    });

    return items;
  }
}

export const tileMap = new TileMap();

/**
 * Pixel-Perfect Sprite & Tile Canvas Generator
 * Generates authentic GBA FireRed/Emerald style 16x16 / 32x32 pixel art in memory.
 */

export const TILE_SIZE = 32; // Scaled for modern crisp displays (native 16px rendered at 2x)

export class SpriteGenerator {
  private cache: Map<string, HTMLCanvasElement> = new Map();

  private createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    return [c, ctx];
  }

  // --- Tiles ---

  public getGrassTile(): HTMLCanvasElement {
    const key = 'tile_grass';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    // Base Emerald/FireRed green
    ctx.fillStyle = '#4ade80'; // vibrant grass green
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    // Subtle grass texture pixels
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(4, 6, 4, 4);
    ctx.fillRect(20, 10, 4, 4);
    ctx.fillRect(12, 22, 4, 4);
    ctx.fillRect(24, 26, 4, 4);

    ctx.fillStyle = '#86efac';
    ctx.fillRect(6, 4, 2, 2);
    ctx.fillRect(22, 8, 2, 2);
    ctx.fillRect(14, 20, 2, 2);

    this.cache.set(key, c);
    return c;
  }

  public getTallGrassTile(frame: number = 0): HTMLCanvasElement {
    const key = `tile_tallgrass_${frame % 2}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.drawImage(this.getGrassTile(), 0, 0);

    // Tall wild grass blades
    ctx.fillStyle = '#15803d';
    const offset = (frame % 2) * 2;
    for (let x = 2; x < TILE_SIZE - 4; x += 6) {
      ctx.fillRect(x + offset, 8, 3, 20);
      ctx.fillRect(x + 2 + offset, 4, 2, 24);
    }

    ctx.fillStyle = '#86efac';
    for (let x = 3; x < TILE_SIZE - 4; x += 6) {
      ctx.fillRect(x + offset, 4, 2, 6);
    }

    this.cache.set(key, c);
    return c;
  }

  public getPathTile(): HTMLCanvasElement {
    const key = 'tile_path';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#eab308'; // Warm sandy dirt
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(0, 0, TILE_SIZE, 2);
    ctx.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);
    ctx.fillRect(6, 12, 4, 4);
    ctx.fillRect(18, 6, 4, 4);
    ctx.fillRect(22, 20, 4, 4);

    ctx.fillStyle = '#fde047';
    ctx.fillRect(8, 14, 2, 2);
    ctx.fillRect(20, 8, 2, 2);

    this.cache.set(key, c);
    return c;
  }

  public getWaterTile(frame: number = 0): HTMLCanvasElement {
    const key = `tile_water_${frame % 4}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#38bdf8'; // Sky blue water
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    // Animated ripple lines
    ctx.fillStyle = '#7dd3fc';
    const wave = (frame % 4) * 8;
    ctx.fillRect((wave) % TILE_SIZE, 8, 10, 2);
    ctx.fillRect((wave + 16) % TILE_SIZE, 20, 12, 2);

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, TILE_SIZE, 2);
    ctx.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);

    this.cache.set(key, c);
    return c;
  }

  public getFenceTile(): HTMLCanvasElement {
    const key = 'tile_fence';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.drawImage(this.getGrassTile(), 0, 0);

    // Wooden post and rails
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(4, 6, 6, 22);
    ctx.fillRect(22, 6, 6, 22);
    ctx.fillRect(0, 10, TILE_SIZE, 4);
    ctx.fillRect(0, 20, TILE_SIZE, 4);

    ctx.fillStyle = '#a16207';
    ctx.fillRect(4, 6, 2, 22);
    ctx.fillRect(0, 10, TILE_SIZE, 2);

    this.cache.set(key, c);
    return c;
  }

  public getSignTile(): HTMLCanvasElement {
    const key = 'tile_sign';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.drawImage(this.getGrassTile(), 0, 0);

    // Wooden post
    ctx.fillStyle = '#78350f';
    ctx.fillRect(14, 14, 4, 18);

    // Wooden sign board
    ctx.fillStyle = '#b45309';
    ctx.fillRect(4, 4, 24, 16);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(6, 6, 20, 12);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(8, 9, 16, 2);
    ctx.fillRect(8, 13, 12, 2);

    this.cache.set(key, c);
    return c;
  }

  public getFlowerTile(type: 'red' | 'blue' | 'yellow'): HTMLCanvasElement {
    const key = `tile_flower_${type}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.drawImage(this.getGrassTile(), 0, 0);

    const colors = {
      red: '#ef4444',
      blue: '#3b82f6',
      yellow: '#eab308',
    };

    ctx.fillStyle = colors[type];
    ctx.fillRect(6, 8, 6, 6);
    ctx.fillRect(20, 16, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(8, 10, 2, 2);
    ctx.fillRect(22, 18, 2, 2);

    this.cache.set(key, c);
    return c;
  }

  public getTreeTile(): HTMLCanvasElement {
    const key = 'tile_tree_64';
    if (this.cache.has(key)) return this.cache.get(key)!;

    // Big GBA tree (64x64 = 2x2 tiles)
    const [c, ctx] = this.createCanvas(64, 64);

    // Tree shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(32, 54, 24, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#78350f';
    ctx.fillRect(26, 36, 12, 22);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(26, 36, 4, 22);

    // Leaves canopy (layered emerald green)
    ctx.fillStyle = '#15803d'; // dark shadow
    ctx.beginPath();
    ctx.arc(32, 28, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#16a34a'; // mid tone
    ctx.beginPath();
    ctx.arc(32, 24, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4ade80'; // highlight
    ctx.beginPath();
    ctx.arc(28, 18, 14, 0, Math.PI * 2);
    ctx.fill();

    this.cache.set(key, c);
    return c;
  }

  public getFootballTile(): HTMLCanvasElement {
    const key = 'tile_football';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(24, 24);
    // Ball body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(12, 12, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Black pentagon pattern
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(10, 10, 4, 4);
    ctx.fillRect(6, 6, 3, 3);
    ctx.fillRect(15, 6, 3, 3);
    ctx.fillRect(6, 15, 3, 3);
    ctx.fillRect(15, 15, 3, 3);

    this.cache.set(key, c);
    return c;
  }

  // --- Character Sprites (Player & NPCs) ---

  /**
   * Generates a 32x32 character sprite in 4 directions with walk animation
   */
  public getCharacterSprite(
    type: string,
    direction: 'down' | 'up' | 'left' | 'right',
    stepFrame: number
  ): HTMLCanvasElement {
    const key = `char_${type}_${direction}_${stepFrame % 4}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(32, 32);

    // Config colors per character type
    const palette = this.getCharacterPalette(type);

    // Step wobble offset: 0=idle, 1=left foot, 2=idle, 3=right foot
    const frame = stepFrame % 4;
    const legOffset = frame === 1 ? -2 : frame === 3 ? 2 : 0;
    const bob = frame === 1 || frame === 3 ? -1 : 0;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(16, 28, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    if (direction === 'down') {
      // Legs
      ctx.fillStyle = palette.pants;
      ctx.fillRect(11 + legOffset, 20 + bob, 4, 8);
      ctx.fillRect(17 - legOffset, 20 + bob, 4, 8);
      // Shoes
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(11 + legOffset, 26 + bob, 4, 3);
      ctx.fillRect(17 - legOffset, 26 + bob, 4, 3);

      // Torso / Jacket
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(10, 13 + bob, 12, 9);
      // Collar / Details
      ctx.fillStyle = palette.accent;
      ctx.fillRect(14, 13 + bob, 4, 7);

      // Head & Face
      ctx.fillStyle = palette.skin;
      ctx.fillRect(11, 7 + bob, 10, 7);
      // Eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(13, 9 + bob, 2, 2);
      ctx.fillRect(17, 9 + bob, 2, 2);

      // Hair or Hat
      ctx.fillStyle = palette.hat;
      ctx.fillRect(9, 3 + bob, 14, 5);
      ctx.fillRect(10, 2 + bob, 12, 2);
      // Hat brim / badge
      ctx.fillStyle = palette.hatBrim;
      ctx.fillRect(9, 7 + bob, 14, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(15, 4 + bob, 2, 2);
    } else if (direction === 'up') {
      // Back view
      ctx.fillStyle = palette.pants;
      ctx.fillRect(11 - legOffset, 20 + bob, 4, 8);
      ctx.fillRect(17 + legOffset, 20 + bob, 4, 8);
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(11 - legOffset, 26 + bob, 4, 3);
      ctx.fillRect(17 + legOffset, 26 + bob, 4, 3);

      // Backpack / Jacket back
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(10, 13 + bob, 12, 9);
      ctx.fillStyle = palette.accent; // Backpack
      ctx.fillRect(12, 14 + bob, 8, 7);

      // Back of head
      ctx.fillStyle = palette.hair;
      ctx.fillRect(11, 7 + bob, 10, 7);

      // Hat back
      ctx.fillStyle = palette.hat;
      ctx.fillRect(10, 2 + bob, 12, 6);
    } else if (direction === 'left') {
      // Left profile
      ctx.fillStyle = palette.pants;
      ctx.fillRect(13 + legOffset, 20 + bob, 5, 8);
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(11 + legOffset, 26 + bob, 6, 3);

      ctx.fillStyle = palette.shirt;
      ctx.fillRect(12, 13 + bob, 8, 9);
      ctx.fillStyle = palette.accent; // Backpack strap / side
      ctx.fillRect(16, 14 + bob, 4, 6);

      ctx.fillStyle = palette.skin;
      ctx.fillRect(11, 7 + bob, 8, 7);
      ctx.fillStyle = '#0f172a'; // Left eye
      ctx.fillRect(12, 9 + bob, 2, 2);

      ctx.fillStyle = palette.hat;
      ctx.fillRect(10, 3 + bob, 10, 5);
      ctx.fillStyle = palette.hatBrim;
      ctx.fillRect(8, 7 + bob, 8, 2);
    } else if (direction === 'right') {
      // Right profile
      ctx.fillStyle = palette.pants;
      ctx.fillRect(14 - legOffset, 20 + bob, 5, 8);
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(15 - legOffset, 26 + bob, 6, 3);

      ctx.fillStyle = palette.shirt;
      ctx.fillRect(12, 13 + bob, 8, 9);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(12, 14 + bob, 4, 6);

      ctx.fillStyle = palette.skin;
      ctx.fillRect(13, 7 + bob, 8, 7);
      ctx.fillStyle = '#0f172a'; // Right eye
      ctx.fillRect(18, 9 + bob, 2, 2);

      ctx.fillStyle = palette.hat;
      ctx.fillRect(12, 3 + bob, 10, 5);
      ctx.fillStyle = palette.hatBrim;
      ctx.fillRect(16, 7 + bob, 8, 2);
    }

    this.cache.set(key, c);
    return c;
  }

  private getCharacterPalette(type: string) {
    switch (type) {
      case 'player': // Red / Brendan style trainer
        return {
          hat: '#ef4444',
          hatBrim: '#ffffff',
          hair: '#1e293b',
          skin: '#fed7aa',
          shirt: '#ef4444',
          accent: '#ffffff',
          pants: '#1e3a8a',
          shoes: '#f8fafc',
        };
      case 'scientist': // Prof. Oak style
        return {
          hat: '#f1f5f9',
          hatBrim: '#94a3b8',
          hair: '#94a3b8',
          skin: '#fed7aa',
          shirt: '#ffffff',
          accent: '#dc2626', // red tie
          pants: '#475569',
          shoes: '#0f172a',
        };
      case 'nurse': // Joy style receptionist
        return {
          hat: '#ffffff',
          hatBrim: '#f43f5e',
          hair: '#f43f5e', // Pink hair
          skin: '#ffedd5',
          shirt: '#ffffff',
          accent: '#fb7185',
          pants: '#fda4af',
          shoes: '#ffffff',
        };
      case 'clerk': // Poké Mart clerk
        return {
          hat: '#3b82f6',
          hatBrim: '#1d4ed8',
          hair: '#475569',
          skin: '#fed7aa',
          shirt: '#22c55e', // Green apron
          accent: '#15803d',
          pants: '#1e293b',
          shoes: '#334155',
        };
      case 'gymleader': // BMS Leader / Tech Champ
        return {
          hat: '#0f172a',
          hatBrim: '#3b82f6',
          hair: '#0f172a',
          skin: '#fed7aa',
          shirt: '#1e293b', // Navy blazer
          accent: '#38bdf8', // Blue tech lanyard
          pants: '#0f172a',
          shoes: '#0284c7',
        };
      case 'arcade': // Arcade Gamer
        return {
          hat: '#8b5cf6',
          hatBrim: '#ec4899',
          hair: '#312e81',
          skin: '#fed7aa',
          shirt: '#6366f1',
          accent: '#eab308',
          pants: '#1e1b4b',
          shoes: '#f43f5e',
        };
      case 'pet': // Eevee / Dog companion
        return {
          hat: '#b45309',
          hatBrim: '#d97706',
          hair: '#78350f',
          skin: '#fef3c7',
          shirt: '#b45309',
          accent: '#fde68a',
          pants: '#92400e',
          shoes: '#78350f',
        };
      default:
        return {
          hat: '#64748b',
          hatBrim: '#475569',
          hair: '#334155',
          skin: '#fed7aa',
          shirt: '#0ea5e9',
          accent: '#38bdf8',
          pants: '#1e293b',
          shoes: '#0f172a',
        };
    }
  }

  // --- Buildings ---

  /**
   * Generates a 4x3 tile Pokémon Center (Projects Hub)
   * Width: 128px, Height: 96px
   */
  public getPokemonCenter(): HTMLCanvasElement {
    const key = 'bld_poke_center';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // Wall base
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(8, 32, 112, 64);
    // Lower brick strip
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(8, 80, 112, 16);

    // Red Pitched Roof
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(4, 34);
    ctx.lineTo(64, 4);
    ctx.lineTo(124, 34);
    ctx.fill();

    // White roof trim
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 32, 120, 4);

    // Iconic Pokéball Emblem above door
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(64, 22, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(64, 22, 13, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(64, 22, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Large glass sliding doors
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(48, 54, 32, 42);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(63, 54, 2, 42);

    // Windows
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(16, 48, 20, 24);
    ctx.fillRect(92, 48, 20, 24);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(18, 50, 4, 20);
    ctx.fillRect(94, 50, 4, 20);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 4x3 tile Poké Mart (Skill & Tool Mart)
   * Width: 128px, Height: 96px
   */
  public getPokeMart(): HTMLCanvasElement {
    const key = 'bld_poke_mart';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // Wall base
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(8, 32, 112, 64);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(8, 80, 112, 16);

    // Blue Pitched Roof
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(4, 34);
    ctx.lineTo(64, 4);
    ctx.lineTo(124, 34);
    ctx.fill();

    // Yellow roof trim
    ctx.fillStyle = '#facc15';
    ctx.fillRect(4, 32, 120, 4);

    // "MART" Sign
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(44, 14, 40, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('MART', 52, 26);

    // Glass entrance door
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(52, 54, 24, 42);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(63, 54, 2, 42);

    // Showcase windows
    ctx.fillStyle = '#bfdbfe';
    ctx.fillRect(16, 50, 24, 24);
    ctx.fillRect(88, 50, 24, 24);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 5x4 tile Silicon Gym (Bristol Myers Squibb Arena)
   * Width: 160px, Height: 128px
   */
  public getSiliconGym(): HTMLCanvasElement {
    const key = 'bld_silicon_gym';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(160, 128);

    // Marble stone structure
    ctx.fillStyle = '#334155';
    ctx.fillRect(10, 36, 140, 92);

    // Grand pillars
    ctx.fillStyle = '#64748b';
    ctx.fillRect(16, 44, 16, 84);
    ctx.fillRect(48, 44, 16, 84);
    ctx.fillRect(96, 44, 16, 84);
    ctx.fillRect(128, 44, 16, 84);

    // Temple pediment / roof
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(4, 38);
    ctx.lineTo(80, 4);
    ctx.lineTo(156, 38);
    ctx.fill();

    // Gold battle crest
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(80, 24, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('GYM', 71, 28);

    // Grand double doors
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(68, 76, 24, 52);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(72, 98, 4, 8);
    ctx.fillRect(84, 98, 4, 8);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 5x3 tile Research Lab (Prof. Aritro's Lab)
   * Width: 160px, Height: 96px
   */
  public getResearchLab(): HTMLCanvasElement {
    const key = 'bld_research_lab';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(160, 96);

    // Tech building wall
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(10, 28, 140, 68);

    // Flat roof with tech antenna
    ctx.fillStyle = '#475569';
    ctx.fillRect(6, 18, 148, 12);
    ctx.fillRect(130, 2, 4, 18); // Antenna
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(129, 0, 6, 4); // Blinking red light

    // Signboard "LAB"
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(60, 24, 40, 14);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('AI LAB', 65, 35);

    // Double glass doors
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(68, 50, 24, 46);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(79, 50, 2, 46);

    // High-tech server windows with glowing green racks
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(18, 44, 36, 26);
    ctx.fillRect(106, 44, 36, 26);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(22, 48, 28, 4);
    ctx.fillRect(22, 56, 28, 4);
    ctx.fillRect(110, 48, 28, 4);
    ctx.fillRect(110, 56, 28, 4);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 4x3 tile Developer Arcade (Game Corner)
   * Width: 128px, Height: 96px
   */
  public getArcadeBuilding(): HTMLCanvasElement {
    const key = 'bld_arcade';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // Dark cyberpunk arcade walls
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(8, 28, 112, 68);

    // Neon purple/pink striped awning
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(4, 18, 120, 14);
    ctx.fillStyle = '#ec4899';
    for (let x = 4; x < 124; x += 16) {
      ctx.fillRect(x, 18, 8, 14);
    }

    // Neon "ARCADE" sign
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(36, 8, 56, 14);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('ARCADE', 44, 19);

    // Entrance
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(50, 50, 28, 46);

    // Illuminated game cabinets visible in windows
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(14, 46, 24, 28);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(90, 46, 24, 28);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 4x3 tile Cozy House (Aritro's House)
   * Width: 128px, Height: 96px
   */
  public getHouseBuilding(): HTMLCanvasElement {
    const key = 'bld_house';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // White stucco wall
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(8, 32, 112, 64);

    // Brown tiled roof
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.moveTo(4, 34);
    ctx.lineTo(64, 6);
    ctx.lineTo(124, 34);
    ctx.fill();

    // Chimney
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(94, 2, 12, 20);

    // Wooden door
    ctx.fillStyle = '#78350f';
    ctx.fillRect(52, 54, 24, 42);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(70, 74, 3, 3); // Doorknob

    // Cozy warm windows with curtains
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(18, 48, 20, 22);
    ctx.fillRect(90, 48, 20, 22);
    ctx.fillStyle = '#dc2626'; // red curtains
    ctx.fillRect(18, 48, 4, 22);
    ctx.fillRect(34, 48, 4, 22);
    ctx.fillRect(90, 48, 4, 22);
    ctx.fillRect(106, 48, 4, 22);

    this.cache.set(key, c);
    return c;
  }
}

export const spriteGenerator = new SpriteGenerator();

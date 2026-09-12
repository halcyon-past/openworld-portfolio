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

  // --- 2.5D Terrain Elevation & Cliff Tiles ---

  public getCliffTile(part: 'top' | 'middle' | 'corner_left' | 'corner_right'): HTMLCanvasElement {
    const key = `tile_cliff_${part}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    // Upper plateau grass
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 0, TILE_SIZE, 8);

    // Plateau edge highlight
    ctx.fillStyle = '#86efac';
    ctx.fillRect(0, 7, TILE_SIZE, 2);

    // 2.5D Vertical Rock Cliff Face (Layered stone striations)
    ctx.fillStyle = '#78350f'; // Dark earth base
    ctx.fillRect(0, 9, TILE_SIZE, TILE_SIZE - 9);

    // Midtone rock bands
    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, 10, TILE_SIZE, 8);
    ctx.fillRect(0, 22, TILE_SIZE, 6);

    // Cliff crevices & texture
    ctx.fillStyle = '#451a03';
    ctx.fillRect(4, 12, 6, 4);
    ctx.fillRect(18, 14, 8, 3);
    ctx.fillRect(10, 24, 6, 4);

    // 2.5D Drop shadow cast onto ground below
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, TILE_SIZE - 4, TILE_SIZE, 4);

    this.cache.set(key, c);
    return c;
  }

  public getStairsTile(): HTMLCanvasElement {
    const key = 'tile_stairs';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = '#cbd5e1'; // Stone steps
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    // 4 tier stone steps with 3D riser shadows
    for (let y = 0; y < TILE_SIZE; y += 8) {
      // Step riser (dark shadow)
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, y, TILE_SIZE, 3);
      // Step tread (lit surface)
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, y + 3, TILE_SIZE, 5);
      // Step edge highlight
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, y + 3, TILE_SIZE, 1);
    }

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
   * Generates a volumetric 2.5D character sprite in 4 directions with walk animation and light/shadow facets
   */
  public getCharacterSprite(
    type: string,
    direction: 'down' | 'up' | 'left' | 'right',
    stepFrame: number
  ): HTMLCanvasElement {
    const key = `char_25d_${type}_${direction}_${stepFrame % 4}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(32, 34);

    // Config colors per character type
    const palette = this.getCharacterPalette(type);

    // Step wobble offset: 0=idle, 1=left foot, 2=idle, 3=right foot
    const frame = stepFrame % 4;
    const legOffset = frame === 1 ? -2 : frame === 3 ? 2 : 0;
    const bob = frame === 1 || frame === 3 ? -1 : 0;

    // 2.5D Directional Ground Cast Shadow (Slanted towards bottom-right 135deg)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(17, 30, 9, 3.5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    if (direction === 'down') {
      // 2.5D Legs with shading
      ctx.fillStyle = palette.pants;
      ctx.fillRect(11 + legOffset, 20 + bob, 4, 8);
      ctx.fillRect(17 - legOffset, 20 + bob, 4, 8);
      // Leg shadow facet
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(14 + legOffset, 20 + bob, 1, 8);
      ctx.fillRect(20 - legOffset, 20 + bob, 1, 8);

      // Shoes (2.5D bevel)
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(10 + legOffset, 27 + bob, 5, 3);
      ctx.fillRect(17 - legOffset, 27 + bob, 5, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(10 + legOffset, 29 + bob, 5, 1);
      ctx.fillRect(17 - legOffset, 29 + bob, 5, 1);

      // Torso / Jacket (Volumetric cylinder)
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(9, 13 + bob, 14, 9);
      // Light highlight on left side
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(10, 13 + bob, 3, 9);
      // Dark shading on right side
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(20, 13 + bob, 3, 9);

      // Collar / Inner Accent
      ctx.fillStyle = palette.accent;
      ctx.fillRect(14, 13 + bob, 4, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(15, 15 + bob, 2, 2);

      // Head & Face (Volumetric)
      ctx.fillStyle = palette.skin;
      ctx.fillRect(10, 7 + bob, 12, 7);
      // Face shadow cast by cap brim
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(10, 7 + bob, 12, 2);

      // Expressive Pixel Eyes with highlights
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(12, 10 + bob, 2, 3);
      ctx.fillRect(18, 10 + bob, 2, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12, 10 + bob, 1, 1);
      ctx.fillRect(18, 10 + bob, 1, 1);

      // Hair wisps
      ctx.fillStyle = palette.hair;
      ctx.fillRect(9, 9 + bob, 2, 4);
      ctx.fillRect(21, 9 + bob, 2, 4);

      // 2.5D Cap / Hair (Cylindrical curved crown)
      ctx.fillStyle = palette.hat;
      ctx.fillRect(8, 3 + bob, 16, 5);
      ctx.fillRect(9, 2 + bob, 14, 2);
      // Cap highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(10, 2 + bob, 5, 4);
      // Cap side shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(20, 3 + bob, 4, 5);

      // 2.5D Overhanging Visor Brim
      ctx.fillStyle = palette.hatBrim;
      ctx.fillRect(8, 7 + bob, 16, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(14, 4 + bob, 4, 2); // Trainer emblem / badge
    } else if (direction === 'up') {
      // Back view (Shows 3D backpack)
      ctx.fillStyle = palette.pants;
      ctx.fillRect(11 - legOffset, 20 + bob, 4, 8);
      ctx.fillRect(17 + legOffset, 20 + bob, 4, 8);
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(11 - legOffset, 27 + bob, 4, 3);
      ctx.fillRect(17 + legOffset, 27 + bob, 4, 3);

      // Jacket back
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(9, 13 + bob, 14, 9);

      // 3D Backpack with depth & strap
      ctx.fillStyle = palette.accent;
      ctx.fillRect(11, 13 + bob, 10, 8);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(18, 13 + bob, 3, 8);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(13, 16 + bob, 6, 2); // Zipper flap

      // Back of head & hair
      ctx.fillStyle = palette.hair;
      ctx.fillRect(10, 8 + bob, 12, 6);

      // Hat back
      ctx.fillStyle = palette.hat;
      ctx.fillRect(9, 2 + bob, 14, 7);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(18, 2 + bob, 5, 7);
    } else if (direction === 'left') {
      // Left profile
      ctx.fillStyle = palette.pants;
      ctx.fillRect(13 + legOffset, 20 + bob, 5, 8);
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(10 + legOffset, 27 + bob, 7, 3);

      ctx.fillStyle = palette.shirt;
      ctx.fillRect(12, 13 + bob, 9, 9);
      // 3D Backpack on back
      ctx.fillStyle = palette.accent;
      ctx.fillRect(17, 13 + bob, 5, 8);

      ctx.fillStyle = palette.skin;
      ctx.fillRect(11, 7 + bob, 9, 7);
      // Left eye
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(12, 10 + bob, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12, 10 + bob, 1, 1);

      // Hat & forward visor
      ctx.fillStyle = palette.hat;
      ctx.fillRect(10, 3 + bob, 11, 5);
      ctx.fillStyle = palette.hatBrim;
      ctx.fillRect(7, 7 + bob, 10, 2); // Visor sticking forward
    } else if (direction === 'right') {
      // Right profile (Lit side)
      ctx.fillStyle = palette.pants;
      ctx.fillRect(14 - legOffset, 20 + bob, 5, 8);
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(15 - legOffset, 27 + bob, 7, 3);

      ctx.fillStyle = palette.shirt;
      ctx.fillRect(11, 13 + bob, 9, 9);
      // Light highlight
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(15, 13 + bob, 3, 9);

      // Backpack on far side
      ctx.fillStyle = palette.accent;
      ctx.fillRect(10, 13 + bob, 4, 7);

      ctx.fillStyle = palette.skin;
      ctx.fillRect(12, 7 + bob, 9, 7);
      // Right eye
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(18, 10 + bob, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(18, 10 + bob, 1, 1);

      // Hat & forward visor
      ctx.fillStyle = palette.hat;
      ctx.fillRect(11, 3 + bob, 11, 5);
      ctx.fillStyle = palette.hatBrim;
      ctx.fillRect(15, 7 + bob, 10, 2); // Visor sticking forward
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

  // --- 2.5D Volumetric Oblique Buildings ---

  /**
   * Generates a 4x3 tile 2.5D Pokémon Center (Projects Hub)
   * Width: 128px, Height: 96px
   */
  public getPokemonCenter(): HTMLCanvasElement {
    const key = 'bld_25d_poke_center';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // 2.5D Soft Ground Shadow beneath building
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(64, 92, 60, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2.5D Right Lateral Wall (shaded face showing depth)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(116, 36, 8, 56);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(116, 76, 8, 16);

    // Front Wall (Primary lit facade)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(8, 36, 108, 56);
    // Lower stone wainscot
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(8, 76, 108, 16);

    // 2.5D Overhanging Red Slanted Roof
    // Main roof face (slanted towards viewer)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(4, 38);
    ctx.lineTo(24, 6);
    ctx.lineTo(104, 6);
    ctx.lineTo(124, 38);
    ctx.closePath();
    ctx.fill();

    // 2.5D Right Roof Chamfer / Shade (Darker red)
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(104, 6);
    ctx.lineTo(112, 10);
    ctx.lineTo(126, 38);
    ctx.lineTo(124, 38);
    ctx.closePath();
    ctx.fill();

    // Roof Highlight ridge
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(24, 6, 80, 4);

    // White Roof Overhang Eaves (creates 3D shelf)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 36, 124, 5);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(2, 40, 124, 2); // Eave underside shadow

    // 2.5D Iconic Pokéball Center Marquee (Pops off roof)
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(64, 23, 16, 0, Math.PI * 2);
    ctx.fill(); // Cast shadow on roof

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(64, 21, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(64, 21, 14, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(64, 21, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2.5D Recessed Glass Entrance (Dark inner arch)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(46, 50, 36, 44); // Recessed door frame
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(49, 53, 30, 41);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(63, 53, 2, 41);
    // Glass specular reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(50, 90);
    ctx.lineTo(75, 54);
    ctx.lineTo(67, 54);
    ctx.lineTo(49, 80);
    ctx.fill();

    // 2.5D Bay Windows with bevels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(14, 46, 24, 26);
    ctx.fillRect(86, 46, 24, 26);
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(16, 48, 20, 22);
    ctx.fillRect(88, 48, 20, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(18, 50, 4, 18);
    ctx.fillRect(90, 50, 4, 18);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 4x3 tile 2.5D Poké Mart (Skill Mart)
   * Width: 128px, Height: 96px
   */
  public getPokeMart(): HTMLCanvasElement {
    const key = 'bld_25d_poke_mart';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // 2.5D Soft Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(64, 92, 60, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right Lateral Wall (shaded face)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(116, 36, 8, 56);

    // Front Wall
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(8, 36, 108, 56);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(8, 76, 108, 16);

    // 2.5D Pitched Blue Roof
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(4, 38);
    ctx.lineTo(24, 6);
    ctx.lineTo(104, 6);
    ctx.lineTo(124, 38);
    ctx.closePath();
    ctx.fill();

    // Right roof shadow facet
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.moveTo(104, 6);
    ctx.lineTo(112, 10);
    ctx.lineTo(126, 38);
    ctx.lineTo(124, 38);
    ctx.closePath();
    ctx.fill();

    // Yellow Roof Trim with 3D eave
    ctx.fillStyle = '#facc15';
    ctx.fillRect(2, 36, 124, 5);
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(2, 40, 124, 2);

    // 2.5D Extruded "MART" Marquee
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(42, 14, 46, 20); // Marquee shadow
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(40, 12, 46, 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(42, 14, 42, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('MART', 48, 26);

    // 2.5D Recessed Automatic Doors
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(50, 50, 28, 44);
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(52, 53, 24, 41);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(63, 53, 2, 41);

    // Showcase Glass Displays
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(14, 48, 26, 24);
    ctx.fillRect(88, 48, 26, 24);
    ctx.fillStyle = '#bfdbfe';
    ctx.fillRect(16, 50, 22, 20);
    ctx.fillRect(90, 50, 22, 20);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 5x4 tile 2.5D Silicon Gym (BMS Arena)
   * Width: 160px, Height: 128px
   */
  public getSiliconGym(): HTMLCanvasElement {
    const key = 'bld_25d_silicon_gym';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(160, 128);

    // Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(80, 124, 76, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right lateral shaded stone wall
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(146, 38, 10, 86);

    // Front stone wall
    ctx.fillStyle = '#334155';
    ctx.fillRect(8, 38, 138, 86);

    // 2.5D Grand Pediment / Triangular Portico Roof
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(2, 40);
    ctx.lineTo(80, 4);
    ctx.lineTo(154, 40);
    ctx.closePath();
    ctx.fill();

    // Portico Overhang Eaves
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 38, 156, 6);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 43, 156, 3); // Deep shadow under roof cornice

    // 2.5D Volumetric Pillars (Curved lighting)
    const pillarPositions = [14, 44, 102, 132];
    for (const px of pillarPositions) {
      // Pillar shadow cast behind
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(px + 4, 46, 18, 78);
      // Main pillar
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px, 46, 16, 78);
      // Left highlight
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(px, 46, 4, 78);
      // Right shadow
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 12, 46, 4, 78);
      // Pillar capital & base
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(px - 2, 44, 20, 4);
      ctx.fillRect(px - 2, 120, 20, 4);
    }

    // Gold Gym Emblem Shield
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.arc(80, 24, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(80, 22, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(77, 19, 4, 0, Math.PI * 2);
    ctx.fill(); // Specular shine
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('BMS', 71, 26);

    // 2.5D Recessed Double Doors with Brass Hardware
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(66, 74, 28, 50);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(68, 76, 24, 48);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(72, 98, 4, 10);
    ctx.fillRect(84, 98, 4, 10);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 5x3 tile 2.5D Research Lab (Prof. Aritro's Lab)
   * Width: 160px, Height: 96px
   */
  public getResearchLab(): HTMLCanvasElement {
    const key = 'bld_25d_research_lab';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(160, 96);

    // Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(80, 92, 74, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right lateral wall
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(146, 32, 10, 60);

    // Front high-tech wall
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(8, 32, 138, 60);

    // 2.5D Flat Roof with 3D AC Vents & High-Tech Antenna
    ctx.fillStyle = '#475569';
    ctx.fillRect(4, 20, 150, 14);
    ctx.fillStyle = '#334155';
    ctx.fillRect(4, 30, 150, 4); // Roof overhang shadow

    // 3D Rooftop AC Unit
    ctx.fillStyle = '#64748b';
    ctx.fillRect(20, 10, 24, 12);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(20, 10, 24, 3);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(24, 14, 16, 2);
    ctx.fillRect(24, 18, 16, 2);

    // Tech Antenna Mast with blinking beacon
    ctx.fillStyle = '#64748b';
    ctx.fillRect(130, 2, 4, 20);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(129, 0, 6, 5); // Warning Beacon

    // Signboard "AI LAB"
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(58, 25, 44, 16);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(56, 23, 44, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('AI LAB', 62, 35);

    // 2.5D Recessed Glass Portal
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(66, 48, 28, 44);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(68, 50, 24, 42);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(79, 50, 2, 42);

    // Server Window bays with glowing green terminal racks
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 44, 38, 28);
    ctx.fillRect(104, 44, 38, 28);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(20, 48, 30, 4);
    ctx.fillRect(20, 56, 30, 4);
    ctx.fillRect(20, 64, 30, 4);
    ctx.fillRect(108, 48, 30, 4);
    ctx.fillRect(108, 56, 30, 4);
    ctx.fillRect(108, 64, 30, 4);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 4x3 tile 2.5D Developer Arcade
   * Width: 128px, Height: 96px
   */
  public getArcadeBuilding(): HTMLCanvasElement {
    const key = 'bld_25d_arcade';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(64, 92, 60, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right lateral wall
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(116, 32, 8, 60);

    // Dark cyberpunk neon wall
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(8, 32, 108, 60);

    // 2.5D Striped Neon Awning
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(2, 20, 124, 16);
    ctx.fillStyle = '#ec4899';
    for (let x = 2; x < 124; x += 16) {
      ctx.fillRect(x, 20, 8, 16);
    }
    // Awning underside shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(2, 34, 124, 4);

    // Neon "ARCADE" Marquee Sign
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(36, 8, 56, 16);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(34, 6, 56, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('ARCADE', 42, 18);

    // Glowing Entrance
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(48, 48, 32, 44);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(50, 50, 28, 42);

    // Illuminated Game Cabinets inside windows
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(14, 46, 26, 28);
    ctx.fillRect(88, 46, 26, 28);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(16, 48, 22, 24);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(90, 48, 22, 24);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 4x3 tile 2.5D Cozy House
   * Width: 128px, Height: 96px
   */
  public getHouseBuilding(): HTMLCanvasElement {
    const key = 'bld_25d_house';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(64, 92, 60, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right lateral shaded wall
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(116, 36, 8, 56);

    // Front Wall
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(8, 36, 108, 56);

    // 2.5D Brown Tiled Roof with Overhang
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.moveTo(4, 38);
    ctx.lineTo(24, 6);
    ctx.lineTo(104, 6);
    ctx.lineTo(124, 38);
    ctx.closePath();
    ctx.fill();

    // Right roof shadow facet
    ctx.fillStyle = '#9a3412';
    ctx.beginPath();
    ctx.moveTo(104, 6);
    ctx.lineTo(112, 10);
    ctx.lineTo(126, 38);
    ctx.lineTo(124, 38);
    ctx.closePath();
    ctx.fill();

    // Roof Eave Overhang
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(2, 36, 124, 5);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(2, 40, 124, 2);

    // 3D Brick Chimney
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(92, 2, 14, 20);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(102, 2, 4, 20); // Chimney shadow side
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(90, 0, 18, 3); // Chimney cap

    // Wooden door with brass knob
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(50, 52, 28, 40);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(52, 54, 24, 38);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(70, 74, 3, 3);

    // Cozy lit windows with red curtains
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 46, 24, 24);
    ctx.fillRect(88, 46, 24, 24);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(18, 48, 20, 20);
    ctx.fillRect(90, 48, 20, 20);
    ctx.fillStyle = '#dc2626'; // curtains
    ctx.fillRect(18, 48, 4, 20);
    ctx.fillRect(34, 48, 4, 20);
    ctx.fillRect(90, 48, 4, 20);
    ctx.fillRect(106, 48, 4, 20);

    this.cache.set(key, c);
    return c;
  }
}

export const spriteGenerator = new SpriteGenerator();

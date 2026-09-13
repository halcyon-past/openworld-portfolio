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

  // --- Rich Stylized HD Tiles ---

  public getGrassTile(): HTMLCanvasElement {
    const key = 'tile_grass_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    // Base lush emerald green with gradient depth
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    // Deep meadow under-shading
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, 0, TILE_SIZE, 3);
    ctx.fillRect(0, 16, TILE_SIZE, 2);

    // Multiple layered grass blade clusters
    const darkBlades = [
      [2, 6], [3, 5], [6, 18], [7, 17], [14, 8], [15, 7],
      [22, 12], [23, 11], [18, 24], [19, 23], [26, 4], [27, 3],
      [10, 26], [11, 25], [28, 22], [29, 21], [4, 12], [12, 14]
    ];
    ctx.fillStyle = '#15803d';
    for (const [x, y] of darkBlades) {
      ctx.fillRect(x, y, 2, 4);
      ctx.fillRect(x + 1, y - 1, 2, 3);
    }

    // Bright sunlit dewdrop highlights
    const brightBlades = [
      [3, 4], [7, 16], [15, 6], [23, 10], [19, 22], [27, 2],
      [11, 24], [29, 20], [8, 8], [24, 18], [16, 16]
    ];
    ctx.fillStyle = '#86efac';
    for (const [x, y] of brightBlades) {
      ctx.fillRect(x, y, 2, 2);
    }

    // Extra micro-pixel noise for texture depth
    ctx.fillStyle = '#4ade80';
    for (let x = 1; x < TILE_SIZE; x += 4) {
      for (let y = 2; y < TILE_SIZE; y += 5) {
        ctx.fillRect((x * 7) % TILE_SIZE, (y * 11) % TILE_SIZE, 1, 2);
      }
    }

    this.cache.set(key, c);
    return c;
  }

  public getTallGrassTile(frame: number = 0): HTMLCanvasElement {
    const key = `tile_tallgrass_hd_${frame % 2}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.drawImage(this.getGrassTile(), 0, 0);

    const sway = (frame % 2) * 2;

    // Layer 1: Dark background wild grass silhouettes
    ctx.fillStyle = '#14532d';
    for (let x = 2; x < TILE_SIZE - 2; x += 5) {
      ctx.fillRect(x + sway, 6, 3, 26);
      ctx.fillRect(x - 1 + sway, 10, 2, 22);
    }

    // Layer 2: Vibrant wild blade stalks with tapered tips
    ctx.fillStyle = '#15803d';
    for (let x = 1; x < TILE_SIZE - 2; x += 5) {
      ctx.fillRect(x + sway, 8, 3, 24);
      ctx.fillRect(x + 1 + sway, 4, 2, 6);
      ctx.fillRect(x + 2 + sway, 2, 1, 4);
    }

    // Layer 3: Sunlit blade highlights & seed pods
    ctx.fillStyle = '#4ade80';
    for (let x = 2; x < TILE_SIZE - 3; x += 5) {
      ctx.fillRect(x + sway, 4, 1, 8);
      ctx.fillRect(x + 1 + sway, 2, 1, 3);
    }

    ctx.fillStyle = '#bbf7d0';
    for (let x = 3; x < TILE_SIZE - 4; x += 6) {
      ctx.fillRect(x + sway, 1, 2, 2); // Pollen / flower tip
    }

    this.cache.set(key, c);
    return c;
  }

  public getPathTile(): HTMLCanvasElement {
    const key = 'tile_path_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    // Base warm cobblestone / sandy terracotta dirt
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    // Stone paving blocks with chiseled mortar grooves
    const stones = [
      { x: 1, y: 1, w: 14, h: 9 },
      { x: 17, y: 1, w: 14, h: 9 },
      { x: 1, y: 11, w: 9, h: 9 },
      { x: 12, y: 11, w: 12, h: 9 },
      { x: 26, y: 11, w: 5, h: 9 },
      { x: 1, y: 21, w: 14, h: 10 },
      { x: 17, y: 21, w: 14, h: 10 },
    ];

    // Mortar groove lines (dark shadow)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    for (const s of stones) {
      // Stone body
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(s.x, s.y, s.w, s.h);

      // Stone top/left bevel highlight
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(s.x, s.y, s.w, 1);
      ctx.fillRect(s.x, s.y, 1, s.h);

      // Stone bottom/right bevel shadow
      ctx.fillStyle = '#b45309';
      ctx.fillRect(s.x, s.y + s.h - 1, s.w, 1);
      ctx.fillRect(s.x + s.w - 1, s.y, 1, s.h);

      // Speckled pebble texture
      ctx.fillStyle = '#d97706';
      ctx.fillRect(s.x + 3, s.y + 3, 2, 2);
      ctx.fillRect(s.x + s.w - 4, s.y + s.h - 4, 2, 2);
    }

    this.cache.set(key, c);
    return c;
  }

  public getWaterTile(frame: number = 0): HTMLCanvasElement {
    const key = `tile_water_hd_${frame % 4}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    // Deep crystal ocean base gradient
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    // Deep water depth bands
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 4, TILE_SIZE, 8);
    ctx.fillRect(0, 20, TILE_SIZE, 8);

    // Animated water caustics & gentle crest ripples
    const offset1 = (frame % 4) * 8;
    const offset2 = ((frame + 2) % 4) * 8;

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect((offset1) % TILE_SIZE, 6, 12, 3);
    ctx.fillRect((offset1 + 18) % TILE_SIZE, 10, 10, 2);
    ctx.fillRect((offset2) % TILE_SIZE, 22, 14, 3);
    ctx.fillRect((offset2 + 16) % TILE_SIZE, 18, 8, 2);

    // Brilliant white foam sparkle glints
    ctx.fillStyle = '#ffffff';
    ctx.fillRect((offset1 + 4) % TILE_SIZE, 7, 3, 1);
    ctx.fillRect((offset2 + 5) % TILE_SIZE, 23, 4, 1);
    ctx.fillRect((offset1 + 22) % TILE_SIZE, 11, 2, 1);

    // Translucent shoreline edge gradient
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(0, 0, TILE_SIZE, 2);
    ctx.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);

    this.cache.set(key, c);
    return c;
  }

  public getFenceTile(): HTMLCanvasElement {
    const key = 'tile_fence_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.drawImage(this.getGrassTile(), 0, 0);

    // Ground cast shadow under fence
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fillRect(2, 28, 10, 3);
    ctx.fillRect(20, 28, 10, 3);

    // 2.5D Wooden Posts with grain and bevel
    const posts = [4, 22];
    for (const px of posts) {
      // Post main body
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(px, 4, 7, 24);

      // Post left highlight
      ctx.fillStyle = '#d97706';
      ctx.fillRect(px, 4, 2, 24);

      // Post right shadow
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px + 5, 4, 2, 24);

      // Post top point
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px + 2, 2, 3, 2);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(px + 1, 3, 5, 1);
    }

    // Horizontal Rails with bevel
    const rails = [10, 20];
    for (const ry of rails) {
      // Rail shadow underneath
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(0, ry + 4, TILE_SIZE, 2);

      // Rail body
      ctx.fillStyle = '#a16207';
      ctx.fillRect(0, ry, TILE_SIZE, 4);

      // Rail top highlight
      ctx.fillStyle = '#fde047';
      ctx.fillRect(0, ry, TILE_SIZE, 1);

      // Rail bottom shadow
      ctx.fillStyle = '#713f12';
      ctx.fillRect(0, ry + 3, TILE_SIZE, 1);
    }

    this.cache.set(key, c);
    return c;
  }

  public getSignTile(): HTMLCanvasElement {
    const key = 'tile_sign_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.drawImage(this.getGrassTile(), 0, 0);

    // Sign ground shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fillRect(10, 28, 12, 3);

    // Wooden sturdy post
    ctx.fillStyle = '#78350f';
    ctx.fillRect(13, 14, 6, 16);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(13, 14, 2, 16);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(17, 14, 2, 16);

    // Signboard outer wood rim
    ctx.fillStyle = '#451a03';
    ctx.fillRect(2, 2, 28, 18);

    // Signboard face
    ctx.fillStyle = '#d97706';
    ctx.fillRect(4, 4, 24, 14);

    // Paper notice pinned to board
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(6, 6, 20, 10);
    // Gold thumbtack
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(15, 5, 2, 2);

    // Micro text lines
    ctx.fillStyle = '#475569';
    ctx.fillRect(8, 9, 16, 1);
    ctx.fillRect(8, 11, 14, 1);
    ctx.fillRect(8, 13, 10, 1);

    this.cache.set(key, c);
    return c;
  }

  public getFlowerTile(type: 'red' | 'blue' | 'yellow'): HTMLCanvasElement {
    const key = `tile_flower_hd_${type}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(TILE_SIZE, TILE_SIZE);
    ctx.drawImage(this.getGrassTile(), 0, 0);

    const petals = {
      red: { base: '#dc2626', light: '#f87171', center: '#fef08a' },
      blue: { base: '#2563eb', light: '#60a5fa', center: '#ffffff' },
      yellow: { base: '#d97706', light: '#fde047', center: '#ffffff' },
    }[type];

    const clusters = [
      { cx: 9, cy: 11 },
      { cx: 23, cy: 19 },
      { cx: 14, cy: 23 },
    ];

    for (const cl of clusters) {
      // Stems & green leaf blades
      ctx.fillStyle = '#15803d';
      ctx.fillRect(cl.cx - 1, cl.cy + 3, 2, 4);
      ctx.fillRect(cl.cx + 1, cl.cy + 4, 3, 2);

      // Petals (4-leaf blossom)
      ctx.fillStyle = petals.base;
      ctx.fillRect(cl.cx - 3, cl.cy - 1, 7, 4);
      ctx.fillRect(cl.cx - 1, cl.cy - 3, 4, 7);

      // Petal highlights
      ctx.fillStyle = petals.light;
      ctx.fillRect(cl.cx - 2, cl.cy - 2, 2, 2);
      ctx.fillRect(cl.cx + 1, cl.cy - 2, 2, 2);

      // Flower golden pollen center
      ctx.fillStyle = petals.center;
      ctx.fillRect(cl.cx, cl.cy, 2, 2);
    }

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
    const key = 'tile_tree_64_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    // Big GBA tree (64x64 = 2x2 tiles)
    const [c, ctx] = this.createCanvas(64, 64);

    // 1. 2.5D Directional Ground Cast Shadow (deep realistic drop shadow)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(36, 56, 26, 7, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // 2. Volumetric Wood Trunk & Roots
    // Roots spreading into ground
    ctx.fillStyle = '#451a03';
    ctx.fillRect(20, 52, 24, 6);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(22, 50, 20, 8);

    // Main Trunk with vertical bark grooves
    ctx.fillStyle = '#78350f';
    ctx.fillRect(25, 34, 14, 22);

    // Left lit trunk edge
    ctx.fillStyle = '#b45309';
    ctx.fillRect(25, 34, 3, 22);

    // Right dark bark groove & shadow
    ctx.fillStyle = '#451a03';
    ctx.fillRect(35, 34, 4, 22);
    ctx.fillRect(30, 38, 2, 14);

    // 3. Volumetric Multi-Clustered Leaf Canopy (FireRed / Octopath style lush foliage)
    // Deep Under-Canopy Shadow Spheres
    const darkSpheres = [
      { x: 22, y: 28, r: 16 },
      { x: 42, y: 28, r: 16 },
      { x: 32, y: 32, r: 17 },
      { x: 32, y: 18, r: 18 },
    ];
    ctx.fillStyle = '#14532d'; // Deepest forest green
    for (const s of darkSpheres) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mid-tone Foliage Clusters
    const midSpheres = [
      { x: 21, y: 26, r: 14 },
      { x: 41, y: 26, r: 14 },
      { x: 32, y: 16, r: 16 },
      { x: 25, y: 14, r: 13 },
      { x: 39, y: 14, r: 13 },
    ];
    ctx.fillStyle = '#16a34a'; // Vibrant leaf mid-tone
    for (const s of midSpheres) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Upper Sunlit Leaf Highlights (Top-Left 135deg sunlight)
    const litSpheres = [
      { x: 19, y: 23, r: 11 },
      { x: 38, y: 22, r: 10 },
      { x: 29, y: 13, r: 13 },
      { x: 24, y: 10, r: 9 },
    ];
    ctx.fillStyle = '#22c55e';
    for (const s of litSpheres) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Intense Crest Highlights & Leaf Tufts
    const topHighlights = [
      { x: 27, y: 8, r: 7 },
      { x: 18, y: 20, r: 6 },
      { x: 36, y: 19, r: 5 },
    ];
    ctx.fillStyle = '#86efac';
    for (const s of topHighlights) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Leaf tuft texture pixels across canopy
    ctx.fillStyle = '#bbf7d0';
    ctx.fillRect(26, 6, 3, 2);
    ctx.fillRect(16, 18, 3, 2);
    ctx.fillRect(34, 17, 3, 2);

    this.cache.set(key, c);
    return c;
  }

  public getFootballTile(): HTMLCanvasElement {
    const key = 'tile_football';
    if (this.cache.has(key)) return this.cache.get(key)!;

    // 48x48 Retina canvas for ultra-crisp display at 24x24 world size
    const [c, ctx] = this.createCanvas(48, 48);
    ctx.imageSmoothingEnabled = true;

    const cx = 24;
    const cy = 24;
    const r = 20;

    // 1. Clip to circular sphere boundary
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // 2. Base sphere surface with realistic spherical gradient
    const sphereGrad = ctx.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, r);
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.65, '#f1f5f9');
    sphereGrad.addColorStop(0.88, '#cbd5e1');
    sphereGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = sphereGrad;
    ctx.fillRect(0, 0, 48, 48);

    // 3. Authentic Truncated Icosahedron (Telstar) Soccer Ball Panel Geometry
    const rot = -Math.PI / 2;
    const r_center = 7.2; // Central pentagon radius

    // 5 vertices of central black pentagon
    const pentagon_pts: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < 5; i++) {
      const a = rot + i * (2 * Math.PI / 5);
      pentagon_pts.push({ x: cx + r_center * Math.cos(a), y: cy + r_center * Math.sin(a) });
    }

    // Outer black pentagons centered along vertex rays
    const r_outer_center = 17.2;
    const r_outer_size = 5.2;
    const outer_pentagons: Array<Array<{ x: number; y: number }>> = [];

    for (let i = 0; i < 5; i++) {
      const a_v = rot + i * (2 * Math.PI / 5);
      const ocx = cx + r_outer_center * Math.cos(a_v);
      const ocy = cy + r_outer_center * Math.sin(a_v);
      const opts: Array<{ x: number; y: number }> = [];
      for (let j = 0; j < 5; j++) {
        const aj = a_v + Math.PI + j * (2 * Math.PI / 5);
        opts.push({ x: ocx + r_outer_size * Math.cos(aj), y: ocy + r_outer_size * Math.sin(aj) });
      }
      outer_pentagons.push(opts);
    }

    // Draw panel stitching seams
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(pentagon_pts[i].x, pentagon_pts[i].y);
      ctx.lineTo(outer_pentagons[i][0].x, outer_pentagons[i][0].y);
      ctx.stroke();

      const p_curr = outer_pentagons[i];
      const p_next = outer_pentagons[(i + 1) % 5];
      ctx.beginPath();
      ctx.moveTo(p_curr[2].x, p_curr[2].y);
      ctx.lineTo(p_next[3].x, p_next[3].y);
      ctx.stroke();
    }

    // Draw outer black pentagons
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.2;
    for (const opts of outer_pentagons) {
      ctx.beginPath();
      ctx.moveTo(opts[0].x, opts[0].y);
      for (let j = 1; j < opts.length; j++) {
        ctx.lineTo(opts[j].x, opts[j].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw central black pentagon
    ctx.beginPath();
    ctx.moveTo(pentagon_pts[0].x, pentagon_pts[0].y);
    for (let i = 1; i < pentagon_pts.length; i++) {
      ctx.lineTo(pentagon_pts[i].x, pentagon_pts[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. Specular spherical highlight on top-left
    const shineGrad = ctx.createRadialGradient(cx - 7, cy - 7, 0, cx - 7, cy - 7, 12);
    shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
    shineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shineGrad;
    ctx.fillRect(0, 0, 48, 48);

    ctx.restore();

    // 5. Outer sphere rim border
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a cute retro pixel-art swimming rubber/mallard duck (20x18 px) with subtle water ripple
   */
  public getDuckSprite(direction: 'left' | 'right', frame: number = 0, variant: 'yellow' | 'mallard' = 'yellow'): HTMLCanvasElement {
    const key = `duck_${variant}_${direction}_${frame % 2}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(24, 20);
    const bob = (frame % 2 === 1) ? 1 : 0;
    const isRight = direction === 'right';

    ctx.save();
    if (isRight) {
      ctx.translate(24, 0);
      ctx.scale(-1, 1);
    }

    // 1. Water wake / ripple underneath duck
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(12, 16, 8 + (frame % 2), 3, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Duck Body (Plump round waterbird)
    if (variant === 'mallard') {
      // Emerald / brown mallard
      ctx.fillStyle = '#78350f'; // Warm brown plumage
      ctx.beginPath();
      ctx.ellipse(12, 11 + bob, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wing winglet feather
      ctx.fillStyle = '#451a03';
      ctx.fillRect(11, 10 + bob, 5, 3);

      // Iridescent Emerald Green Head
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(6, 7 + bob, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // White neck collar band
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(5, 10 + bob, 4, 1.5);

      // Yellow-orange beak
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(1, 7 + bob, 3, 2.5);
    } else {
      // Classic Cute Bright Yellow Duckling
      ctx.fillStyle = '#facc15'; // Vibrant sunny yellow body
      ctx.beginPath();
      ctx.ellipse(12, 11 + bob, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wing fold
      ctx.fillStyle = '#eab308';
      ctx.fillRect(11, 10 + bob, 5, 3);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(10, 9 + bob, 4, 1.5);

      // Head
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(6, 7 + bob, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Fluffy cheek tuft
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(7, 7 + bob, 2, 2);

      // Bright orange bill / beak
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(1, 7 + bob, 3, 2.5);
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(1, 7 + bob, 3, 1);
    }

    // Eye (Glossy black dot with tiny white catchlight)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(5, 6 + bob, 1.5, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, 6 + bob, 1, 1);

    // Cute upturned tail feathers
    ctx.fillStyle = variant === 'mallard' ? '#451a03' : '#eab308';
    ctx.beginPath();
    ctx.moveTo(17, 10 + bob);
    ctx.lineTo(21, 6 + bob);
    ctx.lineTo(19, 12 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    this.cache.set(key, c);
    return c;
  }

  // --- Character Sprites (Player & NPCs) ---

  /**
   * Generates a high-detail stylized 2.5D character sprite in 4 directions with natural walk animation
   */
  public getCharacterSprite(
    type: string,
    direction: 'down' | 'up' | 'left' | 'right',
    stepFrame: number
  ): HTMLCanvasElement {
    if (type === 'pet') {
      return this.getPetSprite(direction, stepFrame);
    }

    const key = `char_hd_${type}_${direction}_${stepFrame % 4}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(32, 36);

    // Config colors per character type
    const palette = this.getCharacterPalette(type);

    // Step cycle: 0=idle, 1=left foot forward, 2=idle, 3=right foot forward
    const frame = stepFrame % 4;
    const legOffset = frame === 1 ? -2 : frame === 3 ? 2 : 0;
    const bob = frame === 1 || frame === 3 ? -1 : 0;
    const armSwing = frame === 1 ? 2 : frame === 3 ? -2 : 0;

    // 1. Soft Elliptical Ground Contact Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.42)';
    ctx.beginPath();
    ctx.ellipse(16, 32, 10, 4, 0.15, 0, Math.PI * 2);
    ctx.fill();

    if (direction === 'down') {
      // --- LEGS & PANTS ---
      ctx.fillStyle = palette.pants;
      ctx.fillRect(10 + legOffset, 20 + bob, 5, 8);
      ctx.fillRect(17 - legOffset, 20 + bob, 5, 8);
      // Pants creases / inner shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(13 + legOffset, 20 + bob, 2, 8);
      ctx.fillRect(17 - legOffset, 20 + bob, 2, 8);

      // --- SNEAKERS / SHOES ---
      // Left shoe
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(9 + legOffset, 27 + bob, 6, 4);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(9 + legOffset, 29 + bob, 6, 2); // White rubber sole
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(11 + legOffset, 28 + bob, 2, 1); // Shoe accent lace

      // Right shoe
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(17 - legOffset, 27 + bob, 6, 4);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(17 - legOffset, 29 + bob, 6, 2);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(19 - legOffset, 28 + bob, 2, 1);

      // --- TORSO / JACKET ---
      // Outer Jacket
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(8, 13 + bob, 16, 8);

      // Jacket Left Highlight (Lit side)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(9, 13 + bob, 4, 8);

      // Jacket Right Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(20, 13 + bob, 4, 8);

      // Inner Shirt / Undershirt
      ctx.fillStyle = palette.accent;
      ctx.fillRect(14, 14 + bob, 4, 7);

      // Belt with silver buckle
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(9, 20 + bob, 14, 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(15, 20 + bob, 2, 2);

      // Swinging Arms & Hands
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(6, 14 + bob - armSwing, 3, 5);
      ctx.fillRect(23, 14 + bob + armSwing, 3, 5);
      ctx.fillStyle = palette.skin;
      ctx.fillRect(6, 19 + bob - armSwing, 3, 3); // Hands
      ctx.fillRect(23, 19 + bob + armSwing, 3, 3);

      // --- HEAD & FACE ---
      // Neck
      ctx.fillStyle = palette.skin;
      ctx.fillRect(14, 12 + bob, 4, 2);

      // Face base
      ctx.fillStyle = palette.skin;
      ctx.fillRect(9, 6 + bob, 14, 8);

      // Cheek blush
      ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
      ctx.fillRect(10, 10 + bob, 3, 2);
      ctx.fillRect(19, 10 + bob, 3, 2);

      // Expressive Anime Eyes with Catchlight
      ctx.fillStyle = '#0f172a'; // Eye contour
      ctx.fillRect(11, 8 + bob, 3, 4);
      ctx.fillRect(18, 8 + bob, 3, 4);
      ctx.fillStyle = '#38bdf8'; // Iris
      ctx.fillRect(12, 9 + bob, 2, 3);
      ctx.fillRect(19, 9 + bob, 2, 3);
      ctx.fillStyle = '#ffffff'; // White catchlight
      ctx.fillRect(12, 8 + bob, 1, 2);
      ctx.fillRect(19, 8 + bob, 1, 2);

      // Smile
      ctx.fillStyle = '#9a3412';
      ctx.fillRect(15, 12 + bob, 2, 1);

      // Sideburn hair locks
      ctx.fillStyle = palette.hair;
      ctx.fillRect(8, 7 + bob, 2, 5);
      ctx.fillRect(22, 7 + bob, 2, 5);

      // --- 2.5D TRAINER CAP / HAIR ---
      // Volumetric Cap Crown
      ctx.fillStyle = palette.hat;
      ctx.fillRect(7, 2 + bob, 18, 5);
      ctx.fillRect(9, 1 + bob, 14, 2);

      // Cap lit highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(9, 2 + bob, 6, 4);

      // Cap shadow side
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(20, 2 + bob, 5, 5);

      // Front Curved Visor Brim (Casts shadow on forehead)
      ctx.fillStyle = palette.hatBrim;
      ctx.fillRect(6, 6 + bob, 20, 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(9, 7 + bob, 14, 1); // Drop shadow on forehead

      // White Pokéball emblem on cap
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(16, 4 + bob, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (direction === 'up') {
      // --- BACK VIEW (Shows 3D Travel Pack) ---
      // Pants & Shoes
      ctx.fillStyle = palette.pants;
      ctx.fillRect(10 - legOffset, 20 + bob, 5, 8);
      ctx.fillRect(17 + legOffset, 20 + bob, 5, 8);
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(9 - legOffset, 27 + bob, 6, 4);
      ctx.fillRect(17 + legOffset, 27 + bob, 6, 4);

      // Jacket Back
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(8, 13 + bob, 16, 8);

      // 3D Bulging Backpack
      ctx.fillStyle = palette.accent;
      ctx.fillRect(10, 13 + bob, 12, 8);
      // Backpack side shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(18, 13 + bob, 4, 8);
      // Zipper pocket & straps
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(12, 17 + bob, 8, 2);
      ctx.fillStyle = '#334155';
      ctx.fillRect(10, 13 + bob, 2, 8);
      ctx.fillRect(20, 13 + bob, 2, 8);

      // Arms swinging
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(6, 14 + bob + armSwing, 3, 6);
      ctx.fillRect(23, 14 + bob - armSwing, 3, 6);

      // Back of head & spiky hair
      ctx.fillStyle = palette.hair;
      ctx.fillRect(9, 7 + bob, 14, 6);
      ctx.fillRect(8, 10 + bob, 2, 4);
      ctx.fillRect(22, 10 + bob, 2, 4);

      // Back of Cap with adjustment strap
      ctx.fillStyle = palette.hat;
      ctx.fillRect(8, 2 + bob, 16, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(14, 6 + bob, 4, 2); // Strap hole
    } else if (direction === 'left') {
      // --- LEFT PROFILE VIEW ---
      // Pants & Shoes
      ctx.fillStyle = palette.pants;
      ctx.fillRect(12 + legOffset, 20 + bob, 6, 8);
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(9 + legOffset, 27 + bob, 8, 4);

      // Torso & Arm
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(11, 13 + bob, 10, 8);
      // Backpack on rear
      ctx.fillStyle = palette.accent;
      ctx.fillRect(18, 13 + bob, 5, 8);

      // Left Arm
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(12, 14 + bob + armSwing, 4, 5);
      ctx.fillStyle = palette.skin;
      ctx.fillRect(12, 19 + bob + armSwing, 3, 3);

      // Head & Left Eye
      ctx.fillStyle = palette.skin;
      ctx.fillRect(10, 6 + bob, 10, 8);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(11, 8 + bob, 2, 4);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(11, 9 + bob, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(11, 8 + bob, 1, 1);

      // Hair
      ctx.fillStyle = palette.hair;
      ctx.fillRect(15, 7 + bob, 5, 6);

      // Cap with prominent forward visor
      ctx.fillStyle = palette.hat;
      ctx.fillRect(9, 2 + bob, 12, 5);
      ctx.fillStyle = palette.hatBrim;
      ctx.fillRect(6, 6 + bob, 11, 2); // Sticking out left
    } else if (direction === 'right') {
      // --- RIGHT PROFILE VIEW (Lit Side) ---
      // Pants & Shoes
      ctx.fillStyle = palette.pants;
      ctx.fillRect(14 - legOffset, 20 + bob, 6, 8);
      ctx.fillStyle = palette.shoes;
      ctx.fillRect(15 - legOffset, 27 + bob, 8, 4);

      // Torso & Arm
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(11, 13 + bob, 10, 8);
      // Backpack on rear (far side)
      ctx.fillStyle = palette.accent;
      ctx.fillRect(9, 13 + bob, 4, 8);

      // Right Arm
      ctx.fillStyle = palette.shirt;
      ctx.fillRect(16, 14 + bob - armSwing, 4, 5);
      ctx.fillStyle = palette.skin;
      ctx.fillRect(17, 19 + bob - armSwing, 3, 3);

      // Head & Right Eye
      ctx.fillStyle = palette.skin;
      ctx.fillRect(12, 6 + bob, 10, 8);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(19, 8 + bob, 2, 4);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(19, 9 + bob, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(19, 8 + bob, 1, 1);

      // Hair
      ctx.fillStyle = palette.hair;
      ctx.fillRect(12, 7 + bob, 5, 6);

      // Cap with prominent forward visor
      ctx.fillStyle = palette.hat;
      ctx.fillRect(11, 2 + bob, 12, 5);
      ctx.fillStyle = palette.hatBrim;
      ctx.fillRect(15, 6 + bob, 11, 2); // Sticking out right
    }

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates an authentic 4-legged golden puppy / canine companion (Pixel Pup)
   * Featuring floppy ears, animated paws, wagging tail, shiny eyes, and red collar
   */
  public getPetSprite(
    direction: 'down' | 'up' | 'left' | 'right',
    stepFrame: number
  ): HTMLCanvasElement {
    const frame = stepFrame % 4;
    const key = `char_hd_pixelpup_${direction}_${frame}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(32, 36);

    // Dynamic animation offsets
    const bob = frame === 1 || frame === 3 ? -1 : 0;
    const pawOffset = frame === 1 ? -2 : frame === 3 ? 2 : 0;
    const tailWag = frame === 1 ? -2 : frame === 3 ? 2 : 0;

    // 1. Soft Ground Contact Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(16, 32, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Color Palette - Golden Retriever / Puppy tones
    const furMain = '#f59e0b';      // Rich golden amber fur
    const furHighlight = '#fbbf24'; // Light top coat highlight
    const furDark = '#b45309';      // Underbelly / deep shading
    const furCream = '#fef3c7';     // Muzzle & chest cream fluff
    const collarRed = '#ef4444';    // Vibrant red collar
    const collarTag = '#facc15';    // Gold bell / medal tag
    const noseBlack = '#1e1b4b';    // Dark nose & eye outline

    if (direction === 'down') {
      // Wagging tail visible in background behind body
      ctx.fillStyle = furDark;
      ctx.fillRect(15 + tailWag, 18, 3, 5);

      // Back paws
      ctx.fillStyle = furDark;
      ctx.fillRect(8, 27 + bob, 4, 4);
      ctx.fillRect(20, 27 + bob, 4, 4);

      // Puppy Torso / Body (compact quadruped form)
      ctx.fillStyle = furMain;
      ctx.beginPath();
      ctx.roundRect(9, 18 + bob, 14, 11, 4);
      ctx.fill();

      // Fluffy Cream Chest
      ctx.fillStyle = furCream;
      ctx.beginPath();
      ctx.roundRect(12, 19 + bob, 8, 8, 3);
      ctx.fill();

      // Front 2 Paws (animated walk cycle)
      ctx.fillStyle = furHighlight;
      ctx.fillRect(10 + pawOffset, 27 + bob, 4, 4);
      ctx.fillRect(18 - pawOffset, 27 + bob, 4, 4);
      // Paw pads / claws accent
      ctx.fillStyle = furDark;
      ctx.fillRect(10 + pawOffset, 30 + bob, 4, 1);
      ctx.fillRect(18 - pawOffset, 30 + bob, 4, 1);

      // Red Collar & Golden Tag
      ctx.fillStyle = collarRed;
      ctx.fillRect(10, 16 + bob, 12, 3);
      ctx.fillStyle = collarTag;
      ctx.fillRect(15, 18 + bob, 2, 2);

      // Big Cute Puppy Head
      ctx.fillStyle = furMain;
      ctx.beginPath();
      ctx.roundRect(8, 8 + bob, 16, 11, 5);
      ctx.fill();

      // Head top coat highlight
      ctx.fillStyle = furHighlight;
      ctx.fillRect(11, 8 + bob, 10, 3);

      // Floppy Puppy Ears (hanging down at sides)
      ctx.fillStyle = furDark;
      ctx.beginPath();
      ctx.roundRect(6, 9 + bob, 4, 9, 2); // Left ear
      ctx.roundRect(22, 9 + bob, 4, 9, 2); // Right ear
      ctx.fill();

      // Cream Muzzle / Snout
      ctx.fillStyle = furCream;
      ctx.beginPath();
      ctx.roundRect(11, 13 + bob, 10, 5, 3);
      ctx.fill();

      // Cute Black Button Nose
      ctx.fillStyle = noseBlack;
      ctx.fillRect(14, 13 + bob, 4, 2);
      ctx.fillStyle = '#f43f5e'; // Tiny pink tongue tip
      ctx.fillRect(15, 16 + bob, 2, 1);

      // Big Sparkling Puppy Eyes
      ctx.fillStyle = noseBlack;
      ctx.fillRect(11, 11 + bob, 3, 3);
      ctx.fillRect(18, 11 + bob, 3, 3);
      // Eye Highlights (Kawaii sparkle)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(11, 11 + bob, 1, 1);
      ctx.fillRect(18, 11 + bob, 1, 1);
    } else if (direction === 'up') {
      // Tail prominently standing up and wagging
      ctx.fillStyle = furMain;
      ctx.fillRect(14 + tailWag, 14, 4, 7);
      ctx.fillStyle = furHighlight;
      ctx.fillRect(15 + tailWag, 12, 3, 4);

      // Rear quadruped body
      ctx.fillStyle = furDark;
      ctx.beginPath();
      ctx.roundRect(9, 18 + bob, 14, 10, 4);
      ctx.fill();

      // 4 Paws walking from behind
      ctx.fillStyle = furHighlight;
      ctx.fillRect(8 - pawOffset, 27 + bob, 4, 4);
      ctx.fillRect(20 + pawOffset, 27 + bob, 4, 4);
      ctx.fillStyle = furDark;
      ctx.fillRect(11 + pawOffset, 26 + bob, 4, 4);
      ctx.fillRect(17 - pawOffset, 26 + bob, 4, 4);

      // Red Collar rim
      ctx.fillStyle = collarRed;
      ctx.fillRect(10, 16 + bob, 12, 3);

      // Back of Puppy Head & Ears
      ctx.fillStyle = furMain;
      ctx.beginPath();
      ctx.roundRect(8, 7 + bob, 16, 11, 5);
      ctx.fill();

      ctx.fillStyle = furHighlight;
      ctx.fillRect(11, 8 + bob, 10, 4);

      // Floppy Ears visible from behind
      ctx.fillStyle = furDark;
      ctx.beginPath();
      ctx.roundRect(6, 8 + bob, 4, 9, 2);
      ctx.roundRect(22, 8 + bob, 4, 9, 2);
      ctx.fill();
    } else if (direction === 'left') {
      // Wagging tail pointing back to right
      ctx.fillStyle = furMain;
      ctx.fillRect(22, 17 + bob + tailWag, 5, 4);
      ctx.fillStyle = furHighlight;
      ctx.fillRect(24, 16 + bob + tailWag, 4, 3);

      // Quadruped Horizontal Body
      ctx.fillStyle = furDark;
      ctx.fillRect(12, 19 + bob, 12, 8);
      ctx.fillStyle = furMain;
      ctx.beginPath();
      ctx.roundRect(10, 17 + bob, 13, 9, 3);
      ctx.fill();

      // Front & Back 4 Paws in profile
      ctx.fillStyle = furDark;
      ctx.fillRect(10 - pawOffset, 26 + bob, 3, 5); // Back leg 1
      ctx.fillRect(21 + pawOffset, 26 + bob, 3, 5); // Back leg 2
      ctx.fillStyle = furHighlight;
      ctx.fillRect(8 + pawOffset, 27 + bob, 4, 4);  // Front leg 1
      ctx.fillRect(19 - pawOffset, 27 + bob, 4, 4); // Front leg 2

      // Red Collar
      ctx.fillStyle = collarRed;
      ctx.fillRect(11, 16 + bob, 3, 7);
      ctx.fillStyle = collarTag;
      ctx.fillRect(10, 19 + bob, 2, 2);

      // Puppy Head facing left
      ctx.fillStyle = furMain;
      ctx.beginPath();
      ctx.roundRect(6, 9 + bob, 12, 10, 4);
      ctx.fill();

      // Floppy Ear hanging back
      ctx.fillStyle = furDark;
      ctx.beginPath();
      ctx.roundRect(13, 9 + bob, 4, 9, 2);
      ctx.fill();

      // Left Snout & Nose
      ctx.fillStyle = furCream;
      ctx.fillRect(3, 14 + bob, 5, 4);
      ctx.fillStyle = noseBlack;
      ctx.fillRect(2, 13 + bob, 3, 3);

      // Left Big Eye
      ctx.fillStyle = noseBlack;
      ctx.fillRect(7, 11 + bob, 3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(7, 11 + bob, 1, 1);
    } else {
      // direction === 'right'
      // Wagging tail pointing back to left
      ctx.fillStyle = furMain;
      ctx.fillRect(5, 17 + bob + tailWag, 5, 4);
      ctx.fillStyle = furHighlight;
      ctx.fillRect(4, 16 + bob + tailWag, 4, 3);

      // Quadruped Horizontal Body
      ctx.fillStyle = furDark;
      ctx.fillRect(8, 19 + bob, 12, 8);
      ctx.fillStyle = furMain;
      ctx.beginPath();
      ctx.roundRect(9, 17 + bob, 13, 9, 3);
      ctx.fill();

      // Front & Back 4 Paws in profile
      ctx.fillStyle = furDark;
      ctx.fillRect(19 + pawOffset, 26 + bob, 3, 5); // Back leg 1
      ctx.fillRect(8 - pawOffset, 26 + bob, 3, 5);  // Back leg 2
      ctx.fillStyle = furHighlight;
      ctx.fillRect(20 - pawOffset, 27 + bob, 4, 4); // Front leg 1
      ctx.fillRect(9 + pawOffset, 27 + bob, 4, 4);  // Front leg 2

      // Red Collar
      ctx.fillStyle = collarRed;
      ctx.fillRect(18, 16 + bob, 3, 7);
      ctx.fillStyle = collarTag;
      ctx.fillRect(20, 19 + bob, 2, 2);

      // Puppy Head facing right
      ctx.fillStyle = furMain;
      ctx.beginPath();
      ctx.roundRect(14, 9 + bob, 12, 10, 4);
      ctx.fill();

      // Floppy Ear hanging back
      ctx.fillStyle = furDark;
      ctx.beginPath();
      ctx.roundRect(15, 9 + bob, 4, 9, 2);
      ctx.fill();

      // Right Snout & Nose
      ctx.fillStyle = furCream;
      ctx.fillRect(24, 14 + bob, 5, 4);
      ctx.fillStyle = noseBlack;
      ctx.fillRect(27, 13 + bob, 3, 3);

      // Right Big Eye
      ctx.fillStyle = noseBlack;
      ctx.fillRect(22, 11 + bob, 3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(23, 11 + bob, 1, 1);
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

  // --- Ultra-Detailed Stylized 2.5D Buildings ---

  /**
   * Generates an Ultra-Detailed 4x3 tile 2.5D Pokémon Center
   * Width: 128px, Height: 96px
   */
  public getPokemonCenter(): HTMLCanvasElement {
    const key = 'bld_25d_poke_center_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // 1. Soft Ambient Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(64, 92, 62, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Right Lateral Wall (Cast shadow side, showing building depth)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(116, 36, 8, 56);
    ctx.fillStyle = '#475569';
    ctx.fillRect(116, 76, 8, 16); // Wainscot shadow

    // 3. Front Facade Wall (Primary lit white stucco)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(8, 36, 108, 56);

    // Subtle stone brick grid on white facade
    ctx.fillStyle = '#e2e8f0';
    for (let y = 38; y < 74; y += 8) {
      ctx.fillRect(8, y, 108, 1);
    }

    // Lower Chiseled Cobblestone Wainscot
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(8, 76, 108, 16);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(8, 76, 108, 2); // Wainscot shelf lip

    // 4. Detailed 2.5D Slanted Red Roof with Individual Shingles
    ctx.fillStyle = '#b91c1c'; // Roof base shadow
    ctx.beginPath();
    ctx.moveTo(4, 38);
    ctx.lineTo(24, 6);
    ctx.lineTo(104, 6);
    ctx.lineTo(124, 38);
    ctx.closePath();
    ctx.fill();

    // Tiered shingle rows on roof
    const shingleRows = [
      { y: 8, x1: 23, x2: 105, h: 5 },
      { y: 14, x1: 19, x2: 109, h: 5 },
      { y: 20, x1: 15, x2: 113, h: 5 },
      { y: 26, x1: 11, x2: 117, h: 5 },
      { y: 32, x1: 7, x2: 121, h: 5 },
    ];

    for (const r of shingleRows) {
      // Row body
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(r.x1, r.y, r.x2 - r.x1, r.h);

      // Shingle top highlight lip
      ctx.fillStyle = '#f87171';
      ctx.fillRect(r.x1, r.y, r.x2 - r.x1, 1);

      // Vertical shingle seam lines
      ctx.fillStyle = '#991b1b';
      for (let sx = r.x1 + 8; sx < r.x2 - 4; sx += 12) {
        ctx.fillRect(sx, r.y, 1, r.h);
      }
    }

    // Right Roof Chamfer Shading (Dark crimson)
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.moveTo(104, 6);
    ctx.lineTo(112, 10);
    ctx.lineTo(126, 38);
    ctx.lineTo(124, 38);
    ctx.closePath();
    ctx.fill();

    // White Roof Overhang Cornice / Eaves
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 36, 124, 5);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(2, 40, 124, 2); // Eave underside deep shadow

    // 5. 3D Glowing Glass Pokéball Emblem Sign
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.arc(64, 23, 16, 0, Math.PI * 2);
    ctx.fill(); // Sign shadow

    // Chrome outer ring
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(64, 21, 15, 0, Math.PI * 2);
    ctx.fill();

    // Red upper half
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(64, 21, 13, Math.PI, 0);
    ctx.fill();

    // White lower half
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(64, 21, 13, 0, Math.PI);
    ctx.fill();

    // Center divider band & glowing button
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(51, 20, 26, 2);
    ctx.beginPath();
    ctx.arc(64, 21, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8'; // Glowing blue inner button
    ctx.beginPath();
    ctx.arc(64, 21, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(63, 20, 1, 1); // Catchlight

    // 6. 2.5D Recessed Glass Automatic Doors
    ctx.fillStyle = '#0f172a'; // Deep door recess arch
    ctx.fillRect(45, 48, 38, 46);

    ctx.fillStyle = '#38bdf8'; // Crystal blue glass
    ctx.fillRect(48, 51, 32, 43);

    // Dark door frame dividers
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(63, 51, 2, 43);
    ctx.fillRect(48, 72, 32, 2);

    // Diagonal Glass Specular Sheen
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.moveTo(49, 93);
    ctx.lineTo(76, 52);
    ctx.lineTo(70, 52);
    ctx.lineTo(49, 83);
    ctx.closePath();
    ctx.fill();

    // 7. Architectural Bay Windows with Interior Warm Light
    const windows = [14, 86];
    for (const wx of windows) {
      // Outer bevel frame
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx - 1, 45, 26, 26);

      // Glass window panes
      ctx.fillStyle = '#7dd3fc';
      ctx.fillRect(wx, 46, 24, 24);

      // Window mullions
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(wx + 11, 46, 2, 24);
      ctx.fillRect(wx, 57, 24, 2);

      // Specular glare
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(wx + 2, 48, 4, 18);
    }

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates an Ultra-Detailed 4x3 tile 2.5D Poké Mart
   * Width: 128px, Height: 96px
   */
  public getPokeMart(): HTMLCanvasElement {
    const key = 'bld_25d_poke_mart_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // 1. Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(64, 92, 62, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Right Lateral Wall (depth facet)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(116, 36, 8, 56);
    ctx.fillStyle = '#475569';
    ctx.fillRect(116, 76, 8, 16);

    // 3. Front Wall
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(8, 36, 108, 56);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(8, 76, 108, 16);

    // 4. 2.5D Pitched Blue Shingle Roof
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(4, 38);
    ctx.lineTo(24, 6);
    ctx.lineTo(104, 6);
    ctx.lineTo(124, 38);
    ctx.closePath();
    ctx.fill();

    const martShingleRows = [
      { y: 8, x1: 23, x2: 105, h: 5 },
      { y: 14, x1: 19, x2: 109, h: 5 },
      { y: 20, x1: 15, x2: 113, h: 5 },
      { y: 26, x1: 11, x2: 117, h: 5 },
      { y: 32, x1: 7, x2: 121, h: 5 },
    ];

    for (const r of martShingleRows) {
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(r.x1, r.y, r.x2 - r.x1, r.h);
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(r.x1, r.y, r.x2 - r.x1, 1);
      ctx.fillStyle = '#1d4ed8';
      for (let sx = r.x1 + 8; sx < r.x2 - 4; sx += 12) {
        ctx.fillRect(sx, r.y, 1, r.h);
      }
    }

    // Right roof shadow
    ctx.fillStyle = '#172554';
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
    ctx.fillStyle = '#a16207';
    ctx.fillRect(2, 40, 124, 2);

    // 5. 2.5D Extruded "MART" Marquee Box
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(40, 14, 48, 20); // Box shadow
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(38, 12, 48, 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(40, 14, 44, 16);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(40, 14, 44, 1); // Gold top border
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('MART', 48, 26);

    // 6. Recessed Doors & Showcase
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(48, 48, 32, 46);
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(50, 51, 28, 43);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(63, 51, 2, 43);

    // Showcase Displays
    const martWindows = [14, 86];
    for (const wx of martWindows) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx - 1, 47, 26, 26);
      ctx.fillStyle = '#bfdbfe';
      ctx.fillRect(wx, 48, 24, 24);
      // Items on display shelf
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(wx + 3, 62, 5, 5); // Pokéball
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(wx + 10, 60, 4, 7); // Potion
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(wx + 16, 62, 5, 5); // TM
    }

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates an Ultra-Detailed 5x4 tile 2.5D Silicon Gym (BMS Arena)
   * Width: 160px, Height: 128px
   */
  public getSiliconGym(): HTMLCanvasElement {
    const key = 'bld_25d_silicon_gym_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(160, 128);

    // 1. Massive Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
    ctx.beginPath();
    ctx.ellipse(80, 124, 78, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Lateral Wall (Right side in shadow)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(146, 38, 10, 86);

    // 3. Front Chiseled Granite Wall
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, 38, 138, 86);
    // Stone block masonry grooves
    ctx.fillStyle = '#334155';
    for (let y = 42; y < 120; y += 12) {
      ctx.fillRect(8, y, 138, 1);
    }

    // 4. 2.5D Grand Pediment / Triangular Temple Portico
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(2, 40);
    ctx.lineTo(80, 4);
    ctx.lineTo(154, 40);
    ctx.closePath();
    ctx.fill();

    // Portico Pediment Inner Relief
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(12, 38);
    ctx.lineTo(80, 8);
    ctx.lineTo(144, 38);
    ctx.closePath();
    ctx.fill();

    // Portico Cornice & Dentil moldings
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 38, 156, 6);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 38, 156, 1); // White marble top highlight
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 44, 156, 3); // Deep frieze shadow

    // 5. 4 Grand Classical Fluted Pillars
    const gymPillars = [14, 44, 102, 132];
    for (const px of gymPillars) {
      // Cast shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(px + 4, 46, 20, 78);

      // Fluted pillar shaft
      ctx.fillStyle = '#475569';
      ctx.fillRect(px, 46, 16, 78);
      // Fluted vertical ridges (3D cylinder gradient)
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(px, 46, 3, 78);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(px + 4, 46, 4, 78); // Peak specular
      ctx.fillStyle = '#334155';
      ctx.fillRect(px + 12, 46, 4, 78);

      // Corinthian / Ionic capital & base
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(px - 2, 44, 20, 4);
      ctx.fillRect(px - 2, 120, 20, 4);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px - 1, 46, 18, 1);
    }

    // 6. Gold Embossed Crest (BMS Enterprise Leader Badge)
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.arc(80, 24, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b45309'; // Bronze bevel rim
    ctx.beginPath();
    ctx.arc(80, 22, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b'; // Gold field
    ctx.beginPath();
    ctx.arc(80, 22, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a'; // Specular gleam
    ctx.beginPath();
    ctx.arc(77, 18, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('BMS', 71, 26);

    // 7. Grand Heavy Bronze Double Doors
    ctx.fillStyle = '#020617';
    ctx.fillRect(66, 72, 28, 52);

    ctx.fillStyle = '#78350f'; // Heavy dark wood/bronze
    ctx.fillRect(68, 74, 24, 50);

    // Paneled bronze door studs
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(72, 80, 4, 4);
    ctx.fillRect(84, 80, 4, 4);
    ctx.fillRect(72, 98, 4, 10); // Brass pull handles
    ctx.fillRect(84, 98, 4, 10);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates an Ultra-Detailed 5x3 tile 2.5D Research Lab (Prof. Aritro's Lab)
   * Width: 160px, Height: 96px
   */
  public getResearchLab(): HTMLCanvasElement {
    const key = 'bld_25d_research_lab_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(160, 96);

    // 1. Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(80, 92, 76, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Right Lateral Wall
    ctx.fillStyle = '#64748b';
    ctx.fillRect(146, 32, 10, 60);

    // 3. Front High-Tech Cleanroom Wall
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(8, 32, 138, 60);
    // Brushed aluminum seam lines
    ctx.fillStyle = '#cbd5e1';
    for (let x = 8; x < 146; x += 18) {
      ctx.fillRect(x, 32, 1, 60);
    }

    // 4. 2.5D Tech Rooftop with Solar Array & AC Chillers
    ctx.fillStyle = '#334155';
    ctx.fillRect(4, 20, 150, 14);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, 31, 150, 4); // Eave shadow

    // 3D Solar Panel Array on roof
    for (let x = 16; x < 60; x += 14) {
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(x, 8, 12, 12);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x + 1, 9, 10, 1);
      ctx.fillRect(x + 5, 8, 1, 12);
    }

    // High-Tech Communications Mast & Satellite Dish
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(130, 2, 4, 20);
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(126, 12, 8, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    // Blinking Aeronautical Warning Beacon
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(129, 0, 6, 5);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(131, 1, 2, 2);

    // 5. Backlit Acrylic "AI LAB" Sign
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(58, 25, 44, 16);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(56, 23, 44, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(57, 24, 42, 1); // Neon top tube
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('AI LAB', 62, 35);

    // 6. Sliding Air-Lock Doors
    ctx.fillStyle = '#020617';
    ctx.fillRect(66, 48, 28, 44);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(68, 50, 24, 42);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(79, 50, 2, 42);

    // 7. Server Room Windows with Pulsing Multi-Color LED Racks
    const serverBays = [16, 104];
    for (const bx of serverBays) {
      ctx.fillStyle = '#020617';
      ctx.fillRect(bx, 44, 38, 28);

      // Server rack chassis
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx + 2, 46, 34, 24);

      // Green & Cyan Activity LEDs
      for (let y = 48; y < 68; y += 4) {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(bx + 4, y, 16, 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(bx + 22, y, 12, 2);
      }
    }

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates an Ultra-Detailed 4x3 tile 2.5D Developer Arcade
   * Width: 128px, Height: 96px
   */
  public getArcadeBuilding(): HTMLCanvasElement {
    const key = 'bld_25d_arcade_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // 1. Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(64, 92, 62, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Right Lateral Wall
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(116, 32, 8, 60);

    // 3. Cyberpunk Dark Purple Concrete Wall
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(8, 32, 108, 60);

    // 4. 2.5D Animated Striped Neon Awning with Scalloped Edge
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(2, 20, 124, 16);
    ctx.fillStyle = '#ec4899';
    for (let x = 2; x < 124; x += 16) {
      ctx.fillRect(x, 20, 8, 16);
    }
    // Neon glow line along awning lip
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(2, 35, 124, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(2, 37, 124, 4); // Shadow underneath

    // 5. Glowing Neon "ARCADE" Marquee Sign
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(36, 8, 56, 16);
    ctx.fillStyle = '#831843';
    ctx.fillRect(34, 6, 56, 16);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(35, 7, 54, 14);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('ARCADE', 42, 18);

    // 6. Holographic Entrance Portal
    ctx.fillStyle = '#020617';
    ctx.fillRect(48, 48, 32, 44);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(50, 50, 28, 42);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(53, 53, 22, 2); // Neon overhead tube

    // 7. Glass Showcase with Detailed Pixel Retro Arcade Cabinets
    const arcadeWindows = [14, 88];
    for (const wx of arcadeWindows) {
      ctx.fillStyle = '#020617';
      ctx.fillRect(wx, 46, 26, 28);

      // Arcade Cabinet Silhouette (Angled CRT marquee)
      ctx.fillStyle = '#312e81';
      ctx.fillRect(wx + 3, 50, 20, 22);
      ctx.fillStyle = '#f59e0b'; // Glowing Marquee
      ctx.fillRect(wx + 5, 51, 16, 4);
      ctx.fillStyle = '#38bdf8'; // Glowing CRT screen
      ctx.fillRect(wx + 5, 57, 16, 10);
      ctx.fillStyle = '#ef4444'; // Joystick knob
      ctx.fillRect(wx + 9, 69, 3, 3);
    }

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates an Ultra-Detailed 4x3 tile 2.5D Cozy House
   * Width: 128px, Height: 96px
   */
  public getHouseBuilding(): HTMLCanvasElement {
    const key = 'bld_25d_house_hd';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // 1. Soft Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(64, 92, 62, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Right Lateral Wall
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(116, 36, 8, 56);

    // 3. Front Stucco Siding Wall
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(8, 36, 108, 56);

    // Wood siding plank horizontal lines
    ctx.fillStyle = '#cbd5e1';
    for (let y = 40; y < 90; y += 6) {
      ctx.fillRect(8, y, 108, 1);
    }

    // 4. 2.5D Terracotta Clay Shingle Roof
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.moveTo(4, 38);
    ctx.lineTo(24, 6);
    ctx.lineTo(104, 6);
    ctx.lineTo(124, 38);
    ctx.closePath();
    ctx.fill();

    const houseShingleRows = [
      { y: 8, x1: 23, x2: 105, h: 5 },
      { y: 14, x1: 19, x2: 109, h: 5 },
      { y: 20, x1: 15, x2: 113, h: 5 },
      { y: 26, x1: 11, x2: 117, h: 5 },
      { y: 32, x1: 7, x2: 121, h: 5 },
    ];

    for (const r of houseShingleRows) {
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(r.x1, r.y, r.x2 - r.x1, r.h);
      ctx.fillStyle = '#fb923c';
      ctx.fillRect(r.x1, r.y, r.x2 - r.x1, 1);
      ctx.fillStyle = '#9a3412';
      for (let sx = r.x1 + 8; sx < r.x2 - 4; sx += 10) {
        ctx.fillRect(sx, r.y, 1, r.h);
      }
    }

    // Right roof shadow facet
    ctx.fillStyle = '#431407';
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
    ctx.fillStyle = '#431407';
    ctx.fillRect(2, 40, 124, 2);

    // 5. 3D Red Brick Chimney with Mortar Lines
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(92, 2, 14, 20);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(102, 2, 4, 20); // Shadow facet
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(92, 6, 10, 1); // Mortar line
    ctx.fillRect(92, 12, 10, 1);
    ctx.fillRect(92, 17, 10, 1);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(90, 0, 18, 3); // Chimney stone cap

    // 6. Charming Paneled Wooden Door with Brass Fixtures
    ctx.fillStyle = '#020617';
    ctx.fillRect(50, 52, 28, 40);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(52, 54, 24, 38);

    // Door wood panels
    ctx.fillStyle = '#451a03';
    ctx.fillRect(54, 56, 9, 14);
    ctx.fillRect(65, 56, 9, 14);
    ctx.fillRect(54, 74, 9, 14);
    ctx.fillRect(65, 74, 9, 14);

    // Brass doorknob & letter slot
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(70, 72, 3, 3);
    ctx.fillRect(57, 85, 14, 2);

    // 7. Warm Glowing Windows with Plaid Red Curtains
    const houseWindows = [16, 88];
    for (const wx of houseWindows) {
      ctx.fillStyle = '#020617';
      ctx.fillRect(wx - 1, 45, 26, 26);
      ctx.fillStyle = '#fef08a'; // Warm amber interior light
      ctx.fillRect(wx, 46, 24, 24);

      // Red ruffled curtains
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(wx, 46, 5, 24);
      ctx.fillRect(wx + 19, 46, 5, 24);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(wx, 46, 24, 4); // Valance

      // Window cross muntins
      ctx.fillStyle = '#78350f';
      ctx.fillRect(wx + 11, 46, 2, 24);
      ctx.fillRect(wx, 57, 24, 2);
    }

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 2.5D Mega Jumbotron Outdoor Town Screen (128x96 px)
   * High-definition 4-tile wide stadium display showing live rotating project showcases
   */
  public getMegaJumbotronTV(): HTMLCanvasElement {
    const key = 'bldg_jumbotron_frame_hd_128';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(128, 96);

    // 1. Heavy Industrial Ground Shadow (grounded at y: 88..94)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(64, 90, 58, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Heavy Dual Support Steel Pillars (row 14: y: 64..92)
    // Left Pillar (x: 24..38)
    ctx.fillStyle = '#334155';
    ctx.fillRect(24, 66, 14, 26);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(32, 66, 6, 26);
    // Steel base plate & bolts
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(22, 88, 18, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(25, 76, 3, 3);
    ctx.fillRect(33, 76, 3, 3);

    // Right Pillar (x: 90..104)
    ctx.fillStyle = '#334155';
    ctx.fillRect(90, 66, 14, 26);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(98, 66, 6, 26);
    // Steel base plate & bolts
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(88, 88, 18, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(91, 76, 3, 3);
    ctx.fillRect(99, 76, 3, 3);

    // Cross-truss support beam between pillars
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(38, 72, 52, 4);
    ctx.fillStyle = '#334155';
    ctx.fillRect(38, 73, 52, 2);

    // 3. Main Monitor Chassis / Heavy Metallic Bezel (124x68 px, y: 2..70)
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.roundRect(2, 2, 124, 68, 5);
    ctx.fill();

    // Metallic Outer Bezel highlight
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Top Header Banner: "⚡ PALLET CLOUD TV • LIVE SHOWCASE ⚡"
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(5, 4, 118, 7);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 5.5px monospace';
    ctx.fillText('⚡ PALLET CLOUD TV • LIVE SHOWCASE ⚡', 12, 10);

    // Live ON-AIR blinking LED housing
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(116, 7.5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Inner Display Recess Housing (Screen area: x: 6, y: 12, w: 116, h: 52)
    ctx.fillStyle = '#000000';
    ctx.fillRect(6, 12, 116, 52);

    // Dual stereo speakers underneath display (y: 65)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(6, 65, 116, 3);
    for (let x = 10; x < 118; x += 4) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, 65, 2, 3);
    }

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a 2.5D Animated Marble Town Water Fountain (64x64 px)
   */
  public getTownFountain(): HTMLCanvasElement {
    const key = 'scenery_fountain_base';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(64, 52);

    // 1. Circular Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(32, 44, 28, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Outer Stone Basin Ring
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(32, 36, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner Basin Rim
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(32, 34, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Basin Water Body
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(32, 35, 23, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Central Pedestal
    ctx.fillStyle = '#475569';
    ctx.fillRect(28, 18, 8, 16);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(28, 18, 3, 16);

    // Upper Basin
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(32, 18, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(32, 17, 10, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spouting Gem Orb at Apex
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(32, 10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(31, 8, 2, 2);

    this.cache.set(key, c);
    return c;
  }

  /**
   * Generates a Cozy 2.5D Park Wooden Bench (32x24 px)
   */
  public getParkBench(): HTMLCanvasElement {
    const key = 'tile_park_bench';
    if (this.cache.has(key)) return this.cache.get(key)!;

    const [c, ctx] = this.createCanvas(32, 24);

    // Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fillRect(2, 18, 28, 4);

    // Cast Iron Legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(4, 10, 3, 11);
    ctx.fillRect(25, 10, 3, 11);

    // Wooden Slats Backrest
    ctx.fillStyle = '#92400e';
    ctx.fillRect(2, 4, 28, 3);
    ctx.fillRect(2, 8, 28, 3);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(2, 4, 28, 1);
    ctx.fillRect(2, 8, 28, 1);

    // Wooden Slats Seat
    ctx.fillStyle = '#b45309';
    ctx.fillRect(2, 12, 28, 4);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(2, 12, 28, 1);

    this.cache.set(key, c);
    return c;
  }
}

export const spriteGenerator = new SpriteGenerator();

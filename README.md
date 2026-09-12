# 🎮 Aritro Saha — 2.5D Open-World RPG Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Canvas 2D](https://img.shields.io/badge/HTML5-Canvas_2D-E34F26?style=flat-square&logo=html5)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_API-orange?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

An immersive, retro Pokémon-inspired open-world developer portfolio set in **Pallet Cloud**. Explore interactive buildings, view projects broadcasting on a town square **Mega Jumbotron TV**, visit the **Innovation Pokédex Center**, challenge the **Silicon Gym**, play retro minigames in the **Developer Arcade**, or toggle instantly to an executive **Recruiter Dossier** mode.

---

## 🌟 Key Highlights & Features

### 🕹️ Custom 2.5D Retro Game Engine
- **Hardware-Accelerated 60 FPS Canvas**: Built from scratch using native HTML5 Canvas 2D without bulky external game engines.
- **Dynamic 2.5D Perspective**: Depth-sorted rendering via Painter's algorithm with realistic object occlusion between the player, buildings, trees, and NPCs.
- **Procedural Pixel-Art Generation**: Over 40+ custom sprites generated procedurally in memory via `SpriteGenerator` (buildings, interiors, NPCs, cap-wearing trainer, animated fountain, jumbotron, and terrain tiles).
- **BFS Shortest-Path Navigation**: Intelligent tap-to-walk / click-to-walk pathfinding with an animated glowing waypoint beacon.
- **Dual Control Scheme**: Full support for desktop keyboard controls and an on-screen responsive **Virtual Gamepad** (D-Pad, [A] Interact, [B] Sprint, [START] Menu) optimized for mobile touch screens.
- **Interactive NPC Voice Synthesis**: Web Speech API integration featuring custom voice persona profiles (Prof. Oak, Aritro Saha, Nurse Joy, Shopkeeper, and Pixel Pup).
- **Chiptune Audio Synthesizer**: Native Web Audio API sound generator producing retro 8-bit sound effects (menu cursors, bumps, warp chimes, victory fanfare, and footsteps).

---

### 🏙️ Town Map & Interactive Landmarks

| Landmark | Grid Location | Description |
| :--- | :--- | :--- |
| **⚡ Mega Jumbotron TV** | `x: 10..15, y: 12..15` | Giant outdoor TV broadcasting live rotating project showcases every 5s with CRT scanlines, glass reflection, and live channel indicator. Press **[A]** to cycle channels on demand! |
| **🔴 Innovation Pokédex Center** | `x: 5..8, y: 14..16` | Inspect Aritro's full-stack and distributed engineering projects with Pokémon-style stats, radar graphs, live links, and PyPI badges. |
| **🏢 Silicon Gym (BMS Arena)** | `x: 14..18, y: 22..25` | Explore enterprise experience at Bristol Myers Squibb, distributed ETL pipelines, and 8 Gym Badges of Honor. |
| **🔵 Skill & Tech Stack Mart** | `x: 17..20, y: 14..16` | Inventory Bag stocked with Key Items (Python, Next.js, LangGraph), TMs & HMs (Docker, GCP, Terraform), and Battle Tools. |
| **🔬 AI Research Lab** | `x: 19..23, y: 4..6` | Access the lab mainframe to view the Trainer Card, LeetCode Knight stats (1868 peak, 630+ solved), CGPA, and publications. |
| **🏠 Aritro's Residence** | `x: 3..6, y: 4..6` | Contact terminal, social channels (GitHub, LinkedIn, LeetCode, X), SiliconSync blog feed, and beatbox studio. |
| **🕹️ Developer Arcade Corner** | `x: 26..29, y: 14..16` | Fully playable retro games: *Developer Speed Test* (typing benchmark) and *Minimalist Python Snake*. |
| **⛲ Pallet Cloud Wishing Fountain** | `x: 11..14, y: 5..7` | Animated marble fountain with procedural water droplet spray and concentric pool ripples. Toss in a PokéDollar for a CI/CD blessing! |
| **🪑 Scenic Rest Benches** | Multiple | Located in Town Square, Northern Garden, and Southwestern Lake shore for taking a breather. |
| **⚽ Interactive Football Match** | `x: 8, y: 6` | Physics-simulated soccer ball that bounces off borders when kicked across the lawn. |

---

### 📄 Executive Recruiter Dossier Mode
For hiring managers and recruiters who prefer a fast, streamlined review:
- **One-Click Toggle**: Switch between the 2.5D game world and an executive portfolio dossier view at any time.
- **Direct Resume Download**: Instant access to Aritro's latest software engineering resume.
- **Enterprise Highlights**: Bristol Myers Squibb experience, Hack4Bengal 3.0 championship breakdown, and technical stack summary.
- **SEO & Social Cards**: Fully optimized OpenGraph cards, Twitter preview cards, dynamic `sitemap.xml`, and `robots.txt`.

---

## 🚀 Controls

### Keyboard (Desktop)
- **Move**: `W`, `A`, `S`, `D` or `Arrow Keys`
- **Interact / Talk / Enter / Cycle TV**: `Space`, `Enter`, or `Z`
- **Sprint**: Hold `Shift`
- **Start Menu**: `Esc` or `M`
- **Navigate to Tile**: `Left-Click` anywhere on the map

### Touch / Mobile
- **Movement**: Virtual D-Pad on the bottom left
- **Action [A]**: Interact / Enter / Cycle TV
- **Sprint [B]**: Toggle running speed
- **Start [START]**: Open player menu (Trainer Card, Pokédex, Bag, Town Map, Save, Recruiter View)
- **Tap to Walk**: Tap any reachable location on screen to pathfind automatically

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual FX**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Graphics Engine**: Native HTML5 Canvas 2D with custom pixel rasterizer
- **Audio**: Web Audio API (Synthesized Chiptune) + Web Speech API (Text-to-Speech)

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.17+ or later
- npm, pnpm, or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/halcyon-past/openworld-portfolio.git
   cd openworld-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to explore Pallet Cloud!

### Building for Production

```bash
npm run build
npm run start
```

---

## 👤 About the Author

**Aritro Saha (Megh)**
- **Role**: Associate Software Developer at Bristol Myers Squibb
- **Specialization**: Resilient Distributed Pipelines, Cloud Architecture (AWS/GCP), AI Clinician Decision Support Systems, and Next.js / TypeScript Web Applications
- **Achievements**:
  - 🏆 **Hack4Bengal 3.0 Winner** (Built *PAWsitive*)
  - ⚔️ **LeetCode Knight** (Peak Rating: 1868, 630+ Solved, Top 6% Globally)
  - 🎓 **B.Tech Computer Science**, VIT Chennai (CGPA: 8.53 / 10.0)
- **Profiles**:
  - [GitHub](https://github.com/halcyon-past)
  - [LinkedIn](https://linkedin.com/in/aritro-saha)
  - [LeetCode](https://leetcode.com/u/aritrosaha2025/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).


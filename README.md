# 🎮 Aritro Saha — 2.5D Open-World RPG Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Canvas 2D](https://img.shields.io/badge/HTML5-Canvas_2D-E34F26?style=flat-square&logo=html5)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_API-orange?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

An immersive, retro Pokémon-inspired open-world developer portfolio set in **Pallet Cloud**. Explore interactive buildings, view live projects broadcasting on a high-definition town square **Mega Jumbotron TV**, visit the **Innovation Pokédex Center**, challenge the **Silicon Gym**, play retro minigames in the **Developer Arcade**, or toggle instantly to an executive **Recruiter Dossier** mode.

---

## 🌟 Key Highlights & Features

### 🕹️ Custom 2.5D Retro Game Engine
- **Hardware-Accelerated 60 FPS Canvas**: Built completely from scratch using native HTML5 Canvas 2D without heavy external game engines.
- **Dynamic 2.5D Perspective**: Depth-sorted rendering via Painter's algorithm with realistic occlusion between player, buildings, trees, and NPCs.
- **Precise 1-to-1 Collision & Navigation**:
  - Tight, accurate collision bounding boxes aligned to exact object bases.
  - Zero invisible blocker walls—wide, unobstructed pathways across the entire map.
  - Debounced obstacle collision bump sound (300ms throttle) ensuring smooth gliding along walls and scenery without audio stutter.
- **Procedural Pixel-Art Generation**: Over 40+ custom sprites generated in-memory via `SpriteGenerator` (buildings, interiors, NPCs, animated fountain, 128px jumbotron, and terrain tiles).
- **Intelligent BFS Shortest-Path Navigation**: Breadth-First Search pathfinding for one-tap travel across the town with an animated glowing waypoint marker.
- **Dual Responsive Control Scheme**: Full desktop keyboard controls plus a mobile-optimized **Virtual Gamepad** (D-Pad, `[A]` Interact, `[B]` Sprint, `[START]` Menu).

---

### 📺 High-Definition Mega Jumbotron TV
- **128x96 px Widescreen Stadium Display**: Positioned centrally in Pallet Cloud town square (`x: 11..14, y: 12..14`).
- **Retina-Crisp Visuals**: Anti-aliased high-quality downscaling (`imageSmoothingQuality = 'high'`) with clear rounded corners (`116x52 px` active screen area).
- **Live Rotating Project Previews**: Automatically cycles through Aritro's key engineering creations (*Quarantine*, *Structurify*, *Luffy Laser Dodge*, *PAWsitive*, *GlideConnect*, *EduHelper*) with real project screenshots every 5 seconds.
- **Interactive Channel Cycling**: Press **`[A]`** anywhere directly in front of the TV (`x: 11, 12, 13, y: 15`) to instantly cycle channels manually!
- **Broadcast Lower-Third Overlay**: High-contrast frosted glass banner with bold project title typography (`bold 8px`), golden tech badges (`bold 6.5px`), `CH 01/06` status indicator, pulsing red `🔴 LIVE` pill, and animated slide countdown timer.

---

### 🔊 Advanced Multi-Channel Audio & Settings System
- **Dedicated Settings Center (`SettingsModal`)**: Accessible from the top HUD gear icon or the in-game Start Menu (`[START]` / `Esc` / `M`).
- **Independent Volume Channels & Mutes**:
  1. **Background Music (BGM)**: Independent volume slider (0%–100%) and mute toggle for 8-bit chiptune melodies.
  2. **Sound Effects (SFX)**: Independent volume slider (0%–100%) with live test audio feedback and mute toggle.
  3. **Character Voices (TTS)**: Independent volume slider (0%–100%) and voice mute toggle.
  4. **Retro CRT TV Scanlines**: Switch on/off the authentic retro CRT television scanline overlay.
- **Automatic Settings Persistence**: All audio volumes, mute toggles, and CRT filter preferences persist across browser sessions in `localStorage`.
- **🐶 Synthesized Canine Puppy Voice Engine**:
  - Pixel Pup now uses a **100% custom synthesized Web Audio API puppy bark engine** (`playPuppyBark('happy')` - multi-tone "Arf! ... Arf-arf!").
  - Unnatural robotic TTS voice synthesis has been completely removed for the pet.
  - Dialogue typewriter text produces delightful canine micro-bark yips with pitch modulation.
- **Tailored NPC Voice Personas**:
  - **Aritro Saha (Tech Lead / Gym Leader)**: Natural, confident human voice profile (explicitly mapped to Daniel voice).
  - **Prof. Oak**: Distinguished, deep professor tone.
  - **Nurse Joy**: Sweet, cheerful high tone.
  - **Mart Clerk**: Crisp, polite shopkeeper pace.
  - **Arcade Host**: Energetic, upbeat retro tone.
  - **Town Notice Boards / Signs**: Clean, crisp public system announcer guide voice.

---

### 🏙️ Town Map & Interactive Landmarks

| Landmark | Grid Location | Footprint | Description |
| :--- | :--- | :--- | :--- |
| **⚡ Mega Jumbotron TV** | `x: 11..14, y: 12..14` | 3x1 Pillars (`y: 14`) | High-definition outdoor display showcasing rotating project previews. Walk up to row 15 and press **[A]** to cycle channels! |
| **🔴 Innovation Pokédex Center** | `x: 5..8, y: 14..16` | 4x3 Building | Inspect Aritro's full-stack & distributed creations with Pokémon-style battle stats, radar graphs, live links, and PyPI badges. |
| **🏢 Silicon Gym (BMS Arena)** | `x: 14..18, y: 22..25` | 5x4 Building | Explore enterprise systems engineering at Bristol Myers Squibb, distributed ETL pipelines, and 8 Gym Badges of Honor. |
| **🔵 Skill & Tech Stack Mart** | `x: 17..20, y: 14..16` | 4x3 Building | Full-fledged Poké Mart store where recruiters and engineers can browse skills by category, add items to their Cart, compose a project message, and generate an authentic Pokémon pixel-styled mail order. |
| **🔬 AI Research Lab** | `x: 19..23, y: 4..6` | 5x3 Building | Access the lab mainframe to view the Trainer Card, LeetCode Knight stats (1868 peak, 630+ solved), CGPA, and research publications. |
| **🏠 Aritro's Residence** | `x: 3..6, y: 4..6` | 4x3 Building | Contact terminal, social links (GitHub, LinkedIn, LeetCode, X), SiliconSync blog feed, and beatbox studio. |
| **🕹️ Developer Arcade Corner** | `x: 26..29, y: 14..16` | 4x3 Building | Playable retro minigames: *Developer Speed Test* (typing benchmark) and *Minimalist Python Snake*. |
| **⛲ Pallet Cloud Wishing Fountain** | `x: 11..12, y: 5..6` | 2x1 Basin (`y: 6`) | Animated marble fountain with procedural water droplet spray and concentric pool ripples. Toss in 100 PokéDollars for a CI/CD blessing! |
| **🦆 Swimming Lake Ducks** | `x: 1..4, y: 21..28` | Animated Wildlife | Cute pixel-art yellow ducklings and emerald mallards swimming leisurely in the southwestern lake with gentle bobbing and wake ripples. |
| **🪑 Scenic Rest Benches** | Multiple Locations | 1x1 Each | Cozy wooden benches in Town Square (`9, 13`), Northern Garden (`14, 5`), and Lakeshore Overlook (`5, 23`) for taking a breather. |
| **⚽ Interactive Soccer Pitch** | `x: 8, y: 6` | Physics Object | Soccer ball simulated with velocity and friction that bounces off boundaries when kicked across the lawn. |

---

### 🛒 Poké Mart Tech Stack Shopping Cart & Pixel Mail Generator
- **Categorized Inventory Catalog**: Browse all technical skills cleanly partitioned across:
  - **Languages**: Python, JavaScript, TypeScript, Java, C, SQL
  - **Frontend**: React.js, Next.js, Vue.js, Three.js, Tailwind CSS, HTML/CSS
  - **Backend**: PySpark, Node.js, Express.js, FastAPI, Flask, REST APIs, WebSockets
  - **Cloud & DevOps**: AWS (Lambda, S3, DynamoDB, Glue, SageMaker, Bedrock), GCP (BigQuery, Dataflow, Dataproc, Cloud Run, Pub/Sub, GCS, Vertex AI, AlloyDB), Azure (Data Factory, DevOps), Docker, Jenkins, Terraform
  - **AI/ML**: OpenAI, Google Gemini, Databricks, Spark, Langchain, Scikit-Learn, NLP, NER, Computer Vision, Pandas, NumPy
  - **Databases**: SQL, PostgreSQL, MongoDB, DynamoDB, ElasticSearch, Firestore
  - **Tools**: Git, Linux, Postman, JIRA
- **Interactive Shopping Cart**: Select and add desired engineering capabilities to your cart with instant badge counters, remove options, and order summaries.
- **Project Message & Checkout Flow**: Click "PROCEED TO ORDER" to open the requisition desk where recruiters can fill in their Name, Email, Organization/Role, and customized project inquiry.
- **Real Graphical Pokémon HTML Mail Format**:
  - Full graphical layout featuring a diagonal airmail chevron border ribbon, retro Silph Co. Pallet Town postage seal, graphical red/white Pokéball emblem, and routing dossier.
  - Project inquiry message callout box.
  - Ordered skills organized in clean **side-by-side categorized cards** with type badges, level pills, and star ratings.
- **Direct 1-Click Graphical Email Transmission**:
  - Clicking **`DISPATCH ORDER DIRECTLY ►`** sends the complete graphical HTML email directly to `aritrosaha2025@gmail.com` via the backend endpoint (`/api/send-order`).
  - Seamlessly falls back to launching the user's email client (`mailto:`) with pre-filled destination, subject, and auto-copied rich graphical HTML onto the clipboard if an offline or unconfigured environment is encountered.
- **One-Click Rich HTML Clipboard Copy (`COPY GRAPHICAL MAIL (HTML)`)**: Copies the rendered layout as a native rich HTML table directly onto the system clipboard for pasting directly into Gmail, Outlook, or Apple Mail.

---

### 📄 Executive Recruiter Dossier Mode
For hiring managers and recruiters who prefer a fast, streamlined review:
- **One-Click Instant Toggle**: Switch between the 2.5D game world and an executive portfolio dossier view at any time.
- **Direct Resume Download**: Instant access to Aritro's latest software engineering resume.
- **Enterprise Highlights**: Bristol Myers Squibb experience, Hack4Bengal 3.0 championship breakdown, and technical stack summary.
- **SEO & Metadata Optimization**: Fully configured OpenGraph cards, Twitter preview cards, dynamic `sitemap.xml`, and `robots.txt`.

---

## 🚀 Controls

### Keyboard (Desktop)
- **Move**: `W`, `A`, `S`, `D` or `Arrow Keys`
- **Interact / Talk / Enter / Cycle TV**: `Space`, `Enter`, or `Z`
- **Sprint**: Hold `Shift` or `B`
- **Start Menu**: `Esc` or `M`
- **Navigate / Tap-to-Walk**: `Left-Click` anywhere on the map

### Touch / Mobile
- **Movement**: Virtual D-Pad on the bottom left
- **Action [A]**: Interact / Talk / Enter / Cycle TV
- **Sprint [B]**: Toggle running speed
- **Menu [START]**: Open player start menu (Trainer Card, Pokédex, Bag, Settings, Recruiter View)
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
- **Audio Engine**: Web Audio API (Synthesized Chiptune & Puppy Barks) + Web Speech API (Character Voices)

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


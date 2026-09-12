export interface Project {
  id: string;
  dexNumber: string;
  title: string;
  subtitle: string;
  description: string;
  overview: string;
  features: string[];
  techStack: string[];
  pokemonType: [string, string];
  color: string;
  image: string;
  github?: string;
  liveDemo?: string;
  pypi?: string;
  docs?: string;
  researchPaper?: string;
  stats: {
    label: string;
    value: number; // 0 to 100
  }[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  description: string[];
  technologies: string[];
  badgeName: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  highlights: string[];
}

export interface GymBadge {
  id: string;
  name: string;
  gymCity: string;
  leaderTitle: string;
  description: string;
  iconColor: string;
  unlocked: boolean;
}

export interface SkillPocket {
  category: string;
  pocketName: string;
  icon: string;
  items: {
    name: string;
    level: string;
    description: string;
    tag: string;
  }[];
}

export interface SocialLink {
  platform: string;
  username: string;
  url: string;
  color: string;
  description: string;
}

export const PORTFOLIO_DATA = {
  trainer: {
    name: "Aritro Saha",
    alias: "Megh",
    title: "Associate Software Developer",
    company: "Bristol Myers Squibb",
    idNo: "2025-BMS",
    level: 99,
    money: "999,999",
    pokedexSeen: 6,
    pokedexCaught: 6,
    badgesCount: 8,
    location: "Pallet Cloud, Tech Region",
    avatar: "/assets/profile.webp",
    bio: "Passionate Data Science Engineer with strong footing in Full Stack Development. I bridge the gap between backend resilience, scalable cloud architectures, and intuitive user experiences. When not crafting code, I'm beatboxing, playing football, or building retro browser experiences.",
    quote: "Every exception caught is a step closer to zero-crash production.",
  },

  projects: [
    {
      id: "quarantine",
      dexNumber: "#001",
      title: "Quarantine",
      subtitle: "Zero-dependency dead-letter queue and fault-tolerance library for Python loops",
      description: "Zero-dependency dead-letter queue and fault-tolerance library for Python loops. Safely isolates failing items during multi-hour pipelines without crashing.",
      overview: "Quarantine is an open-source, zero-dependency Python library that brings dead-letter queue resilience to regular loops and batch data pipelines. When processing thousands of records (e.g., CSV ingestion, scraping, API syncing), an unexpected exception at item #5,247 no longer crashes the entire multi-hour run. quarantine safely isolates the failing item, captures the error and full execution state to disk, and keeps the loop running.",
      features: [
        "Zero-Crash Decorators: Wrap sync or async loops with @quarantine to isolate exceptions.",
        "Atomic On-Disk Isolation: Serializes failed items and full tracebacks atomically to disk (.quarantine/).",
        "Surgical Replays: Re-run only failed records using 'quarantine retry' or drop into pdb with 'quarantine debug'.",
        "Circuit Breakers: Automatic circuit breaker tripping via halt_after to prevent cascading outages.",
        "CLI & Dashboard: Built-in CLI commands and local web dashboard to inspect tracebacks and recovery stats."
      ],
      techStack: ["Python 3.9+", "PyPI", "AsyncIO", "CLI", "Dead-Letter Queue", "Fault Tolerance", "Pytest"],
      pokemonType: ["Steel", "Poison"],
      color: "#f43f5e",
      image: "/assets/Quarantine.webp",
      github: "https://github.com/halcyon-past/quarantine",
      pypi: "https://pypi.org/project/quarantine-py/",
      liveDemo: "https://pypi.org/project/quarantine-py/",
      docs: "https://quarantine-py.aritro.cloud",
      stats: [
        { label: "Fault Tolerance", value: 98 },
        { label: "Isolation Speed", value: 95 },
        { label: "Reliability", value: 99 },
        { label: "Code Health", value: 96 }
      ]
    },
    {
      id: "structurify",
      dexNumber: "#002",
      title: "Structurify",
      subtitle: "AI-powered SaaS that transforms messy spreadsheet data into a clean master schema",
      description: "Production-ready B2B SaaS platform turning messy spreadsheets into pristine standardized schemas via Google Gemini and GCP serverless fan-out.",
      overview: "Structurify is a production-ready, event-driven B2B SaaS platform that turns unstructured CSV and XLSX files into a standardized schema using Google Gemini, with a serverless fan-out architecture on GCP for resilient, scalable processing.",
      features: [
        "Strict Schema Enforcement: Enforces exact JSON and Excel structures with reliable type-casting and validation.",
        "Sandbox Preview Mode: Lets users validate the first 10 rows before launching full cluster workloads.",
        "Auto-Clean Mode: Infers schema from headers and normalizes capitalization, whitespace, and date formats automatically.",
        "Serverless Fan-Out Pipeline: Uses Cloud Pub/Sub, Cloud Run workers, and LangGraph map-reduce flow.",
        "Real-Time Observability: Streams job progress, audit logs, and secure download links through Firestore live updates."
      ],
      techStack: ["Next.js 14", "React", "TailwindCSS", "Firebase", "FastAPI", "Python", "LangGraph", "Google Gemini", "GCP"],
      pokemonType: ["Psychic", "Electric"],
      color: "#10b981",
      image: "/assets/Structurify.webp",
      github: "https://github.com/halcyon-past/Structurify",
      liveDemo: "https://structurify.aritro.cloud",
      stats: [
        { label: "Inference Speed", value: 92 },
        { label: "Schema Strictness", value: 99 },
        { label: "Cloud Scalability", value: 96 },
        { label: "Data Quality", value: 94 }
      ]
    },
    {
      id: "luffy-laser-dodge",
      dexNumber: "#003",
      title: "Luffy Laser Dodge",
      subtitle: "Interactive 3D reflex game dodging laser beams using actual head movements via webcam",
      description: "Interactive 3D reflex game dodging laser beams using physical head movements in real time via MediaPipe WASM and Three.js.",
      overview: "Luffy Laser Dodge is an interactive, browser-based 3D reflex game where you use your actual head movements via webcam to dodge laser beams shot by Kuma! The game seamlessly melds computer vision with 3D web rendering to create a unique physically interactive experience—all running 100% locally in your browser.",
      features: [
        "Real-Time AI Head Tracking: Uses Google's MediaPipe via WebAssembly (WASM) to detect face and lean angles instantly.",
        "Dynamic 3D Scene: Powered by Three.js and React Three Fiber with fully rigged 3D models with bone-level procedural animation.",
        "100% Client-Side GPU Processing: Webcam data is processed entirely on the local device for zero latency and privacy.",
        "Serverless WASM Architecture: Zero backend latency with full physics simulation directly in browser workers."
      ],
      techStack: ["React", "Vite", "React Three Fiber", "Three.js", "MediaPipe AI", "WebAssembly", "FastAPI"],
      pokemonType: ["Fighting", "Flying"],
      color: "#f59e0b",
      image: "/assets/luffy-laser-dodge.webp",
      github: "https://github.com/halcyon-past/Luffy-Laser-Dodge",
      liveDemo: "https://onepiece.aritro.cloud/",
      stats: [
        { label: "Tracking Latency", value: 98 },
        { label: "3D Animation", value: 94 },
        { label: "Reflex Challenge", value: 96 },
        { label: "Creativity", value: 100 }
      ]
    },
    {
      id: "glide-connect",
      dexNumber: "#004",
      title: "GlideConnect",
      subtitle: "Virtual Mouse Control using Gesture Recognition and Voice Assistant Krishna",
      description: "Final Year VIT Capstone project featuring contactless mouse control via MediaPipe hand tracking and Gemini-powered voice assistant Krishna.",
      overview: "A Final Year Project for VIT, this project demonstrates a novel way to control a computer interface using hand gestures and voice commands. It leverages MediaPipe for real-time gesture recognition, integrates a custom voice assistant named Krishna, and incorporates generative AI (using Google Gemini) for enhanced query responses.",
      features: [
        "Cursor Control: Move the mouse pointer with sub-pixel precision using fingertip tracking.",
        "Gestural Clicks: Left, right, and double-clicks mapped to distinct finger pinch gestures.",
        "System Controls: Adjust system volume and screen brightness smoothly using pinch sliders.",
        "Voice Assistant (Krishna): Hands-free system navigation, app launching, and web searches.",
        "Divine Mode (GenAI): Multi-modal screen reasoning powered by Google Gemini Flash."
      ],
      techStack: ["Python 3.9", "MediaPipe", "OpenCV", "Google Gemini API", "PyAutoGUI", "PyCAW"],
      pokemonType: ["Psychic", "Dragon"],
      color: "#3b82f6",
      image: "/assets/GlideConnect.webp",
      github: "https://github.com/halcyon-past/Glide-Connect",
      researchPaper: "https://ijirt.org/article?manuscript=180711",
      stats: [
        { label: "Gesture Accuracy", value: 93 },
        { label: "Voice Latency", value: 91 },
        { label: "Research Rigor", value: 98 },
        { label: "Innovation", value: 95 }
      ]
    },
    {
      id: "pawsitive",
      dexNumber: "#005",
      title: "PAWsitive",
      subtitle: "Centralized Platform for Pet Healthcare & Blood Donors (Hack4Bengal 3.0 Winner)",
      description: "Award-winning centralized platform for pet healthcare, blood donor coordination, and emergency vet clinic discovery.",
      overview: "PAWsitive is a comprehensive web application designed to help pet owners find blood donors, veterinary clinics, and rescue centers with ease. Built at Hack4Bengal, Eastern India's Largest Hackathon, where it won 1st place overall.",
      features: [
        "Blood Donors & Vet Directory: Real-time search and geo-filtering for pet emergency services.",
        "Rescue Centers Directory: Ambulance dispatch and hospital connectivity for stray and domestic animals.",
        "Registration Portals: Verified clinic portals, donor profiles, and adoption event registries.",
        "AI Veterinary Chatbot: Gemini-powered diagnostic assistant for instant first-aid guidance.",
        "Voice Support: Accessible telephone support integration via Callchimp.AI."
      ],
      techStack: ["React", "Next.js", "TypeScript", "MongoDB", "Tailwind CSS", "Node.js", "Kinde Auth", "Callchimp.AI"],
      pokemonType: ["Fairy", "Normal"],
      color: "#8b5cf6",
      image: "/assets/Pawsitive.webp",
      github: "https://github.com/halcyon-past/PAW-sitive",
      liveDemo: "https://www.bepawsitive.xyz",
      stats: [
        { label: "Hackathon Impact", value: 100 },
        { label: "Full Stack Quality", value: 95 },
        { label: "UX Empathy", value: 97 },
        { label: "Reliability", value: 94 }
      ]
    },
    {
      id: "siliconsync",
      dexNumber: "#006",
      title: "SiliconSync & Veripyed",
      subtitle: "Daily AI Engineering News Platform & Video Tech Channel",
      description: "Automated daily tech intelligence curation engine analyzing breakthroughs in LLMs, robotics, and cloud infra, paired with YouTube tutorials.",
      overview: "SiliconSync is a daily AI news blog that aggregates and breaks down breakthrough papers and enterprise developments in artificial intelligence. Paired with @veripyed on YouTube, Aritro creates video deep-dives exploring software engineering and AI implementations.",
      features: [
        "Daily Automated AI Digest: Synthesizes top arxiv preprints, open-source models, and developer tooling.",
        "YouTube Deep-Dives: Tutorials on Python distributed patterns, Next.js optimization, and computer vision.",
        "Clean Minimalist Reader: Lightning-fast markdown reading experience with syntax highlighting."
      ],
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Markdown", "YouTube Studio", "Content Delivery"],
      pokemonType: ["Electric", "Psychic"],
      color: "#06b6d4",
      image: "/assets/Eduhelper.webp",
      liveDemo: "https://siliconsync.aritro.cloud/",
      docs: "https://www.youtube.com/@veripyed",
      stats: [
        { label: "Content Quality", value: 96 },
        { label: "Engineering Depth", value: 94 },
        { label: "Community Reach", value: 91 },
        { label: "Consistency", value: 95 }
      ]
    }
  ] as Project[],

  experience: [
    {
      id: "bms",
      role: "Associate Software Developer",
      company: "Bristol Myers Squibb",
      location: "Hyderabad, India",
      duration: "July 2025 - Present",
      badgeName: "Enterprise Badge",
      description: [
        "Architecting robust full-stack applications and automated data pipelines for enterprise biopharma platforms.",
        "Integrating scalable cloud systems, microservices, and continuous automated verification workflows.",
        "Championing clean code standards, resilient async exception handling, and high test coverage."
      ],
      technologies: ["TypeScript", "React", "Python", "Databricks", "Cloud Infrastructure", "CI/CD", "Enterprise Architecture"]
    },
    {
      id: "bajaj",
      role: "Data Science Intern",
      company: "Bajaj Finserv Health",
      location: "Pune, India (Remote)",
      duration: "Feb 2025 - June 2025",
      badgeName: "HealthTech Badge",
      description: [
        "Engineered predictive machine learning pipelines and health risk scoring algorithms on large datasets.",
        "Optimized ETL workflows, reducing pipeline latency and boosting feature engineering throughput.",
        "Collaborated with cross-functional healthcare product teams to deliver actionable analytics."
      ],
      technologies: ["Python", "Pandas", "Scikit-Learn", "FastAPI", "SQL", "Predictive Modeling"]
    },
    {
      id: "wipro",
      role: "Full Stack Developer Intern",
      company: "Wipro",
      location: "Kolkata, India",
      duration: "Oct 2023 - Dec 2023",
      badgeName: "FullStack Badge",
      description: [
        "Built responsive web interfaces and integrated RESTful backend services using React and Node.js.",
        "Implemented secure JWT authentication workflows and optimized relational database queries.",
        "Participated in agile sprints, daily standups, and rigorous peer code reviews."
      ],
      technologies: ["React", "Node.js", "Express", "REST APIs", "MySQL", "JavaScript"]
    }
  ] as Experience[],

  education: [
    {
      degree: "B.Tech in Electronics and Computer Engineering",
      institution: "Vellore Institute of Technology, Chennai",
      year: "2021 - 2025",
      highlights: [
        "Graduated with Distinction in Core Computer Science, Operating Systems, and Distributed Computing.",
        "Capstone: GlideConnect (Virtual gesture control & voice assistant), published in IJIRT research journal.",
        "Active member of tech innovation clubs and hackathon leadership teams."
      ]
    },
    {
      degree: "High School (Science & Mathematics)",
      institution: "Birla Bharati",
      year: "2021",
      highlights: [
        "Focused on Mathematics, Physics, Chemistry, and Computer Science.",
        "Captain of school football team and lead organizer for annual cultural festivals."
      ]
    }
  ] as Education[],

  badges: [
    {
      id: "hackathon",
      name: "Hack4Bengal Champion",
      gymCity: "Kolkata Arena",
      leaderTitle: "Hackathon Victor",
      description: "Awarded for winning 1st Place overall at Eastern India's largest hackathon with PAWsitive.",
      iconColor: "#f59e0b",
      unlocked: true
    },
    {
      id: "bms",
      name: "Enterprise Dev",
      gymCity: "BMS Silicon Gym",
      leaderTitle: "Associate Developer",
      description: "Building production-grade biopharma software systems at Bristol Myers Squibb.",
      iconColor: "#3b82f6",
      unlocked: true
    },
    {
      id: "vit",
      name: "VIT Chennai Scholar",
      gymCity: "Vellore Academy",
      leaderTitle: "B.Tech Graduate",
      description: "Completed B.Tech in Electronics & Computer Engineering with published research.",
      iconColor: "#10b981",
      unlocked: true
    },
    {
      id: "pypi",
      name: "PyPI Package Author",
      gymCity: "Python Foundry",
      leaderTitle: "Open Source Creator",
      description: "Published 'quarantine-py' - zero-crash dead-letter queue resilience for Python.",
      iconColor: "#ef4444",
      unlocked: true
    },
    {
      id: "genai",
      name: "GenAI Architect",
      gymCity: "Gemini Citadel",
      leaderTitle: "Agentic AI Specialist",
      description: "Implemented LangGraph multi-agent systems and Google Gemini multimodal reasoning.",
      iconColor: "#8b5cf6",
      unlocked: true
    },
    {
      id: "wasm",
      name: "3D & WASM Master",
      gymCity: "Kinematics Studio",
      leaderTitle: "Three.js Craftsman",
      description: "Integrated MediaPipe AI face tracking with Three.js rigged procedural meshes.",
      iconColor: "#06b6d4",
      unlocked: true
    },
    {
      id: "beatbox",
      name: "Rhythm & Beatbox",
      gymCity: "Acoustic Corner",
      leaderTitle: "Audio Virtuoso",
      description: "Mastered vocal percussion, polyrhythmic beatboxing, and acoustic artistry.",
      iconColor: "#ec4899",
      unlocked: true
    },
    {
      id: "arcade",
      name: "Arcade Champion",
      gymCity: "Developer Game Corner",
      leaderTitle: "Retro Minigame Master",
      description: "Tested Developer Speed Typing and Minimalist Snake with high-score precision.",
      iconColor: "#eab308",
      unlocked: true
    }
  ] as GymBadge[],

  skillPockets: [
    {
      category: "Languages",
      pocketName: "Key Items",
      icon: "key",
      items: [
        { name: "Python", level: "Expert", description: "AsyncIO, PyPI package author, NumPy, Pandas, Scikit-Learn, Pytest", tag: "Core" },
        { name: "TypeScript", level: "Advanced", description: "Strict type systems, Next.js App Router, modern async patterns", tag: "Frontend" },
        { name: "JavaScript (ES6+)", level: "Expert", description: "Modern event-driven web architecture, DOM, Web Workers", tag: "Web" },
        { name: "SQL", level: "Advanced", description: "Relational modeling, query optimization, PostgreSQL, MySQL", tag: "Data" },
        { name: "C / C++", level: "Intermediate", description: "Data structures, memory allocation, microcontrollers", tag: "Systems" }
      ]
    },
    {
      category: "Frameworks & UI",
      pocketName: "Poké Balls",
      icon: "disc",
      items: [
        { name: "Next.js 14 / 15", level: "Advanced", description: "Server Components, dynamic routes, layout streaming, SEO", tag: "FullStack" },
        { name: "React 18 / 19", level: "Expert", description: "Hooks, custom state engines, concurrent rendering, Fiber", tag: "UI" },
        { name: "FastAPI", level: "Advanced", description: "Asynchronous REST endpoints, Pydantic schemas, OpenAPI", tag: "API" },
        { name: "Three.js / R3F", level: "Advanced", description: "3D scene graphs, lighting, rigged animations, WebGL", tag: "3D" },
        { name: "Tailwind CSS", level: "Expert", description: "Responsive layouts, custom retro design systems, modern animations", tag: "Styling" }
      ]
    },
    {
      category: "Cloud, AI & DevOps",
      pocketName: "TMs & HMs",
      icon: "zap",
      items: [
        { name: "Google Gemini API", level: "Advanced", description: "Multimodal prompts, structured JSON outputs, function calling", tag: "GenAI" },
        { name: "LangGraph", level: "Advanced", description: "Multi-agent orchestration, map-reduce fan-out pipelines", tag: "Agents" },
        { name: "Google Cloud Platform", level: "Advanced", description: "Cloud Run, Pub/Sub, Cloud Storage, Serverless workers", tag: "Cloud" },
        { name: "Databricks", level: "Intermediate", description: "Big data processing, Spark jobs, unified enterprise analytics", tag: "Enterprise" },
        { name: "Docker", level: "Advanced", description: "Multi-stage container builds, reproducibility, orchestration", tag: "DevOps" },
        { name: "Git & GitHub Actions", level: "Advanced", description: "CI/CD pipelines, semantic release, automated testing", tag: "Tooling" }
      ]
    },
    {
      category: "Databases & Libraries",
      pocketName: "Medicine & Items",
      icon: "shield",
      items: [
        { name: "MongoDB", level: "Advanced", description: "Document schemas, aggregation pipelines, replica sets", tag: "NoSQL" },
        { name: "Firebase / Firestore", level: "Advanced", description: "Real-time subscriptions, security rules, offline persistence", tag: "Realtime" },
        { name: "MediaPipe AI", level: "Advanced", description: "WASM computer vision, face mesh, hand landmarks", tag: "Vision" },
        { name: "Web Audio API", level: "Advanced", description: "Synthesizer oscillators, gain envelopes, chiptune sound generation", tag: "Audio" },
        { name: "HTML5 Canvas", level: "Advanced", description: "High performance 60FPS 2D/2.5D game rendering and sprite pipelines", tag: "Canvas" }
      ]
    }
  ] as SkillPocket[],

  socials: [
    {
      platform: "LinkedIn",
      username: "aritro-saha",
      url: "https://linkedin.com/in/aritro-saha",
      color: "#0a66c2",
      description: "Connect for professional collaborations and engineering discussions"
    },
    {
      platform: "GitHub",
      username: "halcyon-past",
      url: "https://github.com/halcyon-past",
      color: "#333333",
      description: "Explore open-source repositories, packages, and experiments"
    },
    {
      platform: "YouTube",
      username: "@veripyed",
      url: "https://www.youtube.com/@veripyed",
      color: "#ff0000",
      description: "Watch video tutorials on AI engineering and coding projects"
    },
    {
      platform: "Instagram",
      username: "halcyon-past",
      url: "https://instagram.com/halcyon-past",
      color: "#e1306c",
      description: "Follow creative endeavors, beatboxing, and football snippets"
    },
    {
      platform: "AI Tech Blog",
      username: "SiliconSync",
      url: "https://siliconsync.aritro.cloud/",
      color: "#10b981",
      description: "Read daily synthesized AI research and engineering news"
    }
  ] as SocialLink[]
};

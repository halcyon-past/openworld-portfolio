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
    title: "Associate Software Engineer",
    company: "Bristol Myers Squibb",
    idNo: "2025-BMS",
    level: 99,
    money: "999,999",
    pokedexSeen: 6,
    pokedexCaught: 6,
    badgesCount: 8,
    location: "Pallet Cloud, Tech Region",
    phone: "+919043150635",
    email: "aritrosaha2025@gmail.com",
    avatar: "/assets/profile.webp",
    bio: "Associate Software Engineer at Bristol Myers Squibb with a strong background in distributed data pipelines, cloud architecture (AWS/GCP), and AI clinical decision support systems. LeetCode Knight (Peak Rating: 1868, 630+ solved, Top 6% globally), Hack4Bengal 3.0 Winner, and VIT Chennai graduate.",
    quote: "Every exception caught is a step closer to zero-crash production.",
    cgpa: "8.53 / 10.0",
    leetcode: {
      rating: 1868,
      rank: "Knight Badge (Top 6% Globally)",
      solved: "630+ Problems"
    }
  },

  projects: [
    {
      id: "quarantine",
      dexNumber: "#001",
      title: "Quarantine",
      subtitle: "Resilient Error-Handling & Dead-Letter Queue Library for Python ETL",
      description: "Resilient error-handling library for Python ETL pipelines with dynamic dead-letter queues preventing batch failures for loops of 10,000+ items.",
      overview: "Quarantine is an open-source, resilient error-handling library for Python ETL pipelines. It implements a dynamic dead-letter queue that prevents batch failures and ensures continuous execution for loops of 10,000+ items. Integrates with AWS, Azure, and GCP to isolate malformed records, reducing debugging and data recovery time by over 40%. Distributed via GitHub Actions CI/CD to PyPI and Conda-Forge.",
      features: [
        "Dynamic Dead-Letter Queue: Prevents batch failures and ensures continuous execution for multi-hour loops of 10,000+ items.",
        "Multi-Cloud Error Isolation: Integrates with AWS, Azure, and GCP to isolate malformed records, reducing debugging time by over 40%.",
        "Automated Multi-Platform CI/CD: Automated distribution via GitHub Actions to both PyPI and Conda-Forge.",
        "Production Reliability: Maintains strict semantic versioning and >90% test coverage with surgical replay CLI tooling."
      ],
      techStack: ["Python", "AWS", "Azure", "GCP", "CI/CD", "Conda-Forge", "PyPI", "Pytest"],
      pokemonType: ["Steel", "Poison"],
      color: "#f43f5e",
      image: "/assets/Quarantine.webp",
      github: "https://github.com/halcyon-past/quarantine",
      pypi: "https://pypi.org/project/quarantine-py/",
      liveDemo: "https://pypi.org/project/quarantine-py/",
      docs: "https://quarantine-py.aritro.cloud",
      stats: [
        { label: "Loop Resilience", value: 99 },
        { label: "Isolation Speed", value: 96 },
        { label: "Test Coverage", value: 92 },
        { label: "Recovery Boost", value: 95 }
      ]
    },
    {
      id: "structurify",
      dexNumber: "#002",
      title: "Structurify: ETL Data Pipeline",
      subtitle: "Serverless Fan-Out Architecture with LangGraph, Gemini & GCP",
      description: "Serverless fan-out architecture on GCP with Cloud Run and Pub/Sub processing up to 1M rows with 99.8% schema validation accuracy.",
      overview: "Structurify is an enterprise-grade ETL data pipeline with a serverless fan-out architecture on GCP utilizing Cloud Run and Pub/Sub. Decouples API gateways to process datasets of up to 1M rows, eliminating server timeouts and ensuring 99% availability under high-concurrency burst loads. Utilizes a LangGraph and Gemini AI Map-Reduce pipeline with retry state machines, DuckDB aggregation, and Firestore real-time client synchronization.",
      features: [
        "Serverless Fan-Out on GCP: Uses Cloud Run and Pub/Sub to process datasets up to 1M rows with 99% availability under burst loads.",
        "LangGraph & Gemini Map-Reduce: Fault-tolerant ETL pipeline with dynamic batching and retry state machine achieving 99.8% schema validation accuracy.",
        "Distributed DuckDB Aggregation: Compiles multi-vendor chunks over 40% faster while tracking atomic LLM token usage in Firestore for enterprise billing.",
        "Sub-200ms Real-Time Client: Next.js frontend synchronized with Firestore listeners delivering sub-200ms live progress updates authenticated via Firebase Identity Platform."
      ],
      techStack: ["GCP", "Cloud Run", "Pub/Sub", "LangGraph", "Google Gemini", "DuckDB", "Next.js", "Firebase", "Terraform"],
      pokemonType: ["Psychic", "Electric"],
      color: "#10b981",
      image: "/assets/Structurify.webp",
      github: "https://github.com/halcyon-past/Structurify",
      liveDemo: "https://structurify.aritro.cloud",
      stats: [
        { label: "Schema Accuracy", value: 99 },
        { label: "Throughput (1M Rows)", value: 97 },
        { label: "Latency (<200ms)", value: 95 },
        { label: "Availability", value: 99 }
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
      role: "Associate Software Engineer",
      company: "Bristol Myers Squibb",
      location: "Hyderabad, India",
      duration: "Jul 2025 – Present",
      badgeName: "Enterprise Badge",
      description: [
        "Reduced diagnostic review time for NSCLC cases by 30%, by architecting a medical diagnostic assistant with LLM-driven clinical decision support and system design integration.",
        "Reduced release cycle time by 40+ engineering hours per cycle, by architecting a company-wide Databricks accelerator with standardized ETL/ELT microservices and YAML-driven CI/CD pipeline generation.",
        "Owned end-to-end delivery of a self-service LLM marketplace plugin adopted by 20+ internal teams, sharply reducing recurring support tickets by replacing manual deployment requests with automated workflows.",
        "Scaled data ingestion to handle 5M+ records per hour by building serverless, distributed AWS Lambda pipelines with Glue-crawler metadata enrichment and DynamoDB persistence."
      ],
      technologies: ["Python", "Spark Databricks", "SQL", "AWS Lambda", "AWS S3", "DynamoDB", "AWS Glue", "AWS Bedrock", "SageMaker", "OpenSearch", "Redshift"]
    },
    {
      id: "bajaj",
      role: "Data Science Engineer Intern",
      company: "Bajaj Finserv Health",
      location: "Pune, India",
      duration: "Feb 2025 – Jun 2025",
      badgeName: "HealthTech Badge",
      description: [
        "Cut OPD claims processing failure rate by 60%, by redesigning a distributed, vision-based NER pipeline scaled to 40,000+ claims/day.",
        "Designed and implemented a regex-based NER mapping service for ICD-10 codes, eliminating third-party API dependencies and accelerating throughput by 98%.",
        "Improved P99 backend latency by 35% (800ms to 520ms), by refactoring FastAPI endpoint serialization and adding unit test coverage across critical paths."
      ],
      technologies: ["Python", "FastAPI", "ElasticSearch", "MongoDB", "Google Gemini", "OpenAI", "Azure DevOps"]
    },
    {
      id: "wipro",
      role: "Software Engineering Intern",
      company: "WIPRO",
      location: "Kolkata, India",
      duration: "Oct 2023 – Dec 2023",
      badgeName: "FullStack Badge",
      description: [
        "Built a 3D visualization engine in Three.js with optimized asset loading, making client-side render times roughly 3x faster.",
        "Increased deployment frequency by 50%, by automating CI/CD pipelines with Docker and Azure DevOps."
      ],
      technologies: ["React.js", "Node.js", "Three.js", "Git", "Docker", "Azure"]
    }
  ] as Experience[],

  education: [
    {
      degree: "Bachelor of Technology in Electronics and Computer Engineering",
      institution: "Vellore Institute of Technology",
      year: "Sep 2021 – Jul 2025",
      highlights: [
        "Graduated with CGPA: 8.53 / 10.0 from VIT Chennai, India.",
        "Published Research: KrishnaVision (Multimodal Virtual Interface for Context-Aware HCI) in IJIRT journal.",
        "Competitive Programming: LeetCode Knight Badge (Peak Rating: 1868, solved 630+ questions, top 6% globally)."
      ]
    }
  ] as Education[],

  badges: [
    {
      id: "hackathon",
      name: "Hack4Bengal Champion",
      gymCity: "Kolkata Arena",
      leaderTitle: "Hackathon Victor",
      description: "Won 1st Place overall at Eastern India's largest hackathon with PAWsitive.",
      iconColor: "#f59e0b",
      unlocked: true
    },
    {
      id: "bms",
      name: "Enterprise Dev",
      gymCity: "BMS Silicon Gym",
      leaderTitle: "Associate Software Engineer",
      description: "Bristol Myers Squibb: Scaled AWS Lambda to 5M+ records/hr, Databricks accelerators, and NSCLC AI assistants.",
      iconColor: "#3b82f6",
      unlocked: true
    },
    {
      id: "vit",
      name: "VIT Chennai Scholar",
      gymCity: "Vellore Academy",
      leaderTitle: "B.Tech Graduate",
      description: "B.Tech in Electronics & Computer Engineering (CGPA: 8.53/10.0).",
      iconColor: "#10b981",
      unlocked: true
    },
    {
      id: "leetcode",
      name: "LeetCode Knight",
      gymCity: "Algorithm Citadel",
      leaderTitle: "Peak Rating 1868",
      description: "Solved 630+ algorithmic problems, placing in the top 6 percentile globally.",
      iconColor: "#eab308",
      unlocked: true
    },
    {
      id: "pypi",
      name: "PyPI Package Author",
      gymCity: "Python Foundry",
      leaderTitle: "Open Source Creator",
      description: "Published 'quarantine-py' & Conda-Forge package for fault-tolerant Python ETL loops.",
      iconColor: "#ef4444",
      unlocked: true
    },
    {
      id: "genai",
      name: "GenAI Architect",
      gymCity: "Gemini Citadel",
      leaderTitle: "Agentic AI Specialist",
      description: "LangGraph map-reduce ETL, Gemini AI dynamic batching, and 99.8% schema accuracy.",
      iconColor: "#8b5cf6",
      unlocked: true
    },
    {
      id: "wasm",
      name: "KrishnaVision Author",
      gymCity: "IJIRT Publications",
      leaderTitle: "HCI Researcher",
      description: "Published multimodal virtual mouse achieving 97.3% accuracy at 22ms latency in IJIRT.",
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
    }
  ] as GymBadge[],

  skillPockets: [
    {
      category: "Core Languages",
      pocketName: "Key Items",
      icon: "key",
      items: [
        { name: "Python", level: "Expert", description: "AsyncIO, PyPI package author, ETL pipelines, Pandas, Pytest", tag: "Core" },
        { name: "SQL", level: "Advanced", description: "Complex queries, Redshift, relational schema modeling", tag: "Data" },
        { name: "TypeScript", level: "Advanced", description: "Strict type-safe systems, Next.js, asynchronous architectures", tag: "FullStack" },
        { name: "JavaScript", level: "Expert", description: "Event-driven programming, React.js, Node.js runtime", tag: "Web" },
        { name: "Spark / PySpark", level: "Advanced", description: "Distributed dataframes, Databricks accelerators, batch transformations", tag: "BigData" }
      ]
    },
    {
      category: "Cloud, AWS & DevOps",
      pocketName: "TMs & HMs",
      icon: "zap",
      items: [
        { name: "AWS Suite", level: "Expert", description: "Lambda, S3, DynamoDB, Glue, Bedrock, SageMaker, OpenSearch, Redshift", tag: "AWS" },
        { name: "Spark Databricks", level: "Advanced", description: "Standardized ETL/ELT microservices, YAML-driven CI/CD generation", tag: "Databricks" },
        { name: "GCP (Google Cloud)", level: "Advanced", description: "Cloud Run serverless fan-out, Pub/Sub message decoupling", tag: "GCP" },
        { name: "Azure DevOps & Docker", level: "Advanced", description: "Multi-stage containers, automated CI/CD deployment pipelines", tag: "DevOps" },
        { name: "Terraform & IaC", level: "Intermediate", description: "Declarative cloud infrastructure provisioning and scaling", tag: "Infra" }
      ]
    },
    {
      category: "AI, ML & Frameworks",
      pocketName: "Poké Balls",
      icon: "disc",
      items: [
        { name: "LangGraph", level: "Advanced", description: "Fault-tolerant Map-Reduce pipelines, retry state machines", tag: "Agents" },
        { name: "Google Gemini & OpenAI", level: "Advanced", description: "Clinical decision support, vision-based NER, structured outputs", tag: "GenAI" },
        { name: "FastAPI", level: "Advanced", description: "High-throughput async APIs, P99 latency optimization, regex NER services", tag: "Backend" },
        { name: "Next.js & React.js", level: "Expert", description: "Sub-200ms real-time client sync, SSR, modern UI component systems", tag: "Frontend" },
        { name: "Three.js", level: "Advanced", description: "3D client-side visualization engines with 3x optimized asset loading", tag: "3D" }
      ]
    },
    {
      category: "Databases & Engines",
      pocketName: "Medicine & Items",
      icon: "shield",
      items: [
        { name: "DuckDB", level: "Advanced", description: "High-speed distributed in-process SQL OLAP data aggregation", tag: "OLAP" },
        { name: "DynamoDB & MongoDB", level: "Advanced", description: "High-throughput NoSQL stores, document indexing, claims pipelines", tag: "NoSQL" },
        { name: "ElasticSearch", level: "Advanced", description: "Distributed document search, NER indexing, healthcare claims", tag: "Search" },
        { name: "Firebase / Firestore", level: "Advanced", description: "Real-time sync listeners, Identity Platform, token logging", tag: "Realtime" },
        { name: "PyPI & Conda-Forge", level: "Advanced", description: "Open-source package publishing, semantic versioning, CI/CD", tag: "Packages" }
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

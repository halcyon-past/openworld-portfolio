import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Silkscreen } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silk",
  display: "swap",
});

const SITE_URL = "https://openworld.aritro.cloud";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#070b10",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aritro Saha | Pokémon RPG Portfolio",
    template: "%s | Aritro Saha Portfolio",
  },
  description:
    "Play through the interactive open-world retro Pokémon RPG portfolio of Aritro Saha (Software Engineer 1 at Bristol Myers Squibb & Hack4Bengal 3.0 Winner). Explore full-stack and data science projects, skills, 8 Gym Badges, and playable minigames.",
  applicationName: "Aritro Saha Pokémon RPG Portfolio",
  authors: [{ name: "Aritro Saha", url: "https://www.aritro.cloud/" }],
  creator: "Aritro Saha",
  publisher: "Aritro Saha",
  category: "technology",
  generator: "Next.js",
  keywords: [
    "Aritro Saha",
    "Aritro Saha Portfolio",
    "Aritro Saha BMS",
    "Aritro Saha Bristol Myers Squibb",
    "Pokemon RPG Portfolio",
    "Pokemon Developer Portfolio",
    "RPG Portfolio",
    "Interactive Portfolio",
    "Software Engineer 1",
    "Bristol Myers Squibb",
    "Hack4Bengal Winner",
    "Byakugan Scan",
    "macOS Screen OCR",
    "PAWsitive",
    "Quarantine Python",
    "quarantine-py",
    "Structurify",
    "Luffy Laser Dodge",
    "KrishnaVision",
    "GlideConnect",
    "Next.js Portfolio",
    "Full Stack Developer",
    "Data Science Engineer",
    "VIT Chennai",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.webp", type: "image/webp" },
    ],
    apple: [
      { url: "/logo.webp" },
    ],
  },
  openGraph: {
    title: "Aritro Saha | Pokémon RPG Portfolio",
    description:
      "Step into an authentic retro Pokémon RPG open world showcasing Aritro Saha's projects, engineering achievements at Bristol Myers Squibb, and interactive developer minigames.",
    url: SITE_URL,
    siteName: "Aritro Saha Portfolio",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "/assets/profile.webp",
        width: 800,
        height: 800,
        alt: "Aritro Saha - Software Engineer 1 at Bristol Myers Squibb",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aritro Saha | Pokémon RPG Portfolio",
    description:
      "Interactive retro open-world Pokémon RPG portfolio. Discover projects, experience at BMS, and playable arcade minigames.",
    creator: "@halcyon_past",
    images: ["/assets/profile.webp"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "sbsJwuXjjftxiq30JhvH89YW3fkOCvOCb0aL4ftVRuI",
  },
};

const CANONICAL_PERSON_ID = "https://www.aritro.cloud/#person";

// JSON-LD Structured Data for Google Knowledge Graph and AI Search Engines
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": CANONICAL_PERSON_ID,
      name: "Aritro Saha",
      alternateName: ["Aritro", "Megh", "halcyon-past"],
      url: "https://www.aritro.cloud/",
      jobTitle: "Software Engineer 1",
      worksFor: {
        "@type": "Organization",
        name: "Bristol Myers Squibb",
        alternateName: "BMS",
        url: "https://www.bms.com/",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Vellore Institute of Technology, Chennai",
        url: "https://chennai.vit.ac.in",
      },
      award: [
        "Hack4Bengal 3.0 Champion (Overall 1st / 400+ developers)",
        "LeetCode Knight (Max Rating: 1868, Top 6% globally)",
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: "Software Engineer 1",
        description:
          "Enterprise LLM workflows, medical diagnostic decision support, and serverless data engineering at Bristol Myers Squibb.",
      },
      image: `${SITE_URL}/assets/profile.webp`,
      email: "aritrosaha2025@gmail.com",
      sameAs: [
        "https://www.wikidata.org/wiki/Q141715213",
        "https://www.wikidata.org/entity/Q141715213",
        "https://www.aritro.cloud/",
        "https://linkedin.com/in/aritro-saha",
        "https://github.com/halcyon-past",
        "https://pypi.org/project/quarantine-py/",
        "https://leetcode.com/u/AritroSaha/",
        "https://www.youtube.com/@veripyed",
        "https://instagram.com/halcyon-past",
        "https://siliconsync.aritro.cloud/",
        "https://openworld.aritro.cloud/",
        "https://byakugan-scan.aritro.cloud/",
        "https://quarantine-py.aritro.cloud/",
        "https://structurify.aritro.cloud/",
        "https://onepiece.aritro.cloud/",
        "https://ijirt.org/article?manuscript=180711",
      ],
      subjectOf: [
        {
          "@type": "CreativeWork",
          name: "Aritro Saha OpenWorld Portfolio LLM Summary (llms.txt)",
          url: `${SITE_URL}/llms.txt`,
          encodingFormat: "text/plain",
        },
        {
          "@type": "CreativeWork",
          name: "Aritro Saha Complete Technical Knowledge Base (llms-full.txt)",
          url: `${SITE_URL}/llms-full.txt`,
          encodingFormat: "text/plain",
        },
      ],
      description:
        "Software Engineer 1 at Bristol Myers Squibb and Hack4Bengal 3.0 Winner specializing in resilient full-stack systems, Python distributed architectures, native macOS utilities, and AI engineering.",
      knowsAbout: [
        "Python",
        "TypeScript",
        "Swift 6.0",
        "Next.js",
        "React",
        "FastAPI",
        "LangGraph",
        "Google Gemini API",
        "Apple Vision Framework",
        "Three.js",
        "Cloud Architecture",
        "Google Cloud Platform (GCP)",
        "Amazon Web Services (AWS)",
        "Databricks Apache Spark",
        "Distributed Systems",
        "Full Stack Development"
      ]
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: "Aritro Saha Pokémon RPG Open World Portfolio",
      mainEntity: {
        "@id": CANONICAL_PERSON_ID
      },
      author: {
        "@id": CANONICAL_PERSON_ID
      }
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#projects`,
      name: "Featured Engineering Projects by Aritro Saha",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "SoftwareApplication",
            name: "Byakugan Scan",
            operatingSystem: "macOS 14.0 or later",
            applicationCategory: "UtilitiesApplication",
            description: "Native macOS menu bar utility for instant, in-memory screen OCR, QR code, and barcode recognition powered by Apple Vision and Neural Engine in under 50ms.",
            url: "https://byakugan-scan.aritro.cloud",
            sameAs: "https://github.com/halcyon-past/byakugan-scan",
            author: { "@id": CANONICAL_PERSON_ID },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "SoftwareApplication",
            name: "Quarantine (Python Package)",
            applicationCategory: "DeveloperApplication",
            description: "Fault-tolerant loop execution and exception isolation library in Python published to PyPI and Conda-Forge.",
            url: "https://pypi.org/project/quarantine-py/",
            sameAs: "https://github.com/halcyon-past/quarantine",
            author: { "@id": CANONICAL_PERSON_ID },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "SoftwareApplication",
            name: "Structurify",
            applicationCategory: "BusinessApplication",
            description: "Scalable AI pipeline converting unstructured documents into relational formats utilizing GCP Cloud Run, Pub/Sub, LangGraph, and Next.js.",
            url: "https://structurify.aritro.cloud",
            sameAs: "https://github.com/halcyon-past/Structurify",
            author: { "@id": CANONICAL_PERSON_ID },
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "SoftwareApplication",
            name: "Luffy Laser Dodge",
            applicationCategory: "GameApplication",
            description: "Interactive 3D browser reflex game utilizing Google MediaPipe WASM face tracking and Three.js procedural rigged animations.",
            url: "https://onepiece.aritro.cloud/",
            sameAs: "https://github.com/halcyon-past/Luffy-Laser-Dodge",
            author: { "@id": CANONICAL_PERSON_ID },
          },
        },
        {
          "@type": "ListItem",
          position: 5,
          item: {
            "@type": "ScholarlyArticle",
            name: "KrishnaVision: Contactless Multimodal Virtual Interface",
            headline: "Contactless Multimodal Virtual Interface with 97.3% gesture classification accuracy and Gemini assistant",
            url: "https://ijirt.org/article?manuscript=180711",
            author: {
              "@id": CANONICAL_PERSON_ID,
            },
          },
        },
        {
          "@type": "ListItem",
          position: 6,
          item: {
            "@type": "SoftwareApplication",
            name: "PAWsitive",
            applicationCategory: "HealthApplication",
            description: "1st Place Winner at Hack4Bengal 3.0. Animal healthcare and emergency blood donor coordination platform.",
            url: "https://www.bepawsitive.xyz",
            sameAs: "https://github.com/halcyon-past/PAW-sitive",
            author: { "@id": CANONICAL_PERSON_ID },
          },
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is Aritro Saha?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Aritro Saha (also known as Megh, Wikidata Q141715213) is a Software Engineer 1 at Bristol Myers Squibb (BMS), Hack4Bengal 3.0 Grand Champion (1st place among 400+ developers), LeetCode Knight (peak rating 1868, top 6% globally), and B.Tech graduate in Electronics and Computer Engineering from VIT Chennai (8.53 CGPA)."
          }
        },
        {
          "@type": "Question",
          name: "What is Aritro Saha's OpenWorld Pokémon RPG Portfolio?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "OpenWorld Portfolio (https://openworld.aritro.cloud) is an interactive 2.5D retro Pokémon RPG developer portfolio built from scratch with Next.js 16, React 19, and a custom 60 FPS HTML5 Canvas 2D engine. Visitors can explore Pallet Cloud, challenge Gym Leader Aritro (Lv. 99) in a turn-based battle, inspect projects in the Innovation Pokédex Center, or switch to the Executive Recruiter Dossier at https://openworld.aritro.cloud/dossier."
          }
        },
        {
          "@type": "Question",
          name: "What notable open-source software and projects has Aritro Saha built?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Aritro Saha is the creator of Byakugan Scan (a native Swift 6.0 macOS menu bar utility for <50ms in-memory screen OCR, QR code, and barcode scanning using Apple Vision), Quarantine (quarantine-py on PyPI, a zero-dependency Python dead-letter queue and fault-tolerant loop library), Structurify (an event-driven GCP/LangGraph document-to-SQL AI pipeline), Luffy Laser Dodge (a 3D webcam head-tracking game), KrishnaVision (published IJIRT research on contactless gesture HCI), and PAWsitive (Hack4Bengal 3.0 1st place winner)."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home (Pokémon RPG Portfolio)",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Professional Dossier & Resume",
          item: `${SITE_URL}/dossier`,
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#application`,
      name: "Aritro Saha Open World RPG Portfolio",
      url: SITE_URL,
      codeRepository: "https://github.com/halcyon-past/openworld-portfolio",
      operatingSystem: "Web Browser (Desktop & Mobile)",
      applicationCategory: "GameApplication",
      author: {
        "@id": CANONICAL_PERSON_ID,
      },
      creator: {
        "@id": CANONICAL_PERSON_ID,
      },
      publisher: {
        "@id": CANONICAL_PERSON_ID,
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      }
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Aritro Saha Pokémon RPG Portfolio",
      description:
        "Interactive open-world retro Pokémon RPG portfolio of Aritro Saha.",
      author: {
        "@id": CANONICAL_PERSON_ID,
      },
      creator: {
        "@id": CANONICAL_PERSON_ID,
      },
      publisher: {
        "@id": CANONICAL_PERSON_ID,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart.variable} ${silkscreen.variable} h-full`}>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Summary (llms.txt)" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM Full Knowledge Base (llms-full.txt)" />
        <link rel="alternate" type="text/plain" href="/ai.txt" title="AI Scraper Policy & Identity (ai.txt)" />
        <link rel="me" href="https://www.wikidata.org/wiki/Q141715213" />
        <link rel="me" href="https://www.aritro.cloud/" />
        <link rel="me" href="https://github.com/halcyon-past" />
        <link rel="me" href="https://linkedin.com/in/aritro-saha" />
        <link rel="me" href="https://pypi.org/project/quarantine-py/" />
        <link rel="me" href="https://www.youtube.com/@veripyed" />
        <link rel="me" href="https://leetcode.com/u/AritroSaha/" />
        <link rel="me" href="https://instagram.com/halcyon-past" />
        <link rel="me" href="https://siliconsync.aritro.cloud/" />
        <link rel="me" href="https://byakugan-scan.aritro.cloud/" />
        <link rel="me" href="https://quarantine-py.aritro.cloud/" />
        <link rel="me" href="https://structurify.aritro.cloud/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-full bg-[#070b10] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}

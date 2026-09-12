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
    default: "Aritro Saha | GBA Open World RPG Portfolio (FireRed & Emerald Style)",
    template: "%s | Aritro Saha Portfolio",
  },
  description:
    "Play through the interactive open-world retro Pokémon RPG portfolio of Aritro Saha (Associate Software Engineer at Bristol Myers Squibb & Hack4Bengal 3.0 Winner). Explore full-stack and data science projects, skills, 8 Gym Badges, and playable minigames.",
  applicationName: "Aritro Saha Pokémon RPG Portfolio",
  authors: [{ name: "Aritro Saha", url: "https://linkedin.com/in/aritro-saha" }],
  creator: "Aritro Saha",
  publisher: "Aritro Saha",
  category: "technology",
  generator: "Next.js",
  keywords: [
    "Aritro Saha",
    "Aritro Saha Portfolio",
    "Aritro Saha BMS",
    "Aritro Saha Bristol Myers Squibb",
    "Pokemon FireRed Portfolio",
    "Pokemon Emerald Portfolio",
    "RPG Portfolio",
    "Interactive Portfolio",
    "Associate Software Engineer",
    "Bristol Myers Squibb",
    "Hack4Bengal Winner",
    "PAWsitive",
    "Quarantine Python",
    "Structurify",
    "Luffy Laser Dodge",
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
    title: "Aritro Saha | Pokémon FireRed & Emerald RPG Portfolio",
    description:
      "Step into an authentic GBA retro Pokémon RPG open world showcasing Aritro Saha's projects, engineering achievements at Bristol Myers Squibb, and interactive developer minigames.",
    url: SITE_URL,
    siteName: "Aritro Saha Portfolio",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "/assets/profile.webp",
        width: 800,
        height: 800,
        alt: "Aritro Saha - Associate Software Developer at Bristol Myers Squibb",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aritro Saha | Pokémon FireRed & Emerald RPG Portfolio",
    description:
      "Interactive retro open-world portfolio styled after Pokémon FireRed & Emerald. Discover projects, experience at BMS, and playable arcade minigames.",
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
};

// JSON-LD Structured Data for Googlebot and search engines (Rich Snippets: Person, ProfilePage, SoftwareApplication, WebSite)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Aritro Saha",
      alternateName: "Megh",
      jobTitle: "Associate Software Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Bristol Myers Squibb",
        url: "https://www.bms.com",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Vellore Institute of Technology, Chennai",
        url: "https://chennai.vit.ac.in",
      },
      url: SITE_URL,
      image: `${SITE_URL}/assets/profile.webp`,
      email: "aritrosaha2025@gmail.com",
      sameAs: [
        "https://linkedin.com/in/aritro-saha",
        "https://github.com/halcyon-past",
        "https://www.youtube.com/@veripyed",
        "https://instagram.com/halcyon-past",
        "https://siliconsync.aritro.cloud",
        "https://pypi.org/project/quarantine-py/",
      ],
      description:
        "Associate Software Engineer at Bristol Myers Squibb and Hack4Bengal 3.0 Winner specializing in resilient full-stack systems, Python distributed architectures, and AI engineering.",
      knowsAbout: [
        "Python",
        "TypeScript",
        "Next.js",
        "React",
        "LangGraph",
        "Cloud Architecture",
        "GCP",
        "AWS",
        "Databricks",
        "Distributed Systems",
        "Full Stack Development"
      ]
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: "Aritro Saha GBA RPG Portfolio",
      mainEntity: {
        "@id": `${SITE_URL}/#person`
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#application`,
      name: "Aritro Saha Open World RPG Portfolio",
      operatingSystem: "Web Browser (Desktop & Mobile)",
      applicationCategory: "GameApplication",
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
      name: "Aritro Saha GBA RPG Portfolio",
      description:
        "Open-world retro RPG portfolio in the style of Pokémon FireRed and Emerald.",
      publisher: {
        "@id": `${SITE_URL}/#person`,
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

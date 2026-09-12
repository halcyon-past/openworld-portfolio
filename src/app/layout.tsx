import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://aritro.cloud'),
  title: "Aritro Saha | GBA Open World RPG Portfolio",
  description:
    "Explore the open-world retro RPG portfolio of Aritro Saha (Associate Software Developer at Bristol Myers Squibb & Hack4Bengal 3.0 Winner) styled after Pokémon FireRed and Emerald.",
  keywords: [
    "Aritro Saha",
    "Portfolio",
    "Pokemon FireRed",
    "Pokemon Emerald",
    "RPG Portfolio",
    "Next.js",
    "Software Engineer",
    "Bristol Myers Squibb",
    "Hack4Bengal",
    "Data Science",
  ],
  authors: [{ name: "Aritro Saha" }],
  openGraph: {
    title: "Aritro Saha | Pokémon FireRed & Emerald RPG Portfolio",
    description: "Interactive open-world retro Pokémon RPG portfolio exploring projects, skills, and experience.",
    type: "website",
    images: ["/assets/profile.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pressStart.variable} ${silkscreen.variable} h-full`}>
      <body className="h-full bg-[#0d131a] text-slate-100 overflow-hidden select-none font-sans">
        {children}
      </body>
    </html>
  );
}

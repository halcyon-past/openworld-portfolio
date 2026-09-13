'use client';

import React from 'react';
import Image from 'next/image';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { soundManager } from '@/game/audio/SoundManager';
import {
  Gamepad2,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  Trophy,
  CheckCircle2,
  FileText
} from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const BlogIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M6 6h10" />
    <path d="M6 10h10" />
    <path d="M6 14h7" />
  </svg>
);

const PyPIIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.012 0l-9.61 5.548v11.096l4.805 2.774v-5.548l4.805 2.774v5.548l4.805-2.774v-5.548l4.805 2.774V5.548L12.012 0zm0 2.316l6.993 4.037-3.606 2.082-6.993-4.037 3.606-2.082zm-8.008 4.62l3.387 1.956v3.911l-3.387-1.956V6.936zm8.008 4.62l3.388 1.955v3.912l-3.388-1.956v-3.911zm-4.62-2.668l3.606 2.082-3.606 2.082-3.606-2.082 3.606-2.082zm-3.388 6.577l3.388 1.956v3.911l-3.388-1.955v-3.912zm16.016-3.912v3.912l-3.387 1.955v-3.911l3.387-1.956z" />
  </svg>
);

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <LinkedInIcon className="w-3.5 h-3.5 text-[#0a66c2]" />;
    case 'github':
      return <GithubIcon className="w-3.5 h-3.5 text-white" />;
    case 'youtube':
      return <YouTubeIcon className="w-3.5 h-3.5 text-[#ff0000]" />;
    case 'instagram':
      return <InstagramIcon className="w-3.5 h-3.5 text-[#e1306c]" />;
    case 'ai tech blog':
    case 'blog':
      return <BlogIcon className="w-3.5 h-3.5 text-[#10b981]" />;
    default:
      return <ExternalLink className="w-3.5 h-3.5 text-slate-400" />;
  }
};

import Link from 'next/link';

interface RecruiterDossierViewProps {
  onReturn?: () => void;
  returnHref?: string;
  returnLabel?: string;
}

export const RecruiterDossierView: React.FC<RecruiterDossierViewProps> = ({
  onReturn,
  returnHref,
  returnLabel = 'RETURN TO POKÉMON RPG',
}) => {
  return (
    <div className="min-h-screen w-full bg-[#0b0f17] text-slate-100 font-sans pb-16 overflow-y-auto">
      {/* Sticky Header Bar */}
      <header className="sticky top-0 z-40 bg-[#111726]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 p-1 flex items-center justify-center shadow-md overflow-hidden shrink-0">
            <img
              src="/logo.webp"
              alt="Aritro Saha Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {PORTFOLIO_DATA.trainer.name}
            </h1>
            <p className="text-xs text-indigo-400">
              {PORTFOLIO_DATA.trainer.title} • {PORTFOLIO_DATA.trainer.company}
            </p>
          </div>
        </div>

        {/* Back navigation button / link */}
        {returnHref ? (
          <Link
            href={returnHref}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>{returnLabel}</span>
          </Link>
        ) : (
          <button
            onClick={() => {
              soundManager.playSelect();
              onReturn?.();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>{returnLabel}</span>
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-12">
        
        {/* Profile Hero Card */}
        <section className="bg-[#151d2f] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 shadow-xl">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl shrink-0">
            <Image
              src={PORTFOLIO_DATA.trainer.avatar}
              alt={PORTFOLIO_DATA.trainer.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Aritro Saha
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Hack4Bengal 3.0 Winner
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  LeetCode Knight (1868 • Top 6%)
                </span>
              </div>
              <p className="text-base text-indigo-300 font-medium">
                Associate Software Engineer @ Bristol Myers Squibb
              </p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {PORTFOLIO_DATA.trainer.bio}
            </p>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <a
                href="tel:+919043150635"
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 9043150635</span>
              </a>

              <a
                href="mailto:aritrosaha2025@gmail.com"
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>aritrosaha2025@gmail.com</span>
              </a>

              {PORTFOLIO_DATA.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {getSocialIcon(s.platform)}
                  <span>{s.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Work Experience
            </h2>
          </div>

          <div className="space-y-4">
            {PORTFOLIO_DATA.experience.map((exp) => (
              <div key={exp.id} className="bg-[#151d2f] border border-slate-800/80 rounded-xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-base font-bold text-white">{exp.role}</h3>
                    <p className="text-sm text-indigo-400 font-medium">{exp.company} • {exp.location}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2.5 py-1 rounded-full">
                    {exp.duration}
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {exp.description.map((line, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">▹</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.technologies.map((t) => (
                    <span key={t} className="text-xs bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Featured Projects & Open-Source Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PORTFOLIO_DATA.projects.map((p) => (
              <div key={p.id} className="bg-[#151d2f] border border-slate-800/80 rounded-xl overflow-hidden flex flex-col justify-between shadow-lg">
                <div>
                  <div className="relative w-full h-44 bg-slate-900 border-b border-slate-800">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {p.pokemonType.map((t) => (
                        <span key={t} className="text-[10px] bg-slate-900/90 text-slate-200 px-2 py-0.5 rounded-full font-mono border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{p.title}</h3>
                      <p className="text-xs text-indigo-400 font-medium mt-0.5">{p.subtitle}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {p.techStack.map((tech) => (
                        <span key={tech} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Links */}
                <div className="p-4 bg-slate-900/40 border-t border-slate-800/80 flex flex-wrap gap-2">
                  {p.liveDemo && (
                    <a
                      href={p.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {p.pypi && (
                    <a
                      href={p.pypi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <PyPIIcon className="w-3.5 h-3.5 text-amber-300" />
                      <span>PyPI</span>
                    </a>
                  )}

                  {p.researchPaper && (
                    <a
                      href={p.researchPaper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Research Paper</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Skills Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Education
              </h2>
            </div>

            <div className="space-y-3">
              {PORTFOLIO_DATA.education.map((edu, idx) => (
                <div key={idx} className="bg-[#151d2f] border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <h3 className="text-sm font-bold text-white">{edu.degree}</h3>
                  <p className="text-xs text-emerald-400 font-medium">{edu.institution} • {edu.year}</p>
                  <ul className="space-y-1 pt-1">
                    {edu.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Technical Stack & Tools
              </h2>
            </div>

            <div className="space-y-3">
              {PORTFOLIO_DATA.skillPockets.map((pocket) => (
                <div key={pocket.category} className="bg-[#151d2f] border border-slate-800/80 rounded-xl p-4 space-y-2">
                  <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    {pocket.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {pocket.items.map((item) => (
                      <span
                        key={item.name}
                        title={item.description}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700/80 transition-colors"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

      </main>
    </div>
  );
};

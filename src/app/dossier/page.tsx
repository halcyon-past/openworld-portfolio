import type { Metadata } from 'next';
import { RecruiterDossierView } from '@/components/recruiter/RecruiterDossierView';

export const metadata: Metadata = {
  title: 'Aritro Saha | Professional Software Engineering Dossier & Resume',
  description:
    'Detailed engineering resume, career accomplishments at Bristol Myers Squibb, PyPI packages, published research papers, Hack4Bengal 3.0 championship, and full-stack technical competencies of Aritro Saha.',
  alternates: {
    canonical: 'https://openworld.aritro.cloud/dossier',
  },
  openGraph: {
    title: 'Aritro Saha | Professional Software Engineering Dossier & Resume',
    description:
      'Detailed engineering resume, career accomplishments at Bristol Myers Squibb, PyPI packages, and research publications of Aritro Saha.',
    url: 'https://openworld.aritro.cloud/dossier',
    type: 'profile',
    images: [
      {
        url: '/assets/profile.webp',
        width: 800,
        height: 800,
        alt: 'Aritro Saha - Associate Software Engineer at Bristol Myers Squibb',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aritro Saha | Professional Software Engineering Dossier',
    description:
      'Comprehensive software engineering resume and portfolio of Aritro Saha (Associate Software Engineer at Bristol Myers Squibb).',
    images: ['/assets/profile.webp'],
  },
};

export default function DossierPage() {
  return (
    <RecruiterDossierView
      returnHref="/"
      returnLabel="PLAY RETRO POKÉMON RPG"
    />
  );
}

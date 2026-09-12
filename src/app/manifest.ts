import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aritro Saha | GBA Open World RPG Portfolio',
    short_name: 'Aritro RPG',
    id: 'aritro-saha-rpg-portfolio',
    description: 'Interactive open-world Pokémon FireRed & Emerald RPG portfolio of Aritro Saha (Associate Software Developer @ BMS).',
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#070b10',
    theme_color: '#070b10',
    categories: ['games', 'portfolio', 'developer'],
    icons: [
      {
        src: '/logo.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'any',
      },
      {
        src: '/assets/profile.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'maskable',
      },
    ],
  };
}

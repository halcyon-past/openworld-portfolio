import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: 'https://openworld.aritro.cloud',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://openworld.aritro.cloud/dossier',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}

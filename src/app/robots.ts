import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://openworld.aritro.cloud';

  return {
    rules: [
      {
        userAgent: [
          '*',
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
          'anthropic-ai',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Googlebot',
          'Bingbot',
          'Applebot',
          'Applebot-Extended',
          'Meta-ExternalAgent',
          'Amazonbot',
          'YouBot',
          'DuckAssistBot',
          'cohere-ai',
          'CCBot',
        ],
        allow: ['/', '/dossier', '/llms.txt', '/llms-full.txt', '/ai.txt', '/.well-known/ai.txt'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

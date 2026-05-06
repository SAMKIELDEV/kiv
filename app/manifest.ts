import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kiv',
    short_name: 'Kiv',
    description: 'Minimalist intentional journaling.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#0F0F0F',
    theme_color: '#0F0F0F',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '192x192',
        type: 'image/x-icon',
        purpose: 'maskable',
      },
      {
        src: '/favicon.ico',
        sizes: '512x512',
        type: 'image/x-icon',
        purpose: 'maskable',
      },
    ],
  };
}

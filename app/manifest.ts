import { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    return {
        name: 'Ratio1 Explorer',
        short_name: 'Ratio1 Explorer',
        description:
            'Experience the power of Ratio1 AI OS, built on Ratio1 Protocol and powered by blockchain, democratizing AI to empower limitless innovation.',
        icons: [
            { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        start_url: '/',
        theme_color: '#1b47f7',
        background_color: '#1b47f7',
        display: 'standalone',
    };
}

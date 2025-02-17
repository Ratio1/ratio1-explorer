import config, { domains } from '@/config';
import { Metadata } from 'next';

export const getShortAddress = (address: string, size = 4) => `${address.slice(0, size)}...${address.slice(-size)}`;

export const generateMetadata = (
    title: string,
    description: string,
    imageUrl: string,
    imageWidth: number,
    imageHeight: number,
): Metadata => ({
    title: {
        template: `%s | ${title}`,
        default: `${title}`,
    },
    description,
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
        other: {
            rel: '/favicon.ico',
            url: '/favicon.ico',
        },
    },
    openGraph: {
        title,
        description,
        url: `https://${domains[config.environment]}`,
        siteName: title,
        images: [
            {
                url: imageUrl,
                width: imageWidth,
                height: imageHeight,
            },
        ],
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@nextjs',
        images: [imageUrl],
    },
    metadataBase: new URL(`https://${domains[config.environment]}`),
});

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const arrayAverage = (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

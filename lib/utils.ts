import { Metadata } from 'next';

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
        url: process.env.NEXT_PUBLIC_ORIGIN_URL as string,
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
    metadataBase: new URL(process.env.NEXT_PUBLIC_ORIGIN_URL as string),
});

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

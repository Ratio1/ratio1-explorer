import { Metadata } from 'next';
import { cache, JSX } from 'react';
import { formatUnits } from 'viem';

export const ETH_EMPTY_ADDR = '0x0000000000000000000000000000000000000000';

export const isEmptyETHAddr = (addr: string): boolean => addr === ETH_EMPTY_ADDR;

export const getShortAddress = (address: string, size = 4, asString = false): string | JSX.Element => {
    const str = `${address.slice(0, size)}•••${address.slice(-size)}`;

    if (asString) {
        return str;
    }

    return <div className="roboto">{str}</div>;
};

export const buildMetadata = (title: string, description: string, url: string): Metadata => ({
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
        url,
        siteName: title,
        images: [
            {
                url: `${url}/card.jpg`,
                width: 852,
                height: 500,
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
    manifest: '/manifest.json',
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@nextjs',
        images: [`${url}/card.jpg`],
    },
    metadataBase: new URL(url),
});

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const arrayAverage = (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

export function fN(num: number): string | number {
    if (num >= 1_000_000) {
        const formattedNum = num / 1_000_000;
        return formattedNum % 1 === 0 ? `${formattedNum}M` : `${parseFloat(formattedNum.toFixed(2))}M`;
    }

    if (num >= 1000) {
        const formattedNum = num / 1000;
        return formattedNum % 1 === 0 ? `${formattedNum}K` : `${parseFloat(formattedNum.toFixed(2))}K`;
    }

    return parseFloat(num.toFixed(1));
}

export function fBI(num: bigint, decimals: number): string {
    const numWithDecimals = num / 10n ** BigInt(decimals);

    if (numWithDecimals >= 1_000_000n) {
        const formattedNum = Number(numWithDecimals) / 1_000_000;
        return formattedNum % 1 === 0 ? `${formattedNum}M` : `${parseFloat(formattedNum.toFixed(2))}M`;
    }
    if (numWithDecimals >= 1000n) {
        const formattedNum = Number(numWithDecimals) / 1000;
        return formattedNum % 1 === 0 ? `${formattedNum}K` : `${parseFloat(formattedNum.toFixed(2))}K`;
    }

    return parseFloat(Number(formatUnits(num, decimals)).toFixed(1)).toString();
}

export const isNonZeroInteger = (value: string): boolean => {
    if (!/^\d+$/.test(value)) return false;
    const int = parseInt(value, 10);
    return !isNaN(int) && isFinite(int) && int > 0;
};

export const cachedGetENSName = cache(async (ownerEthAddr: string): Promise<string | undefined> => {
    try {
        const response = await fetch(`https://api.ensideas.com/ens/resolve/${ownerEthAddr}`);
        if (response.ok) {
            const data = await response.json();
            return data.name || undefined;
        }
    } catch (error) {
        console.log('Error fetching ENS name');
    }
});

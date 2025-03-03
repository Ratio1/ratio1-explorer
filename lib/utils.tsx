import config, { domains, getCurrentEpoch, getLicenseFirstCheckEpoch } from '@/config';
import * as types from '@/typedefs/blockchain';
import { Metadata } from 'next';
import { JSX } from 'react';
import { getNodeEpochsRange, getNodeLastEpoch } from './api/oracles';

export const getShortAddress = (address: string, size = 4, asString = false): string | JSX.Element => {
    const str = `${address.slice(0, size)}•••${address.slice(-size)}`;

    if (asString) {
        return str;
    }

    return <div className="roboto">{str}</div>;
};

export const buildMetadata = (title: string, description: string): Metadata => ({
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
                url: `https://${domains[config.environment]}/card.jpg`,
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
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@nextjs',
        images: [`https://${domains[config.environment]}/card.jpg`],
    },
    metadataBase: new URL(`https://${domains[config.environment]}`),
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

    return parseFloat(num.toFixed(2));
}

export function fBI(num: bigint, decimals: number): string {
    num = num / 10n ** BigInt(decimals);
    if (num >= 1_000_000n) {
        const formattedNum = Number(num) / 1_000_000;
        return formattedNum % 1 === 0 ? `${formattedNum}M` : `${parseFloat(formattedNum.toFixed(2))}M`;
    }
    if (num >= 1000n) {
        const formattedNum = Number(num) / 1000;
        return formattedNum % 1 === 0 ? `${formattedNum}K` : `${parseFloat(formattedNum.toFixed(2))}K`;
    }
    return num.toString();
}

export const getNodeAvailability = async (
    nodeEthAddr: types.EthAddress,
    assignTimestamp: bigint,
): Promise<types.OraclesAvailabilityResult & types.OraclesDefaultResult> => {
    const currentEpoch: number = getCurrentEpoch();
    const firstCheckEpoch: number = getLicenseFirstCheckEpoch(assignTimestamp);

    return firstCheckEpoch === currentEpoch
        ? await getNodeLastEpoch(nodeEthAddr)
        : await getNodeEpochsRange(nodeEthAddr, firstCheckEpoch, currentEpoch - 1);
};

export const isNonZeroInteger = (value: string): boolean => {
    if (!/^\d+$/.test(value)) return false;
    const int = parseInt(value, 10);
    return !isNaN(int) && isFinite(int) && int > 0;
};

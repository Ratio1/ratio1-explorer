import * as types from '@/typedefs/blockchain';
import { SearchResult } from '@/typedefs/general';
import { Metadata } from 'next';
import { cache, JSX } from 'react';
import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, formatUnits, getAddress, hexToBytes, keccak256 } from 'viem';
import { getActiveNodes } from './api';
import { getLicense } from './api/blockchain';
import { getNodeLastEpoch } from './api/oracles';

const URL_SAFE_PATTERN = /^[a-zA-Z0-9x\s\-_\.]+$/;
export const ETH_EMPTY_ADDR = '0x0000000000000000000000000000000000000000';
const INTERNAL_ADDRESS_PREFIX = '0xai_';

export const isZeroAddress = (addr: string): boolean => addr === ETH_EMPTY_ADDR;

export const internalNodeAddressToEthAddress = (address: string): `0x${string}` => {
    const raw = address.startsWith(INTERNAL_ADDRESS_PREFIX) ? address.slice(INTERNAL_ADDRESS_PREFIX.length) : address;
    const pad = (4 - (raw.length % 4)) % 4;
    const b64 = (raw + '='.repeat(pad)).replace(/-/g, '+').replace(/_/g, '/');
    const compressed = Uint8Array.from(Buffer.from(b64, 'base64')); // 33-byte compressed pk
    const uncompressed = secp256k1.ProjectivePoint.fromHex(compressed).toRawBytes(false); // 65 bytes, 0x04 + X + Y
    const pubkey = uncompressed.slice(1); // drop 0x04
    const hash = keccak256(pubkey);
    const ethBytes = hexToBytes(hash).slice(-20);
    return getAddress(bytesToHex(ethBytes));
};

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

export function fBI(num: bigint, decimals: number, precision: number = 2): string | number {
    const numWithDecimals = num / 10n ** BigInt(decimals);

    if (numWithDecimals >= 1_000_000n) {
        const formattedNum = Number(numWithDecimals) / 1_000_000;
        return formattedNum % 1 === 0 ? `${formattedNum}M` : `${parseFloat(formattedNum.toFixed(2))}M`;
    }
    if (numWithDecimals >= 1000n) {
        const formattedNum = Number(numWithDecimals) / 1000;
        return formattedNum % 1 === 0 ? `${formattedNum}K` : `${parseFloat(formattedNum.toFixed(2))}K`;
    }

    // return parseFloat(Number(numWithDecimals).toFixed(1)).toString();
    // return formatUnits(num, decimals);

    const floatValue = parseFloat(formatUnits(num, decimals));
    return parseFloat(floatValue.toFixed(precision));
}

export const isNonZeroInteger = (value: string): boolean => {
    if (!/^\d+$/.test(value)) return false;
    const int = parseInt(value, 10);
    return !isNaN(int) && isFinite(int) && int > 0;
};

export const processNodeTag = (tag: string): string => {
    if (tag.startsWith('DC:')) {
        return 'DATA CENTER';
    }

    return tag.includes(':') ? tag.split(':')[1] : tag;
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

export const clientSearch = async (
    query: string,
    isLoggingEnabled: boolean,
): Promise<{
    results: SearchResult[];
    error: boolean;
}> => {
    query = query.trim();

    if (!query) {
        if (isLoggingEnabled) console.log('Empty search query.');
        return {
            results: [],
            error: false,
        };
    }

    if (query.length > 50 || !URL_SAFE_PATTERN.test(query)) {
        if (isLoggingEnabled) console.log('Search query is invalid.');
        return {
            results: [],
            error: true,
        };
    }

    try {
        const resultsArray: SearchResult[] = [];

        if (query.startsWith('0xai_') || query.startsWith('aixp_')) {
            const ethAddress = internalNodeAddressToEthAddress(query);
            console.log('Converted ETH Address:', ethAddress);
        }

        if (/^0x(?!_ai)/.test(query) && query.length === 42) {
            if (isLoggingEnabled) console.log('Searching for ETH address...');

            const ethAddress = query as types.EthAddress;
            const ensName = await cachedGetENSName(ethAddress);

            resultsArray.push({
                type: 'owner',
                address: ethAddress,
                ensName,
            });

            try {
                const nodeResponse = await getNodeLastEpoch(ethAddress);

                resultsArray.push({
                    type: 'node',
                    nodeAddress: nodeResponse.node_eth_address,
                    alias: nodeResponse.node_alias,
                    isOnline: nodeResponse.node_is_online,
                });

                return {
                    results: resultsArray,
                    error: false,
                };
            } catch (error) {
                if (isLoggingEnabled) console.log('Address is not a valid node.');
            } finally {
                return {
                    results: resultsArray,
                    error: false,
                };
            }
        } else if (isNonZeroInteger(query)) {
            if (isLoggingEnabled) console.log('Searching for license...');
            const licenseId = parseInt(query);

            try {
                const ndLicense = await getLicense('ND', licenseId);
                if (ndLicense && !isZeroAddress(ndLicense.nodeAddress)) {
                    resultsArray.push({
                        type: 'license',
                        licenseId,
                        licenseType: 'ND',
                        nodeAddress: ndLicense.nodeAddress,
                    });
                }
            } catch (error) {
                if (isLoggingEnabled) console.log('ND License not found', licenseId);
            }

            try {
                const mndLicense = await getLicense('MND', licenseId);
                if (!isZeroAddress(mndLicense.nodeAddress)) {
                    resultsArray.push({
                        type: 'license',
                        licenseId,
                        licenseType: licenseId === 1 ? 'GND' : 'MND',
                        nodeAddress: mndLicense.nodeAddress,
                    });
                }
            } catch (error) {
                if (isLoggingEnabled) console.log('MND/GND License not found', licenseId);
            }

            return {
                results: resultsArray,
                error: resultsArray.length === 0,
            };
        } else {
            if (isLoggingEnabled) console.log('Searching for nodes by alias...');
            let response: types.OraclesDefaultResult;

            try {
                response = await getActiveNodes(1, 50, query);
                if (isLoggingEnabled) console.log('[Search] getActiveNodes', response);

                if (response.result.nodes) {
                    Object.entries(response.result.nodes).forEach(([_ratio1Addr, node]) => {
                        resultsArray.push({
                            type: 'node',
                            nodeAddress: node.eth_addr,
                            alias: node.alias,
                            isOnline: parseInt(node.last_seen_ago.split(':')[2]) < 60,
                        });
                    });

                    // Sort results by node alias
                    resultsArray.sort((a, b) => {
                        if (a.type === 'node' && b.type === 'node') {
                            return a.alias.localeCompare(b.alias);
                        }
                        return 0;
                    });

                    return {
                        results: resultsArray,
                        error: resultsArray.length === 0,
                    };
                } else {
                    throw new Error('No nodes found for the current query.');
                }
            } catch (error) {
                return {
                    results: [],
                    error: true,
                };
            }
        }
    } catch (error) {
        console.log(error);
        return {
            results: [],
            error: true,
        };
    }
};

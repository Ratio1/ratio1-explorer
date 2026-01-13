'use server';

import { ERC20Abi } from '@/blockchain/ERC20';
import { MNDContractAbi } from '@/blockchain/MNDContract';
import { NDContractAbi } from '@/blockchain/NDContract';
import { ReaderAbi } from '@/blockchain/Reader';
import config, { getCurrentEpoch, getEpochStartTimestamp, getNextEpochTimestamp } from '@/config';
import * as types from '@/typedefs/blockchain';
import console from 'console';
import { differenceInSeconds } from 'date-fns';
import Moralis from 'moralis';
import { EvmAddress, EvmChain } from 'moralis/common-evm-utils';
import { isZeroAddress } from '../utils';
import { getPublicClient } from './client';

async function startMoralis() {
    await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
    });

    console.log('Moralis started');
}

startMoralis();

export async function fetchCSPDetails(address: types.EthAddress): Promise<types.CSP | undefined> {
    const publicClient = await getPublicClient();

    const result = await publicClient.readContract({
        address: config.readerContractAddress,
        abi: ReaderAbi,
        functionName: 'getEscrowDetailsByOwner',
        args: [address],
    });

    return isZeroAddress(result.escrowAddress)
        ? undefined
        : {
              ...result,
              activeJobsCount: Number(result.activeJobsCount),
          };
}

export async function fetchCSPs(): Promise<types.CSP[]> {
    const publicClient = await getPublicClient();

    const result = await publicClient.readContract({
        address: config.readerContractAddress,
        abi: ReaderAbi,
        functionName: 'getAllEscrowsDetails',
        args: [],
    });

    return result.map((item) => ({
        ...item,
        activeJobsCount: Number(item.activeJobsCount),
    }));
}

export async function getNodeLicenseDetails(nodeAddress: types.EthAddress): Promise<types.NodeLicenseDetailsResponse> {
    const publicClient = await getPublicClient();

    return await publicClient
        .readContract({
            address: config.readerContractAddress,
            abi: ReaderAbi,
            functionName: 'getNodeLicenseDetails',
            args: [nodeAddress],
        })
        .then(async (result) => {
            const licenseType = [undefined, 'ND', 'MND', 'GND'][result.licenseType] as 'ND' | 'MND' | 'GND' | undefined;
            let firstMiningEpoch: bigint | undefined;
            if (licenseType === 'MND') {
                firstMiningEpoch = (
                    await publicClient.readContract({
                        address: config.mndContractAddress,
                        abi: MNDContractAbi,
                        functionName: 'licenses',
                        args: [result.licenseId],
                    })
                )[3];
            }

            return {
                ...result,
                licenseType,
                firstMiningEpoch,
            };
        });
}

export async function getLicense(licenseType: 'ND' | 'MND' | 'GND', licenseId: number | string): Promise<types.License> {
    const publicClient = await getPublicClient();

    if (licenseType === 'ND') {
        return await publicClient
            .readContract({
                address: config.readerContractAddress,
                abi: ReaderAbi,
                functionName: 'getNdLicenseDetails',
                args: [BigInt(licenseId)],
            })
            .then((license) => {
                const isLinked = !isZeroAddress(license.nodeAddress);
                const licenseType = [undefined, 'ND', 'MND', 'GND'][license.licenseType] as 'ND' | 'MND' | 'GND' | undefined;
                if (licenseType === undefined) {
                    throw new Error('License does not exist');
                }
                if (licenseType !== 'ND') {
                    throw new Error('Invalid license type');
                }

                return {
                    ...license,
                    licenseType,
                    isLinked,
                };
            });
    } else {
        return await publicClient
            .readContract({
                address: config.readerContractAddress,
                abi: ReaderAbi,
                functionName: 'getMndLicenseDetails',
                args: [BigInt(licenseId)],
            })
            .then(async (license) => {
                const isLinked = !isZeroAddress(license.nodeAddress);
                const licenseType = [undefined, 'ND', 'MND', 'GND'][license.licenseType] as 'ND' | 'MND' | 'GND' | undefined;
                if (licenseType === undefined) {
                    throw new Error('License does not exist');
                }
                if (licenseType !== 'MND' && licenseType !== 'GND') {
                    throw new Error('Invalid license type');
                }
                const firstMiningEpoch = (
                    await publicClient.readContract({
                        address: config.mndContractAddress,
                        abi: MNDContractAbi,
                        functionName: 'licenses',
                        args: [BigInt(licenseId)],
                    })
                )[3];

                return {
                    ...license,
                    licenseType,
                    isLinked,
                    firstMiningEpoch,
                };
            });
    }
}

export const getLicenses = async (address: types.EthAddress): Promise<types.LicenseInfo[]> => {
    const publicClient = await getPublicClient();

    const licenses = await publicClient
        .readContract({
            address: config.readerContractAddress,
            abi: ReaderAbi,
            functionName: 'getUserLicenses',
            args: [address],
        })
        .then((licenses) => {
            return licenses.map((license) => {
                const isLinked = !isZeroAddress(license.nodeAddress);
                const licenseType = [undefined, 'ND', 'MND', 'GND'][license.licenseType] as 'ND' | 'MND' | 'GND';

                return {
                    ...license,
                    licenseType,
                    isLinked,
                };
            });
        });

    return [...licenses];
};

export const fetchErc20Balance = async (address: types.EthAddress, tokenAddress: types.EthAddress): Promise<bigint> => {
    const publicClient = await getPublicClient();

    return publicClient.readContract({
        address: tokenAddress,
        abi: ERC20Abi,
        functionName: 'balanceOf',
        args: [address],
    });
};

export const fetchEthBalance = async (address: types.EthAddress): Promise<bigint> => {
    const publicClient = await getPublicClient();

    return publicClient.getBalance({
        address,
    });
};

export const fetchR1Price = async () => {
    const publicClient = await getPublicClient();

    return await publicClient.readContract({
        address: config.ndContractAddress,
        abi: NDContractAbi,
        functionName: 'getTokenPrice',
    });
};

export const fetchR1TotalSupply = async () => {
    const publicClient = await getPublicClient();

    return await publicClient.readContract({
        address: config.r1ContractAddress,
        abi: ERC20Abi,
        functionName: 'totalSupply',
    });
};

// Binary search for the block with the closest timestamp to the target timestamp
export const getBlockByTimestamp = async (targetTimestamp: number) => {
    const publicClient = await getPublicClient();

    let latestBlock = await publicClient.getBlock();
    let earliestBlock = await publicClient.getBlock({ blockNumber: config.contractsGenesisBlock });

    while (earliestBlock.number < latestBlock.number - 1n) {
        const middleBlockNumber = (earliestBlock.number + latestBlock.number) / 2n;
        if (middleBlockNumber === earliestBlock.number) break;

        const middleBlock = await publicClient.getBlock({ blockNumber: middleBlockNumber });

        if (middleBlock.timestamp === BigInt(targetTimestamp)) {
            return middleBlock.number;
        } else if (middleBlock.timestamp < BigInt(targetTimestamp)) {
            earliestBlock = middleBlock;
        } else {
            latestBlock = middleBlock;
        }
    }

    return earliestBlock.number;
};

export const getLicenseRewards = async (
    license: types.License,
    licenseType: 'ND' | 'MND' | 'GND',
    epochs: number[],
    epochs_vals: number[],
): Promise<bigint> => {
    switch (licenseType) {
        case 'ND':
            return getNdLicenseRewards(license, epochs, epochs_vals);
        case 'MND':
            return getMndLicenseRewards(license, epochs, epochs_vals);
        case 'GND':
            return getGndLicenseRewards(license, epochs, epochs_vals);
    }
};

export async function getLicensesTotalSupply(): Promise<{
    mndTotalSupply: string;
    ndTotalSupply: string;
}> {
    const publicClient = await getPublicClient();

    const [mndTotalSupply, ndTotalSupply] = await publicClient.readContract({
        address: config.readerContractAddress,
        abi: ReaderAbi,
        functionName: 'getLicensesTotalSupply',
    });

    return {
        mndTotalSupply: mndTotalSupply.toString(),
        ndTotalSupply: ndTotalSupply.toString(),
    };
}

export async function getLicenseHolders(licenseType: 'ND' | 'MND' | 'GND'): Promise<
    {
        ownerOf: EvmAddress | undefined;
        tokenId: string | number;
    }[]
> {
    const address = licenseType === 'ND' ? config.ndContractAddress : config.mndContractAddress;
    const evmChain: EvmChain = config.environment === 'mainnet' ? EvmChain.BASE : EvmChain.BASE_SEPOLIA;

    const holders: {
        ownerOf: EvmAddress | undefined;
        tokenId: string | number;
    }[] = [];
    let cursor: string | undefined = undefined;

    do {
        const response = await Moralis.EvmApi.nft.getNFTOwners({
            chain: evmChain,
            format: 'decimal',
            cursor,
            address,
            limit: 100,
        });

        holders.push(...response.result);
        cursor = response.pagination.cursor;
    } while (!!cursor);

    return holders;
}

export async function fetchR1MintedLastEpoch() {
    const currentEpoch = getCurrentEpoch();
    const lastEpochStartTimestamp = getEpochStartTimestamp(currentEpoch - 1);
    const lastEpochEndTimestamp = getEpochStartTimestamp(currentEpoch);

    const fromBlock = await getBlockByTimestamp(lastEpochStartTimestamp.getTime() / 1000);
    const toBlock = await getBlockByTimestamp(lastEpochEndTimestamp.getTime() / 1000);

    const alchemyUrl = `https://base-${config.environment === 'mainnet' ? 'mainnet' : 'sepolia'}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

    const res = await fetch(alchemyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'alchemy_getAssetTransfers',
            params: [
                {
                    fromBlock: `0x${fromBlock.toString(16)}`,
                    toBlock: `0x${toBlock.toString(16)}`,
                    fromAddress: '0x0000000000000000000000000000000000000000',
                    contractAddresses: [config.r1ContractAddress],
                    category: ['erc20'],
                    withMetadata: false,
                },
            ],
        }),
        next: { revalidate: differenceInSeconds(getNextEpochTimestamp(), new Date()) + 5 },
    });

    const data = await res.json();

    const transfers = data.result?.transfers ?? [];

    const value: bigint = transfers.reduce((acc: bigint, t: any) => {
        try {
            return acc + BigInt(t.rawContract.value ?? '0');
        } catch {
            return acc;
        }
    }, 0n);

    return value;
}

const getNdLicenseRewards = async (license: types.License, epochs: number[], epochs_vals: number[]): Promise<bigint> => {
    return calculateLicenseRewards(license, epochs, epochs_vals, config.ndVestingEpochs);
};

const getMndLicenseRewards = async (license: types.License, epochs: number[], epochs_vals: number[]): Promise<bigint> => {
    return calculateMndLicenseRewards(license, epochs, epochs_vals);
};

const getGndLicenseRewards = async (license: types.License, epochs: number[], epochs_vals: number[]): Promise<bigint> => {
    return calculateLicenseRewards(license, epochs, epochs_vals, config.gndVestingEpochs);
};

const calculateLicenseRewards = async (
    license: types.License,
    epochs: number[],
    epochs_vals: number[],
    vestingEpochs: number,
    cliffEpochs: number = 0,
): Promise<bigint> => {
    const currentEpoch = getCurrentEpoch();

    const firstEpochToClaim =
        cliffEpochs > 0
            ? license.lastClaimEpoch >= cliffEpochs
                ? Number(license.lastClaimEpoch)
                : cliffEpochs
            : Number(license.lastClaimEpoch);

    const epochsToClaim = currentEpoch - firstEpochToClaim;

    if ((cliffEpochs > 0 && currentEpoch < cliffEpochs) || epochsToClaim <= 0) {
        return 0n;
    }

    // Disregard epochs before the cliff epoch for MNDs
    if (cliffEpochs > 0 && epochs[0] < cliffEpochs) {
        const start = cliffEpochs - epochs[0];
        epochs = epochs.slice(start);
        epochs_vals = epochs_vals.slice(start);
    }

    if (epochsToClaim !== epochs.length || epochsToClaim !== epochs_vals.length) {
        console.error(
            `Invalid epochs array length. Received ${epochs.length} epochs, but there are ${epochsToClaim} epochs to claim.`,
        );

        return 0n;
    }

    const maxRewardsPerEpoch = license.totalAssignedAmount / BigInt(vestingEpochs);
    let rewards_amount = 0n;

    for (let i = 0; i < epochsToClaim; i++) {
        rewards_amount += (maxRewardsPerEpoch * BigInt(epochs_vals[i])) / 255n;
    }

    const maxRemainingClaimAmount = license.totalAssignedAmount - license.totalClaimedAmount;
    return rewards_amount < maxRemainingClaimAmount ? rewards_amount : maxRemainingClaimAmount;
};

const calculateMndLicenseRewards = async (license: types.License, epochs: number[], epochs_vals: number[]): Promise<bigint> => {
    const currentEpoch = getCurrentEpoch();
    const firstMiningEpoch = license.firstMiningEpoch;

    if (firstMiningEpoch === undefined) {
        throw new Error('First mining epoch is undefined for MND license');
    }

    const firstEpochToClaim =
        Number(license.lastClaimEpoch) >= Number(firstMiningEpoch) ? Number(license.lastClaimEpoch) : Number(firstMiningEpoch);
    const epochsToClaim = currentEpoch - firstEpochToClaim;

    if (currentEpoch < Number(firstMiningEpoch) || !epochsToClaim) {
        return 0n;
    }

    if (epochs.length && epochs[0] < firstEpochToClaim) {
        const start = firstEpochToClaim - epochs[0];
        epochs = epochs.slice(start);
        epochs_vals = epochs_vals.slice(start);
    }

    if (epochsToClaim !== epochs.length || epochsToClaim !== epochs_vals.length) {
        console.error(
            `Invalid epochs array length. Received ${epochs.length} epochs, but there are ${epochsToClaim} epochs to claim.`,
        );
        return 0n;
    }

    let rewards_amount = 0n;
    const logisticPlateau = 300_505239501691000000n; // 300.50
    const licensePlateau = (license.totalAssignedAmount * BigInt(1e18)) / logisticPlateau;

    for (let i = 0; i < epochsToClaim; i++) {
        const maxRewardsPerEpoch = calculateMndMaxEpochRelease(epochs[i], firstMiningEpoch, licensePlateau);
        rewards_amount += (maxRewardsPerEpoch * BigInt(epochs_vals[i])) / 255n;
    }

    const maxRemainingClaimAmount = license.totalAssignedAmount - license.totalClaimedAmount;
    return rewards_amount > maxRemainingClaimAmount ? maxRemainingClaimAmount : rewards_amount;
};

const calculateMndMaxEpochRelease = (epoch: number, firstMiningEpoch: bigint, licensePlateau: bigint): bigint => {
    let x = epoch - Number(firstMiningEpoch);
    if (x > config.mndVestingEpochs) {
        x = config.mndVestingEpochs;
    }
    const frac = logisticFraction(x);
    return (licensePlateau * BigInt(frac * 1e18)) / BigInt(1e18);
};

const logisticFraction = (x: number): number => {
    const length = config.mndVestingEpochs;
    const k = 5.0;
    const midPrc = 0.7;
    const midpoint = length * midPrc;
    return 1.0 / (1.0 + Math.exp((-k * (x - midpoint)) / length));
};

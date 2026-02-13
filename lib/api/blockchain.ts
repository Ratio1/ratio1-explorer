'use server';

import { ERC20Abi } from '@/blockchain/ERC20';
import { MNDContractAbi } from '@/blockchain/MNDContract';
import { NDContractAbi } from '@/blockchain/NDContract';
import { ReaderAbi } from '@/blockchain/Reader';
import { AdoptionOracleAbi } from '@/blockchain/AdoptionOracle';
import config, { getCurrentEpoch, getEpochStartTimestamp, getNextEpochTimestamp } from '@/config';
import * as types from '@/typedefs/blockchain';
import { LicenseListItem } from '@/typedefs/general';
import console from 'console';
import { differenceInSeconds } from 'date-fns';
import Moralis from 'moralis';
import { EvmAddress, EvmChain } from 'moralis/common-evm-utils';
import { unstable_cache } from 'next/cache';
import type { ReadContractReturnType } from 'viem';
import { isZeroAddress } from '../utils';
import { getPublicClient } from './client';

export type LicenseRewardsBreakdown = {
    claimableAmount: bigint | undefined;
    rewardsAmount?: bigint;
    carryoverAmount?: bigint;
    withheldAmount?: bigint;
};

async function startMoralis() {
    await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
    });

    console.log('Moralis started');
}

startMoralis();

const getMndLicenseExtraData = async (
    publicClient: Awaited<ReturnType<typeof getPublicClient>>,
    licenseId: bigint,
): Promise<{
    firstMiningEpoch: bigint;
    awbBalance: bigint;
}> => {
    const [mndLicenseData, awbBalance] = await Promise.all([
        publicClient.readContract({
            address: config.mndContractAddress,
            abi: MNDContractAbi,
            functionName: 'licenses',
            args: [licenseId],
        }),
        publicClient.readContract({
            address: config.mndContractAddress,
            abi: MNDContractAbi,
            functionName: 'awbBalances',
            args: [licenseId],
        }),
    ]);

    return {
        firstMiningEpoch: mndLicenseData[3],
        awbBalance,
    };
};

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
            let awbBalance = 0n;
            if (licenseType === 'MND' || licenseType === 'GND') {
                ({ firstMiningEpoch, awbBalance } = await getMndLicenseExtraData(publicClient, result.licenseId));
            }

            return {
                ...result,
                licenseType,
                firstMiningEpoch,
                awbBalance,
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
                    awbBalance: 0n,
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
                const { firstMiningEpoch, awbBalance } = await getMndLicenseExtraData(publicClient, BigInt(licenseId));

                return {
                    ...license,
                    licenseType,
                    isLinked,
                    firstMiningEpoch,
                    awbBalance,
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
            return Promise.all(
                licenses.map(async (license) => {
                    let firstMiningEpoch: bigint | undefined;
                    let awbBalance = 0n;
                    const isLinked = !isZeroAddress(license.nodeAddress);
                    const licenseType = [undefined, 'ND', 'MND', 'GND'][license.licenseType] as 'ND' | 'MND' | 'GND';

                    if (licenseType === 'MND' || licenseType === 'GND') {
                        //TODO optimize by fetching extra data in batch for all licenses
                        ({ firstMiningEpoch, awbBalance } = await getMndLicenseExtraData(publicClient, license.licenseId));
                    }

                    return {
                        ...license,
                        licenseType,
                        isLinked,
                        firstMiningEpoch,
                        awbBalance,
                    };
                }),
            );
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

const MAX_ADOPTION_PERCENTAGE = 65_535; // 100% using uint16

const toThresholdPercentage = (value: bigint, threshold: bigint): number => {
    if (threshold === 0n) {
        return 0;
    }

    const percentage = Number((value * 10_000n) / threshold) / 100;
    return Math.min(percentage, 100);
};

const toOverallPercentage = (value: number): number => {
    const percentage = (value * 10_000) / MAX_ADOPTION_PERCENTAGE / 100;
    return Math.min(percentage, 100);
};

export type AdoptionMetricsEntry = {
    epoch: number;
    dateLabel: string;
    ndSalesPercentage: number;
    poaiVolumePercentage: number;
    overallPercentage: number;
    licensesSold: number;
    poaiVolumeUsdc: number;
};

const getAdoptionMetricsRangeCached = unstable_cache(
    async (resolvedFromEpoch: number, resolvedToEpoch: number): Promise<AdoptionMetricsEntry[]> => {
        const publicClient = await getPublicClient();

        const [licensesSoldRange, poaiVolumeRange, adoptionPercentagesRange, ndThreshold, poaiThreshold] = await Promise.all([
            publicClient.readContract({
                address: config.adoptionOracleContractAddress,
                abi: AdoptionOracleAbi,
                functionName: 'getLicensesSoldRange',
                args: [BigInt(resolvedFromEpoch), BigInt(resolvedToEpoch)],
            }),
            publicClient.readContract({
                address: config.adoptionOracleContractAddress,
                abi: AdoptionOracleAbi,
                functionName: 'getPoaiVolumeRange',
                args: [BigInt(resolvedFromEpoch), BigInt(resolvedToEpoch)],
            }),
            publicClient.readContract({
                address: config.adoptionOracleContractAddress,
                abi: AdoptionOracleAbi,
                functionName: 'getAdoptionPercentagesRange',
                args: [BigInt(resolvedFromEpoch), BigInt(resolvedToEpoch)],
            }),
            publicClient.readContract({
                address: config.adoptionOracleContractAddress,
                abi: AdoptionOracleAbi,
                functionName: 'ndFullReleaseThreshold',
            }),
            publicClient.readContract({
                address: config.adoptionOracleContractAddress,
                abi: AdoptionOracleAbi,
                functionName: 'poaiVolumeFullReleaseThreshold',
            }),
        ]);

        return adoptionPercentagesRange.map((overallAdoption, index) => {
            const epoch = resolvedFromEpoch + index;

            return {
                epoch,
                dateLabel: getEpochStartTimestamp(epoch).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'UTC',
                }),
                ndSalesPercentage: toThresholdPercentage(licensesSoldRange[index], ndThreshold),
                poaiVolumePercentage: toThresholdPercentage(poaiVolumeRange[index], poaiThreshold),
                overallPercentage: toOverallPercentage(overallAdoption),
                licensesSold: Number(licensesSoldRange[index]),
                poaiVolumeUsdc: Number(poaiVolumeRange[index]) / 1_000_000,
            };
        });
    },
    ['adoption-metrics-range'],
    { revalidate: 3600 },
);

export const getAdoptionMetricsRange = async (fromEpoch?: number, toEpoch?: number): Promise<AdoptionMetricsEntry[]> => {
    const currentEpoch = Math.max(getCurrentEpoch(), 0);
    const resolvedToEpoch = Math.max(toEpoch ?? currentEpoch - 1, 0);
    const resolvedFromEpoch = Math.max(fromEpoch ?? config.mndCliffEpochs, 0);

    return getAdoptionMetricsRangeCached(resolvedFromEpoch, resolvedToEpoch);
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
    licenseId: bigint,
    epochs: number[],
    epochs_vals: number[],
): Promise<bigint | undefined> => {
    const breakdown = await getLicenseRewardsBreakdown(license, licenseType, licenseId, epochs, epochs_vals);
    return breakdown.claimableAmount;
};

export const getLicenseRewardsBreakdown = async (
    license: types.License,
    licenseType: 'ND' | 'MND' | 'GND',
    licenseId: bigint,
    epochs: number[],
    epochs_vals: number[],
): Promise<LicenseRewardsBreakdown> => {
    switch (licenseType) {
        case 'ND': {
            const claimableAmount = await getNdLicenseRewards(license, epochs, epochs_vals);
            return {
                claimableAmount,
            };
        }

        case 'MND':
        case 'GND':
            return getMndOrGndLicenseRewardsBreakdown(license, licenseId, epochs, epochs_vals);
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

export async function getLicensesPage(
    offset: number,
    limit: number,
): Promise<{
    mndTotalSupply: bigint;
    ndTotalSupply: bigint;
    licenses: LicenseListItem[];
}> {
    const publicClient = await getPublicClient();

    const [mndTotalSupply, ndTotalSupply, licenseRows] = await publicClient.readContract({
        address: config.readerContractAddress,
        abi: ReaderAbi,
        functionName: 'getLicensesPage',
        args: [BigInt(offset), BigInt(limit)],
    });

    return {
        mndTotalSupply,
        ndTotalSupply,
        licenses: licenseRows.map((license) => {
            const licenseType = [undefined, 'ND', 'MND', 'GND'][Number(license.licenseType)] as
                | 'ND'
                | 'MND'
                | 'GND'
                | undefined;

            if (!licenseType) {
                throw new Error(`Invalid license type returned by reader for license #${license.licenseId}`);
            }

            return {
                licenseType,
                licenseId: Number(license.licenseId),
                owner: license.owner,
                nodeAddress: license.nodeAddress,
                totalAssignedAmount: license.totalAssignedAmount.toString(),
                totalClaimedAmount: license.totalClaimedAmount.toString(),
                assignTimestamp: license.assignTimestamp.toString(),
                awbBalance: license.awbBalance.toString(),
                isBanned: license.isBanned,
            };
        }),
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

const getNdLicenseRewards = async (
    license: types.License,
    epochs: number[],
    epochs_vals: number[],
): Promise<bigint | undefined> => {
    const currentEpoch = getCurrentEpoch();
    const epochsToClaim = currentEpoch - Number(license.lastClaimEpoch);

    if (!epochsToClaim) {
        return 0n;
    }

    if (epochsToClaim !== epochs.length || epochsToClaim !== epochs_vals.length) {
        return undefined;
    }

    let rewards_amount = 0n;
    const maxRewardsPerEpoch = license.totalAssignedAmount / BigInt(config.ndVestingEpochs);

    for (let i = 0; i < epochsToClaim; i++) {
        rewards_amount += (maxRewardsPerEpoch * BigInt(epochs_vals[i])) / 255n;
    }

    const maxRemainingClaimAmount = license.totalAssignedAmount - license.totalClaimedAmount;
    return rewards_amount > maxRemainingClaimAmount ? maxRemainingClaimAmount : rewards_amount;
};

const getMndOrGndLicenseRewardsBreakdown = async (
    license: types.License,
    licenseId: bigint,
    epochs: number[],
    epochs_vals: number[],
): Promise<LicenseRewardsBreakdown> => {
    const currentEpoch = getCurrentEpoch();
    const firstMiningEpoch = license.firstMiningEpoch;

    if (firstMiningEpoch === undefined) {
        throw new Error('First mining epoch is undefined for MND/GND license');
    }

    const firstEpochToClaim =
        Number(license.lastClaimEpoch) >= Number(firstMiningEpoch) ? Number(license.lastClaimEpoch) : Number(firstMiningEpoch);
    const epochsToClaim = currentEpoch - firstEpochToClaim;

    if (currentEpoch < Number(firstMiningEpoch) || !epochsToClaim) {
        return {
            claimableAmount: 0n,
            rewardsAmount: 0n,
            carryoverAmount: 0n,
            withheldAmount: 0n,
        };
    }

    if (epochs.length && epochs[0] < firstEpochToClaim) {
        const start = firstEpochToClaim - epochs[0];
        epochs = epochs.slice(start);
        epochs_vals = epochs_vals.slice(start);
    }

    if (epochsToClaim !== epochs.length || epochsToClaim !== epochs_vals.length) {
        return {
            claimableAmount: undefined,
        };
    }

    const publicClient = await getPublicClient();

    let result: ReadContractReturnType<typeof MNDContractAbi, 'calculateRewards'> | undefined;

    try {
        result = await publicClient.readContract({
            address: config.mndContractAddress,
            abi: MNDContractAbi,
            functionName: 'calculateRewards',
            args: [
                [
                    {
                        licenseId,
                        nodeAddress: license.nodeAddress,
                        epochs: epochs.map((epoch) => BigInt(epoch)),
                        availabilies: epochs_vals,
                    },
                ],
            ],
        });
    } catch {
        return {
            claimableAmount: undefined,
        };
    }

    if (!result || result.length !== 1) {
        throw new Error('Invalid rewards calculation result');
    }

    return {
        claimableAmount: result[0].rewardsAmount + result[0].carryoverAmount,
        rewardsAmount: result[0].rewardsAmount,
        carryoverAmount: result[0].carryoverAmount,
        withheldAmount: result[0].withheldAmount,
    };
};

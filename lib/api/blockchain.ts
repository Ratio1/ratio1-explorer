import { ERC20Abi } from '@/blockchain/ERC20';
import { LiquidityManagerAbi } from '@/blockchain/LiquidityManager';
import { MNDContractAbi } from '@/blockchain/MNDContract';
import { NDContractAbi } from '@/blockchain/NDContract';
import { ReaderAbi } from '@/blockchain/Reader';
import config, { chain, getCurrentEpoch, getEpochStartTimestamp } from '@/config';
import * as types from '@/typedefs/blockchain';
import { createPublicClient, http } from 'viem';
import { ETH_EMPTY_ADDR, isEmptyETHAddr } from '../utils';

// TODO: Replace with a paid RPC at some point
export const publicClient = createPublicClient({
    chain,
    transport: http(
        `https://base-${config.environment === 'mainnet' ? 'mainnet' : 'sepolia'}.g.alchemy.com/v2/n2UXf8tPtZ242ZpCzspVBPVE_sQhe6S3`,
    ),
});

export async function getNodeLicenseDetails(nodeAddress: types.EthAddress): Promise<types.NodeLicenseDetailsResponse> {
    return await publicClient
        .readContract({
            address: config.readerContractAddress,
            abi: ReaderAbi,
            functionName: 'getNodeLicenseDetails',
            args: [nodeAddress],
        })
        .then((result) => ({
            ...result,
            licenseType: [undefined, 'ND', 'MND', 'GND'][result.licenseType] as 'ND' | 'MND' | 'GND' | undefined,
        }));
}

// TODO: Ale add to Reader
export async function getOwnerOfLicense(
    licenseType: 'ND' | 'MND' | 'GND',
    licenseId: number | string,
): Promise<types.EthAddress> {
    const address = licenseType === 'ND' ? config.ndContractAddress : config.mndContractAddress;
    const abi = licenseType === 'ND' ? NDContractAbi : MNDContractAbi;

    return await publicClient.readContract({
        address,
        abi,
        functionName: 'ownerOf',
        args: [BigInt(licenseId)],
    });
}

// TODO: Ale add to Reader
export async function getLicense(licenseType: 'ND' | 'MND' | 'GND', licenseId: number | string): Promise<types.License> {
    let nodeAddress: types.EthAddress,
        totalAssignedAmount: bigint = config.ndLicenseCap,
        totalClaimedAmount: bigint,
        lastClaimEpoch: bigint,
        assignTimestamp: bigint,
        lastClaimOracle: types.EthAddress,
        isBanned: boolean = false;

    if (licenseType === 'ND') {
        [nodeAddress, totalClaimedAmount, lastClaimEpoch, assignTimestamp, lastClaimOracle, isBanned] =
            await publicClient.readContract({
                address: config.ndContractAddress,
                abi: NDContractAbi,
                functionName: 'licenses',
                args: [BigInt(licenseId)],
            });
    } else {
        [nodeAddress, totalAssignedAmount, totalClaimedAmount, lastClaimEpoch, assignTimestamp, lastClaimOracle] =
            await publicClient.readContract({
                address: config.mndContractAddress,
                abi: MNDContractAbi,
                functionName: 'licenses',
                args: [BigInt(licenseId)],
            });
    }

    return {
        nodeAddress,
        totalAssignedAmount,
        totalClaimedAmount,
        lastClaimEpoch,
        assignTimestamp,
        lastClaimOracle,
        isBanned,
    };
}

export const getLicenses = async (address: types.EthAddress): Promise<types.LicenseInfo[]> => {
    const [mndLicense, ndLicenses] = await Promise.all([
        publicClient
            .readContract({
                address: config.mndContractAddress,
                abi: MNDContractAbi,
                functionName: 'getUserLicense',
                args: [address],
            })
            .then((license) => {
                const isLinked = license.nodeAddress !== '0x0000000000000000000000000000000000000000';
                const licenseType: 'MND' | 'GND' = license.licenseId === 1n ? 'GND' : 'MND';

                if (!isLinked) {
                    return { ...license, licenseType, isLinked, isBanned: false };
                }

                return {
                    ...license,
                    licenseType,
                    isLinked,
                    isBanned: false,
                };
            }),
        publicClient
            .readContract({
                address: config.ndContractAddress,
                abi: NDContractAbi,
                functionName: 'getLicenses',
                args: [address],
            })
            .then((licenses) => {
                return licenses.map((license) => {
                    const licenseType: 'ND' | 'MND' | 'GND' = 'ND';
                    const isLinked = !isEmptyETHAddr(license.nodeAddress);
                    const totalAssignedAmount = config.ndLicenseCap;

                    if (!isLinked) {
                        return { ...license, licenseType, totalAssignedAmount, isLinked };
                    }

                    return {
                        ...license,
                        licenseType,
                        totalAssignedAmount,
                        isLinked,
                    };
                });
            }),
    ]);

    const licenses = mndLicense.totalAssignedAmount ? [mndLicense, ...ndLicenses] : ndLicenses;
    return licenses;
};

export const fetchR1MintedLastEpoch = async () => {
    const currentEpoch = getCurrentEpoch();
    const lastEpochStartTimestamp = getEpochStartTimestamp(currentEpoch - 1);
    const lastEpochEndTimestamp = getEpochStartTimestamp(currentEpoch);

    const fromBlock = await getBlockByTimestamp(lastEpochStartTimestamp.getTime() / 1000);
    const toBlock = await getBlockByTimestamp(lastEpochEndTimestamp.getTime() / 1000);

    const logs = await publicClient.getLogs({
        address: config.r1ContractAddress,
        event: ERC20Abi.find((v) => v.name === 'Transfer' && v.type === 'event')!,
        fromBlock,
        toBlock,
        args: {
            from: ETH_EMPTY_ADDR,
        },
    });

    const value: bigint = logs.reduce((acc, log) => acc + BigInt(log.args.value ?? 0), 0n);
    return value;
};

export const fetchErc20Balance = (address: types.EthAddress, tokenAddress: types.EthAddress): Promise<bigint> => {
    return publicClient.readContract({
        address: tokenAddress,
        abi: ERC20Abi,
        functionName: 'balanceOf',
        args: [address],
    });
};

export const fetchR1Price = async () => {
    if (config.liquidityManagerContractAddress.length === 42) {
        return await publicClient.readContract({
            address: config.liquidityManagerContractAddress,
            abi: LiquidityManagerAbi,
            functionName: 'getTokenPrice',
        });
    }
};

export const fetchR1TotalSupply = async () => {
    return await publicClient.readContract({
        address: config.r1ContractAddress,
        abi: ERC20Abi,
        functionName: 'totalSupply',
    });
};

// Binary search for the block with the closest timestamp to the target timestamp
export const getBlockByTimestamp = async (targetTimestamp: number) => {
    let latestBlock = await publicClient.getBlock();
    let earliestBlock = await publicClient.getBlock({ blockNumber: config.contractsGenesisBlock });

    while (earliestBlock.number < latestBlock.number) {
        const middleBlockNumber = earliestBlock.number + (latestBlock.number - earliestBlock.number) / 2n;
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

const getNdLicenseRewards = async (license: types.License, epochs: number[], epochs_vals: number[]): Promise<bigint> => {
    return calculateLicenseRewards(license, epochs, epochs_vals, config.ndVestingEpochs);
};

const getMndLicenseRewards = async (license: types.License, epochs: number[], epochs_vals: number[]): Promise<bigint> => {
    return calculateLicenseRewards(license, epochs, epochs_vals, config.mndVestingEpochs, config.mndCliffEpochs);
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

    if (epochsToClaim !== epochs.length || epochsToClaim !== epochs_vals.length) {
        throw new Error('Invalid epochs array length.');
    }

    const maxRewardsPerEpoch = license.totalAssignedAmount / BigInt(vestingEpochs);
    let rewards_amount = 0n;

    for (let i = 0; i < epochsToClaim; i++) {
        rewards_amount += (maxRewardsPerEpoch * BigInt(epochs_vals[i])) / 255n;
    }

    const maxRemainingClaimAmount = license.totalAssignedAmount - license.totalClaimedAmount;
    return rewards_amount < maxRemainingClaimAmount ? rewards_amount : maxRemainingClaimAmount;
};

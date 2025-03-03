import { ERC20Abi } from '@/blockchain/ERC20';
import { MNDContractAbi } from '@/blockchain/MNDContract';
import { NDContractAbi } from '@/blockchain/NDContract';
import { ReaderAbi } from '@/blockchain/Reader';
import config, { chain, getCurrentEpoch, getEpochStartTimestamp } from '@/config';
import * as types from '@/typedefs/blockchain';
import { createPublicClient, http } from 'viem';
import { ETH_EMPTY_ADDR } from '../utils';

export const publicClient = createPublicClient({
    chain,
    transport: http('https://base-sepolia.g.alchemy.com/v2/n2UXf8tPtZ242ZpCzspVBPVE_sQhe6S3'), // TODO: Replace
});

export async function getNodeLicenseDetails(nodeAddress: types.EthAddress) {
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

export const getNdLicenseRewards = async (license: types.License, epochs: number[], epochs_vals: number[]) => {
    const currentEpoch = getCurrentEpoch();
    const epochsToClaim = currentEpoch - Number(license.lastClaimEpoch);

    if (epochsToClaim <= 0) {
        return 0n;
    }

    if (epochsToClaim !== epochs.length || epochsToClaim !== epochs_vals.length) {
        throw new Error('Invalid epochs array length.');
    }

    const maxRewardsPerEpoch = license.totalAssignedAmount / BigInt(config.ndVestingEpochs);
    let rewards_amount = 0n;

    for (let i = 0; i < epochsToClaim; i++) {
        rewards_amount += (maxRewardsPerEpoch * BigInt(epochs_vals[i])) / 255n;
    }

    const maxRemainingClaimAmount = license.totalAssignedAmount - license.totalClaimedAmount;

    return rewards_amount < maxRemainingClaimAmount ? rewards_amount : maxRemainingClaimAmount;
};

// const getGndNodeAndLicenseRewards = async (
//     license: GNDLicense,
// ): Promise<{
//     rewards_amount: bigint;
//     epochs: number[];
//     epochs_vals: number[];
//     eth_signatures: EthAddress[];
//     node_alias: string;
//     node_is_online: boolean;
// }> => {
//     const currentEpoch = getCurrentEpoch();
//     const epochsToClaim = currentEpoch - Number(license.lastClaimEpoch);

//     const { epochs, epochs_vals, eth_signatures, node_alias, node_is_online } = await getNodeEpochsRange(
//         license.nodeAddress,
//         Number(license.lastClaimEpoch),
//         currentEpoch - 1,
//     );

//     const baseResult = {
//         rewards_amount: 0n,
//         epochs: [],
//         epochs_vals: [],
//         eth_signatures: [],
//         node_alias,
//         node_is_online,
//     };

//     if (epochsToClaim <= 0) {
//         return baseResult;
//     }

//     if (epochsToClaim !== epochs.length || epochsToClaim !== epochs_vals.length) {
//         throw new Error('Invalid epochs array length');
//     }

//     const maxRewardsPerEpoch = license.totalAssignedAmount / BigInt(config.gndVestingEpochs);
//     let rewards_amount = 0n;

//     for (let i = 0; i < epochsToClaim; i++) {
//         rewards_amount += (maxRewardsPerEpoch * BigInt(epochs_vals[i])) / 255n;
//     }

//     const maxRemainingClaimAmount = license.totalAssignedAmount - license.totalClaimedAmount;

//     if (rewards_amount > maxRemainingClaimAmount) {
//         return {
//             ...baseResult,
//             rewards_amount: maxRemainingClaimAmount,
//             epochs,
//             epochs_vals,
//             eth_signatures,
//         };
//     }
//     return {
//         ...baseResult,
//         rewards_amount,
//         epochs,
//         epochs_vals,
//         eth_signatures,
//     };
// };

// const getMndNodeAndLicenseRewards = async (
//     license: MNDLicense,
// ): Promise<{
//     rewards_amount: bigint;
//     epochs: number[];
//     epochs_vals: number[];
//     eth_signatures: EthAddress[];
// }> => {
//     const currentEpoch = getCurrentEpoch();

//     const firstEpochToClaim =
//         license.lastClaimEpoch >= config.mndCliffEpochs ? Number(license.lastClaimEpoch) : config.mndCliffEpochs;
//     const epochsToClaim = currentEpoch - firstEpochToClaim;

//     const { epochs, epochs_vals, eth_signatures, node_alias, node_is_online } = await getNodeEpochsRange(
//         license.nodeAddress,
//         currentEpoch >= config.mndCliffEpochs ? firstEpochToClaim : currentEpoch - 1,
//         currentEpoch - 1,
//     );

//     const baseResult = {
//         rewards_amount: 0n,
//         epochs: [],
//         epochs_vals: [],
//         eth_signatures: [],
//         node_alias,
//         node_is_online,
//     };

//     if (currentEpoch < config.mndCliffEpochs || epochsToClaim === 0) {
//         return baseResult;
//     }

//     if (epochsToClaim !== epochs.length || epochsToClaim !== epochs_vals.length) {
//         throw new Error('Invalid epochs array length');
//     }

//     const maxRewardsPerEpoch = license.totalAssignedAmount / BigInt(config.mndVestingEpochs);
//     let rewards_amount = 0n;

//     for (let i = 0; i < epochsToClaim; i++) {
//         rewards_amount += (maxRewardsPerEpoch * BigInt(epochs_vals[i])) / 255n;
//     }

//     const maxRemainingClaimAmount = license.totalAssignedAmount - license.totalClaimedAmount;

//     if (rewards_amount > maxRemainingClaimAmount) {
//         return {
//             ...baseResult,
//             rewards_amount: maxRemainingClaimAmount,
//             epochs,
//             epochs_vals,
//             eth_signatures,
//         };
//     }

//     return {
//         ...baseResult,
//         rewards_amount,
//         epochs,
//         epochs_vals,
//         eth_signatures,
//     };
// };

import { MNDContractAbi } from '@/blockchain/MNDContract';
import { NDContractAbi } from '@/blockchain/NDContract';
import { ReaderAbi } from '@/blockchain/Reader';
import config, { chain } from '@/config';
import * as types from '@/typedefs/blockchain';
import { createPublicClient, http } from 'viem';

const client = createPublicClient({
    chain,
    transport: http('https://base-sepolia.g.alchemy.com/v2/n2UXf8tPtZ242ZpCzspVBPVE_sQhe6S3'), // TODO: Use your RPC URL
});

export async function getNodeLicenseDetails(nodeAddress: types.EthAddress) {
    return await client
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

    return await client.readContract({
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
            await client.readContract({
                address: config.ndContractAddress,
                abi: NDContractAbi,
                functionName: 'licenses',
                args: [BigInt(licenseId)],
            });
    } else {
        [nodeAddress, totalAssignedAmount, totalClaimedAmount, lastClaimEpoch, assignTimestamp, lastClaimOracle] =
            await client.readContract({
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

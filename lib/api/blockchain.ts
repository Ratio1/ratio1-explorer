import { MNDContractAbi } from '@/blockchain/MNDContract';
import { NDContractAbi } from '@/blockchain/NDContract';
import config, { chain } from '@/config';
import { EthAddress } from '@/typedefs/blockchain';
import { createPublicClient, http } from 'viem';

const client = createPublicClient({
    chain,
    transport: http('https://base-sepolia.g.alchemy.com/v2/n2UXf8tPtZ242ZpCzspVBPVE_sQhe6S3'), // TODO: Use your RPC URL
});

export async function getNodeToNDLicenseId(address: EthAddress) {
    const licenseId = await client.readContract({
        address: config.ndContractAddress,
        abi: NDContractAbi,
        functionName: 'nodeToLicenseId',
        args: [address],
    });

    return licenseId;
}

export async function getNodeToMNDLicenseId(address: EthAddress) {
    const licenseId = await client.readContract({
        address: config.mndContractAddress,
        abi: MNDContractAbi,
        functionName: 'nodeToLicenseId',
        args: [address],
    });

    return licenseId;
}

export async function getOwnerOfLicense(licenseId: bigint, type: 'ND' | 'MND' | 'GND'): Promise<EthAddress> {
    const address = type === 'ND' ? config.ndContractAddress : config.mndContractAddress;
    const abi = type === 'ND' ? NDContractAbi : MNDContractAbi;

    const owner = await client.readContract({
        address,
        abi,
        functionName: 'ownerOf',
        args: [licenseId],
    });

    return owner;
}

export async function getNDLicense(licenseId: bigint): Promise<{
    totalClaimedAmount: bigint;
    lastClaimEpoch: bigint;
    assignTimestamp: bigint;
}> {
    const [nodeAddress, totalClaimedAmount, lastClaimEpoch, assignTimestamp, lastClaimOracle, isBanned] =
        await client.readContract({
            address: config.ndContractAddress,
            abi: NDContractAbi,
            functionName: 'licenses',
            args: [licenseId],
        });

    return { totalClaimedAmount, lastClaimEpoch, assignTimestamp };
}

export async function getMNDLicense(licenseId: bigint): Promise<{
    totalAssignedAmount: bigint;
    totalClaimedAmount: bigint;
    lastClaimEpoch: bigint;
    assignTimestamp: bigint;
}> {
    const [nodeAddress, totalAssignedAmount, totalClaimedAmount, lastClaimEpoch, assignTimestamp, lastClaimOracle] =
        await client.readContract({
            address: config.mndContractAddress,
            abi: MNDContractAbi,
            functionName: 'licenses',
            args: [licenseId],
        });

    return { totalAssignedAmount, totalClaimedAmount, lastClaimEpoch, assignTimestamp };
}

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

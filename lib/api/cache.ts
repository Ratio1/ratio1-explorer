import * as types from '@/typedefs/blockchain';
import { unstable_cache } from 'next/cache';
import { getLicense, getNodeLicenseDetails } from './blockchain';

export const cachedGetLicense = unstable_cache(
    async (
        licenseType: 'ND' | 'MND' | 'GND',
        licenseId: number | string,
    ): Promise<{
        owner: types.EthAddress;
        nodeAddress: types.EthAddress;
        totalAssignedAmount: string;
        totalClaimedAmount: string;
        assignTimestamp: string;
        isBanned: boolean;
    }> => {
        const { owner, nodeAddress, totalAssignedAmount, totalClaimedAmount, assignTimestamp, isBanned } = await getLicense(
            licenseType,
            licenseId,
        );

        return {
            owner,
            nodeAddress,
            totalAssignedAmount: totalAssignedAmount.toString(),
            totalClaimedAmount: totalClaimedAmount.toString(),
            assignTimestamp: assignTimestamp.toString(),
            isBanned,
        };
    },
    ['license'],
    { revalidate: 60 },
);

export const cachedGetNodeLicenseDetails = unstable_cache(
    async (
        nodeAddress: types.EthAddress,
    ): Promise<{
        licenseId: string;
        licenseType: 'ND' | 'MND' | 'GND' | undefined;
        owner: types.EthAddress;
        totalAssignedAmount: string;
        totalClaimedAmount: string;
        isBanned: boolean;
    }> => {
        const { licenseId, licenseType, owner, totalAssignedAmount, totalClaimedAmount, isBanned } =
            await getNodeLicenseDetails(nodeAddress);

        return {
            licenseId: licenseId.toString(),
            licenseType,
            owner,
            totalAssignedAmount: totalAssignedAmount.toString(),
            totalClaimedAmount: totalClaimedAmount.toString(),
            isBanned,
        };
    },
    ['nodeLicenseDetails'],
    { revalidate: 60 },
);

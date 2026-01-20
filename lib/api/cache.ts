import * as types from '@/typedefs/blockchain';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { getActiveNodes } from '.';
import { getLicense, getLicenses, getNodeLicenseDetails } from './blockchain';

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

export const cachedGetLicenses = unstable_cache(
    async (address: types.EthAddress): Promise<types.CachedLicense[]> => {
        const licenses = await getLicenses(address);

        return licenses.map((license) => ({
            ...license,
            licenseId: license.licenseId.toString(),
            totalAssignedAmount: license.totalAssignedAmount.toString(),
            totalClaimedAmount: license.totalClaimedAmount.toString(),
            lastClaimEpoch: license.lastClaimEpoch.toString(),
            assignTimestamp: license.assignTimestamp.toString(),
            usdcPoaiRewards: license.usdcPoaiRewards.toString(),
            r1PoaiRewards: license.r1PoaiRewards.toString(),
            firstMiningEpoch: license.firstMiningEpoch?.toString(),
        }));
    },
    ['licenses'],
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

export const getActiveNodesCached = cache(async (currentPage: number) => {
    try {
        const response: types.OraclesDefaultResult = await getActiveNodes(currentPage);
        return { response };
    } catch (error) {
        console.log('Failed to fetch active nodes:', error);
        return { error };
    }
});

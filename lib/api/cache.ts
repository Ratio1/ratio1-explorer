import * as types from '@/typedefs/blockchain';
import { unstable_cache } from 'next/cache';
import { getLicense } from './blockchain';

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

import { getLicenses } from '@/lib/api/blockchain';
import { fBI } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Item } from '../shared/Item';

export default async function AccountLincenseStats({ ethAddress }: { ethAddress: types.EthAddress }) {
    let licenses: types.LicenseInfo[];

    try {
        licenses = await getLicenses(ethAddress);
    } catch (error: any) {
        console.error(ethAddress, error);
        return null;
    }

    return (
        <>
            <Item
                label="Total Claimed Amount"
                value={
                    <div className="text-primary">
                        {licenses.length > 0
                            ? fBI(
                                  licenses
                                      .map((license) => license.totalClaimedAmount)
                                      .reduce((sum, current) => sum + current, 0n),
                                  18,
                              )
                            : '-'}
                    </div>
                }
            />

            <Item
                label="Last Claim Epoch"
                value={
                    <div>
                        {licenses.length > 0
                            ? licenses.reduce(
                                  (max, license) => (license.lastClaimEpoch > max ? license.lastClaimEpoch : max),
                                  licenses[0].lastClaimEpoch,
                              ) || '-'
                            : '-'}
                    </div>
                }
            />
        </>
    );
}

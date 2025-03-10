import config from '@/config';
import { fetchErc20Balance, getLicenses } from '@/lib/api/blockchain';
import { fBI } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Item } from '../shared/Item';

export default async function AccountLincenseStats({ ethAddress }: { ethAddress: types.EthAddress }) {
    let licenses: types.LicenseInfo[], r1Balance: bigint;

    try {
        [licenses, r1Balance] = await Promise.all([
            getLicenses(ethAddress),
            fetchErc20Balance(ethAddress, config.r1ContractAddress),
        ]);
    } catch (error: any) {
        console.error(ethAddress, error);
        return null;
    }

    return (
        <>
            <div className="flex min-w-[128px]">
                <Item label="Wallet $R1 Balance" value={<div className="text-primary">{fBI(r1Balance, 18)}</div>} />
            </div>

            <div className="flex min-w-[118px] justify-start lg:justify-end">
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
            </div>
        </>
    );
}

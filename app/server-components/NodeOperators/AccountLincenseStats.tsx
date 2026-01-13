import config from '@/config';
import { fetchErc20Balance } from '@/lib/api/blockchain';
import { cachedGetLicenses } from '@/lib/api/cache';
import { fBI } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { CardItem } from '../shared/CardItem';

export default async function AccountLincenseStats({ ethAddress }: { ethAddress: types.EthAddress }) {
    let licenses: types.CachedLicense[], r1Balance: bigint;

    try {
        [licenses, r1Balance] = await Promise.all([
            cachedGetLicenses(ethAddress),
            fetchErc20Balance(ethAddress, config.r1ContractAddress),
        ]);
    } catch (error: any) {
        console.error(ethAddress, error);
        return null;
    }

    return (
        <>
            <div className="flex min-w-[128px]">
                <CardItem label="Wallet $R1 Balance" value={<div className="text-primary">{fBI(r1Balance, 18)}</div>} />
            </div>

            <div className="flex min-w-[118px] justify-start lg:justify-end">
                <CardItem
                    label="Last Claim Epoch"
                    value={
                        <div>
                            {licenses.length > 0
                                ? licenses.reduce(
                                      (max, license) =>
                                          Number(license.lastClaimEpoch) > max ? Number(license.lastClaimEpoch) : max,
                                      Number(licenses[0].lastClaimEpoch),
                                  ) || '-'
                                : '-'}
                        </div>
                    }
                />
            </div>
        </>
    );
}

import { CopyableAddress } from '@/components/shared/CopyableValue';
import { routePath } from '@/lib/routes';
import * as types from '@/typedefs/blockchain';
import { LicenseItem } from '@/typedefs/general';
import { CardBordered } from '../shared/cards/CardBordered';
import { Item } from '../shared/Item';

interface Props {
    ethAddress: types.EthAddress;
    licenses: LicenseItem[];
}

export default async function Account({ ethAddress, licenses }: Props) {
    return (
        <CardBordered useCustomWrapper hasFixedWidth>
            <div className="row justify-between gap-3 py-2 md:py-3 lg:gap-6">
                <Item
                    label="Owner"
                    value={<CopyableAddress value={ethAddress} size={4} link={`${routePath.owner}/${ethAddress}`} />}
                />

                <Item label="Licenses Owned (Total)" value={<div className="font-medium">{licenses.length}</div>} />

                <Item
                    label="ND Licenses Owned"
                    value={
                        <div className="font-medium text-primary">
                            {licenses.filter((license) => license.licenseType === 'ND').length}
                        </div>
                    }
                />

                <Item
                    label="MND Licenses Owned"
                    value={
                        <div className="font-medium text-purple-600">
                            {licenses.filter((license) => license.licenseType !== 'ND').length}
                        </div>
                    }
                />
            </div>
        </CardBordered>
    );
}

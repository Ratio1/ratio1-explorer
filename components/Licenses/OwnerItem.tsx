'use client';

import { Item } from '@/app/server-components/shared/Item';
import { routePath } from '@/lib/routes';
import { getShortAddress } from '@/lib/utils';
import { EthAddress } from '@/typedefs/blockchain';
import { useRouter } from 'next/navigation';

interface Props {
    owner: EthAddress;
}

export const OwnerItem = ({ owner }: Props) => {
    const router = useRouter();

    return (
        <Item
            label="Owner"
            value={
                <div
                    className="cursor-pointer hover:opacity-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`${routePath.owner}/${owner}`);
                    }}
                >
                    {getShortAddress(owner)}
                </div>
            }
        />
    );
};

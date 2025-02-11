'use client';

import { Select, SelectItem } from '@heroui/select';
import { SharedSelection } from '@heroui/system';
import { useState } from 'react';

const networks = [
    {
        key: 'mainnet',
        label: 'Mainnet',
    },
    {
        key: 'testnet',
        label: 'Testnet',
    },
];

export const NetworkSelector = () => {
    const [keys, setKeys] = useState(new Set([networks[1].key]));

    return (
        <Select
            className="min-w-[118px]"
            classNames={{
                trigger: 'min-h-12 bg-slate-100 data-[hover=true]:bg-slate-200 rounded-full ',
                label: 'group-data-[filled=true]:-translate-y-5',
                value: 'font-medium pl-1.5',
            }}
            items={networks}
            selectedKeys={keys}
            onSelectionChange={(value: SharedSelection) => {
                setKeys(new Set([value.anchorKey as string]));
            }}
            aria-label="network-selector"
            label=""
            labelPlacement="outside"
            listboxProps={{
                itemClasses: {
                    base: [
                        'rounded-xl',
                        'text-default-500',
                        'transition-opacity',
                        'data-[hover=true]:text-foreground',
                        'data-[hover=true]:bg-default-100',
                        'data-[selectable=true]:focus:bg-default-100',
                        'data-[pressed=true]:opacity-70',
                        'data-[focus-visible=true]:ring-default-500',
                        'px-3',
                    ],
                },
            }}
            popoverProps={{
                classNames: {
                    base: 'before:bg-default-200',
                    content: 'p-0 border-small border-divider bg-background',
                },
            }}
            variant="flat"
        >
            {(network) => (
                <SelectItem key={network.key} textValue={network.label}>
                    <div className="row gap-2 py-1">
                        <div className="font-medium">{network.label}</div>
                    </div>
                </SelectItem>
            )}
        </Select>
    );
};

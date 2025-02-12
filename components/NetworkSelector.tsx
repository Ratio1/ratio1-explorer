'use client';

import config from '@/config';
import { Select, SelectItem } from '@heroui/select';
import { SharedSelection } from '@heroui/system';
import { useState } from 'react';

const networks = [
    {
        key: 'mainnet',
    },
    {
        key: 'testnet',
    },
];

export const NetworkSelector = () => {
    const [keys, setKeys] = useState(new Set<'mainnet' | 'testnet'>([config.environment]));

    return (
        <Select
            className="min-w-[112px]"
            classNames={{
                trigger: 'min-h-12 bg-primary data-[hover=true]:bg-primary/85 rounded-full ',
                label: 'group-data-[filled=true]:-translate-y-5',
                value: 'font-medium !text-white pl-1.5',
                selectorIcon: '!text-white',
            }}
            items={networks}
            selectedKeys={keys}
            onSelectionChange={(value: SharedSelection) => {
                setKeys(new Set([value.anchorKey as 'mainnet' | 'testnet']));
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
                <SelectItem key={network.key} textValue={`${network.key.charAt(0).toUpperCase() + network.key.slice(1)}`}>
                    <div className="row gap-2 py-1">
                        <div className="te font-medium capitalize">{network.key}</div>
                    </div>
                </SelectItem>
            )}
        </Select>
    );
};

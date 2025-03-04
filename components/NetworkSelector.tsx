'use client';

import config, { domains } from '@/config';
import { ping } from '@/lib/api/backend';
import { Select, SelectItem } from '@heroui/select';
import { SharedSelection } from '@heroui/system';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const networks = ['mainnet', 'testnet', 'devnet'];

export const NetworkSelector = () => {
    const [keys, setKeys] = useState(new Set<'mainnet' | 'testnet' | 'devnet'>([config.environment]));
    const [pingError, setPingError] = useState<boolean>();

    // Init
    useEffect(() => {
        (async () => {
            try {
                const pingResponse = await ping();

                if (pingResponse) {
                    setPingError(false);
                }
            } catch (error) {
                setPingError(true);
            }
        })();
    }, []);

    return (
        <Select
            className="min-w-[126px]"
            classNames={{
                trigger: 'min-h-12 bg-primary data-[hover=true]:bg-primary/85 rounded-full ',
                label: 'group-data-[filled=true]:-translate-y-5',
                value: 'font-medium text-[15px] !text-white pl-1.5',
                selectorIcon: '!text-white mt-0.5 mr-0.5',
                innerWrapper: 'gap-0.5',
            }}
            items={networks.map((network) => ({ key: network }))}
            selectedKeys={keys}
            onSelectionChange={(value: SharedSelection) => {
                const network = value.anchorKey as 'mainnet' | 'testnet' | 'devnet';

                if (network) {
                    window.location.href = `https://${domains[network]}`;
                    setKeys(new Set([network]));
                }
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
            startContent={
                pingError === undefined ? (
                    <></>
                ) : (
                    <div
                        className={clsx('ml-1 mt-0.5 h-2 min-h-2 w-2 min-w-2 rounded-full', {
                            'bg-green-500': !pingError,
                            'bg-red-500': !!pingError,
                        })}
                    ></div>
                )
            }
        >
            {(network) => (
                <SelectItem key={network.key} textValue={`${network.key.charAt(0).toUpperCase() + network.key.slice(1)}`}>
                    <div className="row gap-2 py-1">
                        <div className="font-medium capitalize">{network.key}</div>
                    </div>
                </SelectItem>
            )}
        </Select>
    );
};

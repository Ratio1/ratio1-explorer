'use client';

import { Input } from '@heroui/input';
import { Spinner } from '@heroui/spinner';
import { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { usePublicClient } from 'wagmi';

export const Search = () => {
    const [value, setValue] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);

    const publicClient = usePublicClient();

    const search = async () => {
        if (!publicClient) {
            console.error('No publicClient available');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 300);
    };

    return (
        <Input
            value={value}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    search();
                }
            }}
            onValueChange={(value) => {
                setValue(value);
            }}
            isDisabled={isLoading}
            size="lg"
            classNames={{
                inputWrapper: 'h-[52px] bg-slate-100 hover:!bg-[#eceef6] group-data-[focus=true]:bg-slate-100 px-6 rounded-2xl',
            }}
            variant="flat"
            labelPlacement="outside"
            placeholder="Search by Node ETH Address / Node Internal Address / Alias"
            endContent={
                <div className="center-all -mr-2.5 cursor-pointer p-2 text-[22px]">
                    {isLoading ? (
                        <Spinner size="sm" color="primary" />
                    ) : (
                        <div
                            onClick={() => {
                                search();
                            }}
                        >
                            <RiSearchLine />
                        </div>
                    )}
                </div>
            }
        />
    );
};

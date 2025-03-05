'use client';

import { getShortAddress } from '@/lib/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { RiCheckLine, RiFileCopyLine } from 'react-icons/ri';

interface Props {
    value: string;
    size?: number;
    isLarge?: boolean;
    link?: string;
}

export const CopyableAddress = ({ value, size = 4, isLarge = false, link }: Props) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const getAddress = () => (
        <div
            className={clsx('text-slate-400', {
                'text-sm': !isLarge,
                'text-[15px]': isLarge,
                'hover:text-primary': !!link,
            })}
        >
            {getShortAddress(value, size)}
        </div>
    );

    return (
        <div className="row gap-1">
            {!link ? getAddress() : <Link href={link}>{getAddress()}</Link>}

            <div className="text-primary-300">
                {!copied ? (
                    <RiFileCopyLine
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleCopy();
                        }}
                        className="cursor-pointer hover:opacity-50"
                    />
                ) : (
                    <RiCheckLine />
                )}
            </div>
        </div>
    );
};

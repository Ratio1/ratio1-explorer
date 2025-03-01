'use client';

import { getShortAddress } from '@/lib/utils';
import clsx from 'clsx';
import { useState } from 'react';
import { RiCheckLine, RiFileCopyLine } from 'react-icons/ri';

export const CopyableAddress = ({ value, size = 4, isLarge = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    return (
        <div className="row gap-1">
            <div
                className={clsx('text-slate-400', {
                    'text-sm': !isLarge,
                    'text-[15px] text-body': isLarge,
                })}
            >
                {getShortAddress(value, size)}
            </div>

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

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
        <div className="row gap-1 text-slate-400">
            <div
                className={clsx({
                    'text-sm': !isLarge,
                    'text-[15px] text-body': isLarge,
                })}
            >
                {getShortAddress(value, size)}
            </div>
            {!copied ? <RiFileCopyLine onClick={handleCopy} className="cursor-pointer hover:opacity-50" /> : <RiCheckLine />}
        </div>
    );
};

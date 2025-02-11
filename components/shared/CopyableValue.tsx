'use client';

import { useState } from 'react';
import { RiCheckLine, RiFileCopyLine } from 'react-icons/ri';

export const CopyableValue = ({ value }) => {
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
            <div className="text-sm leading-5">{value}</div>

            {!copied ? <RiFileCopyLine onClick={handleCopy} className="cursor-pointer hover:opacity-50" /> : <RiCheckLine />}
        </div>
    );
};

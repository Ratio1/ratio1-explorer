'use client';

import config from '@/config';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { HiUser } from 'react-icons/hi';

export default function ProfileImage({ ownerEthAddr, isSmall = false }: { ownerEthAddr: types.EthAddress; isSmall?: boolean }) {
    const src = `${config.backendUrl}/branding/get-brand-logo?address=${ownerEthAddr}`;

    const [hasError, setHasError] = useState(false);
    const [isLoading, setLoading] = useState(true);

    if (hasError) {
        return (
            // Placeholder user icon when no image exists
            <div
                className={clsx('center-all h-full w-full bg-slate-200 text-white', {
                    'text-3xl': !isSmall,
                    'text-xl': isSmall,
                })}
            >
                <HiUser />
            </div>
        );
    }

    return (
        <>
            {isLoading && <Skeleton className="h-full w-full" />}

            <Image
                src={src}
                alt="Profile Image"
                className={clsx('object-cover', {
                    'opacity-0': isLoading || hasError,
                })}
                fill
                sizes="128px"
                priority
                onLoad={() => setLoading(false)}
                onError={() => {
                    setLoading(false);
                    setHasError(true);
                }}
            />
        </>
    );
}

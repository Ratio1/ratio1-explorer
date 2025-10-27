'use client';

import config from '@/config';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { HiUser } from 'react-icons/hi';

export default function ProfileImage({ ownerEthAddr, isSmall = false }) {
    const src = `${config.backendUrl}/branding/get-brand-logo?address=${ownerEthAddr}`;
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            // Placeholder user icon when no image exists
            <div
                className={clsx('center-all h-full w-full rounded-[37.5%] bg-slate-200 text-white', {
                    'text-3xl': !isSmall,
                    'text-xl': isSmall,
                })}
            >
                <HiUser />
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt="Profile Image"
            className="object-cover"
            fill
            sizes="128px"
            priority
            onError={() => {
                console.log('Error loading profile image:', src);
                setHasError(true);
            }}
        />
    );
}

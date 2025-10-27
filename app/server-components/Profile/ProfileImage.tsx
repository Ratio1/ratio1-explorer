'use client';

import config from '@/config';
import Image from 'next/image';
import { useState } from 'react';
import { HiUser } from 'react-icons/hi';

export default function ProfileImage({ ownerEthAddr }) {
    const src = `${config.backendUrl}/branding/get-brand-logo?address=${ownerEthAddr}`;
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            // Placeholder user icon when no image exists
            <div className="center-all h-full w-full rounded-full bg-slate-200 text-2xl text-white">
                <HiUser />
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt="Profile Image"
            className="rounded-full object-cover"
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

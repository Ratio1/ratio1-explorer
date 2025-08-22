import ApiStatusCard from '@/app/server-components/shared/ApiStatusCard';
import { cachedLayoutFunction } from '@/lib/actions';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { RiDiscordLine, RiLinkedinBoxLine, RiTwitterXLine, RiYoutubeLine } from 'react-icons/ri';

const socialLinks = [
    { url: 'https://discord.gg/ratio1ai', icon: <RiDiscordLine /> },
    { url: 'https://x.com/ratio1ai', icon: <RiTwitterXLine /> },
    { url: 'https://www.linkedin.com/company/ratio1', icon: <RiLinkedinBoxLine /> },
    { url: 'https://www.youtube.com/@ratio1AI', icon: <RiYoutubeLine /> },
];

export default async function Footer() {
    let activeNodes: types.OraclesDefaultResult;

    try {
        activeNodes = await cachedLayoutFunction();
    } catch (error) {
        console.error(error);
        return null;
    }

    return (
        <div className="col center-all w-full gap-8 rounded-3xl bg-slate-100 px-8 py-10">
            <div className="col gap-4">
                <Image className="h-7 w-auto" src="/logo_explorer.svg" width={0} height={0} alt="Logo" priority />

                <div className="text-center text-sm font-medium text-slate-500">
                    Ratio1 - The Ultimate AI OS Powered by Blockchain Technology
                </div>
            </div>

            <div className="row mx-auto gap-2">
                {socialLinks.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url}
                        className="cursor-pointer p-2 text-3xl text-primary hover:opacity-70"
                        target="_blank"
                    >
                        {link.icon}
                    </Link>
                ))}
            </div>

            <div className="text-center text-sm font-medium text-slate-400">
                {activeNodes.result.server_alias} • v{activeNodes.result.server_version}
            </div>

            <div className="col items-center gap-2">
                <Suspense fallback={<Skeleton className="min-h-[40px] w-full max-w-[116px] rounded-xl" />}>
                    <ApiStatusCard />
                </Suspense>

                {(!!process.env.NEXT_PUBLIC_APP_VERSION || !!process.env.NEXT_PUBLIC_COMMIT_HASH) && (
                    <div className="text-sm font-medium text-slate-500">
                        {process.env.NEXT_PUBLIC_APP_VERSION
                            ? `v${process.env.NEXT_PUBLIC_APP_VERSION}`
                            : `${process.env.NEXT_PUBLIC_COMMIT_HASH?.substring(0, 7)}`}
                    </div>
                )}
            </div>
        </div>
    );
}

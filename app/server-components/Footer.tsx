import ApiStatusCard from '@/app/server-components/shared/ApiStatusCard';
import { getCurrentEpochServer } from '@/lib/api/oracles';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { JSX, Suspense } from 'react';
import { RiDiscordLine, RiLinkedinBoxLine, RiTwitterXLine, RiYoutubeLine } from 'react-icons/ri';

const socialLinks = [
    { url: 'https://discord.gg/ratio1ai', icon: <RiDiscordLine /> },
    { url: 'https://x.com/ratio1ai', icon: <RiTwitterXLine /> },
    { url: 'https://www.linkedin.com/company/ratio1', icon: <RiLinkedinBoxLine /> },
    { url: 'https://www.youtube.com/@ratio1AI', icon: <RiYoutubeLine /> },
];

const keys = ['server_alias', 'server_version', 'server_time', 'server_current_epoch', 'server_uptime'];

export default async function Footer() {
    let response: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined;

    try {
        response = await getCurrentEpochServer();
    } catch (error) {
        console.log(error);
    }

    const getServerDataRow = (key: string, value: string | number): JSX.Element => (
        <div className="text-sm font-medium">
            <span className="w-40 capitalize text-slate-500">{key.replaceAll('_', ' ')}:</span>{' '}
            <span className="text-primary">{value}</span>
        </div>
    );

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

            {!!response && (
                <div className="col -mt-2 text-center">
                    {keys.map((key) => (
                        <div key={key}>{getServerDataRow(key, response[key])}</div>
                    ))}
                </div>
            )}

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

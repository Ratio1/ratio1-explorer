import ApiStatus from '@/components/shared/ApiStatusCard';
import { ServerInfo } from '@/typedefs/blockchain';
import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
import { RiDiscordLine, RiLinkedinBoxLine, RiTwitterXLine, RiYoutubeLine } from 'react-icons/ri';

const socialLinks = [
    { url: 'https://discord.gg/ratio1ai', icon: <RiDiscordLine /> },
    { url: 'https://x.com/ratio1ai', icon: <RiTwitterXLine /> },
    { url: 'https://www.linkedin.com/company/ratio1', icon: <RiLinkedinBoxLine /> },
    { url: 'https://www.youtube.com/@ratio1AI', icon: <RiYoutubeLine /> },
];

export default async function Footer({ serverInfo }: { serverInfo?: ServerInfo }) {
    const getServerDataRow = (key: string, value: string | number): JSX.Element => (
        <div className="text-sm font-medium">
            <span className="w-40 capitalize text-slate-500">{key.replaceAll('_', ' ')}:</span>{' '}
            <span className="text-primary">{value}</span>
        </div>
    );

    return (
        <div className="col center-all w-full gap-8 rounded-3xl bg-slate-100 px-8 py-10">
            <div className="col gap-4">
                <Image className="h-8 w-auto" src="/logo.svg" width={0} height={0} alt="Logo" priority />

                <div className="text-center text-sm font-medium text-slate-500">
                    Ratio1 - The Ultimate AI OS Powered by Blockchain Technology
                </div>
            </div>

            <div className="col gap-1">
                <div className="text-center font-semibold">Join us</div>
                <div className="row w-full gap-2">
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
            </div>

            {serverInfo && (
                <div className="col -mt-2 text-center">
                    {Object.entries(serverInfo).map(([key, value], index) => (
                        <div key={index}>{getServerDataRow(key, value)}</div>
                    ))}
                </div>
            )}

            <ApiStatus />
        </div>
    );
}

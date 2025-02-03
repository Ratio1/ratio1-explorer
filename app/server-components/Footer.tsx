import ApiStatus from '@/components/shared/ApiStatusCard';
import Image from 'next/image';
import Link from 'next/link';
import { RiDiscordLine, RiLinkedinBoxLine, RiTwitterXLine, RiYoutubeLine } from 'react-icons/ri';

const socialLinks = [
    { url: 'https://discord.gg/ratio1ai', icon: <RiDiscordLine /> },
    { url: 'https://x.com/ratio1ai', icon: <RiTwitterXLine /> },
    { url: 'https://www.linkedin.com/company/ratio1', icon: <RiLinkedinBoxLine /> },
    { url: 'https://www.youtube.com/@ratio1AI', icon: <RiYoutubeLine /> },
];

export default async function Footer() {
    return (
        <div className="col center-all w-full gap-10 rounded-3xl bg-lightBlue px-8 py-12">
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

            <ApiStatus />
        </div>
    );
}

import { CardRounded } from '@/app/server-components/shared/cards/CardRounded';
import { NetworkSelector } from '@/components/NetworkSelector';
import config from '@/config';
import Image from 'next/image';
import Link from 'next/link';

export default async function Header() {
    return (
        <div className="flex w-full justify-between">
            <div className="row">
                <Link href="/">
                    <div className="flex items-end gap-2.5">
                        <Image className="h-8 w-auto" src="/logo_explorer.svg" width={0} height={0} alt="Logo" priority />
                    </div>
                </Link>
            </div>

            <div className="row gap-2">
                <div className="flex">
                    <CardRounded>
                        <div className="row gap-1.5 px-4 py-3">
                            <Image className="h-6 w-auto" src="/base.webp" width={32} height={32} alt="Blockchain" />
                            <div className="text-sm font-medium">
                                {config.environment === 'mainnet' ? 'Base' : 'Base Sepolia'}
                            </div>
                        </div>
                    </CardRounded>
                </div>

                <div className="flex">
                    <NetworkSelector />
                </div>
            </div>
        </div>
    );
}

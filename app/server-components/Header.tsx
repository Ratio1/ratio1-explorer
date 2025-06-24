import { CardRounded } from '@/app/server-components/shared/cards/CardRounded';
import Navigation from '@/components/Navigation';
import { NetworkSelector } from '@/components/NetworkSelector';
import config from '@/config';
import Image from 'next/image';
import Link from 'next/link';

export default async function Header() {
    return (
        <div className="flex w-full justify-between">
            <div className="row gap-10">
                <div className="row gap-16">
                    <Link href="/">
                        <div className="flex items-end gap-2.5">
                            <Image
                                className="h-7 w-auto lg:h-8"
                                src="/logo_explorer.svg"
                                width={0}
                                height={0}
                                alt="Logo"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                <Navigation />
            </div>

            <div className="row gap-2">
                <div className="web-only-flex gap-2">
                    <CardRounded>
                        <div className="row gap-1.5 px-4 py-3">
                            <Image className="h-6 w-auto" src="/base.webp" width={32} height={32} alt="Blockchain" />
                            <div className="text-[15px] font-medium">
                                {config.environment === 'mainnet' ? 'Base' : 'Base Sepolia'}
                            </div>
                        </div>
                    </CardRounded>

                    {/* <Button
                        className="min-h-10 rounded-full lg:min-h-12"
                        color="primary"
                        as={Link}
                        href={process.env.NEXT_APP_URL}
                        target="_blank"
                    >
                        <div className="row gap-1.5">
                            <RiFunctionLine className="text-lg" />
                            <div className="font-medium">App</div>
                        </div>
                    </Button> */}
                </div>

                <div className="flex">
                    <NetworkSelector />
                </div>
            </div>
        </div>
    );
}

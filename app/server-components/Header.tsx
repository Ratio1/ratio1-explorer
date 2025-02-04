import { Card } from '@/components/shared/Card';
import Image from 'next/image';

export default async function Header() {
    return (
        <div className="flex w-full justify-between">
            <div className="row">
                <div className="flex items-end gap-2.5">
                    <Image className="h-7 w-auto" src="/logo.svg" width={0} height={0} alt="Logo" priority />
                    <div className="-mt-1 text-2xl font-semibold leading-none text-primary">Explorer</div>
                </div>
            </div>

            <Card>
                <div className="row gap-1.5">
                    <Image className="h-6 w-auto" src="/base_sepolia.webp" width={32} height={32} alt="Blockchain" />
                    <div className="font-medium">Base Sepolia</div>
                </div>
            </Card>
        </div>
    );
}

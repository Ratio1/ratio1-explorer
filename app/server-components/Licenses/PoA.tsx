import * as types from '@/typedefs/blockchain';
import { RiCpuLine } from 'react-icons/ri';
import { formatUnits } from 'viem';
import { CardFlexible } from '../shared/cards/CardFlexible';

export default async function PoA({ license }: { license: types.License }) {
    const getStats = () => (
        <>
            <div className="col gap-[5px]">
                <div className="text-[15px] font-medium leading-none text-slate-500">Remaining</div>
                <div className="font-semibold leading-none">
                    {parseFloat(
                        Number(formatUnits(license.totalAssignedAmount - license.totalClaimedAmount, 18)).toFixed(2),
                    ).toLocaleString()}
                </div>
            </div>

            <div className="col gap-[5px]">
                <div className="text-[15px] font-medium leading-none text-slate-500">Initial amount</div>
                <div className="font-semibold leading-none">
                    {parseFloat(Number(formatUnits(license.totalAssignedAmount ?? 0n, 18)).toFixed(2)).toLocaleString()}
                </div>
            </div>
        </>
    );

    return (
        <CardFlexible isFlexible>
            <div className="flex w-full flex-col justify-between gap-4 px-4 py-4 sm:h-[76px] sm:flex-row sm:items-center sm:py-2 md:gap-10 md:px-6 lg:gap-16">
                <div className="row gap-2">
                    <div className="center-all rounded-full bg-blue-100 p-2.5 text-2xl text-primary">
                        <RiCpuLine />
                    </div>

                    <div className="text-[15px] font-medium leading-none text-slate-500">
                        <span className="hidden sm:block">PoA</span>
                        <span className="block sm:hidden">Proof of Availability</span>
                    </div>
                </div>

                <div className="row justify-between sm:contents">{getStats()}</div>
            </div>
        </CardFlexible>
    );
}

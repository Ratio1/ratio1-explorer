import { CardWithIcon } from '@/app/server-components/shared/cards/CardWithIcon';
import { Search } from '@/components/Search';
import TopBarEpochCard from '@/components/TopBarEpochCard';
import { getActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { RiCpuLine } from 'react-icons/ri';
import PriceCard from './shared/PriceCard';
import { RowWithIcon } from './shared/cards/RowWithIcon';

export default async function TopBar() {
    let activeNodes: types.OraclesDefaultResult;

    try {
        activeNodes = await getActiveNodes();
    } catch (error) {
        console.error(error);
        return null;
    }

    return (
        <div className="flex w-full flex-col justify-between gap-4 md:gap-6 lg:flex-row lg:gap-12">
            <div className="w-full flex-1">
                <Search />
            </div>

            <div className="flex-1">
                <div className="hidden flex-wrap items-center justify-between gap-2 sm:flex lg:flex-nowrap lg:justify-end lg:gap-3">
                    <TopBarEpochCard />

                    <PriceCard />

                    <CardWithIcon icon={<RiCpuLine />} label="Active Nodes">
                        {activeNodes.result.nodes_total_items}
                    </CardWithIcon>
                </div>

                <div className="flex w-full flex-col gap-1.5 rounded-xl bg-slate-100 px-4 py-4 sm:hidden">
                    <TopBarEpochCard />

                    <PriceCard />

                    <RowWithIcon icon={<RiCpuLine />} label="Active Nodes">
                        {activeNodes.result.nodes_total_items}
                    </RowWithIcon>
                </div>
            </div>
        </div>
    );
}

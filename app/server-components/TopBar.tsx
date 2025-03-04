import { CardWithIcon } from '@/app/server-components/shared/cards/CardWithIcon';
import { Search } from '@/components/Search';
import TopBarEpochCard from '@/components/TopBarEpochCard';
import { getActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { RiCpuLine } from 'react-icons/ri';
import PriceCard from './shared/PriceCard';

export default async function TopBar() {
    let activeNodes: types.OraclesDefaultResult;

    try {
        activeNodes = await getActiveNodes();
    } catch (error) {
        return;
    }

    return (
        <div className="row w-full justify-between gap-12">
            <div className="w-full flex-1">
                <Search />
            </div>

            <div className="flex-1">
                <div className="row justify-end gap-3">
                    <TopBarEpochCard />

                    <PriceCard />

                    <CardWithIcon icon={<RiCpuLine />} label="Active Nodes">
                        <div className="font-semibold leading-none text-primary">{activeNodes.result.nodes_total_items}</div>
                    </CardWithIcon>
                </div>
            </div>
        </div>
    );
}

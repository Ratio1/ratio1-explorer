import { CardWithIcon } from '@/app/server-components/shared/cards/CardWithIcon';
import { PriceCard } from '@/components/PriceCard';
import { Search } from '@/components/Search';
import { getNextEpochTimestamp } from '@/config';
import { getActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { formatDistanceToNow } from 'date-fns';
import { RiCpuLine, RiTimeLine } from 'react-icons/ri';

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
                    <CardWithIcon icon={<RiTimeLine />} label={`${formatDistanceToNow(getNextEpochTimestamp())} left`}>
                        <div className="pr-0.5 font-medium leading-none">
                            Epoch <span className="font-semibold text-primary">{activeNodes.result.server_current_epoch}</span>
                        </div>
                    </CardWithIcon>

                    <PriceCard />

                    <CardWithIcon icon={<RiCpuLine />} label="Active Nodes">
                        <div className="font-semibold leading-none text-primary">{activeNodes.result.nodes_total_items}</div>
                    </CardWithIcon>
                </div>
            </div>
        </div>
    );
}

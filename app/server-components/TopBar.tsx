import { SmallCardWithIcon } from '@/app/server-components/shared/SmallCardWithIcon';
import { PriceCard } from '@/components/PriceCard';
import { Search } from '@/components/Search';
import { getNextEpochTimestamp } from '@/config';
import { OraclesDefaultResult } from '@/typedefs/blockchain';
import { formatDistanceToNow } from 'date-fns';
import { RiCpuLine, RiTimeLine } from 'react-icons/ri';

export default function TopBar({ oraclesInfo }: { oraclesInfo: OraclesDefaultResult }) {
    const activeNodes = Object.values(oraclesInfo.result.nodes)
        .slice(1)
        .filter((node) => {
            const [hours, _minutes, _seconds] = node.last_seen_ago.split(':').map(Number);
            return hours === 0;
        });

    return (
        <div className="row w-full justify-between gap-12">
            <div className="w-full flex-1">
                <Search />
            </div>

            <div className="flex-1">
                <div className="row justify-end gap-3">
                    <SmallCardWithIcon icon={<RiTimeLine />} label={`${formatDistanceToNow(getNextEpochTimestamp())} left`}>
                        <div className="pr-0.5 font-medium leading-none">
                            Epoch <span className="font-semibold text-primary">{oraclesInfo.result.server_current_epoch}</span>
                        </div>
                    </SmallCardWithIcon>

                    <PriceCard />

                    <SmallCardWithIcon icon={<RiCpuLine />} label="Active Nodes">
                        <div className="font-semibold leading-none text-primary">{activeNodes.length}</div>
                    </SmallCardWithIcon>
                </div>
            </div>
        </div>
    );
}

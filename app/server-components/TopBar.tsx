import { PriceCard } from '@/components/PriceCard';
import { Search } from '@/components/Search';
import { SmallCardWithIcon } from '@/components/shared/SmallCardWithIcon';
import { getCurrentEpoch, getNextEpochTimestamp } from '@/config';
import { formatDistanceToNow } from 'date-fns';
import { RiCpuLine, RiTimeLine } from 'react-icons/ri';

export default function TopBar() {
    return (
        <div className="row w-full justify-between gap-12">
            <div className="w-full flex-1">
                <Search />
            </div>

            <div className="flex-1">
                <div className="row justify-end gap-3">
                    <SmallCardWithIcon icon={<RiTimeLine />} label={`${formatDistanceToNow(getNextEpochTimestamp())} left`}>
                        <div className="pr-0.5 font-medium leading-none">
                            Epoch <span className="font-semibold text-primary">{getCurrentEpoch()}</span>
                        </div>
                    </SmallCardWithIcon>

                    <PriceCard />

                    <SmallCardWithIcon icon={<RiCpuLine />} label="Active Nodes">
                        <div className="font-semibold leading-none text-primary">32</div>
                    </SmallCardWithIcon>
                </div>
            </div>
        </div>
    );
}

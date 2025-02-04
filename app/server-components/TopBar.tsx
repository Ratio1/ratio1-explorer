import { PriceCard } from '@/components/PriceCard';
import { Search } from '@/components/Search';
import { getCurrentEpoch, getNextEpochTimestamp } from '@/config';
import { formatDistanceToNow } from 'date-fns';

export default function TopBar() {
    return (
        <div className="row w-full justify-between gap-12">
            <div className="w-full flex-1">
                <Search />
            </div>

            <div className="flex-1">
                <div className="row justify-end gap-3">
                    <div className="col h-[52px] justify-center rounded-2xl bg-lightBlue px-4 py-1.5">
                        <div className="font-medium">
                            Epoch <span className="font-semibold text-primary">{getCurrentEpoch()}</span>
                        </div>

                        <div className="text-xs leading-none text-slate-500">
                            {formatDistanceToNow(getNextEpochTimestamp())} left
                        </div>
                    </div>

                    <PriceCard />

                    <div className="col h-[52px] justify-center rounded-2xl bg-lightBlue px-3.5 py-1.5">
                        <div className="font-semibold text-primary">32</div>
                        <div className="text-xs leading-none text-slate-500">Active Nodes</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

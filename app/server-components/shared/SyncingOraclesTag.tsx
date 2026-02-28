import { Spinner } from '@heroui/spinner';

export default function SyncingOraclesTag() {
    return (
        <div className="flex">
            <div className="row gap-1.5 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary">
                <Spinner className="-mt-0.5" size="sm" />
                <span>Syncing oracles</span>
            </div>
        </div>
    );
}

import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
    return (
        <div className="col w-full flex-1 gap-6">
            <Skeleton className="min-h-[183px] w-full rounded-2xl" />
            <Skeleton className="min-h-[264px] w-full rounded-2xl" />
            <Skeleton className="min-h-[264px] w-full rounded-2xl" />
        </div>
    );
}

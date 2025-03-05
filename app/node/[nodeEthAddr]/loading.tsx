import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
    return (
        <div className="responsive-col">
            <Skeleton className="min-h-[317px] w-full rounded-2xl" />
            <Skeleton className="min-h-[352px] w-full rounded-2xl" />
            <Skeleton className="min-h-[276px] w-full rounded-2xl" />
        </div>
    );
}

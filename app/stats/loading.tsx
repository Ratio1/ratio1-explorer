import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
    return (
        <div className="responsive-col">
            <Skeleton className="min-h-[180px] w-full rounded-2xl" />

            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="min-h-[260px] w-full rounded-2xl" />
                <Skeleton className="min-h-[200px] w-full rounded-2xl" />
            </div>
        </div>
    );
}

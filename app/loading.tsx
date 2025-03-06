import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
    return (
        <div className="responsive-col">
            <Skeleton className="min-h-[264px] w-full rounded-2xl" />

            <div className="col w-full gap-2">
                <Skeleton className="min-h-[92px] w-full rounded-2xl" />
                <Skeleton className="min-h-[92px] w-full rounded-2xl" />
                <Skeleton className="min-h-[92px] w-full rounded-2xl" />
                <Skeleton className="min-h-[92px] w-full rounded-2xl" />
            </div>
        </div>
    );
}

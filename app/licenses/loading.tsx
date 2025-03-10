import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
    return (
        <div className="responsive-col">
            <Skeleton className="min-h-[176px] w-full rounded-2xl" />

            <div className="col w-full gap-2">
                <Skeleton className="only-lg min-h-[56px] w-full rounded-2xl" />

                <Skeleton className="min-h-[92px] w-full rounded-2xl" />
                <Skeleton className="min-h-[92px] w-full rounded-2xl" />
                <Skeleton className="min-h-[92px] w-full rounded-2xl" />
                <Skeleton className="min-h-[92px] w-full rounded-2xl" />
            </div>
        </div>
    );
}

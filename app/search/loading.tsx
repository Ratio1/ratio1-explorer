import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
    return (
        <div className="responsive-col">
            <Skeleton className="min-h-[148px] w-full rounded-2xl" />

            <div className="col w-full gap-1.5">
                <Skeleton className="only-lg min-h-[28px] w-[100px] rounded-2xl" />

                <Skeleton className="min-h-[68px] w-full rounded-2xl" />
                <Skeleton className="min-h-[68px] w-full rounded-2xl" />
                <Skeleton className="min-h-[68px] w-full rounded-2xl" />
                <Skeleton className="min-h-[68px] w-full rounded-2xl" />
            </div>
        </div>
    );
}

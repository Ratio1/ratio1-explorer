import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
    return (
        <div className="responsive-col">
            <Skeleton className="min-h-[180px] w-full rounded-2xl" />

            <div className="col w-full gap-2">
                <Skeleton className="only-lg min-h-[56px] w-full rounded-2xl" />

                <Skeleton className="min-h-[68px] w-full rounded-2xl lg:min-h-[56px]" />
                <Skeleton className="min-h-[68px] w-full rounded-2xl lg:min-h-[56px]" />
                <Skeleton className="min-h-[68px] w-full rounded-2xl lg:min-h-[56px]" />
                <Skeleton className="min-h-[68px] w-full rounded-2xl lg:min-h-[56px]" />
                <Skeleton className="min-h-[68px] w-full rounded-2xl lg:min-h-[56px]" />
                <Skeleton className="min-h-[68px] w-full rounded-2xl lg:min-h-[56px]" />
            </div>
        </div>
    );
}

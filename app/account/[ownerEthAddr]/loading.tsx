import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
    return (
        <div className="responsive-col">
            <Skeleton className="min-h-[281px] w-full rounded-2xl" />
            <Skeleton className="min-h-[260px] w-full rounded-2xl" />
        </div>
    );
}

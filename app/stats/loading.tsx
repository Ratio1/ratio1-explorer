import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
    return (
        <div className="responsive-col">
            <Skeleton className="min-h-[180px] w-full rounded-2xl" />

            <Skeleton className="min-h-[368px] w-full rounded-2xl" />
        </div>
    );
}

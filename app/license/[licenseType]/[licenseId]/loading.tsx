import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
    return (
        <div className="responsive-col">
            <Skeleton className="min-h-[264px] w-full rounded-2xl" />
            <Skeleton className="min-h-[325.5px] w-full rounded-2xl" />
            <Skeleton className="min-h-[272px] w-full rounded-2xl" />
        </div>
    );
}

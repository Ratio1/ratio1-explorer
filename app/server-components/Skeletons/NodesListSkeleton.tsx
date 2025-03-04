import { Skeleton } from '@heroui/skeleton';

export default function NodesListSkeleton() {
    return (
        <div className="col w-full gap-2">
            {Array(10)
                .fill(null)
                .map((_, index) => (
                    <div key={index}>
                        <Skeleton className="min-h-[88px] w-full rounded-2xl" />
                    </div>
                ))}
        </div>
    );
}

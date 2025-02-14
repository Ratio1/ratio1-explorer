import { Skeleton } from '@heroui/skeleton';

export default function NodesListSkeleton() {
    return (
        <div className="col w-full gap-2">
            {Array(5)
                .fill(null)
                .map((_, index) => (
                    <div key={index}>
                        <Skeleton className="my h-[99px] rounded-2xl" />
                    </div>
                ))}
        </div>
    );
}

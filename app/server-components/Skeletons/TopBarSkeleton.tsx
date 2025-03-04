import { Skeleton } from '@heroui/skeleton';

export default function TopBarSkeleton() {
    return (
        <div className="row w-full justify-between gap-12">
            <div className="w-full flex-1">
                <Skeleton className="h-[52px] rounded-2xl" />
            </div>

            <div className="flex-1">
                <div className="row justify-end gap-3">
                    {Array(3)
                        .fill(null)
                        .map((_, index) => (
                            <div key={index}>
                                <Skeleton className="h-[52px] min-w-40 rounded-full" />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

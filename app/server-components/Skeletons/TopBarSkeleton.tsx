import { Skeleton } from '@heroui/skeleton';

export default function TopBarSkeleton() {
    return (
        <div className="flex w-full flex-col justify-between gap-4 md:gap-6 lg:flex-row lg:gap-12">
            <div className="w-full flex-1">
                <Skeleton className="h-[52px] w-full rounded-xl sm:w-auto" />
            </div>

            <div className="flex-1">
                <div className="hidden flex-wrap items-center justify-between gap-2 sm:flex lg:flex-nowrap lg:justify-end lg:gap-3">
                    {Array(3)
                        .fill(null)
                        .map((_, index) => (
                            <div key={index}>
                                <Skeleton className="h-[52px] min-w-40 rounded-full" />
                            </div>
                        ))}
                </div>

                <div className="flex w-full sm:hidden">
                    <Skeleton className="h-[122px] w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}

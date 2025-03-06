'use client';

import { navRoutes, routeIcons, routeTitles } from '@/lib/routes';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileTabs() {
    const pathname: string = usePathname() as string;
    const activeStyle = '!text-primary !opacity-100';

    return (
        <div className="center-all fixed bottom-0 left-0 right-0 z-50">
            <div className="w-full border-t border-slate-200 bg-slate-100 px-2.5 py-1">
                <div className="center-all nav-safe-padding gap-4">
                    {navRoutes.map((routePath) => (
                        <div key={routePath}>
                            <Link
                                href={routePath}
                                className={clsx(
                                    'center-all col min-w-[76px] cursor-pointer gap-0.5 px-3 py-1 text-slate-500 hover:opacity-50',
                                    {
                                        [activeStyle]: routePath === pathname,
                                    },
                                )}
                            >
                                <div className="text-[24px]">{routeIcons[routePath]}</div>
                                <div className="text-sm font-medium">{routeTitles[routePath]}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

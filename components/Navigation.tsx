'use client';

import { navRoutes, routeTitles } from '@/lib/routes';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname: string = usePathname() as string;
    const activeStyle = '!text-primary !opacity-100';

    return navRoutes.map((routePath) => (
        <div
            key={routePath}
            className={clsx('cursor-pointer pt-[6px] hover:opacity-50', {
                [activeStyle]: routePath === pathname,
            })}
        >
            <Link href={routePath}>
                <div className="font-semibold">{routeTitles[routePath]}</div>
            </Link>
        </div>
    ));
}

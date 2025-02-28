'use client';

import { navRoutes, routeTitles } from '@/lib/routes';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname: string = usePathname() as string;
    const activeStyle = '!text-primary !opacity-100';

    return (
        <div className="row gap-8">
            {navRoutes.map((routePath) => (
                <div
                    key={routePath}
                    className={clsx('cursor-pointer hover:opacity-60', {
                        [activeStyle]: routePath === pathname,
                    })}
                >
                    <Link href={routePath}>
                        <div className="font-semibold">{routeTitles[routePath]}</div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

import '@/lib/cron';
import { buildMetadata } from '@/lib/utils';
import { monaSans, robotoMono } from '@/styles/fonts';
import '@/styles/globals.css';
import { Skeleton } from '@heroui/skeleton';
import { HeroUIProvider } from '@heroui/system';
import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import Footer from './server-components/Footer';
import Header from './server-components/Header';
import TopBarSkeleton from './server-components/Skeletons/TopBarSkeleton';
import TopBar from './server-components/TopBar';

export const viewport: Viewport = {
    themeColor: '#000000',
};

export async function generateMetadata(): Promise<Metadata> {
    return buildMetadata(
        'Ratio1 Explorer',
        'Experience the power of Ratio1 AI OS, built on Ratio1 Protocol and powered by blockchain, democratizing AI to empower limitless innovation.',
    );
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${monaSans.variable} ${robotoMono.variable} antialiased`}>
                <HeroUIProvider>
                    <div className="col layout min-h-screen gap-4 py-6 md:gap-6">
                        <div className="lg:pb-4">
                            <Header />
                        </div>

                        <Suspense fallback={<TopBarSkeleton />}>
                            <TopBar />
                        </Suspense>

                        {children}

                        <Suspense fallback={<Skeleton className="min-h-[298px] w-full rounded-3xl" />}>
                            <Footer />
                        </Suspense>
                    </div>
                </HeroUIProvider>
            </body>
        </html>
    );
}

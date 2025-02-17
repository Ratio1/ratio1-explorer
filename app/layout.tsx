import { Wrappers } from '@/lib/wrappers';
import { monaSans, robotoMono } from '@/styles/fonts';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Footer from './server-components/Footer';
import Header from './server-components/Header';
import TopBarSkeleton from './server-components/Skeletons/TopBarSkeleton';
import TopBar from './server-components/TopBar';

export const metadata: Metadata = {
    title: 'Ratio1 - Explorer',
    description:
        'Experience the power of Ratio1 AI OS, built on Ratio1 Protocol and powered by blockchain, democratizing AI to empower limitless innovation.',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${monaSans.variable} ${robotoMono.variable} antialiased`}>
                <Wrappers>
                    <div className="col layout min-h-screen gap-6 py-6">
                        <div className="pb-4">
                            <Header />
                        </div>

                        <Suspense fallback={<TopBarSkeleton />}>
                            <TopBar />
                        </Suspense>

                        {children}

                        <Footer />
                    </div>
                </Wrappers>
            </body>
        </html>
    );
}

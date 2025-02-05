import { Wrappers } from '@/lib/wrappers';
import { monaSans, robotoMono } from '@/styles/fonts';
import '@/styles/globals.css';
import { Spinner } from '@heroui/spinner';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Footer from './server-components/Footer';
import Header from './server-components/Header';

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
                    <div className="col layout min-h-screen gap-8 py-6">
                        <Header />

                        <Suspense
                            fallback={
                                <>
                                    <div className="center-all flex-1">
                                        <Spinner />
                                    </div>

                                    <Footer />
                                </>
                            }
                        >
                            {children}
                        </Suspense>
                    </div>
                </Wrappers>
            </body>
        </html>
    );
}

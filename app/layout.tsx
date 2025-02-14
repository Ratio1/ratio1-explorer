import { Wrappers } from '@/lib/wrappers';
import { monaSans, robotoMono } from '@/styles/fonts';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Footer from './server-components/Footer';
import Header from './server-components/Header';
import Loading from './server-components/Loading';

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

                        <Suspense fallback={<Loading />}>{children}</Suspense>

                        <Footer />
                    </div>
                </Wrappers>
            </body>
        </html>
    );
}

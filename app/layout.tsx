import { Wrappers } from '@/lib/wrappers';
import { monaSans, robotoMono } from '@/styles/fonts';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ratio1 - Explorer',
    description:
        'Experience the power of Ratio1 AI OS, built on Ratio1 Protocol and powered by blockchain, democratizing AI to empower limitless innovation.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${monaSans.variable} ${robotoMono.variable} antialiased`}>
                <Wrappers>{children}</Wrappers>
            </body>
        </html>
    );
}

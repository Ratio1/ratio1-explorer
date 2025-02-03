import { geistMono, geistSans } from '@/styles/fonts';
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
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
        </html>
    );
}

import type { Config } from 'tailwindcss';

export default {
    content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
            flex: {
                '2': '2 1 0%',
                '3': '3 1 0%',
            },
            // TODO: ratio1-dapp
        },
    },
    plugins: [],
} satisfies Config;

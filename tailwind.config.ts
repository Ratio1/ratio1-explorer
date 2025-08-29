import { heroui } from '@heroui/theme';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
    content: [
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@heroui/theme/dist/components/(button|dropdown|input|modal|pagination|select|skeleton|spinner|popover|ripple|menu|divider|form|listbox|scroll-shadow).js',
    ],
    theme: {
        extend: {
            colors: {
                body: '#0b0b47',
                light: '#fcfcfd',
                primary: '#1b47f7',
                // primary: {
                //     DEFAULT: 'hsl(var(--primary))',
                //     foreground: 'hsl(var(--primary-foreground))',
                // },
                slate: {
                    '150': '#e9edf2',
                },
                // background: 'hsl(var(--background))',
                // foreground: 'hsl(var(--foreground))',
                // card: {
                //     DEFAULT: 'hsl(var(--card))',
                //     foreground: 'hsl(var(--card-foreground))',
                // },
                // popover: {
                //     DEFAULT: 'hsl(var(--popover))',
                //     foreground: 'hsl(var(--popover-foreground))',
                // },
                // secondary: {
                //     DEFAULT: 'hsl(var(--secondary))',
                //     foreground: 'hsl(var(--secondary-foreground))',
                // },
                // muted: {
                //     DEFAULT: 'hsl(var(--muted))',
                //     foreground: 'hsl(var(--muted-foreground))',
                // },
                // accent: {
                //     DEFAULT: 'hsl(var(--accent))',
                //     foreground: 'hsl(var(--accent-foreground))',
                // },
                // destructive: {
                //     DEFAULT: 'hsl(var(--destructive))',
                //     foreground: 'hsl(var(--destructive-foreground))',
                // },
                border: 'hsl(var(--border))',
                // input: 'hsl(var(--input))',
                // ring: 'hsl(var(--ring))',
                // chart: {
                //     '1': 'hsl(var(--chart-1))',
                //     '2': 'hsl(var(--chart-2))',
                //     '3': 'hsl(var(--chart-3))',
                //     '4': 'hsl(var(--chart-4))',
                //     '5': 'hsl(var(--chart-5))',
                // },
            },
            flex: {
                '0': '0 0 0%',
                '2': '2 1 0%',
                '3': '3 1 0%',
            },
            fontFamily: {
                mona: ['Mona Sans', 'sans-serif'],
                robotoMono: ['Roboto Mono', 'serif'],
            },
            outlineWidth: {
                '3': '3px',
                '6': '6px',
            },
        },
        screens: {
            xs: '400px',
            sm: '550px',
            md: '768px',
            layoutBreak: '856px',
            lg: '1024px',
        },
    },
    plugins: [heroui(), animate],
} satisfies Config;

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
                slate: {
                    '150': '#e9edf2',
                },
                border: 'hsl(var(--border))', // Used by Shadcn UI
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
            larger: '1100px',
        },
    },
    plugins: [heroui(), animate],
} satisfies Config;

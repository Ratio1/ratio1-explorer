import { heroui } from '@heroui/theme';
import type { Config } from 'tailwindcss';

export default {
    content: [
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@heroui/theme/dist/components/(button|input|pagination|select|skeleton|spinner|ripple|form|listbox|divider|popover|scroll-shadow).js',
    ],
    theme: {
        extend: {
            colors: {
                body: '#0b0b47',
                light: '#fcfcfd',
                primary: '#1b47f7',
            },
            flex: {
                '2': '2 1 0%',
                '3': '3 1 0%',
            },
            fontFamily: {
                mona: ['Mona Sans', 'sans-serif'],
                robotoMono: ['Roboto Mono', 'serif'],
            },
            outlineWidth: {
                3: '3px',
                6: '6px',
            },
        },
    },
    plugins: [heroui()],
} satisfies Config;

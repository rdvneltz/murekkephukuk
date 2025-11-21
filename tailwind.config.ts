import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      perspective: {
        '500': '500px',
        '1000': '1000px',
        '2000': '2000px',
      },
      fontFamily: {
        gotham: ['var(--font-gotham)', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#fdfbf7',
          100: '#f9f5eb',
          200: '#f0e6d2',
          300: '#e6d7b8',
          400: '#d4b896',
          500: 'var(--color-primary)',
          600: 'color-mix(in srgb, var(--color-primary) 80%, black)',
          700: 'color-mix(in srgb, var(--color-primary) 65%, black)',
          800: 'color-mix(in srgb, var(--color-primary) 50%, black)',
          900: 'color-mix(in srgb, var(--color-primary) 35%, black)',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: 'color-mix(in srgb, var(--color-secondary) 50%, white)',
          600: 'color-mix(in srgb, var(--color-secondary) 65%, white)',
          700: 'color-mix(in srgb, var(--color-secondary) 80%, white)',
          800: 'var(--color-secondary)',
          900: 'color-mix(in srgb, var(--color-secondary) 80%, black)',
        },
      },
    },
  },
  plugins: [],
};
export default config;

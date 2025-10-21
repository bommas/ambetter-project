import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-ambetter-magenta',
    'text-ambetter-magenta',
    'border-ambetter-magenta',
    'hover:bg-ambetter-magenta-dark',
    'hover:text-ambetter-magenta',
    'hover:border-ambetter-magenta',
  ],
  theme: {
    extend: {
      colors: {
        ambetter: {
          magenta: '#C61C71',
          'magenta-dark': '#B01866',
          'magenta-light': '#E91E85',
          blue: '#1e40af',
          lightBlue: '#3b82f6',
          darkBlue: '#1e3a8a',
          green: '#059669',
          lightGreen: '#10b981',
          gray: '#6b7280',
          lightGray: '#f3f4f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

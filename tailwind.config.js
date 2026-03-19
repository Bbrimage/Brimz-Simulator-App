/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal:    '#1CF4EA',
          gold:    '#FFB612',
          green:   '#10B981',
          red:     '#EF4444',
        },
        surface: {
          bg:      '#080810',
          DEFAULT: '#0F0F1C',
          2:       '#16162A',
          border:  '#1E1E38',
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body:    ['"Barlow"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      keyframes: {
        'wire-h': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        'wire-v': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        'pump-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(1)',   opacity: '0.6' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        'idle-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.06)' },
        },
        'live-dot': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.2' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'wire-h':     'wire-h 2.4s linear infinite',
        'wire-h-rev': 'wire-h 2.8s linear infinite reverse',
        'wire-v':     'wire-v 2.8s linear infinite',
        'wire-v-rev': 'wire-v 2.4s linear infinite reverse',
        'pump-in':    'pump-in 0.2s ease forwards',
        'ring-1':     'pulse-ring 1.6s ease-out infinite',
        'ring-2':     'pulse-ring 1.6s ease-out 0.28s infinite',
        'ring-3':     'pulse-ring 1.6s ease-out 0.56s infinite',
        'idle-pulse': 'idle-pulse 3s ease-in-out infinite',
        'live-dot':   'live-dot 1.5s ease-in-out infinite',
        'fade-in':    'fade-in 0.5s ease forwards',
      },
    },
  },
  plugins: [],
};

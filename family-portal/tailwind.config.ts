import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Hansonium Brand Colors
        hansonium: {
          // Primary - Deep charcoal/navy from the website
          primary: '#1a1a2e',
          'primary-light': '#252540',
          'primary-dark': '#0f0f1a',
          
          // Accent Green - The signature Hansonium green
          accent: '#4ade80',
          'accent-light': '#86efac',
          'accent-dark': '#22c55e',
          'accent-muted': '#166534',
          
          // Warm neutrals
          cream: '#faf9f7',
          'cream-dark': '#f5f3ef',
          sand: '#e8e4dd',
          
          // Text colors
          'text-primary': '#1a1a2e',
          'text-secondary': '#6b7280',
          'text-muted': '#9ca3af',
          'text-inverse': '#ffffff',
          
          // Status colors (NDIS Compliance)
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
          
          // Budget categories
          'core-support': '#8b5cf6',
          'capacity-building': '#06b6d4',
          'capital': '#f97316',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-hansonium': 'linear-gradient(135deg, #1a1a2e 0%, #252540 50%, #1a1a2e 100%)',
        'gradient-accent': 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
        'gradient-warm': 'linear-gradient(180deg, #faf9f7 0%, #f5f3ef 100%)',
        'mesh-pattern': 'radial-gradient(circle at 20% 80%, rgba(74, 222, 128, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(74, 222, 128, 0.03) 0%, transparent 50%)',
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(26, 26, 46, 0.1), 0 2px 8px -2px rgba(26, 26, 46, 0.06)',
        'premium-lg': '0 10px 40px -4px rgba(26, 26, 46, 0.12), 0 4px 16px -4px rgba(26, 26, 46, 0.08)',
        'premium-xl': '0 20px 60px -8px rgba(26, 26, 46, 0.15), 0 8px 24px -8px rgba(26, 26, 46, 0.1)',
        'glow-green': '0 0 20px rgba(74, 222, 128, 0.3)',
        'inner-glow': 'inset 0 2px 4px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'progress-fill': 'progressFill 1.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        progressFill: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: 'var(--progress-offset)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderRadius: {
        'premium': '1.25rem',
        'premium-lg': '1.5rem',
      },
    },
  },
  plugins: [],
}
export default config

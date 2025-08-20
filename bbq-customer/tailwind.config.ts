import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'charcoal': '#2a2a2a',
        'warm-copper': '#b85c38',
        'soft-copper': '#d4a574',
        'cream': '#f7f5f1',
        'off-black': '#1a1a1a',
        'warm-white': '#fefefe',
        
        // Semantic Colors
        'text-primary': '#1a1a1a',
        'text-secondary': '#2a2a2a',
        'text-muted': '#6a6a6a',
        'text-inverse': '#fefefe',
        
        'bg-primary': '#fefefe',
        'bg-secondary': '#f7f5f1',
        'bg-dark': '#2a2a2a',
        
        'accent-primary': '#b85c38',
        'accent-secondary': '#d4a574',
        'accent-hover': '#a04d2f',
      },
      fontFamily: {
        'display': ['var(--font-anek-devanagari)', 'Anek Devanagari', 'sans-serif'],
        'body': ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      spacing: {
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '16': '4rem',     // 64px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
        '32': '8rem',     // 128px
      },
      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '1.875rem',    // 30px
        '4xl': '2.25rem',     // 36px
        '5xl': '3rem',        // 48px
        '6xl': '3.75rem',     // 60px
        '7xl': '4.5rem',      // 72px
      },
      letterSpacing: {
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
      },
      lineHeight: {
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(42, 42, 42, 0.08)',
        'medium': '0 4px 16px rgba(42, 42, 42, 0.12)',
        'strong': '0 8px 32px rgba(42, 42, 42, 0.16)',
        'copper': '0 4px 16px rgba(184, 92, 56, 0.15)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        'fast': '0.2s',
        'medium': '0.3s',
        'slow': '0.5s',
      },
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
const appTwConfig = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
				"6xs": "320px",
				"5xs": "360px",
				"4xs": "380px",
				"3xs": "420px",
				"2xs": "480px",
				xs: "520px", // extra small
				xa: "580px", // extra small average
				sm: "640px",
				sa: "720px", // small average
				md: "768px",
				ma: "820px",
				ml: "920px",
				lg: "1024px",
				xl: "1280px",
				"1xl": "1366px",
				"2xl": "1536px",
			},
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
				// inter: ["var(--font-inter)", "sans-serif"],
				// robotoSlab: ["var(--font-roboto-slab)", "sans-serif"],
				unicephalon: ["var(--font-unicephalon)", "sans-serif"],
				// multivacInterference: ["var(--font-multivac-interference)", "sans-serif"],
				// multivacGhost: ["var(--font-multivac-ghost)", "sans-serif"],
			},
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: {
          DEFAULT: "hsl(var(--ring))",
          secondary: "hsl(var(--ring-secondary))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          secondary: "hsl(var(--accent-secondary))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
				fadeIn: {
					"0%": { opacity: "0%" },
					"20%": { opacity: "0%" },
					"100%": { opacity: "100%" },
				},
				fadeInSiderTextDark: {
					"0%": { opacity: "0%" },
					"100%": { opacity: "35%" },
				},
				fadeInSiderTextLight: {
					"0%": { opacity: "0%" },
					"100%": { opacity: "5%" },
				},
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 2.5s ease-in-out forwards",
				fadeInSiderTextDark: "fadeInSiderTextDark 2.5s ease-in-out forwards",
				fadeInSiderTextLight: "fadeInSiderTextLight 2.5s ease-in-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
}

export default appTwConfig;

/** @type {import('tailwindcss').Config} */

const ThemeColors = {
	"mlt-gray-0": "#646464",
	"mlt-gray-1": "#787878",
	"mlt-gray-2": "#a0a0a0",
	"mlt-gray-3": "#b4b4b4",
	"mlt-gray-4": "#c8c8c8",
	"mlt-gray-5": "#d4d4d4",
	"mlt-gray-6": "#f0f0f0",
	"mlt-dark-0": "#080808",
	"mlt-dark-1": "#111111",
	"mlt-dark-2": "#242424",
	"mlt-dark-3": "#333333",
	"mlt-dark-4": "#3c3c3c",
	"mlt-dark-5": "#444444",
	"mlt-dark-6": "#555555",
	"mlt-blue-dark": "#548ada",
	"mlt-blue-bright": "#5d9fff",
	"mlt-purple-dark": "#9468d8",
	"mlt-purple-bright": "#b27bff",
	"mlt-yellow-primary": "#facc15",
	"mlt-yellow-secondary": "rgb(254 240 138)",
	"mlt-yellow-tertiary": "rgb(254 249 195)",
	"mlt-orange-primary": "#FF5722",
	"mlt-orange-dark": "#d4491d",
	"mlt-orange-secondary": "#ef720e",
};

const appTwConfig = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
				// https://tailwindcss.com/docs/screens
				sm580: "580px",
				sm520: "520px",
				xs: "480px",
				xs420: "420px",
				xs380: "380px",
				xs320: "320px",
				md820: "820px",
			},
			fontFamily: {
				inter: ["var(--font-inter)", "sans-serif"],
				robotoSlab: ["var(--font-roboto-slab)", "sans-serif"],
				unicephalon: ["var(--font-unicephalon)", "sans-serif"],
				multivacInterference: ["var(--font-multivac-interference)", "sans-serif"],
				multivacGhost: ["var(--font-multivac-ghost)", "sans-serif"],
			},
			fontSize: {
				// https://tailwindcss.com/docs/font-size
				md: "1.05rem",
			},
			spacing: {
				21: "5.25rem",
				22: "5.5rem",
				23: "5.75rem",
			},
			padding: {
				21: "5.25rem",
				22: "5.5rem",
				23: "5.75rem",
			},
			letterSpacing: {
				"menu-items": "1px",
				"menu-items-wide": "1.8px",
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
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
				},
				popover: {
					DEFAULT: ThemeColors["mlt-dark-6"], // "hsl(var(--popover))",
					foreground: ThemeColors["mlt-blue-bright"], // "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				...ThemeColors,
			},
			backgroundColor: {
				...ThemeColors,
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
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};

export default appTwConfig;

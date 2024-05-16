/** @type {import('tailwindcss').Config} */

const appTwConfig: import("tailwindcss").Config = {
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
				mp: "780px",
				ma: "820px",
				mb: "840px",
				mm: "905px",
				ml: "920px",
				lg: "1024px",
				xl: "1280px",
				"1xl": "1366px",
				"2xl": "1536px",
			},
			fontFamily: {
				// sans: ["var(--font-geist-sans)", "sans-serif"],
				// mono: ["var(--font-geist-mono)", "monospace"],
				// inter: ["var(--font-inter)", "sans-serif"],
				poppins: ["var(--font-poppins)", "sans-serif"],
				// robotoSlab: ["var(--font-roboto-slab)", "sans-serif"],
				unicephalon: ["var(--font-unicephalon)", "serif"],
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
				foreground: {
					DEFAULT: "hsl(var(--foreground))",
					secondary: "hsl(var(--foreground-secondary))",
					tertiary: "hsl(var(--foreground-tertiary))",
					quaternary: "hsl(var(--foreground-quaternary))",
				},

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
					secondary: "hsl(var(--muted-secondary))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
					secondary: "hsl(var(--accent-secondary))",
					tertiary: "hsl(var(--accent-tertiary))",
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
			scale: {
				"0": "0",
				"5": "0.05",
				"10": "0.1",
				"15": "0.15",
				"20": "0.2",
				"25": "0.25",
				"30": "0.3",
				"35": "0.35",
				"40": "0.4",
				"45": "0.45",
				"50": "0.5",
				"55": "0.55",
				"60": "0.6",
				"65": "0.65",
				"70": "0.7",
				"75": "0.75",
				"80": "0.8",
				"85": "0.85",
				"90": "0.9",
				"95": "0.95",
				"100": "1",
				"105": "1.05",
				"110": "1.1",
				"115": "1.15",
				"120": "1.2",
				"125": "1.25",
				"130": "1.3",
				"135": "1.35",
				"140": "1.4",
				"145": "1.45",
				"150": "1.5",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
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
				zoomInFile: {
					"0%": { transform: "scale(0)", opacity: "0" },
					"0.1%": { transform: "scale(0.25)", opacity: "0" },
					"3%": { transform: "scale(0.25)", opacity: "1" },
					"5%": { transform: "scale(0.25)", opacity: "1" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				fadeIn: "fadeIn 2.5s ease-in-out forwards",
				fadeInSiderTextDark: "fadeInSiderTextDark 2.5s ease-in-out forwards",
				fadeInSiderTextLight: "fadeInSiderTextLight 2.5s ease-in-out forwards",
				zoomInFile: "zoomInFile 250ms ease-out forwards",
			},
			// https://tailwindcss.com/docs/customizing-spacing#default-spacing-scale
			spacing: {
				navbar: "var(--navbar-height)",
				footer: "var(--footer-height)",
				content: "var(--content-height)",
			},
			height: {
				navbar: "var(--navbar-height)",
				footer: "var(--footer-height)",
				content: "var(--content-height)",
			},
			typography: {
				DEFAULT: {
					css: {
						color: "hsl(var(--foreground))",
						a: {
							textDecoration: "none",
							color: "hsl(var(--accent))",
							"&:hover": {
								color: "hsl(var(--accent-secondary))",
							},
						},
					},
				},
			},
			boxShadow: {
				"home-cards": "0 35px 60px -15px hsla(0, 0%, 8%, 0.8)",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
	],
};

export default appTwConfig;

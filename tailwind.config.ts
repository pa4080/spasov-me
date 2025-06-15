/* eslint-disable @typescript-eslint/no-require-imports */
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
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
        sb: "680px",
        sa: "720px", // small average
        md: "768px",
        mp: "780px",
        ma: "820px",
        mb: "840px",
        mc: "880px",
        mm: "905px",
        ml: "920px",
        lg: "1024px",
        xl: "1280px",
        "1xl": "1366px",
        "2xl": "1536px",
        "3xl": "1720px",
      },
      fontFamily: {
        // sans: ["var(--font-geist-sans)", "sans-serif"],
        // mono: ["var(--font-geist-mono)", "monospace"],
        // inter: ["var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif", ...fontFamily.sans],
        // robotoSlab: ["var(--font-roboto-slab)", "sans-serif"],
        unicephalon: ["var(--font-unicephalon)", "serif"],
        // multivacInterference: ["var(--font-multivac-interference)", "sans-serif"],
        // multivacGhost: ["var(--font-multivac-ghost)", "sans-serif"],
      },
      colors: {
        transparent: "transparent",
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
        scrollbarTrack: {
          DEFAULT: "hsl(var(--scrollbar-track))",
        },
        scrollbarThumb: {
          DEFAULT: "hsl(var(--scrollbar-thumb))",
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
        scrollbarThumb: "var(--scrollbar-thumb-radius)",
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
        contentShortPage: "var(--content-short-page-height)",
        projectImageMaxWidth: "var(--project-image-max-width)",
        galleryImageMaxWidth: "var(--gallery-image-max-width)",
        scrollbarWidth: "var(--scrollbar-width)",
        scrollbarHeight: "var(--scrollbar-height)",
      },
      height: {
        navbar: "var(--navbar-height)",
        footer: "var(--footer-height)",
        content: "var(--content-height)",
        contentShortPage: "var(--content-short-page-height)",
        projectImageMaxWidth: "var(--project-image-max-width)",
        galleryImageMaxWidth: "var(--gallery-image-max-width)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "hsl(var(--foreground))",
            a: {
              textDecoration: "none",
              color: "hsl(var(--accent))",
              transition: "color 0.2s ease-in-out",
              "&:hover": {
                color: "hsl(var(--accent-secondary))",
                transition: "color 0.2s ease-in-out",
              },
              "& code": {
                transition: "background-color 0.2s ease-in-out",
              },
              "&:hover code": {
                backgroundColor: "hsl(var(--accent-secondary))",
                transition: "background-color 0.2s ease-in-out",
              },
            },
            strong: {
              color: "hsl(var(--foreground))",
            },
            blockquote: {
              fontWeight: "400",
              color: "hsl(var(--foreground))",
              borderRadius: "0.125rem",
              borderLeftColor: "hsl(var(--primary))",
              borderLeftWidth: "0.375rem",
            },
            code: {
              color: "hsl(var(--background))",
              padding: "1px 4px",
              margin: "0",
              fontSize: "1rem",
              borderRadius: "4px",
              fontFamily: "monospace",
              // border: "1px solid hsl(var(--ring) / 90%)",
              backgroundColor: "hsl(var(--ring) / 90%)",
              position: "relative",
            },
            "h2 code, h3 code, h4 code, h5 code, h6 code": {
              color: "hsl(var(--background))",
              // fontSize: "1.rem !important",
            },
            "h2, h3, h4, h5, h6, h2 > a, h3 > a, h4 > a, h5 > a, h6 > a": {
              scrollMarginTop: "var(--navbar-height)",
              color: "hsl(var(--primary-foreground))",
              fontWeight: "600",
            },
            ul: {
              listStyleType: "square",
              "--tw-prose-bullets": "hsl(var(--ring) / 80%)",
              // Search for ".md-processed-to-html" in globals.scss
              // in order to override the color by theme
            },
            ol: {
              "--tw-prose-counters": "hsl(var(--ring) / 80%)",
            },
            "h2#table-of-contents + ul": {
              "&:has(ul)": {
                listStyleType: "none",
                paddingInlineStart: "0 !important",
              },
              "--tw-prose-bullets": "hsl(var(--ring-secondary) / 80%)",
              "& ul": {
                "--tw-prose-bullets": "hsl(var(--ring-secondary) / 80%)",
              },
              "& a": {
                color: "hsl(var(--primary-foreground))",
              },
              "& code": {
                backgroundColor: "hsl(var(--ring-secondary) / 90%)",
              },
            },
            h2: {
              color: "hsl(var(--primary-foreground))",
            },
            h3: {
              color: "hsl(var(--primary-foreground))",
            },
            h4: {
              color: "hsl(var(--primary-foreground))",
              fontSize: "1.25rem",
              marginTop: "1.3rem !important",
            },
            h5: {
              color: "hsl(var(--primary-foreground))",
            },
            h6: {
              color: "hsl(var(--primary-foreground))",
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
} satisfies Config;

import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["Geist Variable", "system-ui", "sans-serif"],
        mono: ["Geist Mono Variable", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        paper: { DEFAULT: "hsl(var(--paper))", deep: "hsl(var(--paper-deep))" },
        ink: { DEFAULT: "hsl(var(--ink))" },
        night: { DEFAULT: "hsl(var(--night))" },
        chartreuse: { DEFAULT: "hsl(var(--chartreuse))", soft: "hsl(var(--chartreuse-soft))", strong: "hsl(var(--chartreuse-strong))" },
        onaccent: "hsl(var(--on-accent))",
        line: { DEFAULT: "hsl(var(--line))", night: "hsl(var(--line-night))" },
        danger: "hsl(var(--danger))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: {
        // Offsets toujours positifs et inférieurs à --radius (1.5rem = 24px).
        lg: "var(--radius)",
        md: "calc(var(--radius) - 8px)",
        sm: "calc(var(--radius) - 14px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

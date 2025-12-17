import type { Config } from "tailwindcss";

/**
 * PEPTIDES Brand Tailwind Configuration
 *
 * Ultra-premium light theme - Clinical, Apple-like, Research-grade
 *
 * Colors reference CSS variables from globals.css for consistency.
 * Single light theme only.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        peptide: {
          // Brand colors (CSS variables for consistency)
          primary: "var(--peptide-primary)",
          "primary-dark": "var(--peptide-primary-dark)",
          "primary-light": "var(--peptide-primary-light)",
          secondary: "var(--peptide-secondary)",
          "secondary-dark": "var(--peptide-secondary-dark)",
          "secondary-light": "var(--peptide-secondary-light)",
          accent: "var(--peptide-accent)",
          "accent-dark": "var(--peptide-accent-dark)",
          "accent-light": "var(--peptide-accent-light)",
          // Surfaces
          bg: "var(--peptide-bg)",
          "bg-alt": "var(--peptide-bg-alt)",
          "bg-elevated": "var(--peptide-bg-elevated)",
          // Text
          fg: "var(--peptide-fg)",
          "fg-strong": "var(--peptide-fg-strong)",
          "fg-muted": "var(--peptide-fg-muted)",
          // Borders
          border: "var(--peptide-border)",
          "border-light": "var(--peptide-border-light)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "SF Mono", "Menlo", "monospace"],
      },
      backdropBlur: {
        glass: "var(--glass-blur)",
      },
      boxShadow: {
        glass: "var(--glass-shadow)",
        "glass-hover": "var(--glass-shadow-hover)",
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        elevated: "var(--shadow-elevated)",
        header: "var(--shadow-header)",
      },
    },
  },
  plugins: [],
};

export default config;

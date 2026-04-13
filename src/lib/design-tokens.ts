/**
 * Arctic Glass Design Tokens
 * Centralized design tokens for CuentasClarasRD.
 * These match the global CSS variables and should be used for JS-level styling (e.g. Framer Motion).
 */

export const tokens = {
  colors: {
    background: "#f8fafc",
    backgroundSecondary: "#f1f5f9",
    surfaceBase: "rgba(255, 255, 255, 0.70)",
    surfaceElevated: "rgba(255, 255, 255, 0.82)",
    surfaceStrong: "rgba(255, 255, 255, 0.92)",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    primarySoft: "#dbeafe",
    textHeading: "#0f172a",
    textBody: "#475569",
    textMuted: "#64748b",
    borderSoft: "rgba(148, 163, 184, 0.18)",
    borderDefault: "rgba(148, 163, 184, 0.28)",
    success: "#16a34a",
    warning: "#f59e0b",
    danger: "#dc2626",
    info: "#0ea5e9",
  },
  radius: {
    sm: "0.75rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.75rem",
  },
  shadow: {
    glass: "0 10px 30px rgba(15, 23, 42, 0.08)",
    glassHover: "0 18px 50px rgba(15, 23, 42, 0.12)",
    soft: "0 4px 20px rgba(15, 23, 42, 0.05)",
  },
  blur: {
    glass: "20px",
    heavy: "28px",
  },
  motion: {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",
    ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
};

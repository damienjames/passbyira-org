/**
 * Pass By Ira — Design Tokens
 *
 * These constants mirror the CSS custom properties defined in app/globals.css.
 * Import them for type-safe color references, inline styles, or canvas work.
 * The CSS @theme block is the single source of truth for Tailwind utilities;
 * these JS constants exist for situations where CSS variables cannot be used.
 */

export const pbiColors = {
  /** Brand blue — core anchor */
  primary: '#1B4B8A',
  /** Deep navy — headers, nav, footer */
  primaryDark: '#0F2D54',
  /** Medium blue for gradients and emphasis */
  primaryLight: '#3F6797',
  /** Gold accent — CTAs and highlights */
  accent: '#C9A227',
  /** Lighter gold — text on dark backgrounds, hover highlights */
  accentSoft: '#E7CC87',
  /** Darker gold for text and small UI labels on light surfaces */
  accentStrong: '#7D5D10',
  /** Muted gold alpha — pill backgrounds */
  accentMuted: 'rgba(201,162,39,0.14)',
  /** Near-black navy for body text */
  ink: '#162235',
  /** Cool slate for secondary text */
  muted: '#5A6B80',
  /** Cool off-white surface */
  surface: '#F4F7FB',
  /** Slightly deeper cool surface for alternating sections */
  surfaceAlt: '#E8EEF6',
  white: '#FFFFFF',
} as const;

export const pbiRadius = {
  card: '22px',
  pill: '999px',
  btn: '999px',
  input: '12px',
} as const;

export const pbiShadow = {
  card: '0 16px 36px rgba(15, 45, 84, 0.08)',
  cardHover: '0 22px 48px rgba(15, 45, 84, 0.14)',
  nav: '0 10px 30px rgba(15, 45, 84, 0.22)',
  cta: '0 6px 16px rgba(201, 162, 39, 0.35)',
} as const;

export const pbiFonts = {
  display: '"Playfair Display", serif',
  body: '"Inter", sans-serif',
} as const;

export type PbiColor = keyof typeof pbiColors;
export type PbiRadius = keyof typeof pbiRadius;

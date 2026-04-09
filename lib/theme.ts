/**
 * Pass By Ira — Design Tokens
 *
 * These constants mirror the CSS custom properties defined in app/globals.css.
 * Import them for type-safe color references, inline styles, or canvas work.
 * The CSS @theme block is the single source of truth for Tailwind utilities;
 * these JS constants exist for situations where CSS variables cannot be used.
 */

export const pbiColors = {
  /** Warm chestnut — core brand anchor */
  primary: '#7A5A43',
  /** Deep espresso — headers, nav, footer */
  primaryDark: '#4C362A',
  /** Lighter caramel — gradients and emphasis */
  primaryLight: '#A27A5C',
  /** Warm gold — accent, CTAs */
  accent: '#C9A227',
  /** Lighter gold — text on dark backgrounds, hover highlights */
  accentSoft: '#E7CC87',
  /** Muted gold alpha — pill backgrounds */
  accentMuted: 'rgba(201,162,39,0.14)',
  /** Near-black brown for body text */
  ink: '#221812',
  /** Soft warm neutral for secondary text */
  muted: '#6D594B',
  /** Warm off-white surface */
  surface: '#F7F1EA',
  /** Slightly deeper warm surface for alternating sections */
  surfaceAlt: '#EFE2D3',
  white: '#FFFFFF',
} as const;

export const pbiRadius = {
  card: '22px',
  pill: '999px',
  btn: '999px',
  input: '12px',
} as const;

export const pbiShadow = {
  card: '0 16px 36px rgba(76, 54, 42, 0.08)',
  cardHover: '0 22px 48px rgba(76, 54, 42, 0.14)',
  nav: '0 10px 30px rgba(58, 38, 25, 0.22)',
  cta: '0 6px 16px rgba(201, 162, 39, 0.35)',
} as const;

export const pbiFonts = {
  display: '"Playfair Display", serif',
  body: '"Inter", sans-serif',
} as const;

export type PbiColor = keyof typeof pbiColors;
export type PbiRadius = keyof typeof pbiRadius;

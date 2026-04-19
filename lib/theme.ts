/**
 * Pass By Ira — Design Tokens
 *
 * These constants mirror the CSS custom properties defined in app/globals.css.
 * Import them for type-safe color references, inline styles, or canvas work.
 * The CSS @theme block is the single source of truth for Tailwind utilities;
 * these JS constants exist for situations where CSS variables cannot be used.
 */

export const pbiColors = {
  /** Dusty slate — core anchor */
  primary: '#5B707C',
  /** Deep charcoal — headings, nav, footer */
  primaryDark: '#393734',
  /** Soft blue-gray for gradients and emphasis */
  primaryLight: '#B7C9D3',
  /** Warm brown accent — CTAs and highlights */
  accent: '#7A624F',
  /** Light sand accent for overlays and soft highlights */
  accentSoft: '#D8C9B8',
  /** Darker brown for stronger emphasis */
  accentStrong: '#5B4638',
  /** Warm accent alpha — pill backgrounds */
  accentMuted: 'rgba(122,98,79,0.14)',
  /** Near-black brown for body text */
  ink: '#221F1D',
  /** Warm taupe for secondary text */
  muted: '#5F5A55',
  /** Warm off-white surface */
  surface: '#F6F1EA',
  /** Slightly deeper sand surface for alternating sections */
  surfaceAlt: '#E4DCD1',
  white: '#FFFFFF',
} as const;

export const pbiRadius = {
  card: '22px',
  pill: '999px',
  btn: '999px',
  input: '12px',
} as const;

export const pbiShadow = {
  card: '0 16px 36px rgba(57, 55, 52, 0.08)',
  cardHover: '0 22px 48px rgba(57, 55, 52, 0.14)',
  nav: '0 10px 30px rgba(57, 55, 52, 0.18)',
  cta: '0 6px 16px rgba(122, 98, 79, 0.28)',
} as const;

export const pbiFonts = {
  display: '"Playfair Display", serif',
  body: '"Inter", sans-serif',
} as const;

export type PbiColor = keyof typeof pbiColors;
export type PbiRadius = keyof typeof pbiRadius;

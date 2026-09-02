# Pass by Ira Redesign Execution Plan

**Status:** Completed September 1, 2026. The redesigned site, mobile navigation, editable content model, TinaCMS/Azure adapter, and local review environment are implemented and verified.

## Conversion priority

1. Convert qualified visitors into donors.
2. Convert interested supporters into volunteers.
3. Help partners, sponsors, and community members understand the work and find the right contact path.

The site should build trust before asking, connect each ask to visible mission work, and keep the tone dignified rather than transactional.

## Information architecture

- Our Work
- Who We Are
- Events & Stories
- Get Involved
- Contact
- Donate as the single emphasized navigation action

## Implementation sequence

1. Remove the bottom action dock and replace the current navigation with a prominent official-logo header and sticky mobile menu.
2. Finish the editorial homepage in the published ivory, taupe, and black palette.
3. Apply the typography, spacing, page-hero, card, and action hierarchy to every existing route.
4. Structure recurring content for announcements, current needs, programs, events, leadership, galleries, contact information, and calls to action.
5. Add TinaCMS local editing plus the Azure Static Web Apps/GitHub/Azure Table Storage integration path.
6. Validate desktop and mobile layouts, interaction states, accessibility, links, metadata, and production builds.
7. Leave the local review server running with the finished site open.

## Acceptance criteria

- The official logo is unchanged, prominent, and readable.
- Donation is the clearest action at the header, hero, impact moments, and closing call to action.
- Volunteering is consistently available without competing with donation.
- Mobile has no bottom dock; it uses a sticky header, clear menu trigger, large tap targets, scroll locking, Escape support, and managed focus.
- Content editors can update high-frequency content without changing layout code.
- All current routes remain available and coherent.
- The static site and CMS deployment path are compatible with Azure Static Web Apps.

## Verification record

- Production CMS + static export: `npm run build:deploy` — passed (21 routes).
- TypeScript: `npx tsc --noEmit` — passed.
- ESLint: `npm run lint` — passed.
- Exported internal-link audit: 18 HTML pages, 0 broken internal links.
- Responsive browser QA: 390px mobile and 1720px desktop, no horizontal overflow.
- Mobile navigation: focus management, Escape dismissal, scroll locking, and focus restoration verified.
- Live Wix gallery expansion: both `Load More` controls and the embedded carousel were exhausted; 98 photographs were recovered across SERVE (43), REST (30), and Coats & Cocoa (25).
- Photo viewer: desktop and mobile navigation, filmstrip overflow, image counts, focus management, Escape dismissal, and source-file completeness verified.

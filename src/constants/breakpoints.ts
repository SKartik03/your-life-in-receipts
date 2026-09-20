/**
 * Responsive Design Breakpoints
 * Aligned with modern mobile, tablet, and desktop viewports.
 */
export const BREAKPOINTS = {
  MOBILE_SM: 480,
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  WIDE: 1440,
} as const;

export const MEDIA_QUERIES = {
  MOBILE_SM: `(max-width: ${BREAKPOINTS.MOBILE_SM}px)`,
  MOBILE: `(max-width: ${BREAKPOINTS.MOBILE}px)`,
  TABLET: `(max-width: ${BREAKPOINTS.TABLET}px)`,
  DESKTOP: `(min-width: ${BREAKPOINTS.DESKTOP}px)`,
} as const;

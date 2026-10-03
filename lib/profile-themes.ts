/**
 * The company profile is one deck in three looks, each recreating one of the
 * reference decks under "LogX profile example/": ink with red slashes, white
 * with a halftone ribbon, white with a network lattice. The content is the
 * same in all three; only the stylesheet changes.
 *
 * Kept apart from lib/profile-deck.ts so the client-side theme switcher can
 * import it without pulling the catalogue into the browser bundle.
 */
export const profileThemes = ['dark', 'wave', 'mesh'] as const;
export type ProfileTheme = (typeof profileThemes)[number];
export const defaultProfileTheme: ProfileTheme = 'mesh';

export function isProfileTheme(value: string | null | undefined): value is ProfileTheme {
  return profileThemes.includes(value as ProfileTheme);
}

/**
 * Live webinar — 21 Oct 2026, "What's your next move... when life changes?"
 * Zoom registration links per session (Heather, 16 Oct). Registering on
 * Zoom is what issues each person's own join link.
 */
export const WEBINAR_ZOOM_LINKS = {
  "10:00 SAST":
    "https://us06web.zoom.us/meeting/register/dmRnHe_1QOyX_mEEvGUcBw",
  "19:00 SAST":
    "https://us06web.zoom.us/meeting/register/mZKc5fVETeS1mXRUdJdILw",
} as const;

export type WebinarSession = keyof typeof WEBINAR_ZOOM_LINKS;

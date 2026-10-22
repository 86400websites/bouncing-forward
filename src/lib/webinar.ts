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

/**
 * Mailchimp tag per session — the confirmation journey for each session
 * starts on "Tag added" with exactly this tag. Keyed by the same session
 * labels as the Zoom links, so a session can't have a tag without a link.
 */
export const WEBINAR_SESSION_TAGS: Record<WebinarSession, string> = {
  "10:00 SAST": "webinar-oct21-1000",
  "19:00 SAST": "webinar-oct21-1900",
};

/**
 * When the last session ends: 19:00 SAST session (17:00 UTC) + 60 min.
 * After this, /webinar shows the "has taken place" state and
 * /api/webinar stops accepting registrations. For a future webinar,
 * update the details here and in /webinar.
 */
export const WEBINAR_ENDS_AT = new Date("2026-10-21T18:00:00Z");

export function isWebinarOver(now: Date = new Date()): boolean {
  return now.getTime() >= WEBINAR_ENDS_AT.getTime();
}

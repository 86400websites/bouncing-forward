# Mailchimp automations — Bouncing Forward

The website tags every subscriber by where they came from. Two
automations in Mailchimp complete the loop. Set each up once; they run
forever.

The site sends these tags automatically:

| Tag                         | Set when…                                             |
| --------------------------- | ----------------------------------------------------- |
| `newsletter`                | someone submits the "Send me the 7 Step Journal" form |
| `full-assessment`           | someone completes the Full Assessment and gives email |
| `premium`                   | someone buys the $9.99 Book Package (via Stripe)      |
| `webinar` + one session tag | someone registers on /webinar (see Webinars below)    |

---

## Automation A — "All In welcome" (the one Heather described)

**Trigger:** Tag added → `full-assessment`
(Mailchimp: Automations → Create → Customer Journeys → Start point
"Tag added" → choose `full-assessment`.)

**Email 1 (immediately):** subject along the lines of
_"You're all in — here's everything."_ Body links the deliverables,
which are already hosted on the site:

- Book summary:
  `https://<your-domain>/downloads/all-in/bouncing-forward-book-summary.pdf`
- Monthly Letter No. 1:
  `https://<your-domain>/downloads/all-in/monthly-letter-1.pdf`
- The Walking Pages (worksheet for Letter 1):
  `https://<your-domain>/downloads/all-in/monthly-letter-1-the-walking-pages.pdf`
- Their library (everything incl. the 9 course worksheets):
  `https://<your-domain>/all-in#library`

Linking beats attaching: no size limits, and when a file is updated
the link stays current.

## Automation B — "The 7 Step Journal" (newsletter welcome)

**Trigger:** Tag added → `newsletter`

**Email 1 (immediately):** deliver the 7 Step Journal —
`https://<your-domain>/downloads/BF-7-Step-Reflection-Journal.pdf` —
and say the monthly note will follow. (The site already offers this
download on the success screen; the email doubles it and starts the
relationship.)

---

## Automation C — "Book Package access code" (Premium buyers)

**Trigger:** Tag added → `premium`
(the Stripe webhook adds this tag automatically after payment.)

**Email 1 (immediately):** Heather's access-code email
(BF_Premium_Access_Email), with `[ACCESS CODE]` replaced by the
first code in `PREMIUM_ACCESS_CODES`. The buyer is now also on
the list for the weekly note and the Monthly Letter — exactly as
the brief specifies.

---

## Webinars — one confirmation workflow per session

Set up once per webinar, before the registration page goes live.

**What the site sends** (`/api/webinar`, configured in `src/lib/webinar.ts`):

- Merge fields: `FNAME`, `LNAME`, `COUNTRY` (see "Audience fields" below).
- Tags: `webinar` (generic — used only to exclude registrants from broad
  sends) **plus exactly one session tag**, e.g. `webinar-oct21-1000`.
- Status: subscribed. A previously unsubscribed/archived person who
  registers is restored (explicit opt-in), so the journey can reach them.
- After `WEBINAR_ENDS_AT` the page shows "has taken place" and the API
  stops accepting registrations.

**Rules (these prevent the 21 Oct issues):**

1. **One journey per session tag.** Start point: _Tag added_ → the
   session tag. Never trigger on the generic `webinar` tag — anyone from
   a past webinar already has it, so the journey would never fire for them.
2. **Use new session tags for every webinar** (e.g. `webinar-nov04-1900`).
   Re-using a tag means past registrants never get the new confirmation.
3. **The Zoom link goes in the confirmation email from day one.** Do not
   publish the registration page until each journey's button has its
   session's Zoom link (the same link as `WEBINAR_ZOOM_LINKS`).
4. **Greeting:** insert the name with Mailchimp's merge tag `*|FNAME|*`
   (or Personalize → First name). Never type a placeholder such as
   `<<First Name>>` — it is sent literally. Contacts without a first
   name get the audience default (see below).
5. **Journey settings:** contacts may enter once; journey **Active**
   (pausing to edit is fine — always resume and re-check status).
6. **Broad sends** (Monthly Letter, invites): exclude the `webinar` tag
   while an event is open, so registrants aren't invited again.
7. **Links in invites** should point to `/webinar` (so people get the
   tag, confirmation and reminders) rather than straight to Zoom —
   Zoom-direct registrants never reach Mailchimp.

**Audience fields (Mailchimp → Audience → Settings → Audience fields and
\*|MERGE|\* tags):**

- `FNAME` — set **Default merge tag value** to `friend` so a missing
  name reads "Hi friend," instead of "Hi ,".
- `COUNTRY` — add a **Text** field with merge tag `COUNTRY`. If it is
  missing, the site retries without it (registration still succeeds,
  country is not stored).

**Before going live — test with a brand-new address per session**
(e.g. `name+wb1@gmail.com`; a re-used address already has the tag, so
no email fires): register → contact shows both tags and FNAME/COUNTRY →
confirmation arrives with the name and the correct session's Zoom button.

---

## The monthly letters, ongoing

Each new letter is a **regular campaign** (not an automation): send it
monthly to the audience — or only to the `full-assessment` tag if the
letter is members-only. Also send each new letter PDF to Sozana so it
is added to the on-site library (one small edit per month).

## Sender email

Automations need a verified From address. Until the business email
exists, Mailchimp lets you verify any address you own — swap it later
under Settings once the domain email is live (then also do domain
authentication: Website → Domains → Authenticate, for deliverability).

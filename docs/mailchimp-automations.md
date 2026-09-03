# Mailchimp automations — Bouncing Forward

The website tags every subscriber by where they came from. Two
automations in Mailchimp complete the loop. Set each up once; they run
forever.

The site sends these tags automatically:

| Tag               | Set when…                                             |
| ----------------- | ----------------------------------------------------- |
| `newsletter`      | someone submits the "Send me the 7 Step Journal" form |
| `full-assessment` | someone completes the Full Assessment and gives email |
| `premium`         | someone buys the $9.99 Book Package (via Stripe)      |

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

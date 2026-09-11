import { test } from "../../harness/fixtures";

/**
 * Section G — the MANUAL lines (MN-001 … MN-009) and the lines marked MANUAL
 * in other sections (AC-003b, PY-009, PY-016). Each is registered so the
 * report lists it beside the automated results; the exact human steps live
 * in the "manual" annotation. Evidence goes under qa-evidence/manual/<ID>/
 * (gitignored, never uploaded). Nothing here touches the site.
 */

function manual(
  id: string,
  title: string,
  tags: string[],
  completes: string,
  steps: string,
) {
  test(
    `${id} ${title}`,
    {
      tag: [`@${id}`, "@manual", "@desktop-only", ...tags],
      annotation: [
        { type: "manual", description: steps },
        { type: "completes", description: completes },
      ],
    },
    async () => {
      test.skip(true, "MANUAL — human evidence required");
    },
  );
}

manual(
  "MN-001",
  "Each Amazon format link opens the correct live listing",
  [],
  "PG-002 and PG-008 (the links are asserted present and safe; only the listing itself needs a human)",
  '1) Open the Preview address recorded in qa-evidence/preflight.json under "origin". 2) Go to /book. Two CTA rows each carry four black round buttons labelled Kindle, Hardcover, Paperback and Workbook. Click all eight; each must open a NEW browser tab and leave the Preview tab where it was. 3) Confirm each tab shows the Bouncing Forward listing by Maher Kaddoura in the format on the button: Kindle = dp/B0DWRVYCHS, Hardcover = dp/B0HH3N6SQ1, Paperback = dp/B0HJD4DTFW, Workbook = dp/B0HHDXSSK3. 4) Logged out (or in a private window) go to /premium: under the buy button the line "Prefer a printed copy? On Amazon:" carries the same four labelled links. Click each - same new tab, same listings. 5) Evidence: one screenshot per distinct listing (title + address bar) and a short note per button (Book hero row / Book closing row / Premium line - new tab yes/no, correct format yes/no) in qa-evidence/manual/MN-001/. PASS only if every link opened its own correct listing in a new tab.',
);

manual(
  "MN-002",
  "sign-up confirmation and password-reset emails arrive, link to the Preview, and open a working page",
  [],
  "AC-003b and the delivery half of AC-001; AC-003c–g prove the link mechanics with admin-generated tokens",
  'PREPARATION: use only the Preview address in qa-evidence/preflight.json ("origin"); in the same file deployment.siteUrl must not be a live address; Supabase → TEST project → Authentication → URL Configuration must list the Preview address (owner action 4). PART A — RESET: 1) Preview → /login → "Forgot your password?" → "Reset your password." 2) Email = your mailbox with "+bf-e2e-free" before the @ (the address stored as E2E_FREE_USER_EMAIL) → "Send reset link". 3) The form is replaced by "If an account exists for that email, a reset link is on its way. Check your inbox." 4) The email from the TEST project arrives within minutes (check Spam). Hover its link without clicking: with the standard template it starts with https://hmcojplrqoqhyigvtgyp.supabase.co/auth/v1/verify and its redirect_to part names the Preview address followed by /auth/confirm?next=/reset-password; with a custom template it starts with the Preview address directly. Never a live address. 5) Screenshot the email with the long token blacked out. 6) Click the link: the Preview opens /reset-password showing "Choose a new password." — STOP here, do NOT set a password (the suite holds this account\'s password). PART B — SIGN-UP: 7) Preview → /signup → email = your mailbox with "+bf-e2e-manual-signup-<today\'s date>" → a fresh password kept in your password manager → "Create my account". 8) Either the page shows "Account created. Please confirm your email from your inbox, then log in." and a "Confirm your signup" email arrives (check its link the same way, click it, the Preview opens /account "Welcome back." with "No Book Package yet"; screenshot with tokens redacted), or the browser goes straight to /account (Confirm email is off on TEST — record "sign-up email: N/A by TEST setting"). 9) CLEANUP: Supabase TEST → Authentication → Users → delete the +bf-e2e-manual-signup user. RECORD: date/time, folder, sender shown, link host, page opened — in qa-evidence/manual/MN-002/. If nothing arrives, Supabase\'s built-in mailer allows only a few emails per hour: check TEST → Authentication → Rate Limits and the Auth logs first.',
);

manual(
  "MN-003",
  "the labelled test contact message reaches info@bouncing-forward.com",
  [],
  "FM-008 (delivery half; shared Formspree form)",
  'BEFORE: this follows the automated run — FM-008 sends exactly one message per run from your mailbox with "+bf-e2e-contact". The test writes "[LAUNCH GATE TEST]" in the Name and at the start of the Message; the Subject is one of the form\'s fixed choices, so the email is titled "[Bouncing Forward] Tell me more about Bouncing Forward" (the label is NOT in the subject). Open qa-evidence/preflight.json and confirm deployment.contactEndpointConfigured is true; if false, the form only opened a mail program and nothing was sent — record that instead. 1) In the info@bouncing-forward.com mailbox search "[LAUNCH GATE TEST]" (sender name and body); the Reply-To is the +bf-e2e-contact address. Screenshot with the address blurred. 2) formspree.io → Forms → the Bouncing Forward contact form → Submissions: the same message with today\'s date. Screenshot. 3) Delete both (the email and the submission) and note the time. 4) If missing from either place: Formspree → the form → Settings — reCAPTCHA must be OFF (the site sends in-page), "Restrict to domain" off or listing the Preview host, the form active and under its monthly limit; then read the exact provider answer FM-008 recorded (annotation "formspree" in qa-evidence/last-run.json) and report it. Do not resend by hand more than once (shared service). RECORD: arrived in inbox yes/no, in Formspree yes/no, minutes to arrive, deleted at <time> — in qa-evidence/manual/MN-003/.',
);

manual(
  "MN-004",
  "the Mailchimp journeys send the right email after each tag (7 Step Journal, All In welcome, Book Package access)",
  [],
  "FM-002, FM-006 and FM-010 (the email-delivery halves) and the premium-tag audit owed since 9 September",
  'After the run, open qa-evidence/run-record.json (it names the identities used, never a key). All three emails go to your own mailbox; allow up to 15 minutes each and check Spam. A) 7 STEP JOURNAL (tag "newsletter", after FM-002 signed up "+bf-e2e-newsletter"): the welcome email arrives; its link opens /downloads/BF-7-Step-Reflection-Journal.pdf. B) ALL IN WELCOME (tag "full-assessment", after FM-006 signed up "+bf-e2e-assessment"): the welcome email arrives with links to the book summary, Monthly Letter No. 1, The Walking Pages and the library; each link opens. C) BOOK PACKAGE ACCESS (tag "premium", after PY-001/FM-010 bought with "+bf-e2e-buyer-<run id>", or after your own purchase in MN-008): the access-code email arrives — the code is the LIVE shared code: black it out completely and never paste it anywhere. D) CLEANUP CHECK: Mailchimp → Audience → All contacts → search "bf-e2e": every test contact shows Archived (the cleanup step archives them; archive by hand any still subscribed). Screenshot. E) OLD-WEBHOOK AUDIT: Mailchimp → Tags → "premium" (3 members on 9 September; tests/e2e/tools/mailchimp-premium-audit.mjs lists them read-only). In Stripe with Test mode OFF → Payments → search each address for a $9.99 Book Package payment. A "premium" member with no such payment was tagged by the old webhook behaviour (another site\'s checkout on the shared account): record the address partly blurred and decide whether to remove the tag; never touch a real buyer\'s tag. RECORD per journey: arrived yes/no, minutes, folder, links working, plus the audit result, in qa-evidence/manual/MN-004/. If A or B does not arrive on a LATER run: those identities are the same every run and were archived by the previous cleanup — check whether the journey lets a contact re-enter and whether the contact was actually re-subscribed (see the finding on src/lib/mailchimp.ts in the report).',
);

manual(
  "MN-005",
  "the nine course videos play",
  [],
  "IN-001 (playback half)",
  '1) On the Preview (qa-evidence/preflight.json "origin") go to /login and sign in with the premium test account (the values named E2E_PREMIUM_USER_EMAIL and E2E_PREMIUM_USER_PASSWORD in your .env.e2e.local — never paste them anywhere else). You land on "Welcome back." with "The Book Package". 2) Open /course: every module is already open (no "Take the Full Assessment, and every module opens." box, no "Video and worksheet open with the Full Assessment." lines). Alternative without an account: complete the Full Assessment at /all-in#full-assessment on this device first. 3) For Module 1 to Module 9, press play once inside the player and wait until the picture moves and sound starts. Note any "Video unavailable", "Playback on other websites has been disabled", a private-video message, or the wrong video. Expected titles: 1 Introduction to Bouncing Forward, 2 Element 1 — Resilience, 3 Element 2 — Adaptability, 4 Element 3 — Optimism, 5 Element 4 — Support, 6 Step 1 — Accept, 7 Step 2 — Reflect, 8 Step 3 — Imagine, 9 Step 4 — Action. (IN-001 checks the nine YouTube ids are in place; this line checks they play.) 4) If you can, repeat Module 1 on a phone. 5) Evidence: a nine-row table (module — plays yes/no — note) and one screenshot mid-play in qa-evidence/manual/MN-005/; then "Log out".',
);

manual(
  "MN-006",
  "Privacy and Terms open items are confirmed and noindex removed",
  [],
  'PG-013 flips from "markers present, noindex on" to "no markers, noindex removed" once this is done',
  'A decision plus a small code change, not a browser check. 1) Settle items 1–4 of "Open confirmations" in docs/PROJECT-STATUS.md, writing the answer and the date under each: (1) legal entity name + country — the highlight in Privacy section 1 ("Half a Life / Maher Kaddoura — confirm legal entity name and country") and Terms section 1; (2) refund policy — pick one of the two sentences highlighted in Terms section 5; (3) governing-law country — Terms section 12 ("e.g. Jordan / United Kingdom / South Africa"); (4) reply window — Privacy section 7 ("within 30 days — confirm"). 2) Ask Claude Code for a sprint that replaces the five highlighted markers with the confirmed wording, refreshes "Last updated", and removes the hide-from-search-engines instruction from both pages (item 6). Decide at the same time whether /privacy and /terms join the sitemap (they are not in it today; PG-005\'s page count would change). 3) On that PR\'s Preview no yellow highlights remain and the pages no longer carry noindex — the flipped PG-013 is the proof; this line records the decision. 4) Evidence: the PROJECT-STATUS change and the PR link, as a note in qa-evidence/manual/MN-006/. Until the decision is made this line is PENDING (owner decision), not a defect.',
);

manual(
  "MN-007",
  "every Preview credential and destination is TEST/sandbox, the sandbox webhook points at the candidate Preview, the live webhook is the www address with 200 deliveries, and no test identity or purchase appears in Production",
  [],
  "P12 (owner half), the owner part of PY-011, PY-016, and the Production negative control of P2/P5",
  'Names and scopes only — never a value; do not click any reveal/eye icon; black out anything that shows. 0) Open qa-evidence/preflight.json from the run: it records the Preview address ("origin"), the commit, and what the Preview reported about itself — supabaseProjectRef and privilegedSupabaseRef (both hmcojplrqoqhyigvtgyp, or "opaque" for the new key format), stripeMode "test", and the configured yes/no flags. A) VERCEL → the project → Settings → Environment Variables → filter Preview. For each name confirm a Preview-scoped row exists (no unintended branch override) and, by its class, that it is the TEST/sandbox one: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY (TEST); STRIPE_SECRET_KEY (test mode), STRIPE_PRICE_PREMIUM (the test $9.99 price), STRIPE_WEBHOOK_SECRET (the sandbox destination\'s secret); NEXT_PUBLIC_SITE_URL (not a live address); VERCEL_AUTOMATION_BYPASS_SECRET (rotated after 9 September — write the date); and the five shared by decision — MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, MAILCHIMP_SERVER_PREFIX, PREMIUM_ACCESS_CODES, NEXT_PUBLIC_FORMSPREE_ENDPOINT — recorded as "shared". Deployment Protection is on for Previews; "Automatically expose System Environment Variables" is on. Screenshot with values hidden. B) STRIPE, Test mode ON → Developers → Webhooks (Event destinations): one destination whose URL is the Preview address + /api/stripe/webhook (it also carries the bypass query parameter — black it out), listening for checkout.session.completed and checkout.session.async_payment_succeeded, enabled, recent deliveries 200. A 401 means the bypass parameter is stale after the rotation; a 400 "Invalid signature" means the Preview\'s STRIPE_WEBHOOK_SECRET is not this destination\'s secret. Product catalogue → The Book Package → the $9.99 one-time test price exists. Screenshot with the secret hidden. C) STRIPE, Test mode OFF: the live endpoint is exactly https://www.bouncing-forward.com/api/stripe/webhook, enabled, the same two events, recent deliveries 200 (the other site\'s events answer 200 with "ignored" — correct); no endpoint points at bouncing-forward.vercel.app, the address without www, or any Preview. Screenshot (this is PY-016). D) SUPABASE → TEST project → Authentication → URL Configuration: Site URL = the Preview address, Redirect URLs include the Preview address followed by /**, no live host; Authentication → Users: only the two fixture accounts plus any leftover bf-e2e users (delete leftovers). Screenshot with addresses partly blurred. E) PRODUCTION NEGATIVE CONTROL — read-only, test identities only, under the approved Profile B exception: ask Claude Code to run against Production only two counting queries — users whose email contains "+bf-e2e-" and entitlements belonging to them — both must be 0; never list other people\'s rows. Stripe live → Customers and Payments → search "bf-e2e" → nothing. F) Write a one-page table (name → environment → TEST / sandbox / shared → checked on <date>) with the screenshots in qa-evidence/manual/MN-007/.',
);

manual(
  "MN-008",
  "re-sending a real TEST purchase event from the Stripe dashboard restores access",
  [],
  'PY-014 (the resend half; the automated half proves the 500 "Stripe will retry" for a missing user)',
  'Self-contained — make your own TEST purchase so the account still exists when you resend (the suite deletes its own buyer at the end of the run). 1) On the Preview (qa-evidence/preflight.json "origin"), logged out, open /premium → "Buy the Book Package" → Create account: email = your mailbox with "+bf-e2e-manual-<today\'s date>", a fresh password you keep; the button reads "Create account & continue to payment". Never use the free or premium test accounts here. 2) Stripe Checkout opens with the TEST MODE banner and $9.99. Card 4242 4242 4242 4242, any future expiry, any CVC, any postcode → Pay. 3) You return to the Preview at /account showing "Thank you — it’s yours." and "The Book Package" with "The complete book" and "The companion workbook" (if "Payment received — opening now." shows, wait a few seconds and click "Refresh this page"). 4) Stripe (Test mode) → Developers → Webhooks → the Preview destination → Event deliveries: find the checkout.session.completed delivery for this purchase (time + your address); it answered 200. 5) Open the event → Resend → the new attempt answers 200 with {"ok":true}. 6) Supabase → TEST → Authentication → Users → copy your manual user\'s id → Table Editor → entitlements → filter user_id: exactly ONE row, product "premium", status "active" (updated, not duplicated). 7) Back on the Preview: Log out, log in again with the manual account → "Welcome back." → "The complete book" downloads Bouncing-Forward-Book.pdf; "The companion workbook" downloads Bouncing-Forward-Workbook.pdf. 8) Evidence: screenshots of the resend result (200), the single entitlement row (id partly blurred) and a download prompt in qa-evidence/manual/MN-008/. 9) CLEANUP: Supabase TEST → Users → delete the +bf-e2e-manual user (its entitlement goes with it); Mailchimp → that address → Archive (journey C mailed you the live shared access code — black it out; that screenshot also serves MN-004 part C). ALTERNATIVE: run the suite with E2E_KEEP_TEST_USERS=1, resend the PY-001 buyer\'s event listed in qa-evidence/fixtures.json, then run the cleanup project.',
);

manual(
  "MN-009",
  "Google Search Console verification and sitemap submission",
  [],
  "PG-019 (the purpose of the verification file) and PG-005 (sitemap submitted)",
  'Live-site owner actions done by hand; the suite never touches the live site. 1) Open https://www.bouncing-forward.com/google777f049a86d5990c.html — one line: google-site-verification: google777f049a86d5990c.html. 2) Open https://www.bouncing-forward.com/sitemap.xml and confirm every address starts with https://www.bouncing-forward.com/ (21 entries: 13 pages and 8 posts). If they start with another host the Production NEXT_PUBLIC_SITE_URL is wrong — stop and report before submitting. 3) search.google.com/search-console → Add property → URL prefix → https://www.bouncing-forward.com/ → verification method HTML file (the file it names is already served) → Verify → "Ownership verified". 4) Sitemaps → Add a new sitemap → https://www.bouncing-forward.com/sitemap.xml → Submit → status Success with 21 discovered URLs (can take a day). 5) Evidence: screenshots of the verified property and the sitemap status (blur your Google account email) in qa-evidence/manual/MN-009/, plus a dated line in docs/PROJECT-STATUS.md. Neither step has happened yet.',
);

manual(
  "AC-003b",
  "the reset email actually arrives in a controlled inbox",
  ["@accounts"],
  "MN-002 Part A; AC-003a (neutral message) and AC-003c–g (link mechanics) are automated",
  'Follow MN-002 Part A on the Preview: /login → "Forgot your password?" → type the free test account\'s address (your mailbox with "+bf-e2e-free", the address named E2E_FREE_USER_EMAIL) → "Send reset link" → the neutral message shows → the reset email from the TEST project arrives (check Spam) → hover the link: its destination (directly, or through the redirect_to part of a supabase.co link) is the Preview address followed by /auth/confirm?next=/reset-password, never a live address → screenshot with the token blacked out → click it → the Preview opens "Choose a new password." → STOP without setting a password (the suite holds the account\'s password). Record time to arrive, folder, sender, link host; save under qa-evidence/manual/MN-002/ with a note naming both IDs.',
);

manual(
  "PY-009",
  "a 100%-off promotion code completes without a card and still grants access",
  ["@payments"],
  "MANUAL per the approved line (no test-mode promo code is provided to the harness); a $0 purchase never replaces PY-001 (C14)",
  '1) Stripe, Test mode ON → Product catalogue → Coupons → create a 100% off coupon (duration Once) → Add promotion code: a code of your choice, 1 redemption, expiring within a week. 2) On the Preview, logged out: /premium → "Buy the Book Package" → Create account with your mailbox plus "+bf-e2e-manual-promo-<date>" and a fresh password (never the free or premium test accounts) → "Create account & continue to payment". 3) Stripe Checkout shows the TEST MODE banner and $9.99 → "Add promotion code" → enter your code → the total becomes $0.00 and the card section disappears → confirm ("Complete order"). No card is asked for. 4) You return to /account: "Thank you — it’s yours." with "The complete book" and "The companion workbook" (if "Payment received — opening now." shows, wait and click "Refresh this page"). Click a download → the PDF arrives. 5) Stripe (Test mode) → Developers → Webhooks → the Preview destination → the checkout.session.completed delivery answered 200; the event\'s payment_status reads "no_payment_required". 6) Evidence: screenshots of the $0.00 checkout (blur the code), the account page and the delivery in qa-evidence/manual/PY-009/. 7) CLEANUP: delete the +bf-e2e-manual-promo user in Supabase TEST; archive that address in Mailchimp (black out the access code in any screenshot); deactivate the promotion code.',
);

manual(
  "PY-016",
  "the live webhook address is the www one and deliveries succeed",
  ["@payments"],
  'MN-007 part C; closes the "Live webhook address" Blocker row in the feature list\'s defects table',
  'Stripe dashboard only; the suite never sends anything to the live site. 1) Stripe, Test mode OFF → Developers → Webhooks (Event destinations). 2) An enabled endpoint whose URL is exactly https://www.bouncing-forward.com/api/stripe/webhook — with www, https, no trailing slash. 3) It listens for checkout.session.completed and checkout.session.async_payment_succeeded. 4) Recent deliveries answer 200. Most deliveries are the other site\'s events on the shared account: they answer 200 with a body containing "ignored" — correct, and still proof that the address and secret work; a Bouncing Forward purchase answers {"ok":true}. If deliveries show 400 "Invalid signature", the Production STRIPE_WEBHOOK_SECRET in Vercel is not this endpoint\'s secret — update it and redeploy. If they show 3xx, the address is still the one without www (a 308 redirect Stripe does not follow — the cause of the earlier failures). 5) No other live endpoint points at bouncing-forward.vercel.app, the address without www, or any Preview; delete or disable any that does. 6) If there has been no delivery since the address changed, record "no deliveries since <date>" — the line stays PENDING until the first real delivery. 7) Evidence: screenshots of the endpoint page (secret hidden) and the deliveries list in qa-evidence/manual/PY-016/, referenced from MN-007.',
);

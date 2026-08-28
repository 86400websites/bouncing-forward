# private-content/ — NOT publicly served

Files in this folder are **paid deliverables**. They are intentionally
kept OUT of `public/` so they have no web URL — Next.js only serves
files under `public/`, so nothing here is downloadable from the site.

## book-package/ — the $9.99 Book Package (Premium)
- `bouncing-forward-book.pdf` — the complete book (A5 final)
- `bouncing-forward-workbook.pdf` — the companion workbook (final)

### Delivery plan (when Stripe is set up)
Recommended: **Stripe Payment Link** for the $9.99 package, with the
two PDFs delivered by the post-purchase email (either attach them in
Stripe's confirmation, or point the confirmation to a private
fulfilment URL). If we later want on-site delivery, we add an API
route that verifies the Stripe Checkout session id and streams these
files — they can stay right here for that.

Until Stripe exists, the "Buy the Book Package — $9.99" buttons point
at the package description on the Home page; nothing is sold or
delivered yet.

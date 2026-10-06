/**
 * The public page inventory the pages specs share (docs/FEATURE-LIST.md
 * section A). Strings are the exact copy the components render; a change
 * in the site is meant to be caught here.
 */

export type PublicPage = { path: string; h1: string; title: string };

export const PUBLIC_PAGES: readonly PublicPage[] = [
  {
    path: "/",
    h1: "The setback wasn’t your choice. The next step is.",
    title: "Bouncing Forward | Setbacks Don’t Get the Last Word",
  },
  {
    path: "/book",
    h1: "Not another book about moving on.",
    title: "The Book | Bouncing Forward by Maher Kaddoura",
  },
  {
    path: "/about",
    h1: "I turned the worst night of my life into the direction for the rest of it.",
    title: "About Maher Kaddoura | Bouncing Forward",
  },
  {
    path: "/course",
    h1: "Walk the framework, one module at a time.",
    title: "The Course | Nine Guided Modules | Bouncing Forward",
  },
  {
    path: "/compass-and-path",
    h1: "Reading is understanding. Practice is the way through.",
    title: "Free Resources | The Compass & the Path",
  },
  {
    path: "/assess",
    h1: "From here, forward. But first — where’s here?",
    title: "Where’s Here? | Free Two-Minute Check",
  },
  {
    path: "/stories",
    h1: "Loss doesn’t end your story. It’s where you find out what you’re building next.",
    title: "Stories of Bouncing Forward | Real People, Real Loss",
  },
  {
    path: "/blog",
    h1: "Honest words for the hardest seasons.",
    title: "The Blog | Honest Words for the Hardest Seasons",
  },
  {
    path: "/all-in",
    h1: "Commit to Bouncing Forward.",
    title: "All In | The Complete Bouncing Forward Experience",
  },
  {
    path: "/premium",
    h1: "Go all the way.",
    title: "Premium — The Book Package | Bouncing Forward",
  },
  {
    path: "/enterprise",
    h1: "Your team is carrying more than you can see.",
    title: "Enterprise | Bouncing Forward",
  },
  {
    path: "/contact",
    h1: "We’d like to hear from you.",
    title: "Contact | Bouncing Forward",
  },
  {
    path: "/faq",
    h1: "Frequently asked questions",
    title: "FAQ | Bouncing Forward",
  },
  {
    path: "/privacy",
    h1: "Privacy Policy",
    title: "Privacy Policy | Bouncing Forward",
  },
  {
    path: "/terms",
    h1: "Terms of Use",
    title: "Terms of Use | Bouncing Forward",
  },
  { path: "/login", h1: "Log in.", title: "Log in · Bouncing Forward" },
  {
    path: "/signup",
    h1: "Create your account.",
    title: "Create your account · Bouncing Forward",
  },
  {
    path: "/forgot-password",
    h1: "Reset your password.",
    title: "Reset your password · Bouncing Forward",
  },
  {
    path: "/reset-password",
    h1: "Choose a new password.",
    title: "Choose a new password · Bouncing Forward",
  },
  {
    path: "/style-guide",
    h1: "Style Guide",
    title: "Style Guide · Bouncing Forward",
  },
];

/** The eight posts in the order the Blog index and the sitemap list them. */
export const BLOG_POSTS: readonly { slug: string; title: string }[] = [
  {
    slug: "losses-nobody-sends-flowers-for",
    title: "The Losses Nobody Sends Flowers For",
  },
  { slug: "when-there-is-no-goodbye", title: "When There Is No Goodbye" },
  {
    slug: "why-month-eight-is-harder",
    title: "Why Month Eight Is Harder Than Week Two",
  },
  {
    slug: "a-setback-is-not-a-staircase",
    title: "A Setback Is Not a Staircase",
  },
  { slug: "the-friends-who-disappeared", title: "The Friends Who Disappeared" },
  { slug: "you-do-not-have-to-let-go", title: "You Do Not Have to Let Go" },
  {
    slug: "this-will-make-you-stronger",
    title: "When People Say This Will Make You Stronger",
  },
  {
    slug: "someone-who-has-been-through-something",
    title: "Becoming Someone Who Has Been Through Something",
  },
];

/** Old address → new address (next.config.ts permanent redirects). */
export const REDIRECTS: readonly [string, string][] = [
  ["/learn", "/course"],
  ["/workshops", "/enterprise"],
  ["/enterprises", "/enterprise"],
  ["/blog/grief-is-not-a-staircase", "/blog/a-setback-is-not-a-staircase"],
  [
    "/blog/the-losses-nobody-sends-flowers-for",
    "/blog/losses-nobody-sends-flowers-for",
  ],
  [
    "/blog/why-month-eight-is-harder-than-week-two",
    "/blog/why-month-eight-is-harder",
  ],
  [
    "/blog/when-people-say-this-will-make-you-stronger",
    "/blog/this-will-make-you-stronger",
  ],
  [
    "/blog/becoming-someone-who-has-been-through-something",
    "/blog/someone-who-has-been-through-something",
  ],
];

/** The 13 indexable pages the sitemap must list (plus the 8 posts). */
export const SITEMAP_PAGES = [
  "/",
  "/book",
  "/course",
  "/compass-and-path",
  "/stories",
  "/about",
  "/assess",
  "/enterprise",
  "/contact",
  "/faq",
  "/all-in",
  "/blog",
  "/premium",
];

/** Pages that carry a noindex instruction and must stay out of the sitemap. */
export const NOINDEX_PAGES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/account",
  "/style-guide",
  "/privacy",
  "/terms",
];

/**
 * One Amazon listing per format, in the order the pages offer them. The
 * Kindle listing is the original one; the hardcover, paperback and workbook
 * listings were supplied by the owner on 11 September 2026.
 */
export const AMAZON_FORMATS = [
  {
    label: "Kindle",
    href: "https://www.amazon.com/Bouncing-Forward-Hardships-Stepping-Resilience/dp/B0DWRVYCHS",
  },
  { label: "Hardcover", href: "https://www.amazon.com/dp/B0HH3N6SQ1" },
  { label: "Paperback", href: "https://www.amazon.com/dp/B0HJD4DTFW" },
  { label: "Workbook", href: "https://www.amazon.com/dp/B0HHDXSSK3" },
] as const;

export const AMAZON_URLS = AMAZON_FORMATS.map((f) => f.href);
export const FREE_CHAPTER_PDF =
  "/downloads/Bouncing-Forward-Chapter-1-Free-A4.pdf";
export const JOURNAL_PDF = "/downloads/BF-7-Step-Reflection-Journal.pdf";

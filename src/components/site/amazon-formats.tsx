import { AMAZON_FORMATS } from "@/lib/site";
import { ExternalCta } from "@/components/site/begin-your-crossing";

/**
 * The four Amazon listings, one labelled link per format (Kindle, Hardcover,
 * Paperback, Workbook). Every link opens in a new tab with a safe rel, the
 * same as the single "Buy on Amazon" button it replaces.
 *
 * `variant="buttons"` renders the round CTA buttons used on The Book page.
 * `variant="inline"` renders a compact separated list for running text, used
 * under the Premium buy button.
 */
export function AmazonFormats({
  variant = "buttons",
  invert = false,
}: {
  variant?: "buttons" | "inline";
  invert?: boolean;
}) {
  if (variant === "inline") {
    return (
      <span>
        {AMAZON_FORMATS.map((format, index) => (
          <span key={format.href}>
            {index > 0 ? " · " : null}
            <a
              href={format.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent-text font-semibold underline-offset-2 hover:underline"
            >
              {format.label}
            </a>
          </span>
        ))}
      </span>
    );
  }

  return (
    <>
      {AMAZON_FORMATS.map((format) => (
        <ExternalCta
          key={format.href}
          href={format.href}
          label={format.label}
          invert={invert}
        />
      ))}
    </>
  );
}

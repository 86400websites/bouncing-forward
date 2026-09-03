/**
 * S0 scaffold stub — content only; the header/footer shell lives in the root
 * layout as of sprint 2. Full pages replace these in sprints 3–7.
 */
export function PageStub({
  eyebrow,
  title,
  line,
  sprint,
}: {
  eyebrow: string;
  title: string;
  line: string;
  sprint: string;
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col justify-center px-5 py-24 sm:px-6 lg:px-8">
      <p className="text-brand-accent-text text-xs font-bold tracking-[0.08em] uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-4xl leading-tight font-extrabold sm:text-5xl">
        {title}
      </h1>
      <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
        {line}
      </p>
      <p className="border-border text-muted-foreground mt-10 border-t pt-6 text-sm">
        Scaffold stub — full page arrives in {sprint}.
      </p>
    </section>
  );
}

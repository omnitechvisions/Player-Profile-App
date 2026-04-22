export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      {description ? <p className="max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

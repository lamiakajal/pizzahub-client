import { Reveal } from "@/components/home/reveal";

// Same heading style for every home page section.
export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-3">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
        <p className="text-muted-foreground sm:text-lg">{description}</p>
      </div>
      {action}
    </Reveal>
  );
}

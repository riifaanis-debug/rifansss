import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 py-14 md:py-20 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <span className="inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl font-extrabold text-primary md:text-3xl">{title}</h2>
      {sub && <p className="mt-3 text-sm leading-7 text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gold/40 bg-gold-soft/40 p-4 text-sm leading-7 text-primary">
      <AlertTriangle className="mt-1 size-4 shrink-0 text-gold" />
      <p>{children}</p>
    </div>
  );
}

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="surface-royal">
      <div className="mx-auto max-w-7xl px-4 py-14 text-center md:py-20">
        <h1 className="text-2xl font-extrabold md:text-4xl">{title}</h1>
        {sub && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-primary-foreground/80">{sub}</p>
        )}
      </div>
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-14 text-sm leading-8 text-foreground/90">
      {children}
    </div>
  );
}
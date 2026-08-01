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
    <section id={id} className={`mx-auto max-w-7xl px-4 py-10 text-right md:py-20 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl text-right">
      {eyebrow && (
        <span className="inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-xl font-extrabold text-primary md:text-3xl">{title}</h2>
      {sub && <p className="mt-2 text-[0.8rem] leading-6 text-muted-foreground md:text-sm">{sub}</p>}
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gold/40 bg-gold-soft/40 p-3 text-right text-[0.8rem] leading-6 text-primary md:p-4 md:text-sm">
      <AlertTriangle className="mt-1 size-4 shrink-0 text-gold" />
      <p>{children}</p>
    </div>
  );
}

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="surface-royal">
      <div className="mx-auto max-w-7xl px-4 py-10 text-right md:py-20">
        <h1 className="text-xl font-extrabold md:text-4xl">{title}</h1>
        {sub && (
          <p className="mt-3 max-w-2xl text-[0.8rem] leading-7 text-primary-foreground/80 md:text-sm">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 text-right text-[0.8rem] leading-7 text-foreground/90 md:py-14 md:text-sm md:leading-8">
      {children}
    </div>
  );
}
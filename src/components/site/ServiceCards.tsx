import { useSuspenseQuery } from "@tanstack/react-query";
import { servicesQueryOptions } from "@/lib/services-query";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Link } from "@tanstack/react-router";

export function ServiceCards() {
  const { data: services } = useSuspenseQuery(servicesQueryOptions);

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <article
          key={s.id}
          className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1"
        >
          <span className="grid size-12 place-items-center rounded-xl bg-gold-soft">
            <ServiceIcon name={s.icon} className="size-5 text-primary" />
          </span>
          <h3 className="mt-4 text-base font-bold text-primary">{s.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{s.description}</p>
          {s.price != null && (
            <p className="mt-3 text-sm font-bold text-gold">رسوم الخدمة: {s.price} ريال</p>
          )}
          <Link
            to="/request"
            search={{ service: s.id }}
            className="mt-4 text-sm font-bold text-primary hover:text-gold"
          >
            اطلب هذه الخدمة ←
          </Link>
        </article>
      ))}
    </div>
  );
}
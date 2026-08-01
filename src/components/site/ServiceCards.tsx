import { useSuspenseQuery } from "@tanstack/react-query";
import { servicesQueryOptions } from "@/lib/services-query";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Link } from "@tanstack/react-router";

export function ServiceCards() {
  const { data: services } = useSuspenseQuery(servicesQueryOptions);

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:mt-10 md:gap-4">
      {services.map((s) => (
        <article
          key={s.id}
          className="flex flex-col rounded-2xl border border-border bg-card p-4 text-right shadow-soft transition-transform hover:-translate-y-1 md:p-6"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-gold-soft md:size-12">
            <ServiceIcon name={s.icon} className="size-4 text-primary md:size-5" />
          </span>
          <h3 className="mt-3 text-sm font-bold text-primary md:mt-4 md:text-base">{s.title}</h3>
          <p className="mt-2 flex-1 text-[0.8rem] leading-6 text-muted-foreground md:text-sm md:leading-7">
            {s.description}
          </p>
          {s.price != null && (
            <p className="mt-3 text-[0.8rem] font-bold text-gold md:text-sm">
              رسوم الخدمة: {s.price} ريال
            </p>
          )}
          <Link
            to="/request"
            search={{ service: s.id }}
            className="mt-3 text-[0.8rem] font-bold text-primary hover:text-gold md:mt-4 md:text-sm"
          >
            اطلب هذه الخدمة ←
          </Link>
        </article>
      ))}
    </div>
  );
}
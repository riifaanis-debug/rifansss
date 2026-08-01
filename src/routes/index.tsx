import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  Timer,
  ListChecks,
  ShieldCheck,
  Activity,
  Users,
  BellRing,
  MonitorSmartphone,
  Headset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, Notice } from "@/components/site/Bits";
import { ServiceCards } from "@/components/site/ServiceCards";
import { servicesQueryOptions } from "@/lib/services-query";
import { WORK_STEPS } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ريفانس لخدمات التعقيب | ننجز معاملاتك بسهولة واحترافية" },
      {
        name: "description",
        content:
          "ريفانس لخدمات التعقيب: تجهيز ومتابعة المعاملات وإنجاز الإجراءات لدى الجهات والمنصات ذات العلاقة بآلية عمل واضحة ومتابعة مستمرة.",
      },
      { property: "og:title", content: "ريفانس لخدمات التعقيب | ننجز معاملاتك بسهولة واحترافية" },
      {
        property: "og:description",
        content: "ريفانس لخدمات التعقيب: تجهيز ومتابعة المعاملات وإنجاز الإجراءات لدى الجهات والمنصات ذات العلاقة بآلية عمل واضحة ومتابعة مستمرة.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQueryOptions),
  component: Index,
});

const advantages = [
  { icon: Timer, title: "سرعة متابعة الطلبات" },
  { icon: ListChecks, title: "وضوح الإجراءات والمتطلبات" },
  { icon: ShieldCheck, title: "حماية بيانات ومستندات العملاء" },
  { icon: Activity, title: "متابعة مستمرة لحالة المعاملة" },
  { icon: Users, title: "فريق متخصص في خدمات التعقيب" },
  { icon: BellRing, title: "إشعارات عند تحديث حالة الطلب" },
  { icon: MonitorSmartphone, title: "خدمة إلكترونية سهلة" },
  { icon: Headset, title: "دعم العملاء والرد على الاستفسارات" },
];

function Index() {
  return (
    <>
      <div className="surface-royal">
        <div className="mx-auto max-w-7xl px-4 py-12 text-right md:py-24">
          <span className="inline-block rounded-full border border-gold/50 px-4 py-1 text-xs font-semibold text-gold">
            خدمات تعقيب موثوقة
          </span>
          <h1 className="mt-4 max-w-3xl text-2xl font-extrabold leading-tight md:text-5xl">
            ننجز معاملاتك بسهولة واحترافية
          </h1>
          <p className="mt-4 max-w-3xl text-[0.8rem] leading-7 text-primary-foreground/85 md:text-base md:leading-8">
            تقدم ريفانس خدمات التعقيب ومتابعة المعاملات وإنجاز الإجراءات لدى الجهات والمنصات ذات
            العلاقة، من خلال آلية عمل منظمة وواضحة، مع متابعة مستمرة للطلب حتى اكتمال الخدمة.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg" className="md:h-12 md:px-8">
              <Link to="/request">اطلب خدمتك الآن</Link>
            </Button>
            <Button asChild variant="goldOutline" size="lg" className="md:h-12 md:px-8">
              <Link to="/services">استعرض خدماتنا</Link>
            </Button>
          </div>
          <div className="mt-8 max-w-3xl rounded-xl border border-gold/30 bg-white/5 p-3 text-[0.72rem] leading-6 text-primary-foreground/85 md:p-4 md:text-sm md:leading-7">
            ريفانس مقدم خدمات تعقيب مستقل، ولا يمثل أي جهة حكومية. تخضع المعاملات للموافقات
            والمتطلبات والأنظمة الخاصة بالجهات المختصة.
          </div>
        </div>
      </div>

      <Section id="services">
        <SectionHeading eyebrow="خدماتنا" title="خدمات ريفانس" />
        <Suspense fallback={<p className="mt-8 text-right text-sm">جارٍ التحميل...</p>}>
          <ServiceCards />
        </Suspense>
      </Section>

      <div className="bg-muted/60">
        <Section>
          <SectionHeading eyebrow="مميزاتنا" title="لماذا تختار ريفانس؟" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:mt-10 md:gap-4">
            {advantages.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-4 text-right shadow-soft transition-transform hover:-translate-y-1 md:p-5"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-gold-soft md:size-11">
                  <f.icon className="size-4 text-primary md:size-5" />
                </span>
                <h3 className="mt-3 text-[0.82rem] font-bold leading-6 text-primary md:mt-4 md:text-sm">
                  {f.title}
                </h3>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section>
        <SectionHeading eyebrow="آلية العمل" title="كيف نعمل؟" />
        <ol className="mt-6 grid gap-3 md:mt-10 md:grid-cols-2 md:gap-4">
          {WORK_STEPS.map((s, i) => (
            <li
              key={s}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-right md:gap-4 md:p-4"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full surface-royal text-xs font-bold text-gold md:size-9 md:text-sm">
                {i + 1}
              </span>
              <span className="min-w-0 text-[0.82rem] font-medium text-foreground md:text-sm">{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 max-w-3xl">
          <Notice>
            تُحدد رسوم كل خدمة حسب نوع المعاملة ومتطلباتها، ورسوم ريفانس مستقلة تمامًا عن أي رسوم
            تفرضها الجهات الرسمية.
          </Notice>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/request">اطلب خدمتك</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/track">متابعة الطلب</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}

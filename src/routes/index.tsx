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
      { property: "og:title", content: "ريفانس لخدمات التعقيب" },
      {
        property: "og:description",
        content: "خدمات تعقيب ومتابعة معاملات للأفراد والمنشآت بمتابعة مستمرة حتى اكتمال الخدمة.",
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
        <div className="mx-auto max-w-7xl px-4 py-16 text-center md:py-24">
          <span className="inline-block rounded-full border border-gold/50 px-4 py-1 text-xs font-semibold text-gold">
            خدمات تعقيب موثوقة
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
            ننجز معاملاتك بسهولة واحترافية
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-primary-foreground/85 md:text-base">
            تقدم ريفانس خدمات التعقيب ومتابعة المعاملات وإنجاز الإجراءات لدى الجهات والمنصات ذات
            العلاقة، من خلال آلية عمل منظمة وواضحة، مع متابعة مستمرة للطلب حتى اكتمال الخدمة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <Link to="/request">اطلب خدمتك الآن</Link>
            </Button>
            <Button asChild variant="goldOutline" size="xl">
              <Link to="/services">استعرض خدماتنا</Link>
            </Button>
          </div>
          <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gold/30 bg-white/5 p-4 text-xs leading-7 text-primary-foreground/85 md:text-sm">
            ريفانس مقدم خدمات تعقيب مستقل، ولا يمثل أي جهة حكومية. تخضع المعاملات للموافقات
            والمتطلبات والأنظمة الخاصة بالجهات المختصة.
          </div>
        </div>
      </div>

      <Section id="services">
        <SectionHeading eyebrow="خدماتنا" title="خدمات ريفانس" />
        <Suspense fallback={<p className="mt-10 text-center text-sm">جارٍ التحميل...</p>}>
          <ServiceCards />
        </Suspense>
      </Section>

      <div className="bg-muted/60">
        <Section>
          <SectionHeading eyebrow="مميزاتنا" title="لماذا تختار ريفانس؟" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-transform hover:-translate-y-1"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-gold-soft">
                  <f.icon className="size-5 text-primary" />
                </span>
                <h3 className="mt-4 text-sm font-bold leading-6 text-primary">{f.title}</h3>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section>
        <SectionHeading eyebrow="آلية العمل" title="كيف نعمل؟" />
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {WORK_STEPS.map((s, i) => (
            <li
              key={s}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full surface-royal text-sm font-bold text-gold">
                {i + 1}
              </span>
              <span className="min-w-0 text-sm font-medium text-foreground">{s}</span>
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-10 max-w-3xl">
          <Notice>
            تُحدد رسوم كل خدمة حسب نوع المعاملة ومتطلباتها، ورسوم ريفانس مستقلة تمامًا عن أي رسوم
            تفرضها الجهات الرسمية.
          </Notice>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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

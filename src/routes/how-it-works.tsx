import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeading } from "@/components/site/Bits";
import { Button } from "@/components/ui/button";
import { WORK_STEPS } from "@/lib/content";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "آلية العمل | ريفانس لخدمات التعقيب" },
      {
        name: "description",
        content:
          "كيف نعمل في ريفانس: اختيار الخدمة، تعبئة الطلب، رفع المستندات، المراجعة، الدفع، التنفيذ والمتابعة حتى إغلاق الطلب.",
      },
      { property: "og:title", content: "آلية العمل | ريفانس" },
      { property: "og:description", content: "خطوات واضحة من تقديم الطلب حتى اكتمال الخدمة." },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <>
      <PageHeader title="آلية العمل" sub="مسار منظم وواضح لكل معاملة من بدايتها حتى إغلاقها." />
      <Section>
        <SectionHeading eyebrow="خطواتنا" title="كيف نعمل؟" />
        <ol className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          {WORK_STEPS.map((s, i) => (
            <li
              key={s}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-soft"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full surface-royal text-sm font-bold text-gold">
                {i + 1}
              </span>
              <span className="min-w-0 text-sm font-medium text-foreground">{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Button asChild variant="hero" size="lg">
            <Link to="/request">اطلب خدمتك</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
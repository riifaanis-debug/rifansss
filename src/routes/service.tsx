import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Section, Notice } from "@/components/site/Bits";

export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "تفاصيل الخدمة | ريفانس" },
      {
        name: "description",
        content: "تفاصيل خدمة تجهيز ومتابعة إصدار وثيقة توثيق التجارة الإلكترونية مع ريفانس.",
      },
      { property: "og:title", content: "تفاصيل الخدمة | ريفانس" },
      { property: "og:description", content: "ما الذي تشمله خدمة التعقيب لدى ريفانس." },
    ],
  }),
  component: ServicePage,
});

const included = [
  "مراجعة البيانات",
  "مراجعة الأنشطة",
  "تجهيز الطلب",
  "تقديم الطلب",
  "متابعة حالة الطلب",
  "تسليم الوثيقة بعد إصدارها",
];

function ServicePage() {
  return (
    <>
      <PageHeader
        title="تفاصيل الخدمة"
        sub="خدمة متكاملة لتجهيز وتقديم ومتابعة طلب إصدار وثيقة توثيق التجارة الإلكترونية."
      />
      <Section className="max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-extrabold text-primary">تشمل الخدمة</h2>
          <ul className="mt-4 space-y-3">
            {included.map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-gold" />
                {i}
              </li>
            ))}
          </ul>
          <Button asChild variant="hero" size="lg" className="mt-6 w-full">
            <Link to="/request">ابدأ طلبك مع ريفانس</Link>
          </Button>
        </div>
        <div className="mt-6">
          <Notice>رسوم التعقيب مستقلة عن أي رسوم حكومية أو رسوم تفرضها الجهات الرسمية.</Notice>
        </div>
      </Section>
    </>
  );
}
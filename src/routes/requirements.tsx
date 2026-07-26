import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Section, Notice } from "@/components/site/Bits";

export const Route = createFileRoute("/requirements")({
  head: () => ({
    meta: [
      { title: "متطلبات إصدار الوثيقة | ريفانس" },
      {
        name: "description",
        content: "تعرّف على المستندات والبيانات المطلوبة لإصدار وثيقة توثيق التجارة الإلكترونية.",
      },
      { property: "og:title", content: "متطلبات إصدار الوثيقة | ريفانس" },
      { property: "og:description", content: "قائمة المتطلبات والمستندات اللازمة لتقديم الطلب." },
    ],
  }),
  component: RequirementsPage,
});

const groups = [
  {
    title: "بيانات مقدم الطلب",
    items: ["الاسم الكامل", "رقم الهوية أو الإقامة", "رقم الجوال", "البريد الإلكتروني", "المدينة", "صفة مقدم الطلب"],
  },
  {
    title: "بيانات المنشأة",
    items: [
      "اسم المنشأة",
      "الرقم الموحد للمنشأة",
      "رقم السجل التجاري وتاريخ الإصدار والانتهاء",
      "نوع الكيان وحالة السجل التجاري",
      "صورة السجل التجاري",
    ],
  },
  {
    title: "بيانات المتجر الإلكتروني",
    items: ["اسم المتجر", "رابط المتجر", "روابط حسابات التواصل", "منصة المتجر", "وصف مختصر للنشاط"],
  },
  {
    title: "المستندات",
    items: [
      "السجل التجاري",
      "الهوية الوطنية أو الإقامة",
      "التفويض إذا كان مقدم الطلب غير المالك",
      "شعار المتجر إن وجد",
      "أي تراخيص مرتبطة بالنشاط",
    ],
  },
];

function RequirementsPage() {
  return (
    <>
      <PageHeader
        title="متطلبات إصدار الوثيقة"
        sub="جهّز المتطلبات التالية قبل بدء الطلب لتسريع الإجراءات مع فريق ريفانس."
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-base font-extrabold text-primary">{g.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-7 text-foreground">
                    <Check className="mt-1.5 size-4 shrink-0 text-gold" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Notice>
            يشترط وجود سجل تجاري ساري المفعول، وأن يكون النشاط المراد توثيقه قابلًا للتوثيق وفق
            متطلبات الجهات الرسمية.
          </Notice>
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="hero" size="xl">
            <Link to="/request">ابدأ طلبك مع ريفانس</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
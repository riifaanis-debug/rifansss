import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileSearch,
  BadgeCheck,
  Link2,
  Activity,
  BellRing,
  Headset,
  ShieldCheck,
  Download,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, Notice } from "@/components/site/Bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ريفانس | إصدار وثيقة توثيق التجارة الإلكترونية" },
      {
        name: "description",
        content:
          "تتولى ريفانس تجهيز ومتابعة طلب إصدار وثيقة توثيق التجارة الإلكترونية لمنشأتك حتى تسليم الوثيقة.",
      },
      { property: "og:title", content: "ريفانس | إصدار وثيقة توثيق التجارة الإلكترونية" },
      {
        property: "og:description",
        content: "خدمات تعقيب مستقلة لتوثيق المتاجر الإلكترونية بسرعة ووضوح.",
      },
    ],
  }),
  component: Index,
});

const features = [
  { icon: FileSearch, title: "مراجعة بيانات السجل التجاري" },
  { icon: BadgeCheck, title: "التحقق من الأنشطة القابلة للتوثيق" },
  { icon: Link2, title: "ربط رابط المتجر الإلكتروني" },
  { icon: Activity, title: "متابعة الطلب حتى اكتماله" },
  { icon: BellRing, title: "إشعارات فورية بحالة الطلب" },
  { icon: Headset, title: "دعم ومتابعة من موظف مختص" },
  { icon: ShieldCheck, title: "حماية بيانات العميل ومستنداته" },
  { icon: Download, title: "إمكانية تحميل الوثيقة بعد صدورها" },
];

const steps = [
  "تعبئة بيانات العميل والمنشأة",
  "إدخال بيانات السجل التجاري",
  "إضافة رابط المتجر الإلكتروني",
  "تحديد الأنشطة المراد توثيقها",
  "رفع المستندات المطلوبة",
  "مراجعة الطلب من فريق التعقيب",
  "دفع رسوم الخدمة",
  "تقديم الطلب عبر المنصة الرسمية",
  "متابعة حالة الطلب",
  "إصدار الوثيقة وتسليمها للعميل",
];

const priceItems = [
  "مراجعة البيانات",
  "مراجعة الأنشطة",
  "تجهيز الطلب",
  "تقديم الطلب",
  "متابعة حالة الطلب",
  "تسليم الوثيقة بعد إصدارها",
];

function Index() {
  return (
    <>
      <div className="surface-royal">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center md:py-24">
          <span className="inline-block rounded-full border border-gold/50 px-4 py-1 text-xs font-semibold text-gold">
            خدمات تعقيب مستقلة
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
            أصدر وثيقة توثيق تجارتك الإلكترونية مع <span className="text-gold">ريفانس</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-primary-foreground/85 md:text-base">
            تتولى ريفانس مراجعة بيانات منشأتك وتجهيز ومتابعة طلب إصدار وثيقة توثيق التجارة
            الإلكترونية، بدايةً من التحقق من السجل التجاري والأنشطة المرتبطة به، وحتى اكتمال
            الإجراءات وتسليم الوثيقة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="xl">
              <Link to="/request">ابدأ طلبك مع ريفانس</Link>
            </Button>
            <Button asChild variant="goldOutline" size="xl">
              <Link to="/requirements">معرفة المتطلبات</Link>
            </Button>
          </div>
          <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gold/30 bg-white/5 p-4 text-xs leading-7 text-primary-foreground/85 md:text-sm">
            نحن مقدم خدمات تعقيب مستقل، ولسنا جهة حكومية. يتم تنفيذ الطلب من خلال المنصات الرسمية
            بعد الحصول على تفويض وموافقة العميل.
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow="مميزات الخدمة" title="لماذا تختار ريفانس؟" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
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

      <div className="bg-muted/60">
        <Section>
          <SectionHeading eyebrow="مسار العمل" title="خطوات إصدار الوثيقة" />
          <ol className="mt-10 grid gap-4 md:grid-cols-2">
            {steps.map((s, i) => (
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
        </Section>
      </div>

      <Section>
        <SectionHeading eyebrow="رسوم الخدمة" title="خدمة إصدار وثيقة التجارة الإلكترونية" />
        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-gold/40 bg-card p-8 shadow-soft">
          <p className="text-sm text-muted-foreground">رسوم التعقيب</p>
          <p className="mt-1 text-4xl font-extrabold text-primary">
            499 <span className="text-lg font-bold text-gold">ريال</span>
          </p>
          <ul className="mt-6 space-y-3">
            {priceItems.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-gold" />
                {p}
              </li>
            ))}
          </ul>
          <Button asChild variant="hero" size="lg" className="mt-7 w-full">
            <Link to="/request">ابدأ طلبك مع ريفانس</Link>
          </Button>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            رسوم التعقيب مستقلة عن أي رسوم حكومية أو رسوم تفرضها الجهات الرسمية.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            {["مدى", "Apple Pay", "Visa", "Mastercard", "تحويل بنكي"].map((m) => (
              <span key={m} className="rounded-md border border-border px-2 py-1">
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <Notice>
            يتم عرض الأنشطة وفقًا للبيانات التي يقدمها العميل، وتخضع الموافقة النهائية للتحقق من
            الجهة الرسمية.
          </Notice>
        </div>
      </Section>
    </>
  );
}

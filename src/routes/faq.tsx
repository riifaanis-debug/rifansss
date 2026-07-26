import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader, Section } from "@/components/site/Bits";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "الأسئلة الشائعة | ريفانس" },
      {
        name: "description",
        content: "إجابات عن أكثر الأسئلة تكرارًا حول وثيقة توثيق التجارة الإلكترونية وخدمة ريفانس.",
      },
      { property: "og:title", content: "الأسئلة الشائعة | ريفانس" },
      { property: "og:description", content: "كل ما تحتاج معرفته عن إجراءات توثيق المتجر الإلكتروني." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "ما هي وثيقة توثيق التجارة الإلكترونية؟",
    a: "هي وثيقة تُصدرها الجهة الرسمية المختصة لتوثيق المتجر الإلكتروني وربطه بالسجل التجاري والأنشطة المسجلة فيه.",
  },
  { q: "هل يشترط وجود سجل تجاري؟", a: "نعم، يلزم وجود سجل تجاري باسم المنشأة يتضمن نشاطًا قابلًا للتوثيق." },
  { q: "هل يجب أن يكون السجل التجاري ساريًا؟", a: "نعم، يجب أن يكون السجل التجاري ساري المفعول عند تقديم الطلب." },
  { q: "هل يمكن توثيق أكثر من نشاط؟", a: "نعم، يمكن اختيار أكثر من نشاط من الأنشطة القابلة للتوثيق ضمن السجل التجاري." },
  { q: "ما المتطلبات اللازمة؟", a: "بيانات مقدم الطلب والمنشأة والمتجر الإلكتروني، إضافة إلى المستندات مثل السجل التجاري والهوية والتفويض عند الحاجة." },
  { q: "كم تستغرق إجراءات الطلب؟", a: "يبدأ فريق ريفانس المراجعة خلال ساعات العمل، وتعتمد المدة النهائية على إجراءات الجهة الرسمية." },
  { q: "هل رسوم الخدمة تشمل الرسوم الحكومية؟", a: "لا، رسوم التعقيب مستقلة تمامًا عن أي رسوم حكومية أو رسوم تفرضها الجهات الرسمية." },
  { q: "كيف أتابع حالة طلبي؟", a: "عبر صفحة متابعة الطلب باستخدام رقم الطلب ورقم الهوية ورمز التحقق المرسل إلى جوالك." },
  { q: "ماذا يحدث إذا كان أحد الأنشطة غير قابل للتوثيق؟", a: "نوضح لك ذلك قبل التقديم، ويتم استكمال الطلب بالأنشطة القابلة للتوثيق فقط." },
  { q: "كيف أحصل على الوثيقة بعد إصدارها؟", a: "تم إصدار الوثيقة، ويمكنك الآن تحميلها من حسابك في ريفانس عبر لوحة العميل." },
];

function FaqPage() {
  return (
    <>
      <PageHeader title="الأسئلة الشائعة" sub="أجوبة سريعة وواضحة عن خدمة توثيق التجارة الإلكترونية." />
      <Section className="max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`i${i}`}>
              <AccordionTrigger className="text-right text-sm font-bold text-primary">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-8 text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  );
}
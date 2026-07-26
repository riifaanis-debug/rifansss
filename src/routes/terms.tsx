import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/Bits";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط والأحكام | ريفانس" },
      { name: "description", content: "شروط وأحكام استخدام خدمات التعقيب المقدمة من ريفانس." },
      { property: "og:title", content: "الشروط والأحكام | ريفانس" },
      { property: "og:description", content: "الشروط المنظمة للعلاقة بين ريفانس والعميل." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHeader title="الشروط والأحكام" />
      <Prose>
        <p>
          تقدّم ريفانس خدمات تعقيب ومتابعة فقط، ولا تضمن الموافقة على المعاملة أو نتيجتها، إذ تخضع
          المعاملات لقرارات ومتطلبات الجهات المختصة.
        </p>
        <p>
          يقر العميل بصحة البيانات والمستندات المقدمة، ويتحمل مسؤولية أي بيانات غير صحيحة أو ناقصة.
        </p>
        <p>رسوم التعقيب مستقلة عن أي رسوم حكومية أو رسوم تفرضها الجهات الرسمية.</p>
      </Prose>
    </>
  );
}
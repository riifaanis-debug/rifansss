import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/Bits";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "إخلاء المسؤولية | ريفانس" },
      { name: "description", content: "ريفانس مقدم خدمات تعقيب مستقل ولا يمثل أي جهة حكومية." },
      { property: "og:title", content: "إخلاء المسؤولية | ريفانس" },
      { property: "og:description", content: "توضيح صفة ريفانس وحدود مسؤوليتها." },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <>
      <PageHeader title="إخلاء المسؤولية" />
      <Prose>
        <p>
          ريفانس مقدم خدمات تعقيب مستقل، ولا يمثل أي جهة حكومية. تخضع المعاملات للموافقات
          والمتطلبات والأنظمة الخاصة بالجهات المختصة.
        </p>
        <p>
          لا يستخدم الموقع أي شعارات حكومية، ويتم تنفيذ المعاملات لدى الجهات والمنصات ذات العلاقة بعد
          الحصول على موافقة العميل.
        </p>
      </Prose>
    </>
  );
}
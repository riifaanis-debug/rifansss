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
          ريفانس مقدم خدمات تعقيب مستقل، ولا يمثل أي جهة حكومية. تخضع الموافقة على الطلب وإصدار
          الوثيقة للأنظمة والمتطلبات والقرارات الصادرة عن الجهات الرسمية المختصة.
        </p>
        <p>
          لا يستخدم الموقع أي شعارات حكومية، ويتم تنفيذ الطلبات عبر المنصات الرسمية بعد الحصول على
          تفويض وموافقة العميل.
        </p>
      </Prose>
    </>
  );
}
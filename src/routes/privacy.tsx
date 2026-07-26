import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/Bits";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية | ريفانس" },
      { name: "description", content: "كيف تجمع ريفانس بيانات العملاء وتحميها وتستخدمها." },
      { property: "og:title", content: "سياسة الخصوصية | ريفانس" },
      { property: "og:description", content: "سياسة حماية واستخدام بيانات عملاء ريفانس." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHeader title="سياسة الخصوصية" />
      <Prose>
        <p>
          تلتزم ريفانس بحماية بيانات عملائها ومستنداتهم، ويتم جمع البيانات لغرض تنفيذ خدمة التعقيب
          وتجهيز ومتابعة طلب إصدار وثيقة توثيق التجارة الإلكترونية فقط.
        </p>
        <p>
          تُخزَّن البيانات الحساسة بصورة مشفّرة، ولا تتم مشاركتها مع أي طرف ثالث إلا بالقدر اللازم
          لتقديم الطلب عبر المنصات الرسمية بعد الحصول على تفويض العميل.
        </p>
        <p>
          يحق للعميل طلب تصحيح بياناته أو حذفها بعد اكتمال الإجراء، ما لم يكن الاحتفاظ بها مطلوبًا
          نظامًا.
        </p>
      </Prose>
    </>
  );
}
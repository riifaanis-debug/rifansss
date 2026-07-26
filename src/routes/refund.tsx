import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/Bits";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "سياسة الاسترجاع والإلغاء | ريفانس" },
      { name: "description", content: "شروط استرجاع رسوم التعقيب وإلغاء الطلب لدى ريفانس." },
      { property: "og:title", content: "سياسة الاسترجاع والإلغاء | ريفانس" },
      { property: "og:description", content: "متى يمكن إلغاء الطلب واسترجاع الرسوم." },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <>
      <PageHeader title="سياسة الاسترجاع والإلغاء" />
      <Prose>
        <p>يمكن إلغاء الطلب واسترجاع كامل رسوم التعقيب قبل بدء فريق ريفانس بمراجعة الطلب.</p>
        <p>
          بعد بدء المراجعة أو تقديم الطلب عبر المنصة الرسمية، تصبح رسوم التعقيب غير قابلة للاسترجاع
          مقابل الجهد المبذول.
        </p>
        <p>لا تشمل سياسة الاسترجاع أي رسوم مدفوعة للجهات الرسمية.</p>
      </Prose>
    </>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/Bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | ريفانس" },
      {
        name: "description",
        content: "ريفانس منصة متخصصة في خدمات التعقيب والمتابعة للمنشآت والمتاجر الإلكترونية.",
      },
      { property: "og:title", content: "من نحن | ريفانس" },
      { property: "og:description", content: "تعرّف على ريفانس ودورها في تجهيز ومتابعة طلبات التوثيق." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader title="عن ريفانس" />
      <Prose>
        <p>
          ريفانس منصة متخصصة في تقديم خدمات التعقيب والمتابعة للمنشآت والمتاجر الإلكترونية، وتساعد
          العملاء على تجهيز ومتابعة إجراءات إصدار وثيقة توثيق التجارة الإلكترونية بطريقة سهلة
          ومنظمة، مع توفير متابعة مستمرة لحالة الطلب حتى اكتمال الإجراء.
        </p>
        <p className="rounded-xl border border-gold/40 bg-gold-soft/40 p-4 text-primary">
          ريفانس مقدم خدمات تعقيب مستقل، ولا يمثل أي جهة حكومية. تخضع الموافقة على الطلب وإصدار
          الوثيقة للأنظمة والمتطلبات والقرارات الصادرة عن الجهات الرسمية المختصة.
        </p>
      </Prose>
    </>
  );
}
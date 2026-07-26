import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Prose } from "@/components/site/Bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | ريفانس لخدمات التعقيب" },
      {
        name: "description",
        content:
          "ريفانس منشأة متخصصة في خدمات التعقيب ومتابعة المعاملات وإنجاز الإجراءات للأفراد والمنشآت.",
      },
      { property: "og:title", content: "من نحن | ريفانس لخدمات التعقيب" },
      {
        property: "og:description",
        content: "تعرّف على ريفانس ودورها في تعقيب ومتابعة المعاملات حتى اكتمال الخدمة.",
      },
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
          ريفانس منشأة متخصصة في تقديم خدمات التعقيب ومتابعة المعاملات وإنجاز الإجراءات للأفراد
          والمنشآت، من خلال حلول إلكترونية منظمة تساعد العميل على تقديم طلبه ورفع مستنداته ومتابعة
          حالة المعاملة بكل سهولة ووضوح.
        </p>
        <p>
          نعمل على توفير تجربة مريحة وموثوقة، مع الالتزام بسرية البيانات، ووضوح الرسوم، وإبلاغ
          العميل بجميع مستجدات طلبه حتى اكتمال الخدمة.
        </p>
        <p className="rounded-xl border border-gold/40 bg-gold-soft/40 p-4 text-primary">
          ريفانس مقدم خدمات تعقيب مستقل، ولا يمثل أي جهة حكومية. تخضع المعاملات للموافقات
          والمتطلبات والأنظمة الخاصة بالجهات المختصة.
        </p>
      </Prose>
    </>
  );
}
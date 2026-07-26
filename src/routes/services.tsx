import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { PageHeader, Section } from "@/components/site/Bits";
import { ServiceCards } from "@/components/site/ServiceCards";
import { servicesQueryOptions } from "@/lib/services-query";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "خدمات ريفانس | خدمات التعقيب وإنجاز المعاملات" },
      {
        name: "description",
        content:
          "خدمات السجلات التجارية والمنشآت والتراخيص والمنصات الحكومية والمعاملات الإلكترونية والمتابعة والتعقيب من ريفانس.",
      },
      { property: "og:title", content: "خدمات ريفانس" },
      { property: "og:description", content: "تعرف على خدمات التعقيب وإنجاز المعاملات من ريفانس." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQueryOptions),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHeader
        title="خدمات ريفانس"
        sub="نقدم خدمات تعقيب متكاملة للأفراد والمنشآت مع متابعة واضحة لكل معاملة."
      />
      <Section>
        <Suspense fallback={<p className="text-center text-sm">جارٍ التحميل...</p>}>
          <ServiceCards />
        </Suspense>
      </Section>
    </>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, Download, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/site/Bits";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "متابعة الطلب | ريفانس" },
      {
        name: "description",
        content: "تابع حالة طلب إصدار وثيقة توثيق التجارة الإلكترونية برقم الطلب ورمز التحقق.",
      },
      { property: "og:title", content: "متابعة الطلب | ريفانس" },
      { property: "og:description", content: "اطّلع على حالة طلبك ومستنداتك ووثيقتك عند صدورها." },
    ],
  }),
  component: TrackPage,
});

const statuses = [
  "طلب جديد",
  "بانتظار سداد الرسوم",
  "تحت مراجعة فريق التعقيب",
  "مطلوب استكمال بيانات",
  "جاهز للتقديم",
  "تم تقديم الطلب",
  "تحت الإجراء لدى الجهة الرسمية",
  "تمت الموافقة",
  "تم إصدار الوثيقة",
];

const currentIndex = 5;

function TrackPage() {
  const [stage, setStage] = useState<"login" | "otp" | "result">("login");
  const [orderNo, setOrderNo] = useState("");

  return (
    <>
      <PageHeader title="متابعة الطلب" sub="أدخل بيانات طلبك للاطلاع على آخر تحديث لحالته." />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {stage !== "result" && (
          <form
            className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft"
            onSubmit={(e) => {
              e.preventDefault();
              if (stage === "login") {
                setStage("otp");
                toast.success("تم إرسال رمز التحقق إلى جوالك.");
              } else {
                setStage("result");
              }
            }}
          >
            {stage === "login" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order">رقم الطلب</Label>
                  <Input id="order" required value={orderNo} onChange={(e) => setOrderNo(e.target.value)} maxLength={30} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id">رقم الهوية أو الإقامة</Label>
                  <Input id="id" required maxLength={15} />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  إرسال رمز التحقق
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">رمز التحقق المرسل إلى الجوال</Label>
                  <Input id="otp" required inputMode="numeric" maxLength={6} dir="ltr" />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  عرض حالة الطلب
                </Button>
              </div>
            )}
          </form>
        )}

        {stage === "result" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <h2 className="truncate text-lg font-extrabold text-primary">
                  الطلب رقم {orderNo || "RV-00001234"}
                </h2>
                <Badge className="shrink-0">{statuses[currentIndex]}</Badge>
              </div>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["اسم المنشأة", "مؤسسة المتجر الحديث"],
                  ["نوع الخدمة", "إصدار وثيقة توثيق التجارة الإلكترونية"],
                  ["تاريخ تقديم الطلب", "2026-07-20"],
                  ["آخر تحديث", "2026-07-26"],
                  ["الموظف المسؤول", "فريق ريفانس – قسم التعقيب"],
                  ["الفاتورة", "مدفوعة — 499 ريال"],
                ].map(([k, v]) => (
                  <div key={k} className="flex min-w-0 gap-2 text-sm">
                    <dt className="shrink-0 text-muted-foreground">{k}:</dt>
                    <dd className="min-w-0 truncate font-medium text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 rounded-lg bg-muted p-3 text-xs leading-7 text-muted-foreground">
                الملاحظات: تم تقديم طلبك إلى الجهة الرسمية المختصة.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-base font-extrabold text-primary">الخط الزمني للطلب</h3>
              <ol className="mt-5 space-y-1 border-r-2 border-border pr-4">
                {statuses.map((s, i) => (
                  <li key={s} className="relative py-2">
                    <CircleDot
                      className={`absolute -right-[26px] top-3 size-4 ${
                        i <= currentIndex ? "text-gold" : "text-border"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        i === currentIndex
                          ? "font-extrabold text-primary"
                          : i < currentIndex
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {s}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-base font-extrabold text-primary">المستندات</h3>
              <ul className="mt-4 space-y-2">
                {["السجل التجاري — معتمد", "الهوية الوطنية — معتمد", "التفويض — تحت المراجعة"].map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-foreground">
                    <FileText className="size-4 shrink-0 text-gold" />
                    {d}
                  </li>
                ))}
              </ul>
              <Button variant="gold" size="lg" className="mt-6 w-full" disabled>
                <Download /> تحميل وثيقة توثيق التجارة الإلكترونية
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                يفعّل زر التحميل بعد إصدار الوثيقة.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section } from "@/components/site/Bits";
import { trackRequest } from "@/lib/site.functions";
import { REQUEST_STATUSES, statusLabel } from "@/lib/statuses";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "متابعة الطلب | ريفانس لخدمات التعقيب" },
      {
        name: "description",
        content: "تابع حالة معاملتك لدى ريفانس باستخدام رقم الطلب ورقم الجوال ورمز التحقق.",
      },
      { property: "og:title", content: "متابعة الطلب | ريفانس" },
      { property: "og:description", content: "اطّلع على حالة طلبك وآخر تحديث والمستندات والفاتورة." },
    ],
  }),
  component: TrackPage,
});

type TrackResult = Awaited<ReturnType<typeof trackRequest>>;

function TrackPage() {
  const track = useServerFn(trackRequest);
  const [values, setValues] = useState({ order_number: "", phone: "", access_code: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Extract<TrackResult, { found: true }> | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await track({ data: values as never });
      if (!res.found) {
        setResult(null);
        toast.error("لم يتم العثور على طلب مطابق للبيانات المدخلة.");
        return;
      }
      setResult(res);
    } catch {
      toast.error("تعذر جلب بيانات الطلب، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  const fmt = (d?: string | null) =>
    d ? new Date(d).toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" }) : "—";

  return (
    <>
      <PageHeader title="متابعة الطلب" sub="أدخل بيانات طلبك للاطلاع على حالته وآخر تحديث." />
      <Section className="max-w-4xl">
        <form
          onSubmit={onSubmit}
          className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-3"
        >
          <div className="space-y-2">
            <Label htmlFor="order_number">رقم الطلب</Label>
            <Input
              id="order_number"
              required
              dir="ltr"
              value={values.order_number}
              onChange={(e) => setValues((v) => ({ ...v, order_number: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الجوال</Label>
            <Input
              id="phone"
              required
              dir="ltr"
              value={values.phone}
              onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="access_code">رمز التحقق</Label>
            <Input
              id="access_code"
              required
              dir="ltr"
              value={values.access_code}
              onChange={(e) => setValues((v) => ({ ...v, access_code: e.target.value }))}
            />
          </div>
          <Button type="submit" variant="hero" size="lg" className="sm:col-span-3" disabled={loading}>
            <Search /> {loading ? "جارٍ البحث..." : "عرض حالة الطلب"}
          </Button>
        </form>

        {result && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <dl className="grid gap-4 sm:grid-cols-2">
                {[
                  ["رقم الطلب", result.request.order_number],
                  ["اسم الخدمة", result.request.service_title],
                  ["تاريخ الطلب", fmt(result.request.created_at)],
                  ["حالة الطلب", statusLabel(result.request.status)],
                  ["آخر تحديث", fmt(result.request.updated_at)],
                  ["الموظف المسؤول", result.request.assigned_to || "سيتم تحديده"],
                  ["المستندات المطلوبة", result.request.required_documents || "لا توجد متطلبات إضافية"],
                  ["الملاحظات", result.request.admin_notes || "—"],
                  [
                    "الفاتورة",
                    result.request.invoice_amount
                      ? `${result.request.invoice_amount} ريال — ${result.request.invoice_paid ? "مدفوعة" : "غير مدفوعة"}`
                      : "لم تُصدر بعد",
                  ],
                ].map(([k, v]) => (
                  <div key={k as string} className="rounded-xl border border-border p-4">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-sm font-bold text-primary">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-sm font-bold text-primary">مسار حالة الطلب</h2>
              <ol className="mt-4 space-y-3">
                {REQUEST_STATUSES.filter(
                  (s) => !["cancelled", "failed"].includes(s.value) || s.value === result.request.status,
                ).map((s) => (
                  <li key={s.value} className="flex items-center gap-3 text-sm">
                    <span
                      className={`size-2.5 rounded-full ${
                        s.value === result.request.status ? "bg-gold" : "bg-border"
                      }`}
                    />
                    <span
                      className={
                        s.value === result.request.status
                          ? "font-bold text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {s.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-sm font-bold text-primary">المستندات المرفقة</h2>
              {result.documents.length ? (
                <ul className="mt-4 space-y-2">
                  {result.documents.map((d) => (
                    <li key={d.file_name} className="flex items-center gap-2 text-sm text-foreground">
                      <FileText className="size-4 text-gold" /> {d.file_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">لا توجد مستندات مرفقة.</p>
              )}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

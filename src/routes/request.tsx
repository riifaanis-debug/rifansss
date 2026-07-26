import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, CheckCircle2, Upload, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader, Notice } from "@/components/site/Bits";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "تقديم طلب إصدار الوثيقة | ريفانس" },
      {
        name: "description",
        content: "قدّم طلب إصدار وثيقة توثيق التجارة الإلكترونية عبر نموذج ريفانس خلال دقائق.",
      },
      { property: "og:title", content: "تقديم طلب إصدار الوثيقة | ريفانس" },
      { property: "og:description", content: "نموذج متعدد الخطوات لتقديم طلب التوثيق بسهولة." },
    ],
  }),
  component: RequestPage,
});

const stepTitles = [
  "بيانات مقدم الطلب",
  "بيانات المنشأة",
  "بيانات المتجر الإلكتروني",
  "الأنشطة المراد توثيقها",
  "المستندات",
  "المراجعة والموافقة",
];

const activities = [
  { name: "تحصيل الديون", code: "829101", ok: true, supervisor: "—" },
  { name: "أنشطة تجنب المعاملات", code: "829903", ok: true, supervisor: "—" },
  { name: "البيع بالتجزئة عبر الإنترنت", code: "479101", ok: true, supervisor: "وزارة التجارة" },
  { name: "أنشطة استشارية غير مصنفة", code: "702002", ok: false, supervisor: "جهة مختصة" },
];

const docs = [
  "السجل التجاري",
  "الهوية الوطنية أو الإقامة",
  "التفويض (إذا كان مقدم الطلب غير المالك)",
  "شعار المتجر (إن وجد)",
  "أي تراخيص مرتبطة بالنشاط",
  "مستندات إضافية",
];

const docStatuses = ["تم الرفع", "تحت المراجعة", "مطلوب تعديل", "معتمد"] as const;

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} maxLength={200} />
    </div>
  );
}

function RequestPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState<Record<string, string>>({});
  const [storeVerified, setStoreVerified] = useState(false);
  const [agree, setAgree] = useState(false);
  const [signature, setSignature] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const progress = useMemo(() => Math.round(((step + 1) / stepTitles.length) * 100), [step]);

  if (submitted) {
    return (
      <>
        <PageHeader title="تم استلام طلبك لدى ريفانس بنجاح." />
        <div className="mx-auto max-w-xl px-4 py-14 text-center">
          <CheckCircle2 className="mx-auto size-14 text-gold" />
          <p className="mt-5 text-sm leading-8 text-muted-foreground">
            رقم طلبك هو <span className="font-extrabold text-primary">{submitted}</span>، يمكنك
            متابعة حالة الطلب من صفحة متابعة الطلب.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="تقديم طلب إصدار الوثيقة"
        sub="لا يستغرق تعبئة الطلب أكثر من عدة دقائق. جميع بياناتك محفوظة ومحمية لدى ريفانس."
      />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-primary">
              الخطوة {step + 1} من {stepTitles.length}: {stepTitles[step]}
            </span>
            <span className="shrink-0 text-gold">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-3" />
          <div className="mt-4 flex flex-wrap gap-2">
            {stepTitles.map((t, i) => (
              <span
                key={t}
                className={`rounded-full border px-3 py-1 text-[11px] ${
                  i <= step
                    ? "border-gold bg-gold-soft text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {i + 1}. {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الاسم الكامل" id="fullName" value={form.fullName ?? ""} onChange={set("fullName")} />
              <Field label="رقم الهوية أو الإقامة" id="nid" value={form.nid ?? ""} onChange={set("nid")} />
              <Field label="رقم الجوال" id="phone" value={form.phone ?? ""} onChange={set("phone")} />
              <Field label="البريد الإلكتروني" id="email" type="email" value={form.email ?? ""} onChange={set("email")} />
              <Field label="المدينة" id="city" value={form.city ?? ""} onChange={set("city")} />
              <div className="space-y-2">
                <Label>صفة مقدم الطلب</Label>
                <Select value={form.role} onValueChange={set("role")}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الصفة" />
                  </SelectTrigger>
                  <SelectContent>
                    {["مالك المنشأة", "مفوض", "مدير المنشأة"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="اسم المنشأة" id="company" value={form.company ?? ""} onChange={set("company")} />
              <Field label="الرقم الموحد للمنشأة" id="unified" value={form.unified ?? ""} onChange={set("unified")} />
              <Field label="رقم السجل التجاري" id="cr" value={form.cr ?? ""} onChange={set("cr")} />
              <Field label="تاريخ إصدار السجل" id="crStart" type="date" value={form.crStart ?? ""} onChange={set("crStart")} />
              <Field label="تاريخ انتهاء السجل" id="crEnd" type="date" value={form.crEnd ?? ""} onChange={set("crEnd")} />
              <div className="space-y-2">
                <Label>نوع الكيان</Label>
                <Select value={form.entity} onValueChange={set("entity")}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الكيان" />
                  </SelectTrigger>
                  <SelectContent>
                    {["مؤسسة فردية", "شركة ذات مسؤولية محدودة", "شركة مساهمة", "أخرى"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>حالة السجل التجاري</Label>
                <Select value={form.crStatus} onValueChange={set("crStatus")}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    {["ساري", "منتهي", "موقوف"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="crFile">رفع صورة السجل التجاري</Label>
                <Input id="crFile" type="file" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="اسم المتجر الإلكتروني" id="storeName" value={form.storeName ?? ""} onChange={set("storeName")} />
              <Field label="رابط المتجر الإلكتروني" id="storeUrl" value={form.storeUrl ?? ""} onChange={(v) => { setStoreVerified(false); set("storeUrl")(v); }} />
              <Field label="روابط حسابات التواصل (إن وجدت)" id="social" value={form.social ?? ""} onChange={set("social")} />
              <div className="space-y-2">
                <Label>منصة المتجر</Label>
                <Select value={form.platform} onValueChange={set("platform")}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنصة" />
                  </SelectTrigger>
                  <SelectContent>
                    {["سلة", "زد", "شوبيفاي", "ووردبريس", "متجر مبرمج", "أخرى"].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="desc">وصف مختصر لنشاط المتجر</Label>
                <Textarea id="desc" rows={4} maxLength={1000} value={form.desc ?? ""} onChange={(e) => set("desc")(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="button"
                  variant="goldOutline"
                  onClick={() => {
                    if (!form.storeUrl) {
                      toast.error("يرجى إدخال رابط المتجر أولًا.");
                      return;
                    }
                    setStoreVerified(true);
                    toast.success("تم التحقق من رابط المتجر بنجاح.");
                  }}
                >
                  التحقق من رابط المتجر
                </Button>
                {storeVerified && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary">
                    <CheckCircle2 className="size-4 text-gold" /> تم التحقق من رابط المتجر بنجاح.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {activities.map((a) => {
                  const checked = selected.includes(a.code);
                  return (
                    <label
                      key={a.code}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                        checked ? "border-gold bg-gold-soft/40" : "border-border bg-card"
                      } ${a.ok ? "" : "opacity-60"}`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={!a.ok}
                        onCheckedChange={(v) =>
                          setSelected((s) => (v ? [...s, a.code] : s.filter((c) => c !== a.code)))
                        }
                        className="mt-1"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-primary">{a.name}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          رمز النشاط: {a.code}
                        </span>
                        <span className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge variant={a.ok ? "default" : "secondary"}>
                            {a.ok ? "قابل للتوثيق" : "غير قابل للتوثيق"}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            الجهات المشرفة: {a.supervisor}
                          </span>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <Notice>
                يتم عرض الأنشطة وفقًا للبيانات التي يقدمها العميل، وتخضع الموافقة النهائية للتحقق من
                الجهة الرسمية.
              </Notice>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">الصيغ المقبولة: PDF، JPG، PNG</p>
              {docs.map((d) => (
                <div
                  key={d}
                  className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-primary">{d}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      الحالة: {uploaded[d] ?? "لم يتم الرفع"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="max-w-[190px]"
                      onChange={() =>
                        setUploaded((u) => ({ ...u, [d]: docStatuses[0] }))
                      }
                    />
                    <Upload className="size-4 text-gold" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-border p-4">
                <h3 className="text-sm font-extrabold text-primary">ملخص الطلب</h3>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    ["الاسم الكامل", form.fullName],
                    ["رقم الهوية", form.nid],
                    ["الجوال", form.phone],
                    ["البريد الإلكتروني", form.email],
                    ["المنشأة", form.company],
                    ["السجل التجاري", form.cr],
                    ["المتجر", form.storeName],
                    ["رابط المتجر", form.storeUrl],
                    ["المنصة", form.platform],
                    ["الأنشطة المختارة", selected.join("، ")],
                  ].map(([k, v]) => (
                    <div key={k} className="flex min-w-0 gap-2 text-sm">
                      <dt className="shrink-0 text-muted-foreground">{k}:</dt>
                      <dd className="min-w-0 truncate font-medium text-foreground">{v || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-gold/40 bg-gold-soft/30 p-4">
                <Checkbox checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} className="mt-1" />
                <span className="text-xs leading-7 text-primary">
                  أقر بصحة البيانات والمستندات المقدمة، وأفوض مقدم الخدمة في متابعة وتنفيذ إجراءات
                  طلب إصدار وثيقة توثيق التجارة الإلكترونية من خلال المنصات الرسمية، وأوافق على
                  سياسة الخصوصية والشروط والأحكام.
                </span>
              </label>

              <div className="space-y-2">
                <Label htmlFor="sig">التوقيع الإلكتروني (اكتب اسمك الكامل)</Label>
                <Input id="sig" value={signature} onChange={(e) => setSignature(e.target.value)} maxLength={100} />
              </div>

              <Notice>
                ريفانس مقدم خدمات تعقيب مستقل، ولا يمثل أي جهة حكومية. رسوم التعقيب مستقلة عن أي
                رسوم حكومية.
              </Notice>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              السابق
            </Button>

            {step < stepTitles.length - 1 ? (
              <Button type="button" variant="hero" onClick={() => setStep((s) => s + 1)}>
                التالي
              </Button>
            ) : (
              <Button
                type="button"
                variant="gold"
                onClick={() => {
                  if (!agree) return toast.error("يرجى الموافقة على الإقرار والتفويض.");
                  if (!signature.trim()) return toast.error("يرجى إدخال التوقيع الإلكتروني.");
                  setConfirmOpen(true);
                }}
              >
                إرسال الطلب والدفع
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-gold" /> بياناتك مشفّرة ومحفوظة لدى ريفانس.
        </p>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد إرسال الطلب</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم إرسال طلبك إلى فريق ريفانس والانتقال إلى صفحة الدفع. هل تريد المتابعة؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const id = `RV-${Date.now().toString().slice(-8)}`;
                setSubmitted(id);
                toast.success("تم استلام طلبك لدى ريفانس بنجاح.");
              }}
            >
              <Check className="size-4" /> تأكيد وإرسال
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
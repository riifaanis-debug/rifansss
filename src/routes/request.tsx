import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, Section } from "@/components/site/Bits";
import { servicesQueryOptions } from "@/lib/services-query";
import { submitServiceRequest, uploadRequestDocument } from "@/lib/site.functions";
import { CLIENT_TYPES, CONTACT_METHODS } from "@/lib/statuses";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("read error"));
    reader.readAsDataURL(file);
  });
}

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "اطلب خدمتك | ريفانس لخدمات التعقيب" },
      {
        name: "description",
        content:
          "قدّم طلب خدمة التعقيب لدى ريفانس: بياناتك، الخدمة المطلوبة، الجهة، وصف الطلب والمستندات.",
      },
      { property: "og:title", content: "اطلب خدمتك | ريفانس" },
      { property: "og:description", content: "نموذج طلب خدمات التعقيب وإنجاز المعاملات." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQueryOptions),
  component: RequestPage,
});

type Doc = { file_name: string; file_path: string };

function RequestPage() {
  const { service } = Route.useSearch();
  const navigate = useNavigate();
  const { data: services } = useSuspenseQuery(servicesQueryOptions);
  const submit = useServerFn(submitServiceRequest);
  const uploadDoc = useServerFn(uploadRequestDocument);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    city: "",
    client_type: "individual",
    service_id: service ?? "",
    entity_name: "",
    transaction_number: "",
    details: "",
    preferred_contact: "phone",
  });
  const [docs, setDocs] = useState<Doc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ order_number: string; access_code: string } | null>(null);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: Doc[] = [];
      for (const file of Array.from(files).slice(0, 10 - docs.length)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`حجم الملف ${file.name} يتجاوز 10 ميجابايت.`);
          continue;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`نوع الملف ${file.name} غير مدعوم (PDF أو صورة فقط).`);
          continue;
        }
        try {
          const content = await fileToBase64(file);
          const saved = await uploadDoc({
            data: { file_name: file.name, content_type: file.type, content } as never,
          });
          uploaded.push({ file_name: saved.file_name, file_path: saved.file_path });
        } catch {
          toast.error(`تعذر رفع الملف ${file.name}`);
        }
      }
      setDocs((d) => [...d, ...uploaded]);
      if (uploaded.length) toast.success("تم رفع المستندات بنجاح.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.service_id) return toast.error("يرجى اختيار الخدمة المطلوبة.");
    if (!agree) return toast.error("يرجى الموافقة على الشروط وسياسة الخصوصية.");
    setSending(true);
    try {
      const res = await submit({ data: { ...form, documents: docs } as never });
      setResult(res);
      toast.success("تم استلام طلبك لدى ريفانس بنجاح، وسيتم التواصل معك بعد مراجعة البيانات.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("تعذر إرسال الطلب، يرجى التحقق من البيانات والمحاولة مرة أخرى.");
    } finally {
      setSending(false);
    }
  }

  if (result) {
    return (
      <>
        <PageHeader title="تم استلام طلبك" />
        <Section className="max-w-2xl">
          <div className="rounded-2xl border border-gold/40 bg-card p-8 text-center shadow-soft">
            <CheckCircle2 className="mx-auto size-12 text-gold" />
            <p className="mt-4 text-sm leading-8 text-foreground">
              تم استلام طلبك لدى ريفانس بنجاح، وسيتم التواصل معك بعد مراجعة البيانات.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">رقم الطلب</p>
                <p className="mt-1 text-lg font-extrabold text-primary" dir="ltr">
                  {result.order_number}
                </p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground">رمز التحقق</p>
                <p className="mt-1 text-lg font-extrabold text-primary" dir="ltr">
                  {result.access_code}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              احتفظ برقم الطلب ورمز التحقق لمتابعة حالة طلبك.
            </p>
            <Button
              variant="hero"
              size="lg"
              className="mt-6 w-full"
              onClick={() => navigate({ to: "/track" })}
            >
              متابعة الطلب
            </Button>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="اطلب خدمتك"
        sub="عبّئ بيانات الطلب وارفق المستندات، وسيتواصل معك فريق ريفانس بعد المراجعة."
      />
      <Section className="max-w-3xl">
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الاسم الكامل" id="full_name" value={form.full_name} onChange={set("full_name")} required />
            <Field label="رقم الجوال" id="phone" value={form.phone} onChange={set("phone")} required />
            <Field label="البريد الإلكتروني" id="email" type="email" value={form.email} onChange={set("email")} />
            <Field label="المدينة" id="city" value={form.city} onChange={set("city")} required />

            <div className="space-y-2">
              <Label>نوع العميل</Label>
              <Select value={form.client_type} onValueChange={set("client_type")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_TYPES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>الخدمة المطلوبة</Label>
              <Select value={form.service_id} onValueChange={set("service_id")}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Field label="اسم الجهة المرتبطة بالمعاملة" id="entity_name" value={form.entity_name} onChange={set("entity_name")} />
            <Field label="رقم المعاملة (إن وجد)" id="transaction_number" value={form.transaction_number} onChange={set("transaction_number")} />

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="details">وصف الطلب</Label>
              <Textarea
                id="details"
                rows={5}
                maxLength={2000}
                value={form.details}
                onChange={(e) => set("details")(e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>المستندات</Label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground hover:border-gold">
                <Upload className="size-4" />
                {uploading ? "جارٍ الرفع..." : "اختر الملفات (PDF أو صور، حتى 10 ميجابايت للملف)"}
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>
              {docs.length > 0 && (
                <ul className="space-y-2">
                  {docs.map((d) => (
                    <li
                      key={d.file_path}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <span className="truncate">{d.file_name}</span>
                      <button
                        type="button"
                        aria-label="حذف الملف"
                        onClick={() => setDocs((x) => x.filter((f) => f.file_path !== d.file_path))}
                      >
                        <X className="size-4 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>طريقة التواصل المفضلة</Label>
              <Select value={form.preferred_contact} onValueChange={set("preferred_contact")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_METHODS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <label className="mt-6 flex items-start gap-3 text-sm leading-7 text-foreground">
            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} className="mt-1" />
            <span>أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بريفانس.</span>
          </label>

          <Button type="submit" variant="hero" size="lg" className="mt-6 w-full" disabled={sending || uploading}>
            {sending ? "جارٍ الإرسال..." : "إرسال الطلب"}
          </Button>
        </form>
      </Section>
    </>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

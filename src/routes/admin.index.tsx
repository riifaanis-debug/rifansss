import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Download, LogOut, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, Section } from "@/components/site/Bits";
import { supabase } from "@/integrations/supabase/client";
import {
  adminOverview,
  adminUpdateRequest,
  adminSaveService,
  adminDeleteService,
  adminDocumentUrl,
  adminMarkMessageRead,
} from "@/lib/admin.functions";
import { REQUEST_STATUSES, statusLabel, clientTypeLabel, contactMethodLabel } from "@/lib/statuses";
import { ICON_NAMES } from "@/components/site/ServiceIcon";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | ريفانس لخدمات التعقيب" },
      { name: "description", content: "إدارة الطلبات والخدمات والعملاء والفواتير والمستندات." },
      { property: "og:title", content: "لوحة الإدارة | ريفانس" },
      { property: "og:description", content: "لوحة تحكم فريق ريفانس." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const overview = useServerFn(adminOverview);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/admin/login" });
      else setReady(true);
    });
  }, [navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => overview(),
    enabled: ready,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-overview"] });

  if (!ready || isLoading) {
    return (
      <Section>
        <p className="text-center text-sm text-muted-foreground">جارٍ التحميل...</p>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="max-w-lg">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-foreground">
            لا تملك صلاحية الوصول إلى لوحة الإدارة، أو انتهت الجلسة.
          </p>
          <Button
            variant="hero"
            className="mt-4"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin/login" });
            }}
          >
            تسجيل الخروج
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <>
      <PageHeader title="لوحة إدارة ريفانس" sub="إدارة الطلبات والخدمات والفواتير والمستندات والرسائل." />
      <Section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="إجمالي الطلبات" value={data!.requests.length} />
            <Stat
              label="طلبات قيد العمل"
              value={data!.requests.filter((r: any) => !["completed", "cancelled", "failed"].includes(r.status)).length}
            />
            <Stat label="رسائل غير مقروءة" value={data!.messages.filter((m: any) => !m.is_read).length} />
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/admin/login" });
            }}
          >
            <LogOut /> خروج
          </Button>
        </div>

        <Tabs defaultValue="requests">
          <TabsList className="flex-wrap">
            <TabsTrigger value="requests">الطلبات والعملاء</TabsTrigger>
            <TabsTrigger value="services">الخدمات</TabsTrigger>
            <TabsTrigger value="messages">الرسائل</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6 space-y-4">
            {data!.requests.length === 0 && (
              <p className="text-sm text-muted-foreground">لا توجد طلبات حتى الآن.</p>
            )}
            {data!.requests.map((r: any) => (
              <RequestCard
                key={r.id}
                request={r}
                documents={data!.documents.filter((d: any) => d.request_id === r.id)}
                onSaved={refresh}
              />
            ))}
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <ServicesManager services={data!.services} onSaved={refresh} />
          </TabsContent>

          <TabsContent value="messages" className="mt-6 space-y-3">
            {data!.messages.length === 0 && (
              <p className="text-sm text-muted-foreground">لا توجد رسائل.</p>
            )}
            {data!.messages.map((m: any) => (
              <MessageCard key={m.id} message={m} onSaved={refresh} />
            ))}
          </TabsContent>
        </Tabs>
      </Section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-extrabold text-primary">{value}</p>
    </div>
  );
}

function RequestCard({
  request,
  documents,
  onSaved,
}: {
  request: any;
  documents: any[];
  onSaved: () => void;
}) {
  const update = useServerFn(adminUpdateRequest);
  const docUrl = useServerFn(adminDocumentUrl);
  const [form, setForm] = useState({
    status: request.status as string,
    admin_notes: request.admin_notes ?? "",
    required_documents: request.required_documents ?? "",
    assigned_to: request.assigned_to ?? "",
    invoice_amount: request.invoice_amount != null ? String(request.invoice_amount) : "",
    invoice_paid: Boolean(request.invoice_paid),
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await update({
        data: {
          id: request.id,
          status: form.status,
          admin_notes: form.admin_notes,
          required_documents: form.required_documents,
          assigned_to: form.assigned_to,
          invoice_amount: form.invoice_amount ? Number(form.invoice_amount) : null,
          invoice_paid: form.invoice_paid,
        } as never,
      });
      toast.success("تم تحديث الطلب.");
      onSaved();
    } catch {
      toast.error("تعذر تحديث الطلب.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-extrabold text-primary" dir="ltr">
            {request.order_number}
          </p>
          <p className="text-xs text-muted-foreground">{request.service_title}</p>
        </div>
        <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-primary">
          {statusLabel(request.status)}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["العميل", request.full_name],
          ["نوع العميل", clientTypeLabel(request.client_type)],
          ["الجوال", request.phone],
          ["البريد", request.email || "—"],
          ["المدينة", request.city],
          ["الجهة", request.entity_name || "—"],
          ["رقم المعاملة", request.transaction_number || "—"],
          ["التواصل المفضل", contactMethodLabel(request.preferred_contact)],
          ["رمز التحقق", request.access_code],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-lg border border-border p-3">
            <dt className="text-[11px] text-muted-foreground">{k}</dt>
            <dd className="mt-1 font-medium text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      {request.details && (
        <p className="mt-3 rounded-lg bg-muted/60 p-3 text-sm leading-7 text-foreground">
          {request.details}
        </p>
      )}

      {documents.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {documents.map((d) => (
            <Button
              key={d.id}
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const { url } = await docUrl({ data: { path: d.file_path } as never });
                  window.open(url, "_blank", "noopener");
                } catch {
                  toast.error("تعذر فتح المستند.");
                }
              }}
            >
              <Download /> {d.file_name}
            </Button>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>حالة الطلب</Label>
          <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REQUEST_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>الموظف المسؤول</Label>
          <Input value={form.assigned_to} onChange={(e) => setForm((f) => ({ ...f, assigned_to: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>قيمة الفاتورة (ريال)</Label>
          <Input
            inputMode="decimal"
            value={form.invoice_amount}
            onChange={(e) => setForm((f) => ({ ...f, invoice_amount: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-3 pt-7">
          <Switch
            checked={form.invoice_paid}
            onCheckedChange={(v) => setForm((f) => ({ ...f, invoice_paid: v }))}
          />
          <span className="text-sm">تم سداد الفاتورة</span>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>المستندات المطلوبة من العميل</Label>
          <Textarea
            rows={2}
            value={form.required_documents}
            onChange={(e) => setForm((f) => ({ ...f, required_documents: e.target.value }))}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>ملاحظات تظهر للعميل</Label>
          <Textarea
            rows={3}
            value={form.admin_notes}
            onChange={(e) => setForm((f) => ({ ...f, admin_notes: e.target.value }))}
          />
        </div>
      </div>

      <Button variant="hero" className="mt-4" onClick={save} disabled={saving}>
        {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
      </Button>
    </div>
  );
}

const emptyService = {
  id: undefined as string | undefined,
  title: "",
  description: "",
  icon: "FileText",
  price: "",
  sort_order: "0",
  is_active: true,
};

function ServicesManager({ services, onSaved }: { services: any[]; onSaved: () => void }) {
  const save = useServerFn(adminSaveService);
  const remove = useServerFn(adminDeleteService);
  const [draft, setDraft] = useState(emptyService);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await save({
        data: {
          id: draft.id,
          title: draft.title,
          description: draft.description,
          icon: draft.icon,
          price: draft.price ? Number(draft.price) : null,
          sort_order: Number(draft.sort_order || 0),
          is_active: draft.is_active,
        } as never,
      });
      toast.success("تم حفظ الخدمة.");
      setDraft(emptyService);
      onSaved();
    } catch {
      toast.error("تعذر حفظ الخدمة.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h2 className="text-sm font-bold text-primary">
          {draft.id ? "تعديل خدمة" : "إضافة خدمة جديدة"}
        </h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>اسم الخدمة</Label>
            <Input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>الوصف</Label>
            <Textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>الأيقونة</Label>
              <Select value={draft.icon} onValueChange={(v) => setDraft({ ...draft, icon: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_NAMES.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>الرسوم (اختياري)</Label>
              <Input inputMode="decimal" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>الترتيب</Label>
              <Input inputMode="numeric" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={draft.is_active} onCheckedChange={(v) => setDraft({ ...draft, is_active: v })} />
            <span className="text-sm">الخدمة ظاهرة في الموقع</span>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <Button type="submit" variant="hero" disabled={saving}>
            <Plus /> {saving ? "جارٍ الحفظ..." : "حفظ"}
          </Button>
          {draft.id && (
            <Button type="button" variant="outline" onClick={() => setDraft(emptyService)}>
              إلغاء التعديل
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary">{s.title}</p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">{s.description}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  الترتيب: {s.sort_order} — {s.is_active ? "ظاهرة" : "مخفية"}
                  {s.price != null ? ` — ${s.price} ريال` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setDraft({
                      id: s.id,
                      title: s.title,
                      description: s.description ?? "",
                      icon: s.icon,
                      price: s.price != null ? String(s.price) : "",
                      sort_order: String(s.sort_order),
                      is_active: s.is_active,
                    })
                  }
                >
                  تعديل
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  aria-label="حذف"
                  onClick={async () => {
                    if (!confirm("سيتم حذف الخدمة نهائيًا. هل أنت متأكد؟")) return;
                    try {
                      await remove({ data: { id: s.id } as never });
                      toast.success("تم حذف الخدمة.");
                      onSaved();
                    } catch {
                      toast.error("تعذر حذف الخدمة.");
                    }
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageCard({ message, onSaved }: { message: any; onSaved: () => void }) {
  const markRead = useServerFn(adminMarkMessageRead);
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-primary">
          {message.name} — <span dir="ltr">{message.phone}</span>
        </p>
        {!message.is_read && (
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await markRead({ data: { id: message.id } as never });
              onSaved();
            }}
          >
            تعليم كمقروء
          </Button>
        )}
      </div>
      {message.subject && <p className="mt-1 text-xs text-muted-foreground">{message.subject}</p>}
      <p className="mt-2 text-sm leading-7 text-foreground">{message.message}</p>
    </div>
  );
}

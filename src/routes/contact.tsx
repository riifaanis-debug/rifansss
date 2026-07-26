import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Mail, Phone, MessageCircle, MapPin, Clock, Instagram, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Section } from "@/components/site/Bits";
import { submitContactMessage } from "@/lib/site.functions";
import { CONTACT_INFO } from "@/lib/content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | ريفانس لخدمات التعقيب" },
      {
        name: "description",
        content: "تواصل مع فريق ريفانس عبر الهاتف أو واتساب أو البريد الإلكتروني خلال ساعات العمل.",
      },
      { property: "og:title", content: "تواصل معنا | ريفانس" },
      { property: "og:description", content: "فريق ريفانس جاهز للإجابة على استفساراتك." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const send = useServerFn(submitContactMessage);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await send({ data: form as never });
      toast.success("تم استلام رسالتك لدى ريفانس بنجاح، وسيتم التواصل معك قريبًا.");
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("تعذر إرسال الرسالة، يرجى المحاولة مرة أخرى.");
    } finally {
      setSending(false);
    }
  }

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <>
      <PageHeader title="تواصل معنا" sub="نسعد بخدمتك والإجابة على استفساراتك خلال ساعات العمل." />
      <Section className="max-w-5xl">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input id="name" required maxLength={100} value={form.name} onChange={(e) => set("name")(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الجوال</Label>
                <Input id="phone" required inputMode="tel" maxLength={15} value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" maxLength={160} value={form.email} onChange={(e) => set("email")(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">الموضوع</Label>
                <Input id="subject" maxLength={160} value={form.subject} onChange={(e) => set("subject")(e.target.value)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="msg">الرسالة</Label>
                <Textarea id="msg" required maxLength={2000} rows={5} value={form.message} onChange={(e) => set("message")(e.target.value)} />
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="mt-5 w-full" disabled={sending}>
              {sending ? "جارٍ الإرسال..." : "إرسال الرسالة"}
            </Button>
          </form>

          <div className="space-y-3">
            {[
              { icon: Phone, label: "الجوال", value: CONTACT_INFO.phone, ltr: true },
              { icon: MessageCircle, label: "واتساب", value: CONTACT_INFO.whatsapp, ltr: true },
              { icon: Mail, label: "البريد الإلكتروني", value: CONTACT_INFO.email, ltr: true },
              { icon: MapPin, label: "المدينة", value: CONTACT_INFO.city },
              { icon: Clock, label: "ساعات العمل", value: CONTACT_INFO.hours },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold-soft">
                  <c.icon className="size-4 text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="truncate text-sm font-bold text-primary" dir={c.ltr ? "ltr" : undefined}>
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">حسابات التواصل الاجتماعي</p>
              <div className="mt-3 flex gap-2">
                {[
                  { icon: Twitter, label: "X", href: "https://x.com" },
                  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid size-10 place-items-center rounded-lg border border-border text-primary hover:bg-gold-soft"
                  >
                    <s.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

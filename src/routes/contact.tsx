import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, Section } from "@/components/site/Bits";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | ريفانس" },
      { name: "description", content: "تواصل مع فريق ريفانس عبر الهاتف أو واتساب أو البريد الإلكتروني." },
      { property: "og:title", content: "تواصل معنا | ريفانس" },
      { property: "og:description", content: "فريق ريفانس جاهز للإجابة على استفساراتك." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  return (
    <>
      <PageHeader title="تواصل معنا" sub="نسعد بخدمتك والإجابة على استفساراتك خلال ساعات العمل." />
      <Section className="max-w-5xl">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <form
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            onSubmit={(e) => {
              e.preventDefault();
              setSending(true);
              setTimeout(() => {
                setSending(false);
                toast.success("تم استلام رسالتك لدى ريفانس بنجاح.");
                (e.target as HTMLFormElement).reset();
              }, 700);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input id="name" required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الجوال</Label>
                <Input id="phone" required inputMode="tel" maxLength={15} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" required maxLength={255} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="msg">الرسالة</Label>
                <Textarea id="msg" required maxLength={1000} rows={5} />
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="mt-5 w-full" disabled={sending}>
              {sending ? "جارٍ الإرسال..." : "إرسال الرسالة"}
            </Button>
          </form>

          <div className="space-y-3">
            {[
              { icon: Phone, label: "الجوال", value: "+966 55 000 0000" },
              { icon: MessageCircle, label: "واتساب", value: "+966 55 000 0000" },
              { icon: Mail, label: "البريد الإلكتروني", value: "info@rivance.sa" },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold-soft">
                  <c.icon className="size-4 text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="truncate text-sm font-bold text-primary" dir="ltr">
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
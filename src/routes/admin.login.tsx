import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Section } from "@/components/site/Bits";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "دخول لوحة الإدارة | ريفانس" },
      { name: "description", content: "تسجيل دخول فريق ريفانس إلى لوحة إدارة الطلبات والخدمات." },
      { property: "og:title", content: "دخول لوحة الإدارة | ريفانس" },
      { property: "og:description", content: "لوحة إدارة ريفانس لخدمات التعقيب." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب. يمكنك تسجيل الدخول الآن.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر إتمام العملية");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="لوحة إدارة ريفانس" sub="الدخول مخصص لفريق العمل المصرح له فقط." />
      <Section className="max-w-md">
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" dir="ltr" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <Button type="submit" variant="hero" size="lg" className="mt-6 w-full" disabled={loading}>
            {loading ? "جارٍ المعالجة..." : mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
          </Button>
          <button
            type="button"
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-primary"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "إنشاء حساب جديد لفريق العمل" : "لدي حساب بالفعل"}
          </button>
        </form>
      </Section>
    </>
  );
}

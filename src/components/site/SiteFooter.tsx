import { Link } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle, CreditCard, MapPin, Headset } from "lucide-react";
import { CONTACT_INFO, COMPANY_INFO } from "@/lib/content";

const pages = [
  { to: "/services", label: "خدماتنا" },
  { to: "/about", label: "من نحن" },
  { to: "/how-it-works", label: "آلية العمل" },
  { to: "/request", label: "اطلب خدمتك" },
  { to: "/faq", label: "الأسئلة الشائعة" },
  { to: "/track", label: "متابعة الطلب" },
] as const;

const legal = [
  { to: "/privacy", label: "سياسة الخصوصية" },
  { to: "/terms", label: "الشروط والأحكام" },
  { to: "/refund", label: "سياسة الاسترجاع والإلغاء" },
  { to: "/disclaimer", label: "إخلاء المسؤولية" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 surface-royal">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-extrabold text-gold">
            ريفانس لخدمات التعقيب وإنجاز المعاملات
          </h3>
          <p className="mt-3 text-sm leading-7 text-primary-foreground/80">
            ريفانس مقدم خدمات تعقيب مستقل، ولا يمثل أي جهة حكومية. تخضع المعاملات للموافقات
            والمتطلبات والأنظمة الخاصة بالجهات المختصة.
          </p>
          <p className="mt-4 text-xs leading-6 text-primary-foreground/70">
            السجل التجاري: {COMPANY_INFO.crNumber} — الرقم الوطني الموحد:{" "}
            {COMPANY_INFO.unifiedNumber}
            <br />
            عضوية {COMPANY_INFO.chamberName}: {COMPANY_INFO.chamberMembership}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gold">روابط مهمة</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            {pages.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="hover:text-gold">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gold">الصفحات النظامية</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            {legal.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="hover:text-gold">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gold">تواصل معنا</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-gold" />
              <span dir="ltr">{CONTACT_INFO.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4 shrink-0 text-gold" />
              <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noreferrer" dir="ltr" className="hover:text-gold">
                {CONTACT_INFO.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Headset className="size-4 shrink-0 text-gold" />
              <span dir="ltr">{CONTACT_INFO.support}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-gold" />
              <span dir="ltr">{CONTACT_INFO.email}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span className="leading-6">
                {CONTACT_INFO.city}
                <br />
                {CONTACT_INFO.address}
              </span>
            </li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-primary-foreground/80">
            {["مدى", "Apple Pay", "Visa", "Mastercard", "تحويل بنكي"].map((m) => (
              <span
                key={m}
                className="flex items-center gap-1 rounded-md border border-gold/40 px-2 py-1"
              >
                <CreditCard className="size-3 text-gold" />
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gold/20 py-5 text-center text-xs text-primary-foreground/70">
        © 2026 ريفانس. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
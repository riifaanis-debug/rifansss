export const REQUEST_STATUSES = [
  { value: "new", label: "طلب جديد" },
  { value: "under_review", label: "تحت المراجعة" },
  { value: "needs_info", label: "مطلوب استكمال بيانات" },
  { value: "awaiting_payment", label: "بانتظار الدفع" },
  { value: "in_progress", label: "جاري التنفيذ" },
  { value: "following_up", label: "تحت المتابعة" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
  { value: "failed", label: "متعذر التنفيذ" },
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number]["value"];

export function statusLabel(value: string) {
  return REQUEST_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export const CLIENT_TYPES = [
  { value: "individual", label: "فرد" },
  { value: "establishment", label: "مؤسسة" },
  { value: "company", label: "شركة" },
] as const;

export function clientTypeLabel(value: string) {
  return CLIENT_TYPES.find((c) => c.value === value)?.label ?? value;
}

export const CONTACT_METHODS = [
  { value: "phone", label: "اتصال هاتفي" },
  { value: "whatsapp", label: "واتساب" },
  { value: "email", label: "البريد الإلكتروني" },
] as const;

export function contactMethodLabel(value: string) {
  return CONTACT_METHODS.find((c) => c.value === value)?.label ?? value;
}
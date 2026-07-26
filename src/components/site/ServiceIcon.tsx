import {
  Activity,
  BadgeCheck,
  Building2,
  FileText,
  Landmark,
  Laptop,
  ClipboardList,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Activity,
  BadgeCheck,
  Building2,
  FileText,
  Landmark,
  Laptop,
  ClipboardList,
  ShieldCheck,
};

export const ICON_NAMES = Object.keys(icons);

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? FileText;
  return <Icon className={className} />;
}
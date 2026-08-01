import { z } from "zod";

export const requestSchema = z.object({
  full_name: z.string().trim().min(3).max(120),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  client_type: z.enum(["individual", "establishment", "company"]),
  service_id: z.string().uuid(),
  entity_name: z.string().trim().max(160).optional().or(z.literal("")),
  transaction_number: z.string().trim().max(80).optional().or(z.literal("")),
  details: z.string().trim().max(2000).optional().or(z.literal("")),
  preferred_contact: z.enum(["phone", "whatsapp", "email"]),
  documents: z
    .array(z.object({ file_name: z.string().max(200), file_path: z.string().max(400) }))
    .max(10)
    .default([]),
});

export const contactSchema = z.object({
  name: z.string().trim().min(3).max(120),
  phone: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
});

export const trackSchema = z.object({
  order_number: z.string().trim().min(4).max(40),
  phone: z.string().trim().min(8).max(20),
  access_code: z.string().trim().min(4).max(12),
});

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(600).default(""),
  icon: z.string().trim().max(40).default("FileText"),
  price: z.number().nonnegative().nullable().optional(),
  sort_order: z.number().int().min(0).max(999).default(0),
  is_active: z.boolean().default(true),
});

export const updateRequestSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "new",
    "under_review",
    "needs_info",
    "awaiting_payment",
    "in_progress",
    "following_up",
    "completed",
    "cancelled",
    "failed",
  ]),
  admin_notes: z.string().max(2000).optional().or(z.literal("")),
  required_documents: z.string().max(1000).optional().or(z.literal("")),
  assigned_to: z.string().max(120).optional().or(z.literal("")),
  invoice_amount: z.number().nonnegative().nullable().optional(),
  invoice_paid: z.boolean().default(false),
});

export const idSchema = z.object({ id: z.string().uuid() });
export const pathSchema = z.object({ path: z.string().max(400) });

export const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const uploadDocumentSchema = z.object({
  file_name: z.string().trim().min(1).max(200),
  content_type: z.enum(ALLOWED_DOC_TYPES),
  // base64 payload, max ~10MB binary
  content: z.string().min(1).max(14_000_000),
});
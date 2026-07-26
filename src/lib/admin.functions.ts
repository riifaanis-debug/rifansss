import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(600).default(""),
  icon: z.string().trim().max(40).default("FileText"),
  price: z.number().nonnegative().nullable().optional(),
  sort_order: z.number().int().min(0).max(999).default(0),
  is_active: z.boolean().default(true),
});

const updateRequestSchema = z.object({
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

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data) };
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [requests, services, messages] = await Promise.all([
      supabaseAdmin
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300),
      supabaseAdmin.from("services").select("*").order("sort_order", { ascending: true }),
      supabaseAdmin
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    const { data: docs } = await supabaseAdmin
      .from("request_documents")
      .select("id, request_id, file_name, file_path, created_at");
    return {
      requests: requests.data ?? [],
      services: services.data ?? [],
      messages: messages.data ?? [],
      documents: docs ?? [],
    };
  });

export const adminUpdateRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => updateRequestSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("service_requests")
      .update({
        status: data.status,
        admin_notes: data.admin_notes || null,
        required_documents: data.required_documents || null,
        assigned_to: data.assigned_to || null,
        invoice_amount: data.invoice_amount ?? null,
        invoice_paid: data.invoice_paid,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSaveService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => serviceSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      title: data.title,
      description: data.description,
      icon: data.icon,
      price: data.price ?? null,
      sort_order: data.sort_order,
      is_active: data.is_active,
    };
    const { error } = data.id
      ? await supabaseAdmin.from("services").update(payload).eq("id", data.id)
      : await supabaseAdmin.from("services").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDocumentUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ path: z.string().max(400) }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("request-documents")
      .createSignedUrl(data.path, 300);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });

export const adminMarkMessageRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
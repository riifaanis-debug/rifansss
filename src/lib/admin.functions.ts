import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminUser } from "@/lib/admin-guard";
import { serviceSchema, updateRequestSchema, idSchema, pathSchema } from "@/lib/schemas";

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const allowed = await isAdminUser(context.supabase, context.userId);
    return { isAdmin: allowed };
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const allowed = await isAdminUser(context.supabase, context.userId);
    if (!allowed) throw new Error("Forbidden");
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
    const allowed = await isAdminUser(context.supabase, context.userId);
    if (!allowed) throw new Error("Forbidden");
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
    const allowed = await isAdminUser(context.supabase, context.userId);
    if (!allowed) throw new Error("Forbidden");
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
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data, context }) => {
    const allowed = await isAdminUser(context.supabase, context.userId);
    if (!allowed) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDocumentUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => pathSchema.parse(data))
  .handler(async ({ data, context }) => {
    const allowed = await isAdminUser(context.supabase, context.userId);
    if (!allowed) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("request-documents")
      .createSignedUrl(data.path, 300);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });

export const adminMarkMessageRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data, context }) => {
    const allowed = await isAdminUser(context.supabase, context.userId);
    if (!allowed) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
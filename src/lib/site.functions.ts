import { createServerFn } from "@tanstack/react-start";
import { requestSchema, contactSchema, trackSchema } from "@/lib/schemas";

const EXT_BY_TYPE: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("id, title, description, icon, price, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const submitServiceRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => requestSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: service, error: serviceError } = await supabaseAdmin
      .from("services")
      .select("id, title")
      .eq("id", data.service_id)
      .eq("is_active", true)
      .maybeSingle();
    if (serviceError) throw new Error(serviceError.message);
    if (!service) throw new Error("الخدمة المختارة غير متاحة");

    const orderNumber = `RV-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`;
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    const { data: inserted, error } = await supabaseAdmin
      .from("service_requests")
      .insert({
        order_number: orderNumber,
        access_code: accessCode,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email || null,
        city: data.city,
        client_type: data.client_type,
        service_id: service.id,
        service_title: service.title,
        entity_name: data.entity_name || null,
        transaction_number: data.transaction_number || null,
        details: data.details || null,
        preferred_contact: data.preferred_contact,
      })
      .select("id, order_number")
      .single();
    if (error) throw new Error(error.message);

    if (data.documents.length) {
      await supabaseAdmin.from("request_documents").insert(
        data.documents.map((d) => ({
          request_id: inserted.id,
          file_name: d.file_name,
          file_path: d.file_path,
        })),
      );
    }

    return { order_number: inserted.order_number, access_code: accessCode };
  });

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      subject: data.subject || null,
      message: data.message,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const trackRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => trackSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("service_requests")
      .select(
        "id, order_number, service_title, status, created_at, updated_at, admin_notes, required_documents, assigned_to, invoice_amount, invoice_paid, phone, access_code",
      )
      .eq("order_number", data.order_number.trim().toUpperCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row || row.phone !== data.phone.trim() || row.access_code !== data.access_code.trim()) {
      return { found: false as const };
    }
    const { data: docs } = await supabaseAdmin
      .from("request_documents")
      .select("file_name, created_at")
      .eq("request_id", row.id)
      .order("created_at", { ascending: true });

    return {
      found: true as const,
      request: {
        order_number: row.order_number,
        service_title: row.service_title,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        admin_notes: row.admin_notes,
        required_documents: row.required_documents,
        assigned_to: row.assigned_to,
        invoice_amount: row.invoice_amount,
        invoice_paid: row.invoice_paid,
      },
      documents: docs ?? [],
    };
  });
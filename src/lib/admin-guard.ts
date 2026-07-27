import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Checks admin role via the user_roles table using the caller's RLS-scoped client. */
export async function isAdminUser(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return Boolean(data);
}

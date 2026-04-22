import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function listSportsRepository(client: SupabaseClient<Database>) {
  const result = await client.from("sports").select("*").order("name");

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

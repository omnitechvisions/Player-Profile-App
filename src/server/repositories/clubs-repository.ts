import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function listClubsByIdsRepository(
  client: SupabaseClient<Database>,
  clubIds: string[],
) {
  if (!clubIds.length) {
    return [];
  }

  const result = await client.from("clubs").select("*").in("id", clubIds);

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listPublicClubsRepository(client: SupabaseClient<Database>) {
  const result = await client
    .from("clubs")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function getClubByIdRepository(
  client: SupabaseClient<Database>,
  clubId: string,
) {
  const result = await client
    .from("clubs")
    .select("*")
    .eq("id", clubId)
    .maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listClubMembershipsByClubIdsRepository(
  client: SupabaseClient<Database>,
  clubIds: string[],
) {
  if (!clubIds.length) {
    return [];
  }

  const result = await client
    .from("club_members")
    .select("club_id, user_id")
    .in("club_id", clubIds);

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

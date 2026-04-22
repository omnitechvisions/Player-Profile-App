import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function getViewerSessionRepository(client: SupabaseClient<Database>) {
  const result = await client.auth.getUser();

  if (result.error) {
    throw result.error;
  }

  return result.data.user;
}

export async function getProfileByIdRepository(
  client: SupabaseClient<Database>,
  profileId: string,
) {
  const result = await client
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function getProfileByUsernameRepository(
  client: SupabaseClient<Database>,
  username: string,
) {
  const result = await client
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function getPublicProfileByUsernameRepository(
  client: SupabaseClient<Database>,
  username: string,
) {
  const result = await client
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("is_public", true)
    .maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listPublicProfilesRepository(client: SupabaseClient<Database>) {
  const result = await client
    .from("profiles")
    .select("*")
    .eq("is_public", true)
    .order("xp_total", { ascending: false })
    .order("username");

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listProfileSportsRepository(
  client: SupabaseClient<Database>,
  profileId: string,
) {
  const result = await client
    .from("profile_sports")
    .select("sport_id, sports(*)")
    .eq("profile_id", profileId);

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listProfileSportsByProfileIdsRepository(
  client: SupabaseClient<Database>,
  profileIds: string[],
) {
  if (!profileIds.length) {
    return [];
  }

  const result = await client
    .from("profile_sports")
    .select("profile_id, sport_id")
    .in("profile_id", profileIds);

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listProfileAchievementsRepository(
  client: SupabaseClient<Database>,
  profileId: string,
) {
  const result = await client
    .from("user_achievements")
    .select("achievement_id, awarded_at")
    .eq("user_id", profileId)
    .order("awarded_at", { ascending: false });

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listAchievementsRepository(
  client: SupabaseClient<Database>,
  achievementIds: string[],
) {
  if (!achievementIds.length) {
    return [];
  }

  const result = await client
    .from("achievements")
    .select("*")
    .in("id", achievementIds);

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listXpLedgerRepository(
  client: SupabaseClient<Database>,
  profileId: string,
) {
  const result = await client
    .from("xp_ledger")
    .select("*")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false })
    .limit(8);

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listClubMembershipsRepository(
  client: SupabaseClient<Database>,
  profileId: string,
) {
  const result = await client
    .from("club_members")
    .select("club_id")
    .eq("user_id", profileId);

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listEventRegistrationsByUserRepository(
  client: SupabaseClient<Database>,
  profileId: string,
) {
  const result = await client
    .from("event_registrations")
    .select("event_id, created_at")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false });

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function replaceProfileSportsRepository(
  client: SupabaseClient<Database>,
  profileId: string,
  sportIds: string[],
) {
  const deleteResult = await client.from("profile_sports").delete().eq("profile_id", profileId);

  if (deleteResult.error) {
    throw deleteResult.error;
  }

  if (!sportIds.length) {
    return;
  }

  const insertResult = await client.from("profile_sports").insert(
    sportIds.map((sportId) => ({
      profile_id: profileId,
      sport_id: sportId,
    })),
  );

  if (insertResult.error) {
    throw insertResult.error;
  }
}

export async function insertXpLedgerEntryRepository(
  client: SupabaseClient<Database>,
  values: Database["public"]["Tables"]["xp_ledger"]["Insert"],
) {
  const result = await client.from("xp_ledger").insert(values).select("*").single();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function upsertProfileRepository(
  client: SupabaseClient<Database>,
  values: Database["public"]["Tables"]["profiles"]["Insert"],
) {
  const result = await client
    .from("profiles")
    .upsert(values, { onConflict: "id" })
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

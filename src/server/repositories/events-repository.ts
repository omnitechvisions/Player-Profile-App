import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function listEventsRepository(
  client: SupabaseClient<Database>,
  filters?: {
    sportId?: string;
    region?: string;
    clubId?: string;
    eventType?: Database["public"]["Tables"]["events"]["Row"]["event_type"];
    status?: Database["public"]["Tables"]["events"]["Row"]["status"];
    startsAfter?: string;
  },
) {
  let query = client.from("events").select("*").order("starts_at");

  if (filters?.sportId) {
    query = query.eq("sport_id", filters.sportId);
  }
  if (filters?.region) {
    query = query.eq("region", filters.region);
  }
  if (filters?.clubId) {
    query = query.eq("club_id", filters.clubId);
  }
  if (filters?.eventType) {
    query = query.eq("event_type", filters.eventType);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.startsAfter) {
    query = query.gte("starts_at", filters.startsAfter);
  }

  const result = await query;

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listEventsByIdsRepository(
  client: SupabaseClient<Database>,
  eventIds: string[],
) {
  if (!eventIds.length) {
    return [];
  }

  const result = await client
    .from("events")
    .select("*")
    .in("id", eventIds)
    .order("starts_at");

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function getEventByIdRepository(
  client: SupabaseClient<Database>,
  eventId: string,
) {
  const result = await client.from("events").select("*").eq("id", eventId).maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listEventRegistrationsRepository(
  client: SupabaseClient<Database>,
  eventId: string,
) {
  const result = await client
    .from("event_registrations")
    .select("*")
    .eq("event_id", eventId);

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function getViewerRegistrationRepository(
  client: SupabaseClient<Database>,
  eventId: string,
  userId: string,
) {
  const result = await client
    .from("event_registrations")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function listEventRatingsRepository(
  client: SupabaseClient<Database>,
  eventId: string,
) {
  const result = await client.from("ratings").select("*").eq("event_id", eventId);

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function createEventRepository(
  client: SupabaseClient<Database>,
  values: Database["public"]["Tables"]["events"]["Insert"],
) {
  const result = await client.from("events").insert(values).select("*").single();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

export async function upsertEventRegistrationRepository(
  client: SupabaseClient<Database>,
  values: Database["public"]["Tables"]["event_registrations"]["Insert"],
) {
  const result = await client
    .from("event_registrations")
    .upsert(values, { onConflict: "event_id,user_id" })
    .select("*")
    .single();

  if (result.error) {
    throw result.error;
  }

  return result.data;
}

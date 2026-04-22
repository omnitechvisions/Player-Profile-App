import { sports as fallbackSports } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Sport } from "@/lib/types";
import { listSportsRepository } from "@/server/repositories/sports-repository";
import { toSport } from "@/server/services/mappers";

export async function listSports(): Promise<Sport[]> {
  if (!isSupabaseConfigured()) {
    return fallbackSports;
  }

  try {
    const client = await getSupabaseServerClient();
    const rows = await listSportsRepository(client);
    return rows.map(toSport);
  } catch {
    return fallbackSports;
  }
}

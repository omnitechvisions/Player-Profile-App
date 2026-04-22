import { leaderboard as fallbackLeaderboard } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getLevelFromXp } from "@/lib/xp";
import {
  listProfileSportsByProfileIdsRepository,
  listPublicProfilesRepository,
} from "@/server/repositories/profiles-repository";
import { listSportsRepository } from "@/server/repositories/sports-repository";
import { toProfile } from "@/server/services/mappers";

export type LeaderboardRow = {
  rank: number;
  user: ReturnType<typeof toProfile>;
  level: number;
  sports: string[];
};

function getFallbackLeaderboard(): LeaderboardRow[] {
  return fallbackLeaderboard.map((row) => ({
    ...row,
    sports: row.sports.filter((sport): sport is string => Boolean(sport)),
  }));
}

export async function listLeaderboard(): Promise<LeaderboardRow[]> {
  if (!isSupabaseConfigured()) {
    return getFallbackLeaderboard();
  }

  try {
    const client = await getSupabaseServerClient();
    const profiles = await listPublicProfilesRepository(client);
    const [profileSports, sports] = await Promise.all([
      listProfileSportsByProfileIdsRepository(
        client,
        profiles.map((profile) => profile.id),
      ),
      listSportsRepository(client),
    ]);

    const sportsById = new Map(sports.map((sport) => [sport.id, sport.name]));

    const sportNamesByProfileId = profileSports.reduce<Record<string, string[]>>((accumulator, row) => {
      const sportName = sportsById.get(row.sport_id);

      if (!sportName) {
        return accumulator;
      }

      accumulator[row.profile_id] = [...(accumulator[row.profile_id] ?? []), sportName];
      return accumulator;
    }, {});

    return profiles.map((profile, index) => ({
      rank: index + 1,
      user: toProfile(profile, {
        sportIds: profileSports
          .filter((row) => row.profile_id === profile.id)
          .map((row) => row.sport_id),
      }),
      level: getLevelFromXp(profile.xp_total),
      sports: sportNamesByProfileId[profile.id] ?? [],
    }));
  } catch {
    return getFallbackLeaderboard();
  }
}

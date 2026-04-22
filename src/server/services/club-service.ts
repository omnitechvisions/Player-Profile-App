import { clubs as fallbackClubs, events as fallbackEvents, getClubById as getFallbackClubById, getSportById } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Club, Event, Sport } from "@/lib/types";
import {
  getClubByIdRepository,
  listClubMembershipsByClubIdsRepository,
  listPublicClubsRepository,
} from "@/server/repositories/clubs-repository";
import { listEventRegistrationsRepository, listEventsRepository } from "@/server/repositories/events-repository";
import { getRegistrationCounts, toClub, toEvent } from "@/server/services/mappers";

export type ClubWithSport = {
  club: Club;
  sport?: Sport;
};

export type ClubDetailData = ClubWithSport & {
  upcomingEvents: Event[];
};

function groupMembershipCounts(rows: { club_id: string }[]) {
  return rows.reduce<Record<string, number>>((accumulator, row) => {
    accumulator[row.club_id] = (accumulator[row.club_id] ?? 0) + 1;
    return accumulator;
  }, {});
}

export async function listClubs(): Promise<ClubWithSport[]> {
  if (!isSupabaseConfigured()) {
    return fallbackClubs.map((club) => ({
      club,
      sport: getSportById(club.sportId),
    }));
  }

  try {
    const client = await getSupabaseServerClient();
    const clubRows = await listPublicClubsRepository(client);
    const clubIds = clubRows.map((club) => club.id);
    const [membershipRows, sportsResult] = await Promise.all([
      listClubMembershipsByClubIdsRepository(client, clubIds),
      client.from("sports").select("*"),
    ]);

    const membershipCounts = groupMembershipCounts(membershipRows);
    const sportsById = new Map(
      (sportsResult.data ?? []).map((sport) => [
        sport.id,
        { id: sport.id, name: sport.name, emoji: sport.emoji, category: sport.category },
      ]),
    );

    return clubRows.map((row) => ({
      club: toClub(row, { memberCount: membershipCounts[row.id] ?? 0 }),
      sport: row.sport_id ? sportsById.get(row.sport_id) : undefined,
    }));
  } catch {
    return fallbackClubs.map((club) => ({
      club,
      sport: getSportById(club.sportId),
    }));
  }
}

export async function getClubDetail(clubId: string): Promise<ClubDetailData | null> {
  if (!isSupabaseConfigured()) {
    const fallbackClub = getFallbackClubById(clubId);

    if (!fallbackClub) {
      return null;
    }

    return {
      club: fallbackClub,
      sport: getSportById(fallbackClub.sportId),
      upcomingEvents: fallbackEvents.filter((event) => fallbackClub.upcomingEventIds.includes(event.id)),
    };
  }

  try {
    const client = await getSupabaseServerClient();
    const clubRow = await getClubByIdRepository(client, clubId);

    if (!clubRow || !clubRow.is_public) {
      return null;
    }

    const [membershipRows, eventRows, sportsResult] = await Promise.all([
      listClubMembershipsByClubIdsRepository(client, [clubId]),
      listEventsRepository(client, {
        clubId,
        status: "published",
        startsAfter: new Date().toISOString(),
      }),
      client.from("sports").select("*").eq("id", clubRow.sport_id ?? "").maybeSingle(),
    ]);

    const upcomingEvents = await Promise.all(
      eventRows.map(async (row) => {
        const registrations = await listEventRegistrationsRepository(client, row.id);
        return toEvent(row, getRegistrationCounts(registrations));
      }),
    );

    const club = toClub(clubRow, {
      memberCount: membershipRows.length,
      upcomingEventIds: upcomingEvents.map((event) => event.id),
    });

    return {
      club,
      sport: sportsResult.data
        ? {
            id: sportsResult.data.id,
            name: sportsResult.data.name,
            emoji: sportsResult.data.emoji,
            category: sportsResult.data.category,
          }
        : getSportById(club.sportId),
      upcomingEvents,
    };
  } catch {
    const fallbackClub = getFallbackClubById(clubId);

    if (!fallbackClub) {
      return null;
    }

    return {
      club: fallbackClub,
      sport: getSportById(fallbackClub.sportId),
      upcomingEvents: fallbackEvents.filter((event) => fallbackClub.upcomingEventIds.includes(event.id)),
    };
  }
}

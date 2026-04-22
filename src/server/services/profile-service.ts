import { clubs as fallbackClubs, events as fallbackEvents, getUserByUsername, achievements as fallbackAchievements, sports as fallbackSports, xpLedger as fallbackLedger } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Achievement, Club, Sport, UserProfile, XpEntry } from "@/lib/types";
import { listClubsByIdsRepository } from "@/server/repositories/clubs-repository";
import {
  getProfileByIdRepository,
  getPublicProfileByUsernameRepository,
  getProfileByUsernameRepository,
  getViewerSessionRepository,
  listAchievementsRepository,
  listClubMembershipsRepository,
  listEventRegistrationsByUserRepository,
  listProfileAchievementsRepository,
  listProfileSportsRepository,
  listXpLedgerRepository,
} from "@/server/repositories/profiles-repository";
import { listEventRegistrationsRepository, listEventsByIdsRepository, listEventsRepository } from "@/server/repositories/events-repository";
import { getRegistrationCounts, toAchievement, toClub, toEvent, toProfile, toSport, toXpEntry } from "@/server/services/mappers";

export type ProfilePageData = {
  user: UserProfile;
  favoriteSports: Sport[];
  memberClubs: Club[];
  userAchievements: Achievement[];
  userEvents: typeof fallbackEvents;
  entries: XpEntry[];
};

export type ViewerSummary = Pick<UserProfile, "id" | "username" | "avatar" | "fullName"> | null;

export function isProfileComplete(profile: {
  username: string;
  region: string | null;
  roles: string[];
} | null) {
  return Boolean(profile?.username && profile.region && profile.roles.length);
}

export async function getViewerSummary(): Promise<ViewerSummary> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const client = await getSupabaseServerClient();
    const user = await getViewerSessionRepository(client);

    if (!user) {
      return null;
    }

    const profile = await getProfileByIdRepository(client, user.id);

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      username: profile.username,
      avatar:
        profile.full_name
          .split(" ")
          .map((part) => part[0]?.toUpperCase())
          .join("")
          .slice(0, 2) || "PP",
      fullName: profile.full_name,
    };
  } catch {
    return null;
  }
}

export async function getCurrentAuthenticatedProfile() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const client = await getSupabaseServerClient();
    const user = await getViewerSessionRepository(client);

    if (!user) {
      return null;
    }

    return getProfileByIdRepository(client, user.id);
  } catch {
    return null;
  }
}

export async function getProfilePageData(username: string): Promise<ProfilePageData | null> {
  if (!isSupabaseConfigured()) {
    const fallbackUser = getUserByUsername(username);

    if (!fallbackUser) {
      return null;
    }

    return {
      user: fallbackUser,
      favoriteSports: fallbackSports.filter((sport) => fallbackUser.favoriteSportIds.includes(sport.id)),
      memberClubs: fallbackClubs.filter((club) => fallbackUser.joinedClubIds.includes(club.id)),
      userAchievements: fallbackAchievements.filter((achievement) => fallbackUser.achievementIds.includes(achievement.id)),
      userEvents: fallbackEvents.filter((event) => event.organizerId === fallbackUser.id || event.registeredCount > 0).slice(0, 4),
      entries: fallbackLedger.filter((entry) => entry.userId === fallbackUser.id),
    };
  }

  try {
    const client = await getSupabaseServerClient();
    const viewer = await getViewerSessionRepository(client);
    const profileRow =
      viewer
        ? await getProfileByUsernameRepository(client, username)
        : await getPublicProfileByUsernameRepository(client, username);

    if (!profileRow) {
      return null;
    }

    const [sportRows, achievementRows, xpRows, eventsRows, clubMemberships, registrationRows] = await Promise.all([
      listProfileSportsRepository(client, profileRow.id),
      listProfileAchievementsRepository(client, profileRow.id),
      listXpLedgerRepository(client, profileRow.id),
      listEventsRepository(client),
      listClubMembershipsRepository(client, profileRow.id),
      listEventRegistrationsByUserRepository(client, profileRow.id),
    ]);
    const achievements = await listAchievementsRepository(
      client,
      achievementRows.map((row) => row.achievement_id),
    );

    const liveUser = toProfile(profileRow, {
      sportIds: sportRows.map((row) => row.sport_id),
      achievementIds: achievementRows.map((row) => row.achievement_id),
      joinedClubIds: clubMemberships.map((row) => row.club_id),
    });

    const favoriteSports = sportRows
      .map((row) => row.sports)
      .filter(Boolean)
      .map((sport) => toSport(sport as never));
    const memberClubs = (await listClubsByIdsRepository(client, liveUser.joinedClubIds)).map((club) => toClub(club));

    const userAchievements = achievements.map(toAchievement);

    const registeredEventIds = registrationRows.map((row) => row.event_id);
    const visibleRegisteredEvents = await listEventsByIdsRepository(client, registeredEventIds);
    const uniqueEvents = [...eventsRows, ...visibleRegisteredEvents].filter(
      (event, index, collection) =>
        collection.findIndex((candidate) => candidate.id === event.id) === index,
    );

    const mappedEvents = await Promise.all(
      uniqueEvents
        .filter(
          (event) =>
            event.organizer_user_id === profileRow.id ||
            registeredEventIds.includes(event.id),
        )
        .slice(0, 4)
        .map(async (event) => {
          const registrations = await listEventRegistrationsRepository(client, event.id);
          return toEvent(event, getRegistrationCounts(registrations));
        }),
    );

    return {
      user: liveUser,
      favoriteSports,
      memberClubs,
      userAchievements,
      userEvents: mappedEvents,
      entries: xpRows.map(toXpEntry),
    };
  } catch {
    const fallbackUser = getUserByUsername(username);
    if (!fallbackUser) {
      return null;
    }

    return {
      user: fallbackUser,
      favoriteSports: fallbackSports.filter((sport) => fallbackUser.favoriteSportIds.includes(sport.id)),
      memberClubs: fallbackClubs.filter((club) => fallbackUser.joinedClubIds.includes(club.id)),
      userAchievements: fallbackAchievements.filter((achievement) => fallbackUser.achievementIds.includes(achievement.id)),
      userEvents: fallbackEvents.filter((event) => event.organizerId === fallbackUser.id || event.registeredCount > 0).slice(0, 4),
      entries: fallbackLedger.filter((entry) => entry.userId === fallbackUser.id),
    };
  }
}

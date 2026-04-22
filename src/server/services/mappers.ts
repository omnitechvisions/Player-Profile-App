import type { Database } from "@/lib/supabase/database.types";
import type {
  Achievement,
  Club,
  Event,
  Rating,
  RegistrationType,
  Sport,
  UserProfile,
  XpEntry,
} from "@/lib/types";

export function toSport(
  record: Database["public"]["Tables"]["sports"]["Row"],
): Sport {
  return {
    id: record.id,
    name: record.name,
    emoji: record.emoji,
    category: record.category,
  };
}

export function toXpEntry(
  record: Database["public"]["Tables"]["xp_ledger"]["Row"],
): XpEntry {
  return {
    id: record.id,
    userId: record.user_id,
    reason: record.reason,
    amount: record.amount,
    createdAt: record.created_at,
  };
}

export function toAchievement(
  record: Database["public"]["Tables"]["achievements"]["Row"],
): Achievement {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
  };
}

export function toProfile(
  record: Database["public"]["Tables"]["profiles"]["Row"],
  extras?: {
    sportIds?: string[];
    achievementIds?: string[];
    joinedClubIds?: string[];
  },
): UserProfile {
  const initials = record.full_name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return {
    id: record.id,
    username: record.username,
    fullName: record.full_name,
    avatar: initials || "PP",
    avatarUrl: record.avatar_url,
    region: record.region ?? "",
    bio: record.bio ?? "",
    roles: (record.roles ?? []) as UserProfile["roles"],
    favoriteSportIds: extras?.sportIds ?? [],
    xp: record.xp_total,
    isPublic: record.is_public,
    joinedClubIds: extras?.joinedClubIds ?? [],
    achievementIds: extras?.achievementIds ?? [],
  };
}

export function toEvent(
  record: Database["public"]["Tables"]["events"]["Row"],
  registrationCounts?: {
    participantCount: number;
    spectatorCount: number;
  },
): Event {
  return {
    id: record.id,
    title: record.title,
    sportId: record.sport_id,
    organizerId: record.organizer_user_id,
    clubId: record.club_id ?? undefined,
    city: record.city,
    region: record.region,
    venue: record.venue,
    startsAt: record.starts_at,
    status: record.status,
    eventType: record.event_type,
    capacity: record.capacity,
    registeredCount: registrationCounts?.participantCount ?? 0,
    spectatorCount: registrationCounts?.spectatorCount ?? 0,
    description: record.description ?? "",
    entryFeeText: record.entry_fee_text ?? "",
  };
}

export function toClub(
  record: Database["public"]["Tables"]["clubs"]["Row"],
  extras?: {
    memberCount?: number;
    upcomingEventIds?: string[];
  },
): Club {
  return {
    id: record.id,
    name: record.name,
    city: record.city,
    region: record.region,
    sportId: record.sport_id ?? "",
    memberCount: extras?.memberCount ?? 0,
    description: record.description ?? "",
    isPublic: record.is_public,
    upcomingEventIds: extras?.upcomingEventIds ?? [],
  };
}

export function toRating(
  record: Database["public"]["Tables"]["ratings"]["Row"],
): Rating {
  return {
    id: record.id,
    eventId: record.event_id,
    authorId: record.author_user_id,
    targetUserId: record.target_user_id ?? undefined,
    score: record.score,
    comment: record.comment ?? "",
  };
}

export function getRegistrationCounts(
  rows: Database["public"]["Tables"]["event_registrations"]["Row"][],
) {
  return rows.reduce(
    (accumulator, row) => {
      if (row.registration_type === "participant") {
        accumulator.participantCount += 1;
      } else {
        accumulator.spectatorCount += 1;
      }
      return accumulator;
    },
    { participantCount: 0, spectatorCount: 0 },
  );
}

export function getViewerRegistrationType(
  row: Database["public"]["Tables"]["event_registrations"]["Row"] | null,
): RegistrationType | null {
  return row?.registration_type ?? null;
}

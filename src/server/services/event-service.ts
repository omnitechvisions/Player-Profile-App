import { currentUser, events as fallbackEvents, getEventById as getFallbackEventById, getSportById, ratings as fallbackRatings, sports as fallbackSports, users as fallbackUsers } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Event, Rating, RegistrationType, Sport, UserProfile } from "@/lib/types";
import {
  getEventByIdRepository,
  getViewerRegistrationRepository,
  listEventRatingsRepository,
  listEventRegistrationsRepository,
  listEventsRepository,
} from "@/server/repositories/events-repository";
import {
  getProfileByIdRepository,
  getViewerSessionRepository,
} from "@/server/repositories/profiles-repository";
import { getRegistrationCounts, getViewerRegistrationType, toEvent, toProfile, toRating } from "@/server/services/mappers";

export type EventDetailData = {
  event: Event;
  sport: Sport | undefined;
  organizer: UserProfile;
  eventRatings: Rating[];
  viewerRegistrationType: RegistrationType | null;
};

export async function listEvents(filters?: {
  sportId?: string;
  region?: string;
  eventType?: Event["eventType"];
  status?: Event["status"];
}) {
  if (!isSupabaseConfigured()) {
    return fallbackEvents;
  }

  try {
    const client = await getSupabaseServerClient();
    const rows = await listEventsRepository(client, filters);

    return Promise.all(
      rows.map(async (row) => {
        const registrations = await listEventRegistrationsRepository(client, row.id);
        return toEvent(row, getRegistrationCounts(registrations));
      }),
    );
  } catch {
    return fallbackEvents;
  }
}

export async function getEventDetail(eventId: string): Promise<EventDetailData | null> {
  if (!isSupabaseConfigured()) {
    const fallbackEvent = getFallbackEventById(eventId);

    if (!fallbackEvent) {
      return null;
    }

    return {
      event: fallbackEvent,
      sport: getSportById(fallbackEvent.sportId),
      organizer: fallbackUsers.find((user) => user.id === fallbackEvent.organizerId) ?? currentUser,
      eventRatings: fallbackRatings.filter((rating) => rating.eventId === fallbackEvent.id),
      viewerRegistrationType: null,
    };
  }

  try {
    const client = await getSupabaseServerClient();
    const [eventRow, viewer, sportsRows] = await Promise.all([
      getEventByIdRepository(client, eventId),
      getViewerSessionRepository(client),
      client.from("sports").select("*"),
    ]);

    if (!eventRow) {
      return null;
    }

    const [registrationRows, ratingRows, organizerRow, viewerRegistration] = await Promise.all([
      listEventRegistrationsRepository(client, eventRow.id),
      listEventRatingsRepository(client, eventRow.id),
      getProfileByIdRepository(client, eventRow.organizer_user_id),
      viewer ? getViewerRegistrationRepository(client, eventRow.id, viewer.id) : Promise.resolve(null),
    ]);

    const registrationCounts = getRegistrationCounts(registrationRows);
    const event = toEvent(eventRow, registrationCounts);
    const organizer = organizerRow ? toProfile(organizerRow) : currentUser;
    const sport = sportsRows.data?.find((entry) => entry.id === event.sportId);

    return {
      event,
      sport: sport ? { id: sport.id, name: sport.name, emoji: sport.emoji, category: sport.category } : fallbackSports.find((entry) => entry.id === event.sportId),
      organizer,
      eventRatings: ratingRows.map(toRating),
      viewerRegistrationType: getViewerRegistrationType(viewerRegistration),
    };
  } catch {
    const fallbackEvent = getFallbackEventById(eventId);

    if (!fallbackEvent) {
      return null;
    }

    return {
      event: fallbackEvent,
      sport: getSportById(fallbackEvent.sportId),
      organizer: fallbackUsers.find((user) => user.id === fallbackEvent.organizerId) ?? currentUser,
      eventRatings: fallbackRatings.filter((rating) => rating.eventId === fallbackEvent.id),
      viewerRegistrationType: null,
    };
  }
}

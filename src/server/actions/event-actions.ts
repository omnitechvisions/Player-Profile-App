"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { idleFormState, type FormState } from "@/lib/form-state";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { eventSchema } from "@/lib/validation";
import {
  createEventRepository,
  getViewerRegistrationRepository,
  getEventByIdRepository,
  upsertEventRegistrationRepository,
} from "@/server/repositories/events-repository";
import {
  getProfileByIdRepository,
  getViewerSessionRepository,
  insertXpLedgerEntryRepository,
} from "@/server/repositories/profiles-repository";

export async function createEventAction(
  previousState: FormState = idleFormState,
  formData: FormData,
): Promise<FormState> {
  void previousState;

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add the environment variables first.",
    };
  }

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    sportId: formData.get("sportId"),
    city: formData.get("city"),
    region: formData.get("region"),
    venue: formData.get("venue"),
    eventType: formData.get("eventType"),
    status: formData.get("status"),
    entryFeeText: formData.get("entryFeeText"),
    description: formData.get("description"),
    startsAt: formData.get("startsAt"),
    capacity: formData.get("capacity"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please complete the required event fields with valid values.",
    };
  }

  const client = await getSupabaseServerClient();
  const user = await getViewerSessionRepository(client);

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfileByIdRepository(client, user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  if (!profile.roles.includes("organizer")) {
    return {
      status: "error",
      message: "Only organizer profiles can create events right now.",
    };
  }

  const event = await createEventRepository(client, {
    organizer_user_id: user.id,
    title: parsed.data.title,
    sport_id: parsed.data.sportId,
    city: parsed.data.city,
    region: parsed.data.region,
    venue: parsed.data.venue,
    event_type: parsed.data.eventType,
    status: parsed.data.status,
    entry_fee_text: parsed.data.entryFeeText,
    description: parsed.data.description,
    starts_at: new Date(parsed.data.startsAt).toISOString(),
    capacity: parsed.data.capacity,
  });

  revalidatePath("/events");
  redirect(`/events/${event.id}`);
}

export async function registerForEventAction(
  previousState: FormState = idleFormState,
  formData: FormData,
): Promise<FormState> {
  void previousState;

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Supabase is not configured yet. Add the environment variables first.",
    };
  }

  const eventId = String(formData.get("eventId") ?? "");
  const registrationType = formData.get("registrationType");

  if (!eventId || (registrationType !== "participant" && registrationType !== "spectator")) {
    return {
      status: "error",
      message: "Registration request is missing required fields.",
    };
  }

  const client = await getSupabaseServerClient();
  const user = await getViewerSessionRepository(client);

  if (!user) {
    redirect("/auth/login");
  }

  const event = await getEventByIdRepository(client, eventId);

  if (!event) {
    return {
      status: "error",
      message: "That event could not be found.",
    };
  }

  if (!["published", "completed"].includes(event.status)) {
    return {
      status: "error",
      message: "This event is not open for registration.",
    };
  }

  const existingRegistration = await getViewerRegistrationRepository(client, eventId, user.id);
  const profile = await getProfileByIdRepository(client, user.id);

  await upsertEventRegistrationRepository(client, {
    event_id: eventId,
    user_id: user.id,
    registration_type: registrationType,
  });

  if (!existingRegistration) {
    const adminClient = getSupabaseAdminClient();

    if (adminClient) {
      await insertXpLedgerEntryRepository(adminClient, {
        user_id: user.id,
        reason: `Event registration (${registrationType})`,
        amount: 40,
      });
    }
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  revalidatePath("/");
  revalidatePath("/discover");
  revalidatePath("/clubs");
  revalidatePath("/rankings");
  if (profile?.username) {
    revalidatePath(`/profile/${profile.username}`);
  }

  return {
    status: "success",
    message: `Registered as a ${registrationType}.`,
  };
}

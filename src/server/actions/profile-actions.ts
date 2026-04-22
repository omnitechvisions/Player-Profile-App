"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { idleFormState, type FormState } from "@/lib/form-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validation";
import {
  getProfileByUsernameRepository,
  getViewerSessionRepository,
  replaceProfileSportsRepository,
  upsertProfileRepository,
} from "@/server/repositories/profiles-repository";

export async function saveOnboardingAction(
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

  const parsed = onboardingSchema.safeParse({
    fullName: formData.get("fullName"),
    username: formData.get("username"),
    region: formData.get("region"),
    bio: formData.get("bio"),
    roles: formData.getAll("roles"),
    favoriteSportIds: formData.getAll("favoriteSportIds"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please complete the required profile fields before continuing.",
    };
  }

  const client = await getSupabaseServerClient();
  const user = await getViewerSessionRepository(client);

  if (!user) {
    redirect("/auth/login");
  }

  const existingProfile = await getProfileByUsernameRepository(client, parsed.data.username);

  if (existingProfile && existingProfile.id !== user.id) {
    return {
      status: "error",
      message: "That username is already taken. Choose another one.",
    };
  }

  await upsertProfileRepository(client, {
    id: user.id,
    full_name: parsed.data.fullName,
    username: parsed.data.username,
    region: parsed.data.region,
    bio: parsed.data.bio ?? null,
    roles: parsed.data.roles,
    is_public: true,
  });

  await replaceProfileSportsRepository(client, user.id, parsed.data.favoriteSportIds);

  revalidatePath("/", "layout");
  revalidatePath("/onboarding");
  revalidatePath(`/profile/${parsed.data.username}`);
  redirect(`/profile/${parsed.data.username}`);
}

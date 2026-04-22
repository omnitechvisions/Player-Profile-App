"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { idleFormState, type FormState } from "@/lib/form-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { authSchema, signupSchema } from "@/lib/validation";
import {
  getProfileByIdRepository,
  getProfileByUsernameRepository,
  upsertProfileRepository,
} from "@/server/repositories/profiles-repository";
import { isProfileComplete } from "@/server/services/profile-service";

async function buildStarterUsername(baseValue: string) {
  return `${slugify(baseValue) || "player"}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function signInAction(
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

  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please enter a valid email and password.",
    };
  }

  const client = await getSupabaseServerClient();
  const { error } = await client.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  const { data: userResult } = await client.auth.getUser();
  const profile = userResult.user
    ? await getProfileByIdRepository(client, userResult.user.id)
    : null;

  revalidatePath("/", "layout");
  redirect(isProfileComplete(profile) ? "/" : "/onboarding");
}

export async function signUpAction(
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

  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fill out all required fields with valid values.",
    };
  }

  const client = await getSupabaseServerClient();
  const { data, error } = await client.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  if (data.user) {
    const starterUsername = await buildStarterUsername(parsed.data.fullName);
    const existing = await getProfileByUsernameRepository(client, starterUsername);

    await upsertProfileRepository(client, {
      id: data.user.id,
      full_name: parsed.data.fullName,
      username: existing ? `${starterUsername}-${Math.random().toString(36).slice(2, 4)}` : starterUsername,
      region: null,
      bio: null,
      avatar_url: null,
      roles: [],
      is_public: true,
      xp_total: 0,
    });
  }

  revalidatePath("/", "layout");
  redirect("/onboarding");
}

export async function signOutAction() {
  if (!isSupabaseConfigured()) {
    redirect("/auth/login");
  }

  const client = await getSupabaseServerClient();
  await client.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

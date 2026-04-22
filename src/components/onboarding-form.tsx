"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { idleFormState } from "@/lib/form-state";
import type { Sport, UserProfile } from "@/lib/types";
import { saveOnboardingAction } from "@/server/actions/profile-actions";

const roles = ["player", "spectator", "organizer"];

export function OnboardingForm({
  sports,
  profile,
}: {
  sports: Sport[];
  profile?: Partial<UserProfile> | null;
}) {
  const [state, formAction, isPending] = useActionState(
    saveOnboardingAction,
    idleFormState,
  );

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Onboarding</p>
        <h1 className="font-display text-3xl font-semibold">Complete your player setup</h1>
        <p className="text-sm text-muted-foreground">
          Roles, region, favorite sports, and a short bio give the profile pages and discover surfaces enough shape for a strong MVP.
        </p>
      </div>
      <form className="grid gap-4 lg:grid-cols-2" action={formAction}>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Full name</span>
          <Input name="fullName" placeholder="Maya Thompson" defaultValue={profile?.fullName} />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Username</span>
          <Input name="username" placeholder="mayaedge" defaultValue={profile?.username} />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Region</span>
          <Input name="region" placeholder="Halifax" defaultValue={profile?.region} />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Avatar upload</span>
          <Input name="avatar" type="file" />
        </label>
        <div className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium">Roles</span>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <label key={role} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm capitalize">
                <input
                  name="roles"
                  type="checkbox"
                  value={role}
                  defaultChecked={profile?.roles?.includes(role as never) ?? role !== "spectator"}
                />
                {role}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium">Favorite sports</span>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {sports.map((sport) => (
              <label key={sport.id} className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm">
                <input
                  name="favoriteSportIds"
                  type="checkbox"
                  value={sport.id}
                  defaultChecked={profile?.favoriteSportIds?.includes(sport.id) ?? false}
                />
                <span>{sport.emoji}</span>
                {sport.name}
              </label>
            ))}
          </div>
        </div>
        <label className="space-y-2 text-sm lg:col-span-2">
          <span className="font-medium">Bio</span>
          <Textarea
            name="bio"
            placeholder="Tell the community what kind of player, supporter, or organizer you are."
            defaultValue={profile?.bio}
          />
        </label>
        <div className="lg:col-span-2">
          <Button disabled={isPending}>{isPending ? "Saving..." : "Save Profile Setup"}</Button>
        </div>
      </form>
      {state.status !== "idle" ? (
        <div className="rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
          {state.message ??
            (state.status === "success" ? "Profile updated." : "Unable to save profile.")}
        </div>
      ) : null}
    </Card>
  );
}

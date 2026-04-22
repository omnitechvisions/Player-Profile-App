import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";
import { getCurrentAuthenticatedProfile, isProfileComplete } from "@/server/services/profile-service";
import { listSports } from "@/server/services/sport-service";

export default async function OnboardingPage() {
  const [sports, profile] = await Promise.all([
    listSports(),
    getCurrentAuthenticatedProfile(),
  ]);

  if (!profile) {
    redirect("/auth/login");
  }

  if (isProfileComplete(profile)) {
    redirect("/");
  }

  return (
    <OnboardingForm
      sports={sports}
      profile={{
        fullName: profile.full_name,
        username: profile.username,
        region: profile.region ?? "",
        bio: profile.bio ?? "",
        roles: profile.roles as never,
      }}
    />
  );
}

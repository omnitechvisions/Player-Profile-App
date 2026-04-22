import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentAuthenticatedProfile, isProfileComplete } from "@/server/services/profile-service";

export default async function SignupPage() {
  const profile = await getCurrentAuthenticatedProfile();

  if (profile) {
    redirect(isProfileComplete(profile) ? "/" : "/onboarding");
  }

  return <AuthForm mode="signup" />;
}

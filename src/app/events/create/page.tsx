import { redirect } from "next/navigation";
import { EventCreateForm } from "@/components/event-create-form";
import { getCurrentAuthenticatedProfile } from "@/server/services/profile-service";
import { listSports } from "@/server/services/sport-service";

export default async function EventCreatePage() {
  const [sports, profile] = await Promise.all([
    listSports(),
    getCurrentAuthenticatedProfile(),
  ]);

  if (!profile) {
    redirect("/auth/login");
  }

  return <EventCreateForm sports={sports} />;
}

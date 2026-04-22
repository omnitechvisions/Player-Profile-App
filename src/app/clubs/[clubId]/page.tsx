import { notFound } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getClubDetail } from "@/server/services/club-service";

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const data = await getClubDetail(clubId);

  if (!data) {
    notFound();
  }

  const { club, sport, upcomingEvents } = data;

  return (
    <div className="space-y-8">
      <Card className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Club Detail</p>
        <SectionHeading
          title={club.name}
          description={club.description}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Sport</p>
            <p className="mt-2 font-medium">{sport?.emoji} {sport?.name}</p>
          </div>
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Location</p>
            <p className="mt-2 font-medium">{club.city}, {club.region}</p>
          </div>
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Members</p>
            <p className="mt-2 font-medium">{club.memberCount}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button>Join Club</Button>
          <Button variant="secondary">Leave Club</Button>
        </div>
      </Card>
      <div className="space-y-4">
        <SectionHeading title="Upcoming club events" />
        <div className="grid gap-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} sport={sport} />
          ))}
        </div>
      </div>
    </div>
  );
}

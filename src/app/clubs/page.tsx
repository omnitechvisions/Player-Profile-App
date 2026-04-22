import { ClubCard } from "@/components/club-card";
import { SectionHeading } from "@/components/section-heading";
import { listClubs } from "@/server/services/club-service";

export default async function ClubsPage() {
  const clubs = await listClubs();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Clubs"
        title="Join clubs that match your sport and city"
        description="Public club pages stay lightweight, with upcoming events surfaced directly on the detail page."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {clubs.map(({ club, sport }) => (
          <ClubCard key={club.id} club={club} sport={sport} />
        ))}
      </div>
    </div>
  );
}

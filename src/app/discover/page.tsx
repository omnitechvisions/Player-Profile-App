import { ClubCard } from "@/components/club-card";
import { EventCard } from "@/components/event-card";
import { RankingTable } from "@/components/ranking-table";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { listClubs } from "@/server/services/club-service";
import { listEvents } from "@/server/services/event-service";
import { listLeaderboard } from "@/server/services/ranking-service";
import { listSports } from "@/server/services/sport-service";

export default async function DiscoverPage() {
  const [sports, events, clubs, leaderboard] = await Promise.all([
    listSports(),
    listEvents(),
    listClubs(),
    listLeaderboard(),
  ]);
  const sportsById = new Map(sports.map((sport) => [sport.id, sport]));

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Discover"
        title="A focused discover surface"
        description="This page keeps the first-time experience tight: events, clubs, and leaderboard energy without overwhelming the user."
      />
      <Card className="grid gap-3 md:grid-cols-4">
        {sports.map((sport) => (
          <div key={sport.id} className="rounded-2xl bg-secondary p-4">
            <p className="text-2xl">{sport.emoji}</p>
            <p className="mt-3 font-medium">{sport.name}</p>
            <p className="text-xs text-muted-foreground">{sport.category}</p>
          </div>
        ))}
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <SectionHeading title="Popular nearby events" />
          {events.slice(0, 4).map((event) => (
            <EventCard key={event.id} event={event} sport={sportsById.get(event.sportId)} />
          ))}
        </div>
        <div className="space-y-4">
          <SectionHeading title="Clubs to join" />
          {clubs.slice(0, 4).map(({ club, sport }) => (
            <ClubCard key={club.id} club={club} sport={sport} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <SectionHeading title="Leaderboard pulse" />
        <RankingTable rows={leaderboard} />
      </div>
    </div>
  );
}

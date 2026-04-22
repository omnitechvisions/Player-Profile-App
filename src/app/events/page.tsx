import { EventCard } from "@/components/event-card";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { listEvents } from "@/server/services/event-service";
import { listSports } from "@/server/services/sport-service";

export default async function EventsPage() {
  const [events, sports] = await Promise.all([listEvents(), listSports()]);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Events"
        title="Browse, filter, and join events"
        description="Sport, status, location, and event type are represented in the MVP layout, ready for real query-backed filtering."
      />
      <Card className="grid gap-3 md:grid-cols-4">
        <select className="h-11 rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
          <option>All sports</option>
          {sports.map((sport) => (
            <option key={sport.id}>{sport.name}</option>
          ))}
        </select>
        <select className="h-11 rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
          <option>Any date</option>
          <option>This week</option>
          <option>This month</option>
        </select>
        <select className="h-11 rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
          <option>All locations</option>
          <option>Halifax</option>
          <option>Toronto</option>
          <option>Montreal</option>
        </select>
        <select className="h-11 rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
          <option>All types</option>
          <option>Community</option>
          <option>Club</option>
          <option>Showcase</option>
        </select>
      </Card>
      {events.length ? (
        <div className="grid gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <Card className="text-sm text-muted-foreground">
          No live events match the current dataset yet. Seed the database or create an event to populate this view.
        </Card>
      )}
    </div>
  );
}

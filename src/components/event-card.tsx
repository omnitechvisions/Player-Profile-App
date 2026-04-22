import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getSportById } from "@/lib/mock-data";
import type { Event, Sport } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function EventCard({ event, sport: providedSport }: { event: Event; sport?: Sport }) {
  const sport = providedSport ?? getSportById(event.sportId);

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge>{sport?.emoji} {sport?.name}</Badge>
            <Badge className="capitalize">{event.eventType}</Badge>
            <Badge className="capitalize">{event.status}</Badge>
          </div>
          <Link href={`/events/${event.id}`} className="font-display text-xl font-semibold text-slate-950">
            {event.title}
          </Link>
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>{formatDate(event.startsAt)}</span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {event.city}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-4 w-4" />
          {event.registeredCount}/{event.capacity} participants
        </span>
      </div>
    </Card>
  );
}

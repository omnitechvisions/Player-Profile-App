import Link from "next/link";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getSportById } from "@/lib/mock-data";
import type { Sport } from "@/lib/types";
import type { Club } from "@/lib/types";

export function ClubCard({ club, sport: providedSport }: { club: Club; sport?: Sport }) {
  const sport = providedSport ?? getSportById(club.sportId);

  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge>{sport?.emoji} {sport?.name}</Badge>
          <Badge>{club.region}</Badge>
        </div>
        <Link href={`/clubs/${club.id}`} className="font-display text-xl font-semibold text-slate-950">
          {club.name}
        </Link>
        <p className="text-sm text-muted-foreground">{club.description}</p>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{club.city}</span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-4 w-4" />
          {club.memberCount} members
        </span>
      </div>
    </Card>
  );
}

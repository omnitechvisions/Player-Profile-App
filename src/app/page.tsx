import Link from "next/link";
import { ArrowRight, CalendarDays, Medal, Users } from "lucide-react";
import { ClubCard } from "@/components/club-card";
import { EventCard } from "@/components/event-card";
import { SectionHeading } from "@/components/section-heading";
import { StatsGrid } from "@/components/stats-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { currentUser, posts, sports } from "@/lib/mock-data";
import { formatCompactNumber } from "@/lib/utils";
import { listClubs } from "@/server/services/club-service";
import { getProfilePageData, getViewerSummary } from "@/server/services/profile-service";
import { listEvents } from "@/server/services/event-service";
import { listLeaderboard } from "@/server/services/ranking-service";
import { listSports } from "@/server/services/sport-service";

export default async function HomePage() {
  const [viewer, liveEvents, liveSports, liveClubs, liveLeaderboard] = await Promise.all([
    getViewerSummary(),
    listEvents({ status: "published" }),
    listSports(),
    listClubs(),
    listLeaderboard(),
  ]);
  const liveViewerProfile = viewer ? await getProfilePageData(viewer.username) : null;
  const featuredEvents = liveEvents.slice(0, 3);
  const featuredClubs = liveClubs.slice(0, 3);
  const leaderboardHighlights = liveLeaderboard.slice(0, 3);
  const viewerCard = liveViewerProfile?.user ?? currentUser;
  const sportsById = new Map(liveSports.map((sport) => [sport.id, sport]));

  return (
    <div className="space-y-8 pb-10">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.26),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_28%)]" />
          <div className="relative space-y-6">
            <Badge className="border-white/15 bg-white/10 text-white">Minimal sports community MVP</Badge>
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Build your player identity, find events, and stay close to your sports community.
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
                Player Profile helps users discover local events, join clubs, register as participants or spectators, and earn XP through lightweight social activity.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/events/create">
                <Button size="lg">Create Event</Button>
              </Link>
              <Link href="/discover">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Explore Discover
                </Button>
              </Link>
            </div>
          </div>
        </Card>
        <Card className="space-y-5">
          <SectionHeading
            eyebrow="Your Snapshot"
            title={`Welcome back, ${viewerCard.fullName.split(" ")[0]}`}
            description="A tight overview so the homepage stays useful without becoming noisy."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "XP", value: formatCompactNumber(viewerCard.xp) },
              { label: "Clubs", value: viewerCard.joinedClubIds.length },
              { label: "Sports", value: viewerCard.favoriteSportIds.length },
              { label: "Achievements", value: viewerCard.achievementIds.length },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-secondary p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 font-display text-3xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
          <Link href={`/profile/${viewerCard.username}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            View full profile <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </section>

      <StatsGrid
        items={[
          { label: "Active users", value: liveLeaderboard.length, hint: "Public community members" },
          { label: "Sports", value: liveSports.length, hint: "Flexible follow system" },
          { label: "Upcoming events", value: liveEvents.length },
          { label: "Public clubs", value: liveClubs.length },
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Upcoming Events"
            title="See the next events in your sports"
            description="Basketball, volleyball, and a few nearby community nights are surfaced first."
          />
          <div className="grid gap-4">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} sport={sportsById.get(event.sportId)} />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Leaderboard"
            title="Highlights from the rankings"
            description="A quick view of top players before jumping into the full rankings page."
          />
          <div className="grid gap-4">
            {leaderboardHighlights.map((row) => (
              <Card key={row.user.id} className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Rank #{row.rank}</p>
                  <p className="mt-1 font-display text-xl font-semibold">{row.user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{row.user.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">XP</p>
                  <p className="font-display text-2xl font-semibold">{formatCompactNumber(row.user.xp)}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Clubs"
            title="Clubs worth joining"
            description="Public clubs stay easy to scan, with a clear focus on sport and local region."
          />
          <div className="grid gap-4">
            {featuredClubs.map(({ club, sport }) => (
              <ClubCard key={club.id} club={club} sport={sport} />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Community Feed"
            title="Lightweight social activity"
            description="Priority 2 stays intentionally lean: status posts, event updates, and small community moments."
          />
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {liveLeaderboard.find((entry) => entry.user.id === post.authorId)?.user.fullName ?? "Community member"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sports.find((sport) => sport.id === post.sportId)?.name}
                    </p>
                  </div>
                  <div className="rounded-full bg-secondary p-2">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{post.body}</p>
              </Card>
            ))}
            <Card className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-secondary p-4">
                <CalendarDays className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-medium">Simple event flow</p>
              </div>
              <div className="rounded-2xl bg-secondary p-4">
                <Medal className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-medium">XP-backed rankings</p>
              </div>
              <div className="rounded-2xl bg-secondary p-4">
                <Users className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-medium">Player and spectator roles</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

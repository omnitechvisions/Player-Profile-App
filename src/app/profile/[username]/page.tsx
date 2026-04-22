import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getLevelFromXp, getProgressToNextLevel } from "@/lib/xp";
import { getProfilePageData } from "@/server/services/profile-service";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getProfilePageData(username);

  if (!data) {
    notFound();
  }
  const { user, favoriteSports, memberClubs, userAchievements, userEvents, entries } = data;

  const level = getLevelFromXp(user.xp);
  const progress = getProgressToNextLevel(user.xp);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-semibold text-white">
              {user.avatar}
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold">{user.fullName}</h1>
              <p className="text-sm text-muted-foreground">@{user.username} • {user.region}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{user.bio}</p>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <Badge key={role} className="capitalize">{role}</Badge>
            ))}
            {favoriteSports.map((sport) => (
              <Badge key={sport.id}>{sport.emoji} {sport.name}</Badge>
            ))}
          </div>
        </Card>
        <Card className="space-y-5">
          <SectionHeading title="XP and level" description="Profile pages show public progress, not private account settings." />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Total XP</p>
              <p className="mt-2 font-display text-3xl font-semibold">{user.xp}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Level</p>
              <p className="mt-2 font-display text-3xl font-semibold">{level}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Progress</p>
              <p className="mt-2 font-display text-3xl font-semibold">{Math.round(progress)}%</p>
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </Card>
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-4">
          <SectionHeading title="Achievements" />
          {userAchievements.length ? (
            userAchievements.map((achievement) => (
              <div key={achievement.id} className="rounded-2xl bg-secondary p-4">
                <p className="font-medium">{achievement.title}</p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No achievements yet.</p>
          )}
        </Card>
        <Card className="space-y-4">
          <SectionHeading title="Clubs" />
          {memberClubs.length ? (
            memberClubs.map((club) => (
              <div key={club.id} className="rounded-2xl bg-secondary p-4">
                <p className="font-medium">{club.name}</p>
                <p className="text-sm text-muted-foreground">{club.city}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No club memberships yet.</p>
          )}
        </Card>
        <Card className="space-y-4">
          <SectionHeading title="Recent XP activity" />
          {entries.length ? (
            entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl bg-secondary p-4">
                <div>
                  <p className="font-medium">{entry.reason}</p>
                  <p className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="font-semibold text-primary">+{entry.amount}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No XP entries yet.</p>
          )}
        </Card>
      </section>
      <section className="space-y-4">
        <SectionHeading title="Event history" />
        {userEvents.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {userEvents.map((event) => (
              <Card key={event.id}>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.city} • {event.status}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-sm text-muted-foreground">No event history yet.</Card>
        )}
      </section>
    </div>
  );
}

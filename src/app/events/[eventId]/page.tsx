import { notFound } from "next/navigation";
import { RegistrationPanel } from "@/components/registration-panel";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getCurrentAuthenticatedProfile } from "@/server/services/profile-service";
import { getEventDetail } from "@/server/services/event-service";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const [eventData, currentProfile] = await Promise.all([
    getEventDetail(eventId),
    getCurrentAuthenticatedProfile(),
  ]);

  if (!eventData) {
    notFound();
  }
  const { event, sport, eventRatings, organizer, viewerRegistrationType } = eventData;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge>{sport?.emoji} {sport?.name}</Badge>
            <Badge className="capitalize">{event.status}</Badge>
            <Badge className="capitalize">{event.eventType}</Badge>
          </div>
          <SectionHeading
            title={event.title}
            description={event.description}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">When</p>
              <p className="mt-2 font-medium">{formatDate(event.startsAt)}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Where</p>
              <p className="mt-2 font-medium">{event.venue}, {event.city}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Entry Fee</p>
              <p className="mt-2 font-medium">{event.entryFeeText}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Organizer</p>
              <p className="mt-2 font-medium">{organizer.fullName}</p>
            </div>
          </div>
        </Card>
        <RegistrationPanel
          eventId={event.id}
          existingRegistrationType={viewerRegistrationType}
          isAuthenticated={Boolean(currentProfile)}
        />
      </section>
      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="space-y-4">
          <SectionHeading
            eyebrow="Registration"
            title="Participants and spectators"
            description="The core rule is flexible attendance: users can compete in some events and spectate in others."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Participants</p>
              <p className="mt-2 font-display text-3xl font-semibold">{event.registeredCount}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Spectators</p>
              <p className="mt-2 font-display text-3xl font-semibold">{event.spectatorCount}</p>
            </div>
          </div>
        </Card>
        <Card className="space-y-4">
          <SectionHeading
            eyebrow="Ratings"
            title="Post-event feedback"
            description="Ratings stay intentionally simple in the MVP: 1 to 5 stars for joined events and eligible players."
          />
          {eventRatings.length ? (
            <div className="grid gap-3">
              {eventRatings.map((rating) => (
                <div key={rating.id} className="rounded-2xl bg-secondary p-4">
                  <p className="font-medium">{rating.authorId === organizer.id ? organizer.fullName : "Community member"}</p>
                  <p className="text-sm text-muted-foreground">Score: {rating.score}/5</p>
                  <p className="mt-2 text-sm text-secondary-foreground">{rating.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No ratings yet. Completed events will show event and player feedback here.</p>
          )}
        </Card>
      </section>
    </div>
  );
}

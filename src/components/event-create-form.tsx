"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { idleFormState } from "@/lib/form-state";
import type { Sport } from "@/lib/types";
import { createEventAction } from "@/server/actions/event-actions";

export function EventCreateForm({ sports }: { sports: Sport[] }) {
  const [state, formAction, isPending] = useActionState(
    createEventAction,
    idleFormState,
  );

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Organizer Flow</p>
        <h1 className="font-display text-3xl font-semibold">Create a community or club event</h1>
        <p className="text-sm text-muted-foreground">
          Draft and published statuses are supported, with simple participant or spectator registration in mind.
        </p>
      </div>
      <form className="grid gap-4 lg:grid-cols-2" action={formAction}>
        <label className="space-y-2 text-sm lg:col-span-2">
          <span className="font-medium">Event title</span>
          <Input name="title" placeholder="Harbour Hoops Friday Open Night" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Sport</span>
          <select name="sportId" className="h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Type</span>
          <select name="eventType" className="h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
            <option value="community">Community</option>
            <option value="club">Club</option>
            <option value="showcase">Showcase</option>
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">City</span>
          <Input name="city" placeholder="Halifax" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Region</span>
          <Input name="region" placeholder="Atlantic" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Venue</span>
          <Input name="venue" placeholder="Harbour Centre" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Entry fee text</span>
          <Input name="entryFeeText" placeholder="$10 drop-in or free for club members" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Date & time</span>
          <Input name="startsAt" type="datetime-local" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Capacity</span>
          <Input name="capacity" type="number" min="1" defaultValue="32" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Status</span>
          <select name="status" className="h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label className="space-y-2 text-sm lg:col-span-2">
          <span className="font-medium">Description</span>
          <Textarea
            name="description"
            placeholder="Keep it concise: who it is for, how it runs, and whether spectators are welcome."
          />
        </label>
        <div className="flex gap-3 lg:col-span-2">
          <Button disabled={isPending}>{isPending ? "Saving..." : "Save Event"}</Button>
          <Button variant="secondary" type="button" disabled>
            Save Draft
          </Button>
        </div>
      </form>
      {state.status !== "idle" ? (
        <div className="rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
          {state.message ??
            (state.status === "success" ? "Event saved." : "Unable to save event.")}
        </div>
      ) : null}
    </Card>
  );
}

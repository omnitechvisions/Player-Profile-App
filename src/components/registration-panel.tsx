"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { idleFormState } from "@/lib/form-state";
import type { RegistrationType } from "@/lib/types";
import { registerForEventAction } from "@/server/actions/event-actions";

export function RegistrationPanel({
  eventId,
  existingRegistrationType,
  isAuthenticated,
}: {
  eventId: string;
  existingRegistrationType: RegistrationType | null;
  isAuthenticated: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    registerForEventAction,
    idleFormState,
  );

  return (
    <Card className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Register</h2>
      <p className="text-sm text-muted-foreground">
        Users can join as participants or spectators. The final production flow should validate availability and prevent invalid ratings later.
      </p>
      {!isAuthenticated ? (
        <p className="rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
          Sign in to register for this event.
        </p>
      ) : (
        <form action={formAction} className="flex gap-3">
          <input type="hidden" name="eventId" value={eventId} />
          <Button name="registrationType" value="participant" disabled={isPending}>
            {isPending ? "Saving..." : "Join as Participant"}
          </Button>
          <Button
            variant="secondary"
            name="registrationType"
            value="spectator"
            disabled={isPending}
          >
            Join as Spectator
          </Button>
        </form>
      )}
      {existingRegistrationType ? (
        <div className="rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
          You are currently registered as a{" "}
          <span className="font-semibold capitalize">{existingRegistrationType}</span>.
        </div>
      ) : null}
      {state.status !== "idle" ? (
        <div className="rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
          {state.message ??
            (state.status === "success" ? "Registration saved." : "Unable to register.")}
        </div>
      ) : null}
    </Card>
  );
}

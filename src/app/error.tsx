"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 items-center">
      <Card className="w-full space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Something went wrong
        </p>
        <h2 className="font-display text-3xl font-semibold">
          We hit an unexpected app error
        </h2>
        <p className="text-sm text-muted-foreground">
          Try again. If this keeps happening, check your Supabase environment variables and database setup.
        </p>
        <div>
          <Button onClick={reset}>Try again</Button>
        </div>
      </Card>
    </div>
  );
}

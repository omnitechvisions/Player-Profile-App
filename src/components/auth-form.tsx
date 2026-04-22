"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { idleFormState } from "@/lib/form-state";
import { signInAction, signUpAction } from "@/server/actions/auth-actions";

export function AuthForm({
  mode,
}: {
  mode: "login" | "signup";
}) {
  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction, isPending] = useActionState(action, idleFormState);

  return (
    <Card className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          {mode === "login" ? "Welcome back" : "Create account"}
        </p>
        <h1 className="font-display text-3xl font-semibold">
          {mode === "login" ? "Sign in to your sports community" : "Start your player profile"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "login"
            ? "Email and password auth is ready to connect to Supabase."
            : "This MVP keeps signup simple and pushes profile setup into onboarding."}
        </p>
      </div>
      <form className="space-y-4" action={formAction}>
        {mode === "signup" ? <Input name="fullName" placeholder="Full name" required /> : null}
        <Input name="email" type="email" placeholder="Email address" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Button className="w-full" disabled={isPending}>
          {isPending ? "Working..." : mode === "login" ? "Sign In" : "Create Account"}
        </Button>
      </form>
      {state.status !== "idle" ? (
        <div className="rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
          {state.message ??
            (state.status === "success" ? "Success." : "Something went wrong.")}
        </div>
      ) : null}
    </Card>
  );
}

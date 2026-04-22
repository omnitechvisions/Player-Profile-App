import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 items-center">
      <Card className="w-full space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">404</p>
        <h1 className="font-display text-3xl font-semibold">That page is out of bounds</h1>
        <p className="text-sm text-muted-foreground">
          The MVP route structure is in place, but this specific page could not be found.
        </p>
        <Link href="/">
          <Button>Back Home</Button>
        </Link>
      </Card>
    </div>
  );
}

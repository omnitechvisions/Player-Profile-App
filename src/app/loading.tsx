import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Card className="h-44 animate-pulse bg-white/70">
        <span className="sr-only">Loading content</span>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-36 animate-pulse bg-white/70">
          <span className="sr-only">Loading panel</span>
        </Card>
        <Card className="h-36 animate-pulse bg-white/70">
          <span className="sr-only">Loading panel</span>
        </Card>
      </div>
    </div>
  );
}

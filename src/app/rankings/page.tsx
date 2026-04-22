import { RankingTable } from "@/components/ranking-table";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { listLeaderboard } from "@/server/services/ranking-service";

export default async function RankingsPage() {
  const leaderboard = await listLeaderboard();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Rankings"
        title="Leaderboard by XP"
        description="Filters are represented for global, region, and sport views. Total XP remains the source of truth for rank."
      />
      <Card className="grid gap-3 md:grid-cols-3">
        <select className="h-11 rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
          <option>Global</option>
          <option>Atlantic</option>
          <option>Ontario</option>
        </select>
        <select className="h-11 rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
          <option>All sports</option>
          <option>Basketball</option>
          <option>Football</option>
        </select>
        <select className="h-11 rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
          <option>Total XP</option>
          <option>Level</option>
        </select>
      </Card>
      <RankingTable rows={leaderboard} />
    </div>
  );
}

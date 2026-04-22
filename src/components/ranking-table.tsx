import Link from "next/link";
import { formatCompactNumber } from "@/lib/utils";
import type { LeaderboardRow } from "@/server/services/ranking-service";

export function RankingTable({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.45)]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-slate-50/80">
          <tr>
            <th className="px-5 py-4 font-medium text-muted-foreground">Rank</th>
            <th className="px-5 py-4 font-medium text-muted-foreground">Player</th>
            <th className="px-5 py-4 font-medium text-muted-foreground">Region</th>
            <th className="px-5 py-4 font-medium text-muted-foreground">Sports</th>
            <th className="px-5 py-4 font-medium text-muted-foreground">XP</th>
            <th className="px-5 py-4 font-medium text-muted-foreground">Level</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.user.id} className="border-b border-border/60 last:border-b-0">
              <td className="px-5 py-4 font-semibold text-slate-900">#{row.rank}</td>
              <td className="px-5 py-4">
                <Link href={`/profile/${row.user.username}`} className="font-medium text-slate-950">
                  {row.user.fullName}
                </Link>
              </td>
              <td className="px-5 py-4 text-muted-foreground">{row.user.region}</td>
              <td className="px-5 py-4 text-muted-foreground">{row.sports.filter(Boolean).join(", ")}</td>
              <td className="px-5 py-4 font-semibold text-slate-900">{formatCompactNumber(row.user.xp)}</td>
              <td className="px-5 py-4 text-muted-foreground">{row.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

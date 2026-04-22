import { Card } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/utils";

export function StatsGrid({
  items,
}: {
  items: { label: string; value: number | string; hint?: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="space-y-2">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="font-display text-3xl font-semibold">
            {typeof item.value === "number" ? formatCompactNumber(item.value) : item.value}
          </p>
          {item.hint ? <p className="text-xs text-muted-foreground">{item.hint}</p> : null}
        </Card>
      ))}
    </div>
  );
}

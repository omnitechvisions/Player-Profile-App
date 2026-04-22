import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

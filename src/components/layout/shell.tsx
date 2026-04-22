import Link from "next/link";
import { Bell, Compass, Medal, ShieldCheck, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/server/actions/auth-actions";
import { getViewerSummary } from "@/server/services/profile-service";

const nav = [
  { href: "/", label: "Home", icon: Compass },
  { href: "/events", label: "Events", icon: ShieldCheck },
  { href: "/clubs", label: "Clubs", icon: UserCircle2 },
  { href: "/rankings", label: "Rankings", icon: Medal },
];

export async function Shell({ children }: { children: React.ReactNode }) {
  const viewer = await getViewerSummary();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fff8ef_25%,#f7f8fb_58%,#eef2ff_100%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_36%),radial-gradient(circle_at_top_left,rgba(251,146,60,0.22),transparent_28%)]" />
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
              PP
            </div>
            <div>
              <p className="font-display text-lg font-semibold">Player Profile</p>
              <p className="text-xs text-muted-foreground">Sports community MVP</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="hidden rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground sm:inline-flex"
            >
              Discover
            </Link>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-white">
              <Bell className="h-4 w-4" />
            </button>
            {viewer ? (
              <>
                <form action={signOutAction} className="hidden sm:block">
                  <button className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
                    Sign Out
                  </button>
                </form>
                <Link
                  href={`/profile/${viewer.username}`}
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white",
                  )}
                >
                  {viewer.avatar}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground sm:inline-flex"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white",
                  )}
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

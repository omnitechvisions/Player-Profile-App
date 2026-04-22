import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Settings"
        title="Private account settings"
        description="This page is intentionally simple in the MVP, with enough structure for profile editing, notification preferences, and account visibility."
      />
      <Card className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium">Display name</span>
          <Input defaultValue="Maya Thompson" />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Region</span>
          <Input defaultValue="Halifax" />
        </label>
        <label className="space-y-2 text-sm lg:col-span-2">
          <span className="font-medium">Bio</span>
          <Textarea defaultValue="Weekend organizer and basketball guard who likes simple, well-run community events." />
        </label>
        <div className="space-y-2 text-sm">
          <span className="font-medium">Visibility</span>
          <select className="h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
            <option>Public profile</option>
            <option>Private profile</option>
          </select>
        </div>
        <div className="space-y-2 text-sm">
          <span className="font-medium">Notifications</span>
          <select className="h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm shadow-sm">
            <option>Placeholder enabled</option>
            <option>Placeholder muted</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <Button>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
}

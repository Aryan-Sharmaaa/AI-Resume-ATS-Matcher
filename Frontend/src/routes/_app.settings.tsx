import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — ResumeRAG" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <section className="rounded-md border bg-card p-6">
        <h2 className="text-sm font-medium">Profile</h2>
        <p className="text-xs text-muted-foreground">Update your account details.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="n">Full name</Label>
            <Input id="n" defaultValue="Alex Kumar" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="e">Email</Label>
            <Input id="e" defaultValue="alex@example.com" className="mt-1.5" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button size="sm">Save changes</Button>
        </div>
      </section>

      <section className="rounded-md border bg-card p-6">
        <h2 className="text-sm font-medium">Preferences</h2>
        <p className="text-xs text-muted-foreground">Notification and analysis defaults.</p>
        <div className="mt-4 space-y-4">
          {[
            { label: "Email me when an analysis finishes", def: true },
            { label: "Include interview questions in every analysis", def: true },
            { label: "Enable AI bullet suggestions", def: false },
          ].map((p) => (
            <div key={p.label} className="flex items-center justify-between">
              <span className="text-sm">{p.label}</span>
              <Switch defaultChecked={p.def} />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-[var(--color-destructive)]/30 bg-card p-6">
        <h2 className="text-sm font-medium text-[var(--color-destructive)]">Danger zone</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Delete your account and all associated data. This cannot be undone.
        </p>
        <Separator className="my-4" />
        <Button variant="outline" size="sm" className="text-[var(--color-destructive)]">
          Delete account
        </Button>
      </section>
    </div>
  );
}

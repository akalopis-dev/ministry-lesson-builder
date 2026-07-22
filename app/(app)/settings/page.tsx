import { Settings as SettingsIcon } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
          <SettingsIcon size={17} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Settings</h1>
          <p className="text-sm text-charcoal-soft">Parish information used across lesson exports.</p>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader title="Parish" subtitle="Organization details used across lesson exports." />
          <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-charcoal-soft">Name</p>
              <p className="mt-1 text-sm text-charcoal">Greek Orthodox Community of London</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

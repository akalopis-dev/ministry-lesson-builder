import { LessonPlansProvider } from "@/lib/store";
import { ActivitiesProvider } from "@/lib/activities-store";
import { CollectionsProvider } from "@/lib/collections-store";
import { ScriptureProvider } from "@/lib/scripture-store";
import { PrayersProvider } from "@/lib/prayers-store";
import { AppShell } from "@/components/layout/app-shell";
import { ToastProvider } from "@/components/ui/toast";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <LessonPlansProvider>
        <ActivitiesProvider>
          <ScriptureProvider>
            <PrayersProvider>
              <CollectionsProvider>
                <AppShell>{children}</AppShell>
              </CollectionsProvider>
            </PrayersProvider>
          </ScriptureProvider>
        </ActivitiesProvider>
      </LessonPlansProvider>
    </ToastProvider>
  );
}

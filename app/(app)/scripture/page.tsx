import { BookOpen } from "lucide-react";
import { ComingSoonPage } from "@/components/layout/coming-soon";

export default function ScripturePage() {
  return (
    <ComingSoonPage
      title="Scripture Library"
      description="A searchable library of passages, readings, and references for lesson planning."
      icon={BookOpen}
      detail="The Scripture Library is being built next. Scripture you add inside a lesson's sources step stays attached to that lesson."
    />
  );
}

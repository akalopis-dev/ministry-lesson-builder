import { HandHelping } from "lucide-react";
import { ComingSoonPage } from "@/components/layout/coming-soon";

export default function PrayersPage() {
  return (
    <ComingSoonPage
      title="Prayer Library"
      description="Opening, closing, and seasonal prayers organized by ministry and context."
      icon={HandHelping}
      detail="The Prayer Library is being built next. Prayers you add inside a lesson's sources step stay attached to that lesson."
    />
  );
}

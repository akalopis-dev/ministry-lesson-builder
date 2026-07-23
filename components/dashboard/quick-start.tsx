"use client";

import { useRouter } from "next/navigation";
import { FilePlus2, LayoutTemplate, Copy, Blocks } from "lucide-react";
import { useState } from "react";
import { useLessonPlans } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function QuickStart() {
  const router = useRouter();
  const { lessons, duplicateLesson } = useLessonPlans();
  const showToast = useToast();
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleDuplicate(id: string) {
    const copy = duplicateLesson(id);
    setPickerOpen(false);
    if (copy) {
      showToast("Lesson duplicated");
      router.push(`/lessons/${copy.id}/edit`);
    }
  }

  const items = [
    {
      icon: FilePlus2,
      label: "Start from blank lesson",
      onClick: () => router.push("/lessons/new"),
    },
    {
      icon: LayoutTemplate,
      label: "Use a template",
      onClick: () => router.push("/templates"),
    },
    {
      icon: Copy,
      label: "Duplicate a past lesson",
      onClick: () => setPickerOpen(true),
    },
    {
      icon: Blocks,
      label: "Build from an activity",
      onClick: () => router.push("/lessons/new?from=activity"),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="flex flex-col items-start gap-2.5 rounded-md border border-border bg-paper px-4 py-3.5 text-left shadow-soft transition-all hover:border-border-strong hover:shadow-elevated"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border-strong bg-surface text-navy">
              <item.icon size={15} strokeWidth={1.75} />
            </div>
            <span className="text-sm font-medium text-charcoal">{item.label}</span>
          </button>
        ))}
      </div>

      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Duplicate a past lesson" width="max-w-lg">
        <div className="max-h-96 space-y-1 overflow-y-auto">
          {lessons.filter((l) => !l.archived).map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => handleDuplicate(lesson.id)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm hover:bg-surface"
            >
              <span>
                <span className="font-medium text-charcoal">{lesson.title}</span>
                <span className="ml-2 text-xs text-charcoal-soft">{lesson.ministry}</span>
              </span>
              <span className="text-xs text-charcoal-soft">Duplicate</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end border-t border-border pt-4">
          <Button variant="secondary" size="sm" onClick={() => setPickerOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}

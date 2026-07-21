import type { LessonBlock } from "./types";

export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

export function totalBlockDuration(blocks: LessonBlock[]): number {
  return blocks.reduce((sum, b) => sum + (b.durationMinutes || 0), 0);
}

function formatClock(minutesFromStart: number, startHour: number, startMinute: number): string {
  const total = startHour * 60 + startMinute + minutesFromStart;
  const h24 = Math.floor(total / 60) % 24;
  const m = total % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const period = h24 < 12 ? "AM" : "PM";
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export interface TimelineSlot {
  block: LessonBlock;
  startLabel: string;
  endLabel: string;
}

export function buildTimelineSlots(
  blocks: LessonBlock[],
  startHour = 18,
  startMinute = 0
): TimelineSlot[] {
  let cursor = 0;
  const slots: TimelineSlot[] = [];
  for (const block of blocks) {
    const startLabel = formatClock(cursor, startHour, startMinute);
    cursor += block.durationMinutes || 0;
    const endLabel = formatClock(cursor, startHour, startMinute);
    slots.push({ block, startLabel, endLabel });
  }
  return slots;
}

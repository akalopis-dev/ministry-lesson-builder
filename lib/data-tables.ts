import "server-only";
import { SEED_LESSONS } from "@/lib/data/seed";
import { ACTIVITIES } from "@/lib/data/activities";

export const TABLES = {
  lessons: { seed: SEED_LESSONS as { id: string }[] },
  activities: { seed: ACTIVITIES as { id: string }[] },
  collections: { seed: null },
} as const;

export type TableName = keyof typeof TABLES;

export function isTableName(value: string): value is TableName {
  return value in TABLES;
}

import type { ActivityCategory, BlockType, PrayerCategory, ScriptureCategory } from "@/lib/types";

export type AccentColor = "navy" | "gold" | "burgundy" | "olive" | "brown" | "sage" | "neutral";

export const ACCENT_TAG_CLASSES: Record<AccentColor, string> = {
  // one-off pair used only for the GOYA ministry tag — not a general navy accent, so kept inline rather than tokenized
  navy: "bg-[#e0eefc] text-[#2f5378]",
  gold: "bg-gold-soft text-gold",
  burgundy: "bg-burgundy-soft text-burgundy",
  olive: "bg-olive-soft text-olive",
  brown: "bg-brown-soft text-brown",
  sage: "bg-sage-soft text-sage",
  neutral: "bg-surface text-charcoal-soft",
};

export const ACCENT_DOT_CLASSES: Record<AccentColor, string> = {
  navy: "bg-[#2f5378]",
  gold: "bg-gold",
  burgundy: "bg-burgundy",
  olive: "bg-olive",
  brown: "bg-brown",
  sage: "bg-sage",
  neutral: "bg-charcoal-soft",
};

/** Groups block types by function: hospitality/logistics, prayer, teaching, discussion, and activity. */
export const BLOCK_TYPE_ACCENTS: Record<BlockType, AccentColor> = {
  Arrival: "gold",
  Welcome: "gold",
  Snack: "gold",
  Break: "gold",
  Announcements: "gold",
  Icebreaker: "gold",
  "Opening prayer": "navy",
  "Closing prayer": "navy",
  "Prayer activity": "navy",
  "Scripture reading": "burgundy",
  Teaching: "burgundy",
  Reflection: "burgundy",
  "Group discussion": "brown",
  "Small-group discussion": "brown",
  Game: "olive",
  Craft: "olive",
  "Service activity": "olive",
  "Take-home challenge": "olive",
  "Custom block": "neutral",
};

export const ACTIVITY_CATEGORY_ACCENTS: Record<ActivityCategory, AccentColor> = {
  Icebreakers: "gold",
  "Team-building activities": "navy",
  "Active games": "olive",
  "Knowledge & faith games": "burgundy",
};

export const SCRIPTURE_CATEGORY_ACCENTS: Record<ScriptureCategory, AccentColor> = {
  "Gospel reading": "navy",
  "Epistle reading": "burgundy",
  "Old Testament reading": "olive",
  Psalm: "gold",
  "Saint quotation": "brown",
  "Church Father quotation": "sage",
};

export const PRAYER_CATEGORY_ACCENTS: Record<PrayerCategory, AccentColor> = {
  "Opening prayer": "gold",
  "Closing prayer": "navy",
  "Meal prayer": "olive",
  "Seasonal prayer": "burgundy",
  "Traditional prayer": "brown",
  Other: "neutral",
};

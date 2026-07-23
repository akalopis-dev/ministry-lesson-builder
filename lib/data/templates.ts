import type { BlockType, Ministry } from "@/lib/types";

export interface TemplateBlock {
  type: BlockType;
  title: string;
  durationMinutes: number;
}

export interface LessonTemplate {
  id: string;
  name: string;
  description: string;
  ministry: Ministry;
  durationMinutes: number;
  blocks: TemplateBlock[];
  trashedAt?: string;
}

export const TEMPLATES: LessonTemplate[] = [
  {
    id: "template-hope-45",
    name: "45-Minute HOPE Lesson",
    description: "A simple, gentle structure for the youngest children — short teaching, a hands-on activity, and prayer.",
    ministry: "HOPE",
    durationMinutes: 45,
    blocks: [
      { type: "Welcome", title: "Welcome", durationMinutes: 5 },
      { type: "Opening prayer", title: "Opening prayer", durationMinutes: 5 },
      { type: "Teaching", title: "Simple teaching", durationMinutes: 10 },
      { type: "Craft", title: "Craft or movement activity", durationMinutes: 15 },
      { type: "Reflection", title: "Review", durationMinutes: 5 },
      { type: "Closing prayer", title: "Closing prayer", durationMinutes: 5 },
    ],
  },
  {
    id: "template-joy-60",
    name: "60-Minute JOY Lesson",
    description: "A balanced session with an icebreaker, Scripture, discussion, and a main activity.",
    ministry: "JOY",
    durationMinutes: 60,
    blocks: [
      { type: "Welcome", title: "Welcome", durationMinutes: 5 },
      { type: "Icebreaker", title: "Icebreaker", durationMinutes: 10 },
      { type: "Opening prayer", title: "Prayer", durationMinutes: 5 },
      { type: "Scripture reading", title: "Scripture", durationMinutes: 10 },
      { type: "Group discussion", title: "Discussion", durationMinutes: 10 },
      { type: "Craft", title: "Main activity", durationMinutes: 15 },
      { type: "Closing prayer", title: "Closing prayer", durationMinutes: 5 },
    ],
  },
  {
    id: "template-goya-90",
    name: "90-Minute GOYA Meeting",
    description: "A full meeting structure with teaching, small-group discussion, and an activity.",
    ministry: "GOYA",
    durationMinutes: 90,
    blocks: [
      { type: "Arrival", title: "Arrival", durationMinutes: 10 },
      { type: "Opening prayer", title: "Opening prayer", durationMinutes: 5 },
      { type: "Icebreaker", title: "Icebreaker", durationMinutes: 10 },
      { type: "Teaching", title: "Main teaching", durationMinutes: 20 },
      { type: "Small-group discussion", title: "Small-group discussion", durationMinutes: 20 },
      { type: "Game", title: "Activity", durationMinutes: 15 },
      { type: "Announcements", title: "Announcements", durationMinutes: 5 },
      { type: "Closing prayer", title: "Closing prayer", durationMinutes: 5 },
    ],
  },
  {
    id: "template-social-120",
    name: "Two-Hour Social and Faith Night",
    description: "A longer social evening balancing food, fellowship, and faith discussion.",
    ministry: "Family Programs",
    durationMinutes: 120,
    blocks: [
      { type: "Arrival", title: "Arrival", durationMinutes: 15 },
      { type: "Game", title: "Game", durationMinutes: 25 },
      { type: "Snack", title: "Food", durationMinutes: 30 },
      { type: "Group discussion", title: "Faith discussion", durationMinutes: 25 },
      { type: "Craft", title: "Group activity", durationMinutes: 20 },
      { type: "Closing prayer", title: "Closing prayer", durationMinutes: 5 },
    ],
  },
  {
    id: "template-service-90",
    name: "Service Project Session",
    description: "A session centered on a hands-on service project, framed by prayer and reflection.",
    ministry: "GOYA",
    durationMinutes: 90,
    blocks: [
      { type: "Welcome", title: "Welcome", durationMinutes: 10 },
      { type: "Opening prayer", title: "Prayer", durationMinutes: 5 },
      { type: "Teaching", title: "Service context", durationMinutes: 10 },
      { type: "Service activity", title: "Project", durationMinutes: 45 },
      { type: "Reflection", title: "Reflection", durationMinutes: 15 },
      { type: "Closing prayer", title: "Closing prayer", durationMinutes: 5 },
    ],
  },
  {
    id: "template-retreat-day",
    name: "Retreat Day",
    description: "A full-day retreat structure with two teaching sessions, small groups, and breaks.",
    ministry: "GOYA",
    durationMinutes: 280,
    blocks: [
      { type: "Arrival", title: "Registration", durationMinutes: 20 },
      { type: "Opening prayer", title: "Morning prayer", durationMinutes: 10 },
      { type: "Teaching", title: "Session one", durationMinutes: 40 },
      { type: "Break", title: "Break", durationMinutes: 15 },
      { type: "Teaching", title: "Session two", durationMinutes: 40 },
      { type: "Snack", title: "Lunch", durationMinutes: 45 },
      { type: "Game", title: "Activity", durationMinutes: 45 },
      { type: "Small-group discussion", title: "Small groups", durationMinutes: 30 },
      { type: "Reflection", title: "Reflection", durationMinutes: 20 },
      { type: "Closing prayer", title: "Closing prayer", durationMinutes: 15 },
    ],
  },
  {
    id: "template-hope-joy-75",
    name: "75-Minute HOPE/JOY Session",
    description: "Y2AM's own Ministry Plan structure for a typical HOPE/JOY meeting — arrival, a timed icebreaker, the main lesson, an active game, and a closing.",
    ministry: "JOY",
    durationMinutes: 75,
    blocks: [
      { type: "Arrival", title: "Arrival / Free Play", durationMinutes: 10 },
      { type: "Opening prayer", title: "Opening Prayer", durationMinutes: 5 },
      { type: "Icebreaker", title: "Icebreaker", durationMinutes: 10 },
      { type: "Teaching", title: "Main Lesson / Discussion", durationMinutes: 20 },
      { type: "Game", title: "Active Game", durationMinutes: 15 },
      { type: "Snack", title: "Snack / Fellowship", durationMinutes: 10 },
      { type: "Closing prayer", title: "Closing Prayer / Wrap-Up", durationMinutes: 5 },
    ],
  },
];

import type { LessonPlan } from "@/lib/types";

export const SEED_LESSONS: LessonPlan[] = [];

export const SEASONAL_SUGGESTIONS = [
  { name: "Nativity", description: "Lessons on the birth of Christ and the light He brings into the world." },
  { name: "Theophany", description: "The Baptism of Christ and the blessing of waters." },
  { name: "Great Lent", description: "Fasting, prayer, almsgiving, and the journey toward Pascha." },
  { name: "Holy Week", description: "Walking with Christ through the Passion toward the Resurrection." },
  { name: "Pascha", description: "The Resurrection of Christ and the joy of the empty tomb." },
  { name: "Pentecost", description: "The descent of the Holy Spirit and the birth of the Church." },
  { name: "Beginning of the Church Year", description: "New beginnings and setting intentions for the ministry year ahead." },
];

export const RESOURCE_COUNTS = {
  activities: 0,
  prayers: 0,
  scripturePassages: 0,
};

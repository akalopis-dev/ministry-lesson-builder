export type Ministry =
  | "HOPE"
  | "JOY"
  | "Junior GOYA"
  | "GOYA"
  | "YAL"
  | "Family Programs";

export const MINISTRIES: Ministry[] = [
  "HOPE",
  "JOY",
  "Junior GOYA",
  "GOYA",
  "YAL",
  "Family Programs",
];

export type LessonStatus =
  | "Draft"
  | "Ready for review"
  | "Changes requested"
  | "Approved"
  | "Scheduled"
  | "Completed";

export const LESSON_STATUSES: LessonStatus[] = [
  "Draft",
  "Ready for review",
  "Changes requested",
  "Approved",
  "Scheduled",
  "Completed",
];

export type LiturgicalSeason =
  | "Anytime"
  | "Beginning of the Church Year"
  | "Nativity"
  | "Theophany"
  | "Great Lent"
  | "Holy Week"
  | "Pascha"
  | "Pentecost";

export const LITURGICAL_SEASONS: LiturgicalSeason[] = [
  "Anytime",
  "Beginning of the Church Year",
  "Nativity",
  "Theophany",
  "Great Lent",
  "Holy Week",
  "Pascha",
  "Pentecost",
];

export const THEMES = [
  "Faith",
  "Prayer",
  "Friendship",
  "Forgiveness",
  "Service",
  "Leadership",
  "Identity",
  "Relationships",
  "Scripture",
  "Sacraments",
  "Saints",
  "The Divine Liturgy",
  "The Church",
  "Stewardship",
  "Compassion",
  "Gratitude",
  "Hope",
  "Peer pressure",
  "Technology",
  "Community",
  "Orthodox Christian life",
] as const;

export type IndoorOutdoor = "Indoor" | "Outdoor" | "Either";

export type ObjectiveKind =
  | "Faith"
  | "Knowledge"
  | "Personal reflection"
  | "Practical application"
  | "Community or service";

export interface LessonObjective {
  id: string;
  kind: ObjectiveKind;
  text: string;
}

export type SourceType =
  | "Bible passage"
  | "Liturgical text"
  | "Prayer"
  | "Saint quotation"
  | "Church Father quotation"
  | "Hymn"
  | "Gospel reading"
  | "Epistle reading"
  | "Orthodox resource link"
  | "Leader notes";

export interface LessonSource {
  id: string;
  type: SourceType;
  reference: string;
  excerpt: string;
  connection: string;
  link?: string;
  citation?: string;
}

export type BlockType =
  | "Arrival"
  | "Welcome"
  | "Opening prayer"
  | "Icebreaker"
  | "Game"
  | "Scripture reading"
  | "Teaching"
  | "Group discussion"
  | "Small-group discussion"
  | "Craft"
  | "Reflection"
  | "Prayer activity"
  | "Service activity"
  | "Snack"
  | "Break"
  | "Announcements"
  | "Closing prayer"
  | "Take-home challenge"
  | "Custom block";

export const BLOCK_TYPES: BlockType[] = [
  "Arrival",
  "Welcome",
  "Opening prayer",
  "Icebreaker",
  "Game",
  "Scripture reading",
  "Teaching",
  "Group discussion",
  "Small-group discussion",
  "Craft",
  "Reflection",
  "Prayer activity",
  "Service activity",
  "Snack",
  "Break",
  "Announcements",
  "Closing prayer",
  "Take-home challenge",
  "Custom block",
];

export type GroupFormat = "Whole group" | "Small groups" | "Pairs" | "Individual";

export interface LessonBlock {
  id: string;
  type: BlockType;
  title: string;
  durationMinutes: number;
  purpose: string;
  instructions: string;
  materials: string;
  leaderResponsible: string;
  groupFormat: GroupFormat;
  preparationNotes: string;
  safetyNotes: string;
  accessibilityNotes: string;
  discussionPrompts: string;
  internalNotes: string;
  collapsed?: boolean;
}

export type DiscussionCategory =
  | "Opening questions"
  | "Comprehension questions"
  | "Personal reflection"
  | "Application questions"
  | "Group discussion"
  | "Leader follow-up prompts";

export const DISCUSSION_CATEGORIES: DiscussionCategory[] = [
  "Opening questions",
  "Comprehension questions",
  "Personal reflection",
  "Application questions",
  "Group discussion",
  "Leader follow-up prompts",
];

export type Difficulty = "Easy" | "Moderate" | "Deep";

export interface DiscussionQuestion {
  id: string;
  category: DiscussionCategory;
  text: string;
  ageGroup?: string;
  difficulty?: Difficulty;
  leaderNote?: string;
  followUp?: string;
}

export type MaterialCategory =
  | "Print materials"
  | "Craft supplies"
  | "Technology"
  | "Food or snacks"
  | "Room setup"
  | "Religious materials"
  | "Safety supplies"
  | "Other";

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  "Print materials",
  "Craft supplies",
  "Technology",
  "Food or snacks",
  "Room setup",
  "Religious materials",
  "Safety supplies",
  "Other",
];

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  quantity?: string;
  costEstimate?: number;
  assignedPurchaser?: string;
  alreadyAvailable: boolean;
  preparationDeadline?: string;
}

export interface PreparationTask {
  id: string;
  label: string;
  done: boolean;
}

export interface SafetyAccessibility {
  hazards: string;
  medicalConsiderations: string;
  allergyConsiderations: string;
  supervisionRequirements: string;
  emergencyConsiderations: string;
  mobilityAccommodations: string;
  sensoryAccommodations: string;
  readingLevelAccommodations: string;
  behaviouralConsiderations: string;
  alternativeActivity: string;
  weatherBackupPlan: string;
}

export interface CommunicationContent {
  parentDescription: string;
  leaderPurpose: string;
  leaderReminders: string;
  takeHomeReflectionQuestion: string;
  takeHomeFamilyPrompt: string;
  takeHomeChallenge: string;
  takeHomePrayer: string;
}

export interface Attachment {
  id: string;
  name: string;
  url?: string;
}

export interface Revision {
  id: string;
  label: string;
  timestamp: string;
}

export type ActivityCategory =
  | "Icebreakers"
  | "Team-building activities"
  | "Active games"
  | "Knowledge & faith games";

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  "Icebreakers",
  "Team-building activities",
  "Active games",
  "Knowledge & faith games",
];

export type SupplyLevel = "No supplies" | "Some supplies";

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  ministries: Ministry[];
  duration: string;
  suppliesLevel: SupplyLevel;
  summary: string;
  source: string;
  adaptationNote?: string;
  tags?: string[];
  favorite?: boolean;
  trashedAt?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  lessonIds: string[];
  activityIds: string[];
  createdAt: string;
  trashedAt?: string;
}

export type ScriptureCategory =
  | "Gospel reading"
  | "Epistle reading"
  | "Old Testament reading"
  | "Psalm"
  | "Saint quotation"
  | "Church Father quotation";

export const SCRIPTURE_CATEGORIES: ScriptureCategory[] = [
  "Gospel reading",
  "Epistle reading",
  "Old Testament reading",
  "Psalm",
  "Saint quotation",
  "Church Father quotation",
];

export interface ScripturePassage {
  id: string;
  reference: string;
  title: string;
  category: ScriptureCategory;
  ministries: Ministry[];
  text: string;
  connection: string;
  source?: string;
  tags?: string[];
  favorite?: boolean;
  trashedAt?: string;
}

export type PrayerCategory =
  | "Opening prayer"
  | "Closing prayer"
  | "Meal prayer"
  | "Seasonal prayer"
  | "Traditional prayer"
  | "Other";

export const PRAYER_CATEGORIES: PrayerCategory[] = [
  "Opening prayer",
  "Closing prayer",
  "Meal prayer",
  "Seasonal prayer",
  "Traditional prayer",
  "Other",
];

export interface Prayer {
  id: string;
  title: string;
  category: PrayerCategory;
  ministries: Ministry[];
  text: string;
  source?: string;
  tags?: string[];
  favorite?: boolean;
  trashedAt?: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  ministry: Ministry;
  ageRange: string;
  gradeRange?: string;
  theme: string;
  subtheme?: string;
  season: LiturgicalSeason;
  date?: string;
  durationMinutes: number;
  groupSize?: string;
  indoorOutdoor: IndoorOutdoor;
  leadFacilitator: string;
  additionalLeaders?: string;
  status: LessonStatus;
  summary: string;
  internalNotes?: string;

  objectives: LessonObjective[];
  sources: LessonSource[];
  blocks: LessonBlock[];
  discussionQuestions: DiscussionQuestion[];
  materials: Material[];
  preparationTasks: PreparationTask[];
  safety: SafetyAccessibility;
  communication: CommunicationContent;
  attachments: Attachment[];
  revisions: Revision[];

  author: string;
  isSample?: boolean;
  archived?: boolean;
  favorite?: boolean;
  createdAt: string;
  updatedAt: string;
  location?: string;
  trashedAt?: string;
}

export function emptySafety(): SafetyAccessibility {
  return {
    hazards: "",
    medicalConsiderations: "",
    allergyConsiderations: "",
    supervisionRequirements: "",
    emergencyConsiderations: "",
    mobilityAccommodations: "",
    sensoryAccommodations: "",
    readingLevelAccommodations: "",
    behaviouralConsiderations: "",
    alternativeActivity: "",
    weatherBackupPlan: "",
  };
}

export function emptyCommunication(): CommunicationContent {
  return {
    parentDescription: "",
    leaderPurpose: "",
    leaderReminders: "",
    takeHomeReflectionQuestion: "",
    takeHomeFamilyPrompt: "",
    takeHomeChallenge: "",
    takeHomePrayer: "",
  };
}

let idCounter = 0;
export function makeId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

export function makeBlock(
  partial: Partial<LessonBlock> & Pick<LessonBlock, "type" | "title" | "durationMinutes">
): LessonBlock {
  return {
    id: makeId("block"),
    purpose: "",
    instructions: "",
    materials: "",
    leaderResponsible: "",
    groupFormat: "Whole group",
    preparationNotes: "",
    safetyNotes: "",
    accessibilityNotes: "",
    discussionPrompts: "",
    internalNotes: "",
    ...partial,
  };
}

export function blankLessonPlan(): LessonPlan {
  const now = new Date().toISOString();
  return {
    id: makeId("lesson"),
    title: "",
    ministry: "JOY",
    ageRange: "",
    theme: "",
    season: "Anytime",
    durationMinutes: 60,
    indoorOutdoor: "Indoor",
    leadFacilitator: "",
    status: "Draft",
    summary: "",
    objectives: [],
    sources: [],
    blocks: [],
    discussionQuestions: [],
    materials: [],
    preparationTasks: [],
    safety: emptySafety(),
    communication: emptyCommunication(),
    attachments: [],
    revisions: [{ id: makeId("rev"), label: "Lesson created", timestamp: now }],
    author: "",
    createdAt: now,
    updatedAt: now,
  };
}

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Pencil,
  Copy,
  Printer,
  MoreHorizontal,
  Presentation,
  Clock,
  Users2,
  CalendarDays,
  MapPin,
  Star,
  User,
} from "lucide-react";
import type { LessonPlan } from "@/lib/types";
import { StatusBadge, Tag, BlockTypeTag, MinistryTag } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatMinutes, buildTimelineSlots } from "@/lib/time";
import { Section } from "./section";

export type PrintMode = "full" | "leader" | "parent" | "materials" | "runsheet" | "handout";

const MODE_LABELS: Record<PrintMode, string> = {
  full: "Full lesson",
  leader: "Leader version",
  parent: "Parent summary",
  materials: "Materials checklist",
  runsheet: "One-page run sheet",
  handout: "Participant handout",
};

function visibleSections(mode: PrintMode, presenter: boolean): Set<string> {
  if (presenter) return new Set(["overview", "timeline"]);
  switch (mode) {
    case "leader":
      return new Set(["overview", "objectives", "sources", "timeline", "materials", "preparation", "safety", "leaders", "revisions"]);
    case "parent":
      return new Set(["overview", "parent-comms"]);
    case "materials":
      return new Set(["materials", "preparation"]);
    case "runsheet":
      return new Set(["overview", "runsheet"]);
    case "handout":
      return new Set(["objectives", "discussion", "take-home"]);
    default:
      return new Set([
        "overview",
        "objectives",
        "sources",
        "timeline",
        "discussion",
        "materials",
        "preparation",
        "safety",
        "leaders",
        "parent-comms",
        "attachments",
        "revisions",
      ]);
  }
}

export function LessonDetailView({
  lesson,
  initialPrintMode,
  onEdit,
  onDuplicate,
  onExport,
  onArchive,
  onDelete,
  onUpdateLesson,
  onToggleFavorite,
}: {
  lesson: LessonPlan;
  initialPrintMode?: PrintMode;
  onEdit: () => void;
  onDuplicate: () => void;
  onExport: (mode: PrintMode) => void;
  onArchive: () => void;
  onDelete: () => void;
  onUpdateLesson: (lesson: LessonPlan) => void;
  onToggleFavorite: () => void;
}) {
  const [presenter, setPresenter] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const mode = initialPrintMode ?? "full";
  const sections = visibleSections(mode, presenter);
  const slots = buildTimelineSlots(lesson.blocks);

  function toggleMaterial(id: string) {
    onUpdateLesson({
      ...lesson,
      materials: lesson.materials.map((m) => (m.id === id ? { ...m, alreadyAvailable: !m.alreadyAvailable } : m)),
    });
  }

  function togglePrepTask(id: string) {
    onUpdateLesson({
      ...lesson,
      preparationTasks: lesson.preparationTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10 print:max-w-none print:px-8">
      {mode !== "full" && (
        <div className="no-print mb-4 rounded-md border border-gold/40 bg-gold-soft px-4 py-2 text-xs font-medium text-[#7a5a20]">
          Viewing export preview: {MODE_LABELS[mode]}.{" "}
          <Link href={`/lessons/${lesson.id}`} className="underline">
            View full lesson
          </Link>
        </div>
      )}

      <div className="no-print flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-charcoal-soft">
          <Link href="/lessons" className="hover:underline">
            Lesson Plans
          </Link>
          <span>/</span>
          <span className="text-charcoal">{lesson.title}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPresenter((p) => !p)}
            className="flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-sm text-charcoal hover:bg-surface"
          >
            <Presentation size={14} /> {presenter ? "Exit run-sheet view" : "Run-sheet view"}
          </button>
          <button
            onClick={onToggleFavorite}
            title={lesson.favorite ? "Remove from favorites" : "Add to favorites"}
            className={`flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-sm hover:bg-gold-soft ${lesson.favorite ? "text-gold" : "text-charcoal hover:text-gold"}`}
          >
            <Star size={14} className={lesson.favorite ? "fill-current" : ""} /> {lesson.favorite ? "Favorited" : "Favorite"}
          </button>
          <button onClick={onEdit} className="flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-sm text-charcoal hover:bg-surface">
            <Pencil size={14} /> Edit
          </button>
          <button onClick={onDuplicate} className="flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-sm text-charcoal hover:bg-surface">
            <Copy size={14} /> Duplicate
          </button>
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-sm text-charcoal hover:bg-surface"
            >
              <Printer size={14} /> Export
            </button>
            {exportMenuOpen && (
              <div className="absolute right-0 z-20 mt-1 w-52 rounded-md border border-border bg-paper py-1 shadow-floating">
                {(Object.keys(MODE_LABELS) as PrintMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setExportMenuOpen(false);
                      onExport(m);
                    }}
                    className="block w-full px-3 py-1.5 text-left text-sm text-charcoal hover:bg-surface"
                  >
                    {MODE_LABELS[m]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen((o) => !o)}
              className="rounded-md border border-border-strong p-1.5 text-charcoal hover:bg-surface"
            >
              <MoreHorizontal size={16} />
            </button>
            {moreMenuOpen && (
              <div className="absolute right-0 z-20 mt-1 w-44 rounded-md border border-border bg-paper py-1 shadow-floating">
                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onArchive();
                  }}
                  className="block w-full px-3 py-1.5 text-left text-sm text-charcoal hover:bg-surface"
                >
                  Archive lesson
                </button>
                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onDelete();
                  }}
                  className="block w-full px-3 py-1.5 text-left text-sm text-burgundy hover:bg-burgundy-soft"
                >
                  Delete lesson
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <header className="mt-5">
        {lesson.isSample && <Tag className="mb-2">Sample content</Tag>}
        <h1 className="font-heading text-3xl font-semibold text-navy">{lesson.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-charcoal-soft">
          <MinistryTag ministry={lesson.ministry} />
          {lesson.leadFacilitator && (
            <span className="flex items-center gap-1.5">
              <User size={14} /> {lesson.leadFacilitator}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {formatMinutes(lesson.durationMinutes)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users2 size={14} /> {lesson.ageRange}
          </span>
          {lesson.date && (
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} /> {new Date(`${lesson.date}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          )}
          {lesson.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {lesson.location}
            </span>
          )}
          <StatusBadge status={lesson.status} />
        </div>
      </header>

      <div className="mt-8 space-y-6 print:mt-6 print:space-y-5">
        {sections.has("overview") && (
          <Section title="Overview">
            <p className="text-sm text-charcoal">{lesson.summary || "No summary provided."}</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-charcoal-soft">Theme</dt>
                <dd className="text-charcoal">{lesson.theme}{lesson.subtheme ? ` — ${lesson.subtheme}` : ""}</dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-soft">Liturgical season</dt>
                <dd className="text-charcoal">{lesson.season}</dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-soft">Setting</dt>
                <dd className="text-charcoal">{lesson.indoorOutdoor}</dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-soft">Group size</dt>
                <dd className="text-charcoal">{lesson.groupSize || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-charcoal-soft">Author</dt>
                <dd className="text-charcoal">{lesson.author || "—"}</dd>
              </div>
            </dl>
          </Section>
        )}

        {sections.has("objectives") && (
          <Section title="Objectives">
            {lesson.objectives.length === 0 ? (
              <p className="text-sm text-charcoal-soft">No objectives added.</p>
            ) : (
              <ul className="space-y-2">
                {lesson.objectives.map((o) => (
                  <li key={o.id} className="text-sm text-charcoal">
                    <Tag className="mr-2">{o.kind}</Tag>
                    {o.text}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}

        {sections.has("sources") && (
          <Section title="Scripture and sources">
            {lesson.sources.length === 0 ? (
              <p className="text-sm text-charcoal-soft">No sources added.</p>
            ) : (
              <div className="space-y-3">
                {lesson.sources.map((s) => (
                  <div key={s.id} className="rounded-md border border-border px-4 py-3">
                    <p className="text-sm font-medium text-navy">
                      {s.reference} <span className="ml-2 text-xs font-normal text-charcoal-soft">{s.type}</span>
                    </p>
                    {s.excerpt && <p className="mt-1 text-sm italic text-charcoal">{s.excerpt}</p>}
                    {s.connection && <p className="mt-1 text-xs text-charcoal-soft">{s.connection}</p>}
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {sections.has("runsheet") && (
          <Section title="Run sheet">
            <ol className="space-y-1.5">
              {slots.map(({ block, startLabel, endLabel }) => (
                <li key={block.id} className="flex justify-between border-b border-border/70 py-1.5 text-sm">
                  <span className="text-charcoal-soft">{startLabel}–{endLabel}</span>
                  <span className="flex-1 px-3 font-medium text-charcoal">{block.title}</span>
                  <span className="text-charcoal-soft">{block.leaderResponsible}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {sections.has("timeline") && (
          <Section title="Lesson timeline">
            {slots.length === 0 ? (
              <p className="text-sm text-charcoal-soft">No timeline blocks added.</p>
            ) : (
              <div className="space-y-3">
                {slots.map(({ block, startLabel, endLabel }) => (
                  <div key={block.id} className="rounded-md border border-border px-4 py-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-charcoal">
                        <span className="mr-2 text-charcoal-soft">{startLabel}–{endLabel}</span>
                        {block.title}
                        <BlockTypeTag type={block.type} className="ml-2" />
                      </p>
                      <span className="text-xs text-charcoal-soft">{block.durationMinutes} min · {block.leaderResponsible || "Unassigned"}</span>
                    </div>
                    {(block.purpose || presenter) && block.purpose && <p className="mt-1.5 text-xs text-charcoal-soft"><b>Purpose:</b> {block.purpose}</p>}
                    {block.instructions && <p className="mt-1 text-sm text-charcoal">{block.instructions}</p>}
                    {block.materials && <p className="mt-1 text-xs text-charcoal-soft"><b>Materials:</b> {block.materials}</p>}
                    {block.discussionPrompts && <p className="mt-1 text-xs text-charcoal-soft"><b>Discussion:</b> {block.discussionPrompts}</p>}
                    {!presenter && block.safetyNotes && <p className="mt-1 text-xs text-burgundy"><b>Safety:</b> {block.safetyNotes}</p>}
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {sections.has("discussion") && (
          <Section title="Discussion questions">
            {lesson.discussionQuestions.length === 0 ? (
              <p className="text-sm text-charcoal-soft">No discussion questions added.</p>
            ) : (
              <div className="space-y-4">
                {Array.from(new Set(lesson.discussionQuestions.map((q) => q.category))).map((cat) => (
                  <div key={cat}>
                    <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">{cat}</p>
                    <ul className="mt-1 space-y-1">
                      {lesson.discussionQuestions.filter((q) => q.category === cat).map((q) => (
                        <li key={q.id} className="text-sm text-charcoal">
                          {q.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        {sections.has("materials") && (
          <Section title="Materials">
            {lesson.materials.length === 0 ? (
              <p className="text-sm text-charcoal-soft">No materials listed.</p>
            ) : (
              <ul className="space-y-1.5">
                {lesson.materials.map((m) => (
                  <li key={m.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={m.alreadyAvailable} onChange={() => toggleMaterial(m.id)} className="h-4 w-4" />
                    <span className={m.alreadyAvailable ? "text-charcoal-soft line-through" : "text-charcoal"}>{m.name}</span>
                    {m.quantity && <span className="text-xs text-charcoal-soft">× {m.quantity}</span>}
                    <span className="text-xs text-charcoal-soft">({m.category})</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}

        {sections.has("preparation") && (
          <Section title="Preparation">
            {lesson.preparationTasks.length === 0 ? (
              <p className="text-sm text-charcoal-soft">No preparation tasks listed.</p>
            ) : (
              <ul className="space-y-1.5">
                {lesson.preparationTasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={t.done} onChange={() => togglePrepTask(t.id)} className="h-4 w-4" />
                    <span className={t.done ? "text-charcoal-soft line-through" : "text-charcoal"}>{t.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}

        {sections.has("safety") && (
          <Section title="Safety and accessibility">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(lesson.safety)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-charcoal-soft">
                      {k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
                    </dt>
                    <dd className="text-sm text-charcoal">{v}</dd>
                  </div>
                ))}
            </dl>
          </Section>
        )}

        {sections.has("leaders") && (
          <Section title="Leader roles">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-charcoal-soft">Lead facilitator</dt>
                <dd className="mt-1.5 flex items-center gap-2 text-sm text-charcoal">
                  <Avatar name={lesson.leadFacilitator} size="sm" />
                  {lesson.leadFacilitator}
                </dd>
              </div>
              {lesson.additionalLeaders && (
                <div>
                  <dt className="text-xs text-charcoal-soft">Additional leaders</dt>
                  <dd className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-charcoal">
                    {lesson.additionalLeaders.split(",").map((name) => (
                      <span key={name} className="flex items-center gap-2">
                        <Avatar name={name.trim()} size="sm" />
                        {name.trim()}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </Section>
        )}

        {sections.has("parent-comms") && (
          <Section title="Parent communication">
            <p className="text-sm text-charcoal">{lesson.communication.parentDescription || "No parent summary written yet."}</p>
          </Section>
        )}

        {sections.has("take-home") && (
          <Section title="Take-home">
            <ul className="space-y-2 text-sm text-charcoal">
              {lesson.communication.takeHomeReflectionQuestion && <li><b>Reflect:</b> {lesson.communication.takeHomeReflectionQuestion}</li>}
              {lesson.communication.takeHomeFamilyPrompt && <li><b>Family discussion:</b> {lesson.communication.takeHomeFamilyPrompt}</li>}
              {lesson.communication.takeHomeChallenge && <li><b>This week&rsquo;s challenge:</b> {lesson.communication.takeHomeChallenge}</li>}
              {lesson.communication.takeHomePrayer && <li><b>Prayer:</b> {lesson.communication.takeHomePrayer}</li>}
            </ul>
          </Section>
        )}

        {sections.has("attachments") && (
          <Section title="Attachments">
            <p className="text-sm text-charcoal-soft">{lesson.attachments.length === 0 ? "No attachments." : `${lesson.attachments.length} attachment(s).`}</p>
          </Section>
        )}

        {sections.has("revisions") && (
          <Section title="Revision history" className="no-print">
            <ul className="space-y-1.5">
              {lesson.revisions.map((r) => (
                <li key={r.id} className="flex justify-between text-sm">
                  <span className="text-charcoal">{r.label}</span>
                  <span className="text-charcoal-soft">{new Date(r.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

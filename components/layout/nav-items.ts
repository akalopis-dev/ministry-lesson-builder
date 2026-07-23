import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  NotebookText,
  SquarePen,
  Blocks,
  BookOpen,
  HandHelping,
  LayoutTemplate,
  FolderKanban,
  Archive,
  Settings,
  CalendarDays,
  Star,
  Search,
  Trash2,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  builtIn?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, builtIn: true }],
  },
  {
    label: "Plan",
    items: [
      { label: "Create Lesson", href: "/lessons/new", icon: SquarePen, builtIn: true },
      { label: "Lesson Plans", href: "/lessons", icon: NotebookText, builtIn: true },
      { label: "Activity Library", href: "/activities", icon: Blocks },
      { label: "Scripture Library", href: "/scripture", icon: BookOpen },
      { label: "Prayer Library", href: "/prayers", icon: HandHelping },
      { label: "Templates", href: "/templates", icon: LayoutTemplate },
      { label: "Collections", href: "/collections", icon: FolderKanban },
    ],
  },
  {
    label: "Organize",
    items: [
      { label: "Favorites", href: "/favorites", icon: Star },
      { label: "Search", href: "/search", icon: Search },
      { label: "Calendar", href: "/calendar", icon: CalendarDays },
      { label: "Archived", href: "/archived", icon: Archive },
      { label: "Trash", href: "/trash", icon: Trash2 },
    ],
  },
];

export const SETTINGS_ITEM: NavItem = { label: "Settings", href: "/settings", icon: Settings };

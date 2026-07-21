"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { NAV_GROUPS, SETTINGS_ITEM } from "./nav-items";

function isActive(pathname: string, href: string) {
  if (href === "/lessons/new") return pathname === href;
  if (href === "/lessons") return pathname === "/lessons" || (pathname.startsWith("/lessons/") && pathname !== "/lessons/new" && !pathname.startsWith("/lessons/new"));
  return pathname === href || pathname.startsWith(href + "/");
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-navy text-paper">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-paper/10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper">
          <Image src="/logo.avif" alt="Greek Orthodox Community of London crest" width={40} height={40} className="h-full w-full object-contain" priority />
        </div>
        <div className="leading-tight">
          <p className="font-heading text-sm font-semibold text-paper">Ministry Lesson Builder</p>
          <p className="text-[11px] text-paper/55">Greek Orthodox Community of London</p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-widest text-sidebar-label">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-full px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-sidebar-active font-bold text-sidebar-text-active"
                          : "font-medium text-sidebar-text-inactive hover:bg-sidebar-hover hover:text-sidebar-text-active"
                      )}
                    >
                      <Icon size={16} strokeWidth={1.75} className={active ? "text-sidebar-icon-active" : "text-sidebar-icon-inactive"} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-paper/10 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <Avatar name="Angela Kalopisis" size="md" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm text-paper">Angela Kalopisis</p>
            <p className="truncate text-[11px] text-sidebar-footnote">Ministry Coordinator</p>
          </div>
        </div>

        <Link
          href={SETTINGS_ITEM.href}
          onClick={onNavigate}
          className={cn(
            "mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
            isActive(pathname, SETTINGS_ITEM.href) ? "bg-paper/10 text-paper font-medium" : "text-paper/65 hover:bg-paper/5 hover:text-paper"
          )}
        >
          <SETTINGS_ITEM.icon size={16} strokeWidth={1.75} />
          {SETTINGS_ITEM.label}
        </Link>

        <Link
          href="/help"
          onClick={onNavigate}
          className={cn(
            "mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
            isActive(pathname, "/help") ? "bg-paper/10 text-paper font-medium" : "text-paper/65 hover:bg-paper/5 hover:text-paper"
          )}
        >
          <HelpCircle size={16} strokeWidth={1.75} />
          Help &amp; how to use
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="fixed h-screen w-60 shadow-[2px_0_12px_rgb(31_42_68/0.10)]">
        <SidebarContent />
      </div>
    </aside>
  );
}

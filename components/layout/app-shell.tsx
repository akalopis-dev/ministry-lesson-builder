"use client";

import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarContent } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-charcoal/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-[80%]">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-md p-1.5 text-paper/70 hover:bg-paper/10"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print flex items-center gap-3 border-b border-border bg-paper px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md border border-border-strong p-2 text-charcoal"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <span className="flex-1 font-heading text-sm font-semibold text-navy">Ministry Lesson Builder</span>
          <button
            onClick={() => router.push("/search")}
            className="rounded-md border border-border-strong p-2 text-charcoal"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </header>

        <header className="no-print hidden items-center justify-end border-b border-border bg-paper px-6 py-3 lg:flex">
          <form onSubmit={handleSearch} className="relative w-80">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lessons, activities, Scripture, prayers..."
              className="w-full rounded-md border border-border-strong bg-surface/50 py-1.5 pl-9 pr-3 text-sm placeholder:text-charcoal-soft/70 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:bg-paper"
            />
          </form>
        </header>

        <main className="flex-1 bg-paper">{children}</main>
      </div>
    </div>
  );
}

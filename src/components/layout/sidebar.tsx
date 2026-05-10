"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import { useMediaQuery } from "@/hooks";
import { LayoutDashboard, Map, Plus, Compass, DollarSign, ClipboardList, BookOpen, Share2, User, X } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Map },
  { href: "/trips/new", label: "New Trip", icon: Plus },
  { href: "/explore", label: "Explore Cities", icon: Compass },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const tripId = pathname?.match(/\/trips\/([^/]+)/)?.[1];
  const isValidTripId = tripId && tripId !== "new";

  const tripSubItems = isValidTripId ? [
    { href: `/trips/${tripId}`, label: "Overview", icon: Map },
    { href: `/trips/${tripId}/itinerary`, label: "Itinerary", icon: ClipboardList },
    { href: `/trips/${tripId}/budget`, label: "Budget", icon: DollarSign },
    { href: `/trips/${tripId}/packing`, label: "Packing", icon: ClipboardList },
    { href: `/trips/${tripId}/notes`, label: "Notes", icon: BookOpen },
    { href: `/trips/${tripId}/share`, label: "Share", icon: Share2 },
  ] : [];

  if (isMobile && !sidebarOpen) return null;

  const sidebarContent = (
    <div className="flex flex-col h-full pt-20 pb-6 px-3">
      {isMobile && (
        <button onClick={() => setSidebarOpen(false)} className="absolute top-20 right-3 p-2 rounded-lg hover:bg-white/5" aria-label="Close sidebar">
          <X size={18} />
        </button>
      )}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? "bg-accent/10 text-accent" : "text-muted hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {isActive && (
                <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-6 rounded-r-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>

      {tripSubItems.length > 0 && (
        <div className="mt-6 space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Current Trip</p>
          {tripSubItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? "bg-accent/10 text-accent" : "text-muted hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] glass-strong z-50 overflow-y-auto"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] glass border-r border-border/50 overflow-y-auto hidden lg:block">
      {sidebarContent}
    </aside>
  );
}

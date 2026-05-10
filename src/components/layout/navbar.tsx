"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import { Menu, X, LogOut, User, Globe } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, sidebarOpen, toggleSidebar } = useAppStore();
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup") || pathname?.startsWith("/forgot-password");
  const isLanding = pathname === "/";

  if (isAuthPage) return null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          {user && !isLanding && (
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-white/5 transition-colors lg:hidden" aria-label="Toggle menu">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">Traveloop</span>
          </Link>
        </div>

        {isLanding && !user && (
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm">Log in</Link>
            <Link href="/signup" className="btn-primary text-sm">Sign up free</Link>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-2">
            <Link href="/profile" className="p-2 rounded-lg hover:bg-white/5 transition-colors" aria-label="Profile">
              <User size={18} className="text-muted" />
            </Link>
            <button onClick={() => { logout(); window.location.href = "/"; }} className="p-2 rounded-lg hover:bg-white/5 transition-colors" aria-label="Logout">
              <LogOut size={18} className="text-muted" />
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

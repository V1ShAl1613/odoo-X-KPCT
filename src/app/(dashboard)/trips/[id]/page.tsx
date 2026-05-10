"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getTrip } from "@/lib/local-db";
import { getCoverStyle } from "@/services/unsplash";
import { formatCurrency, formatDateRange, getDaysBetween, BUDGET_CATEGORIES } from "@/lib/utils";
import type { Trip } from "@/types";
import { MapPin, Calendar, DollarSign, ClipboardList, BookOpen, Share2, CheckCircle, ArrowRight } from "lucide-react";

export default function TripDetailPage() {
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (params.id) setTrip(getTrip(params.id as string));
  }, [params.id]);

  if (!trip) return <div className="flex items-center justify-center h-64"><span className="text-muted">Loading...</span></div>;

  const totalSpent = trip.budgets?.reduce((s, b) => s + b.amount, 0) || 0;
  const packedCount = trip.packing_items?.filter((p) => p.is_packed).length || 0;
  const totalPacking = trip.packing_items?.length || 0;
  const budgetPercent = trip.budget_limit ? Math.min((totalSpent / trip.budget_limit) * 100, 100) : 0;

  const quickLinks = [
    { href: `/trips/${trip.id}/itinerary`, label: "Itinerary", icon: ClipboardList, desc: `${trip.stops?.length || 0} stops` },
    { href: `/trips/${trip.id}/budget`, label: "Budget", icon: DollarSign, desc: formatCurrency(totalSpent) },
    { href: `/trips/${trip.id}/packing`, label: "Packing", icon: CheckCircle, desc: `${packedCount}/${totalPacking}` },
    { href: `/trips/${trip.id}/notes`, label: "Notes", icon: BookOpen, desc: `${trip.notes?.length || 0} notes` },
    { href: `/trips/${trip.id}/share`, label: "Share", icon: Share2, desc: trip.shared_itinerary?.is_active ? "Active" : "Not shared" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-48 md:h-64" style={getCoverStyle(trip.cover_image, trip.id)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${trip.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-violet-500/20 text-violet-400"}`}>{trip.status}</span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{trip.name}</h1>
          {trip.description && <p className="text-sm text-white/70 mt-1 max-w-lg">{trip.description}</p>}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {trip.start_date && trip.end_date && (
          <div className="glass rounded-xl p-4">
            <Calendar size={16} className="text-accent mb-2" />
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-semibold">{getDaysBetween(trip.start_date, trip.end_date)} days</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatDateRange(trip.start_date, trip.end_date)}</p>
          </div>
        )}
        <div className="glass rounded-xl p-4">
          <MapPin size={16} className="text-cyan-400 mb-2" />
          <p className="text-xs text-muted-foreground">Stops</p>
          <p className="text-sm font-semibold">{trip.stops?.length || 0} cities</p>
        </div>
        <div className="glass rounded-xl p-4">
          <DollarSign size={16} className="text-emerald-400 mb-2" />
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="text-sm font-semibold">{formatCurrency(totalSpent)} <span className="text-muted-foreground font-normal">/ {trip.budget_limit ? formatCurrency(trip.budget_limit) : "∞"}</span></p>
          {trip.budget_limit && (
            <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${budgetPercent > 90 ? "bg-danger" : budgetPercent > 70 ? "bg-warning" : "bg-emerald-400"}`} style={{ width: `${budgetPercent}%` }} />
            </div>
          )}
        </div>
        <div className="glass rounded-xl p-4">
          <CheckCircle size={16} className="text-amber-400 mb-2" />
          <p className="text-xs text-muted-foreground">Packed</p>
          <p className="text-sm font-semibold">{totalPacking > 0 ? `${Math.round((packedCount / totalPacking) * 100)}%` : "0 items"}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <motion.div whileHover={{ y: -2 }} className="glass rounded-xl p-4 flex items-center justify-between group hover:border-accent/20 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <link.icon size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Stops Preview */}
      {trip.stops && trip.stops.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Route</h2>
          <div className="flex flex-wrap items-center gap-2">
            {trip.stops.map((stop, i) => (
              <div key={stop.id} className="flex items-center gap-2">
                <span className="glass px-3 py-1.5 rounded-full text-sm font-medium">{stop.city_name}</span>
                {i < (trip.stops?.length || 0) - 1 && <ArrowRight size={14} className="text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

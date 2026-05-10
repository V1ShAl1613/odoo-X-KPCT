"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getSharedByToken } from "@/lib/local-db";
import { getCoverStyle } from "@/services/unsplash";
import { formatDateRange, formatCurrency, getDaysBetween } from "@/lib/utils";
import type { Trip, SharedItinerary } from "@/types";
import { Globe, Calendar, MapPin, DollarSign, ArrowRight, Clock, Copy, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PublicSharePage() {
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [, setShared] = useState<SharedItinerary | null>(null);
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.token) return;
    const result = getSharedByToken(params.token as string);
    if (result) { setTrip(result.trip); setShared(result.shared); }
    else setNotFound(true);
  }, [params.token]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true); toast.success("Link copied!"); setTimeout(() => setCopied(false), 2000);
  };

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><span className="text-6xl block mb-4">🔒</span><h1 className="text-2xl font-bold mb-2">Itinerary Not Found</h1><p className="text-muted mb-6">This link may have expired or been removed.</p><Link href="/" className="btn-primary">Go to Traveloop</Link></div>
    </div>
  );

  if (!trip) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;

  const totalSpent = trip.budgets?.reduce((s, b) => s + b.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="glass-strong sticky top-0 z-50 px-4 md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center"><Globe size={14} className="text-white" /></div><span className="font-bold gradient-text text-sm">Traveloop</span></Link>
        <button onClick={copyLink} className="btn-secondary text-xs py-1.5">{copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Link</>}</button>
      </nav>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden h-48 md:h-64" style={getCoverStyle(trip.cover_image, trip.id)}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{trip.name}</h1>
            {trip.description && <p className="text-sm text-white/70 mt-1">{trip.description}</p>}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trip.start_date && trip.end_date && <div className="glass rounded-xl p-4"><Calendar size={14} className="text-accent mb-1" /><p className="text-sm font-semibold">{getDaysBetween(trip.start_date, trip.end_date)} days</p><p className="text-xs text-muted-foreground">{formatDateRange(trip.start_date, trip.end_date)}</p></div>}
          <div className="glass rounded-xl p-4"><MapPin size={14} className="text-cyan-400 mb-1" /><p className="text-sm font-semibold">{trip.stops?.length || 0} cities</p></div>
          <div className="glass rounded-xl p-4"><DollarSign size={14} className="text-emerald-400 mb-1" /><p className="text-sm font-semibold">{formatCurrency(totalSpent)}</p><p className="text-xs text-muted-foreground">estimated cost</p></div>
        </div>

        {/* Route */}
        {trip.stops && trip.stops.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-2">
            {trip.stops.map((s, i) => (<div key={s.id} className="flex items-center gap-2"><span className="glass px-3 py-1.5 rounded-full text-sm font-medium">{s.city_name}</span>{i < (trip.stops?.length || 0) - 1 && <ArrowRight size={14} className="text-muted-foreground" />}</div>))}
          </div>
        )}

        {/* Itinerary */}
        {trip.stops && trip.stops.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Itinerary</h2>
            {trip.stops.map((stop, idx) => (
              <div key={stop.id} className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">{idx + 1}</div>
                  <div><h3 className="font-semibold">{stop.city_name}{stop.country && <span className="text-muted-foreground font-normal">, {stop.country}</span>}</h3>{stop.arrival_date && <p className="text-xs text-muted-foreground">{stop.arrival_date} → {stop.departure_date}</p>}</div>
                </div>
                {stop.activities && stop.activities.length > 0 && (
                  <div className="ml-11 space-y-2">
                    {stop.activities.map(act => (
                      <div key={act.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03]">
                        <Clock size={12} className="text-accent shrink-0" />
                        <span className="text-sm">{act.custom_name}</span>
                        {act.scheduled_time && <span className="text-xs text-muted-foreground ml-auto">{act.scheduled_time}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center py-8">
          <p className="text-muted text-sm mb-3">Made with Traveloop</p>
          <Link href="/signup" className="btn-primary">Plan Your Own Trip</Link>
        </div>
      </div>
    </div>
  );
}

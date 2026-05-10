"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import { getCoverStyle } from "@/services/unsplash";
import { formatCurrency, formatDateRange, getDaysBetween } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, Search, Calendar, MapPin, DollarSign, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TripsPage() {
  const { trips, loadTrips, removeTrip } = useAppStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { loadTrips(); setLoaded(true); }, [loadTrips]);

  const filtered = trips.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this trip?")) {
      removeTrip(id);
      toast.success("Trip deleted");
    }
  };

  if (!loaded) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Trips</h1>
          <p className="text-muted text-sm">{trips.length} trip{trips.length !== 1 ? "s" : ""} planned</p>
        </div>
        <Link href="/trips/new" className="btn-primary"><Plus size={16} /> New Trip</Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search trips..." className="input-field pl-10" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-full sm:w-40">
          <option value="all">All Status</option>
          <option value="planning">Planning</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🗺️" title="No trips found" description={search ? "Try a different search term" : "Create your first trip!"} action={<Link href="/trips/new" className="btn-primary"><Plus size={16} /> Plan New Trip</Link>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((trip, i) => (
            <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/trips/${trip.id}`}>
                <div className="glass rounded-2xl overflow-hidden card-shine group cursor-pointer hover:border-accent/20 transition-all">
                  <div className="h-40 relative" style={getCoverStyle(trip.cover_image, trip.id)}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <button onClick={(e) => handleDelete(e, trip.id)} className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 hover:bg-danger/80 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${trip.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : trip.status === "ongoing" ? "bg-cyan-500/20 text-cyan-400" : "bg-violet-500/20 text-violet-400"}`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold group-hover:text-accent transition-colors truncate">{trip.name}</h3>
                    {trip.description && <p className="text-xs text-muted-foreground line-clamp-2">{trip.description}</p>}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
                      {trip.start_date && trip.end_date && (
                        <span className="flex items-center gap-1"><Calendar size={12} /> {getDaysBetween(trip.start_date, trip.end_date)} days</span>
                      )}
                      {trip.budget_limit && (
                        <span className="flex items-center gap-1"><DollarSign size={12} /> {formatCurrency(trip.budget_limit)}</span>
                      )}
                      <span className="flex items-center gap-1"><MapPin size={12} /> {trip.travel_type || "Trip"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

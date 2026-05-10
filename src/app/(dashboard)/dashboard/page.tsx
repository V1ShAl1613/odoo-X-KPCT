"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import { getCoverStyle } from "@/services/unsplash";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { Map, MapPin, DollarSign, TrendingUp, Plus, ArrowRight, Calendar } from "lucide-react";
import { CardSkeleton } from "@/components/shared/skeletons";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const destinations = [
  { name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400" },
  { name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400" },
  { name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400" },
  { name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400" },
];

export default function DashboardPage() {
  const { user, trips, stats, loadTrips, loadStats } = useAppStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadTrips();
    loadStats();
    setLoaded(true);
  }, [loadTrips, loadStats]);

  if (!loaded) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;

  const statCards = [
    { label: "Total Trips", value: stats.totalTrips, icon: Map, color: "from-violet-500 to-purple-600" },
    { label: "Cities Visited", value: stats.totalStops, icon: MapPin, color: "from-cyan-500 to-blue-600" },
    { label: "Budget Spent", value: formatCurrency(stats.totalBudgetSpent), icon: DollarSign, color: "from-emerald-500 to-green-600" },
    { label: "Upcoming", value: stats.upcomingTrips, icon: TrendingUp, color: "from-amber-500 to-orange-600" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Welcome */}
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, <span className="gradient-text">{user?.full_name || "Traveler"}</span> 👋
        </h1>
        <p className="text-muted mt-1">Ready for your next adventure?</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5 card-shine group hover:scale-[1.02] transition-all duration-300">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Recent Trips + CTA */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Trips</h2>
          <Link href="/trips" className="text-sm text-accent hover:text-accent-hover flex items-center gap-1">View all <ArrowRight size={14} /></Link>
        </div>
        {trips.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <span className="text-5xl block mb-4">✈️</span>
            <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
            <p className="text-muted text-sm mb-6">Create your first trip and start planning!</p>
            <Link href="/trips/new" className="btn-primary"><Plus size={16} /> Plan New Trip</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.slice(0, 3).map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl overflow-hidden card-shine group cursor-pointer">
                  <div className="h-36 relative" style={getCoverStyle(trip.cover_image, trip.id)}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${trip.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : trip.status === "ongoing" ? "bg-cyan-500/20 text-cyan-400" : "bg-violet-500/20 text-violet-400"}`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm group-hover:text-accent transition-colors truncate">{trip.name}</h3>
                    {trip.start_date && trip.end_date && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Calendar size={12} /> {formatDateRange(trip.start_date, trip.end_date)}</p>
                    )}
                    {trip.budget_limit && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><DollarSign size={12} /> Budget: {formatCurrency(trip.budget_limit)}</p>
                    )}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recommended */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold mb-4">Recommended Destinations ✨</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destinations.map((dest) => (
            <motion.div key={dest.name} whileHover={{ y: -4 }} className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${dest.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="font-semibold text-sm text-white">{dest.name}</p>
                <p className="text-xs text-white/70">{dest.country}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FAB */}
      <Link href="/trips/new" className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-110 transition-all z-40">
        <Plus size={24} className="text-white" />
      </Link>
    </motion.div>
  );
}

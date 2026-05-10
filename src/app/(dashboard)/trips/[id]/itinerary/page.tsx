"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, Reorder } from "framer-motion";
import { getTrip, createTripStop, deleteTripStop, reorderTripStops, createTripActivity, deleteTripActivity } from "@/lib/local-db";
import { searchCities, getPopularCities } from "@/services/cities";
import { useDebounce } from "@/hooks";
import type { Trip, TripStop, GeoDBCity } from "@/types";
import { Plus, Trash2, GripVertical, MapPin, Clock, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export default function ItineraryPage() {
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoDBCity[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newAct, setNewAct] = useState("");
  const dq = useDebounce(query, 300);

  const reload = useCallback(() => {
    if (!params.id) return;
    const t = getTrip(params.id as string);
    if (t) { setTrip(t); setStops(t.stops || []); }
  }, [params.id]);

  useEffect(() => { reload(); }, [reload]);
  useEffect(() => { dq.length >= 2 ? searchCities(dq).then(setResults) : setResults(getPopularCities()); }, [dq]);

  const addCity = (c: GeoDBCity) => {
    if (!trip) return;
    createTripStop(trip.id, { city_name: c.name, country: c.country, latitude: c.latitude, longitude: c.longitude });
    reload(); setShowSearch(false); setQuery(""); toast.success(`${c.name} added!`);
  };

  const removeStop = (id: string) => { deleteTripStop(id); reload(); toast.success("Stop removed"); };
  const handleReorder = (n: TripStop[]) => { setStops(n); if (trip) reorderTripStops(trip.id, n.map(s => s.id)); };
  const addAct = (stopId: string) => { if (!trip || !newAct.trim()) return; createTripActivity(trip.id, { stop_id: stopId, custom_name: newAct.trim() }); setNewAct(""); reload(); toast.success("Activity added!"); };
  const removeAct = (id: string) => { deleteTripActivity(id); reload(); };

  if (!trip) return <div className="flex items-center justify-center h-64 text-muted">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Itinerary Builder</h1><p className="text-muted text-sm">{trip.name} — {stops.length} stops</p></div>
        <button onClick={() => { setShowSearch(true); setResults(getPopularCities()); }} className="btn-primary"><Plus size={16} /> Add Stop</button>
      </div>

      {showSearch && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setShowSearch(false)}>
          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="glass-strong rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Add a City</h3><button onClick={() => setShowSearch(false)} className="p-1 hover:bg-white/10 rounded-lg"><X size={18} /></button></div>
            <div className="relative mb-4"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search cities..." className="input-field pl-10" autoFocus /></div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {results.map(c => (<button key={c.id} onClick={() => addCity(c)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left"><MapPin size={16} className="text-accent shrink-0" /><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{c.name}</p><p className="text-xs text-muted-foreground">{c.country} • {(c.population/1e6).toFixed(1)}M</p></div></button>))}
              {results.length === 0 && <p className="text-center text-muted text-sm py-4">No cities found</p>}
            </div>
          </motion.div>
        </motion.div>
      )}

      {stops.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center"><span className="text-5xl block mb-4">🗺️</span><h3 className="text-lg font-semibold mb-2">No stops yet</h3><p className="text-muted text-sm mb-4">Add your first city to build the itinerary</p><button onClick={() => { setShowSearch(true); setResults(getPopularCities()); }} className="btn-primary"><Plus size={16} /> Add First Stop</button></div>
      ) : (
        <Reorder.Group axis="y" values={stops} onReorder={handleReorder} className="space-y-3">
          {stops.map((stop, idx) => (
            <Reorder.Item key={stop.id} value={stop}>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 cursor-grab active:cursor-grabbing" onClick={() => setExpanded(expanded === stop.id ? null : stop.id)}>
                  <GripVertical size={16} className="text-muted-foreground shrink-0" />
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold shrink-0">{idx+1}</div>
                  <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h3 className="font-semibold text-sm">{stop.city_name}</h3>{stop.country && <span className="text-xs text-muted-foreground">• {stop.country}</span>}</div>{stop.arrival_date && <p className="text-xs text-muted-foreground mt-0.5">{stop.arrival_date} → {stop.departure_date}</p>}</div>
                  <span className="text-xs text-muted-foreground mr-1">{stop.activities?.length || 0} activities</span>
                  {expanded === stop.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  <button onClick={e => { e.stopPropagation(); removeStop(stop.id); }} className="p-1.5 rounded-lg hover:bg-danger/20 text-muted-foreground hover:text-danger transition"><Trash2 size={14} /></button>
                </div>
                {expanded === stop.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-border/50 p-4">
                    <div className="space-y-2 mb-3">
                      {stop.activities && stop.activities.length > 0 ? stop.activities.map(act => (
                        <div key={act.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] group"><Clock size={14} className="text-accent shrink-0" /><span className="text-sm flex-1">{act.custom_name || "Activity"}</span>{act.scheduled_time && <span className="text-xs text-muted-foreground">{act.scheduled_time}</span>}<button onClick={() => removeAct(act.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-danger/20 text-muted-foreground hover:text-danger transition-all"><Trash2 size={12} /></button></div>
                      )) : <p className="text-xs text-muted-foreground py-2">No activities yet</p>}
                    </div>
                    <div className="flex gap-2"><input value={newAct} onChange={e => setNewAct(e.target.value)} onKeyDown={e => e.key === "Enter" && addAct(stop.id)} placeholder="Add activity..." className="input-field text-sm flex-1" /><button onClick={() => addAct(stop.id)} className="btn-primary px-3 py-2 text-sm"><Plus size={14} /></button></div>
                  </motion.div>
                )}
              </div>
              {idx < stops.length - 1 && <div className="flex justify-center py-1"><div className="w-0.5 h-6 bg-gradient-to-b from-accent/50 to-transparent" /></div>}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </motion.div>
  );
}

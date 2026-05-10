"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getTrip, createPackingItem, togglePackingItem, deletePackingItem, resetPacking } from "@/lib/local-db";
import { PACKING_CATEGORIES } from "@/lib/utils";
import type { Trip } from "@/types";
import { Plus, Trash2, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";

export default function PackingPage() {
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [filter, setFilter] = useState("all");

  const reload = useCallback(() => {
    if (params.id) { const t = getTrip(params.id as string); if (t) setTrip(t); }
  }, [params.id]);

  useEffect(() => { reload(); }, [reload]);

  const addItem = () => {
    if (!trip || !name.trim()) return;
    createPackingItem(trip.id, { name: name.trim(), category });
    setName(""); reload(); toast.success("Item added!");
  };

  const toggle = (id: string) => { togglePackingItem(id); reload(); };
  const remove = (id: string) => { deletePackingItem(id); reload(); };
  const resetAll = () => { if (!trip) return; resetPacking(trip.id); reload(); toast.success("Reset all items"); };

  if (!trip) return <div className="flex items-center justify-center h-64 text-muted">Loading...</div>;

  const items = trip.packing_items || [];
  const packed = items.filter(i => i.is_packed).length;
  const total = items.length;
  const percent = total > 0 ? Math.round((packed / total) * 100) : 0;

  const filtered = filter === "all" ? items : filter === "packed" ? items.filter(i => i.is_packed) : filter === "unpacked" ? items.filter(i => !i.is_packed) : items.filter(i => i.category === filter);

  const grouped: Record<string, typeof items> = {};
  filtered.forEach(i => { if (!grouped[i.category]) grouped[i.category] = []; grouped[i.category].push(i); });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Packing Checklist</h1><p className="text-muted text-sm">{trip.name}</p></div>
        {total > 0 && <button onClick={resetAll} className="btn-secondary text-sm"><RotateCcw size={14} /> Reset</button>}
      </div>

      {/* Progress */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{packed} of {total} packed</span>
          <span className="text-sm font-bold text-accent">{percent}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.5 }} className="h-full gradient-bg rounded-full" />
        </div>
      </div>

      {/* Add Item */}
      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()} placeholder="Add item..." className="input-field flex-1" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="input-field sm:w-40">
            {PACKING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={addItem} className="btn-primary"><Plus size={16} /> Add</button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {["all", "unpacked", "packed", ...PACKING_CATEGORIES].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filter === f ? "gradient-bg text-white" : "bg-white/5 text-muted hover:bg-white/10"}`}>
            {f === "all" ? "All" : f === "packed" ? "✅ Packed" : f === "unpacked" ? "📦 Unpacked" : f}
          </button>
        ))}
      </div>

      {/* Items */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-8"><span className="text-4xl block mb-3">🎒</span><p className="text-muted text-sm">No items yet. Add something to pack!</p></div>
      ) : (
        Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{cat}</h3>
            <div className="space-y-1.5">
              {catItems.map(item => (
                <motion.div key={item.id} layout className="glass rounded-xl p-3 flex items-center gap-3 group">
                  <button onClick={() => toggle(item.id)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${item.is_packed ? "bg-accent border-accent" : "border-white/20 hover:border-accent"}`}>
                    {item.is_packed && <Check size={12} className="text-white" />}
                  </button>
                  <span className={`text-sm flex-1 ${item.is_packed ? "line-through text-muted-foreground" : ""}`}>{item.name}</span>
                  {item.quantity > 1 && <span className="text-xs text-muted-foreground">×{item.quantity}</span>}
                  <button onClick={() => remove(item.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-danger/20 text-muted-foreground hover:text-danger transition-all"><Trash2 size={12} /></button>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
}

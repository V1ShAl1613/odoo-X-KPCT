"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, type BudgetInput } from "@/lib/validators";
import { getTrip, createBudget, deleteBudget } from "@/lib/local-db";
import { formatCurrency, BUDGET_CATEGORIES } from "@/lib/utils";
import type { Trip } from "@/types";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, Trash2, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function BudgetPage() {
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [showForm, setShowForm] = useState(false);

  const reload = useCallback(() => {
    if (params.id) { const t = getTrip(params.id as string); if (t) setTrip(t); }
  }, [params.id]);

  useEffect(() => { reload(); }, [reload]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BudgetInput>({ resolver: zodResolver(budgetSchema) as any });

  const onSubmit = (data: BudgetInput) => {
    if (!trip) return;
    createBudget(trip.id, data);
    reset();
    setShowForm(false);
    reload();
    toast.success("Expense added!");
  };

  const remove = (id: string) => { deleteBudget(id); reload(); toast.success("Removed"); };

  if (!trip) return <div className="flex items-center justify-center h-64 text-muted">Loading...</div>;

  const budgets = trip.budgets || [];
  const total = budgets.reduce((s, b) => s + b.amount, 0);
  const limit = trip.budget_limit || 0;
  const overBudget = limit > 0 && total > limit;

  const pieData = BUDGET_CATEGORIES.map(cat => ({
    name: cat.label, value: budgets.filter(b => b.category === cat.value).reduce((s, b) => s + b.amount, 0), color: cat.color, icon: cat.icon,
  })).filter(d => d.value > 0);

  const barData = BUDGET_CATEGORIES.map(cat => ({
    name: cat.icon, amount: budgets.filter(b => b.category === cat.value).reduce((s, b) => s + b.amount, 0),
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Budget Analytics</h1><p className="text-muted text-sm">{trip.name}</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus size={16} /> Add Expense</button>
      </div>

      {overBudget && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-danger/10 border border-danger/20">
          <AlertTriangle size={20} className="text-danger shrink-0" />
          <div><p className="text-sm font-semibold text-danger">Over Budget!</p><p className="text-xs text-danger/70">You&apos;ve exceeded your budget by {formatCurrency(total - limit)}</p></div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground">Total Spent</p><p className="text-xl font-bold text-accent">{formatCurrency(total)}</p></div>
        <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground">Budget Limit</p><p className="text-xl font-bold">{limit ? formatCurrency(limit) : "No limit"}</p></div>
        <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground">Remaining</p><p className={`text-xl font-bold ${overBudget ? "text-danger" : "text-emerald-400"}`}>{limit ? formatCurrency(limit - total) : "—"}</p></div>
        <div className="glass rounded-xl p-4"><p className="text-xs text-muted-foreground">Expenses</p><p className="text-xl font-bold">{budgets.length}</p></div>
      </div>

      {/* Charts */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-accent" /> Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie><Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} formatter={(v) => formatCurrency(Number(v))} /></PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {pieData.map(d => <span key={d.name} className="text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.icon} {d.name}</span>)}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}><XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 14 }} axisLine={false} /><YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} /><Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9" }} formatter={(v) => formatCurrency(Number(v))} /><Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">New Expense</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs text-muted mb-1 block">Category *</label><select {...register("category")} className="input-field">{BUDGET_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}</select>{errors.category && <p className="text-danger text-xs mt-1">{errors.category.message}</p>}</div>
            <div><label className="text-xs text-muted mb-1 block">Amount *</label><input {...register("amount")} type="number" step="0.01" placeholder="0.00" className="input-field" />{errors.amount && <p className="text-danger text-xs mt-1">{errors.amount.message}</p>}</div>
            <div><label className="text-xs text-muted mb-1 block">Description</label><input {...register("description")} placeholder="What was it for?" className="input-field" /></div>
            <div><label className="text-xs text-muted mb-1 block">Date</label><input {...register("date")} type="date" className="input-field" /></div>
            <div className="sm:col-span-2 flex gap-2"><button type="submit" className="btn-primary">Add Expense</button><button type="button" onClick={() => { setShowForm(false); reset(); }} className="btn-secondary">Cancel</button></div>
          </form>
        </motion.div>
      )}

      {/* Expense List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">All Expenses</h3>
        {budgets.length === 0 ? <p className="text-muted text-sm py-4">No expenses yet</p> : budgets.map(b => {
          const cat = BUDGET_CATEGORIES.find(c => c.value === b.category);
          return (
            <div key={b.id} className="glass rounded-xl p-3 flex items-center gap-3 group">
              <span className="text-lg">{cat?.icon || "📦"}</span>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium">{b.description || cat?.label}</p><p className="text-xs text-muted-foreground">{b.date || "No date"}</p></div>
              <span className="text-sm font-semibold">{formatCurrency(b.amount)}</span>
              <button onClick={() => remove(b.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-danger/20 text-muted-foreground hover:text-danger transition-all"><Trash2 size={14} /></button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

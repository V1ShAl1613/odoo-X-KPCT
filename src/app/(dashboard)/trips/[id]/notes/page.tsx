"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getTrip, createTripNote, updateTripNote, deleteTripNote } from "@/lib/local-db";
import { formatDate } from "@/lib/utils";
import type { Trip } from "@/types";
import { Plus, Trash2, Bell, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function NotesPage() {
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isReminder, setIsReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState("");

  const reload = useCallback(() => {
    if (params.id) { const t = getTrip(params.id as string); if (t) setTrip(t); }
  }, [params.id]);

  useEffect(() => { reload(); }, [reload]);

  const resetForm = () => { setTitle(""); setContent(""); setIsReminder(false); setReminderDate(""); setEditId(null); setShowForm(false); };

  const save = () => {
    if (!trip || !content.trim()) return;
    if (editId) {
      updateTripNote(editId, { title: title || null, content, is_reminder: isReminder, reminder_date: reminderDate || null });
      toast.success("Note updated");
    } else {
      createTripNote(trip.id, { title: title || null, content, is_reminder: isReminder, reminder_date: reminderDate || null });
      toast.success("Note created!");
    }
    resetForm(); reload();
  };

  const edit = (note: { id: string; title?: string | null; content: string; is_reminder: boolean; reminder_date?: string | null }) => {
    setEditId(note.id); setTitle(note.title || ""); setContent(note.content); setIsReminder(note.is_reminder); setReminderDate(note.reminder_date || ""); setShowForm(true);
  };

  const remove = (id: string) => { deleteTripNote(id); reload(); toast.success("Note deleted"); };

  if (!trip) return <div className="flex items-center justify-center h-64 text-muted">Loading...</div>;

  const notes = trip.notes || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Trip Notes</h1><p className="text-muted text-sm">{trip.name} — {notes.length} notes</p></div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary"><Plus size={16} /> Add Note</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">{editId ? "Edit Note" : "New Note"}</h3>
            <button onClick={resetForm} className="p-1 hover:bg-white/10 rounded-lg"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)" className="input-field" />
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your note..." rows={4} className="input-field resize-none" />
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={isReminder} onChange={e => setIsReminder(e.target.checked)} className="rounded" />
                <Bell size={14} className="text-amber-400" /> Reminder
              </label>
              {isReminder && <input type="datetime-local" value={reminderDate} onChange={e => setReminderDate(e.target.value)} className="input-field w-auto text-sm" />}
            </div>
            <div className="flex gap-2">
              <button onClick={save} className="btn-primary"><Save size={14} /> {editId ? "Update" : "Save"}</button>
              <button onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </motion.div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-12"><span className="text-5xl block mb-4">📝</span><h3 className="text-lg font-semibold mb-2">No notes yet</h3><p className="text-muted text-sm">Capture ideas, tips, and reminders for your trip</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map(note => (
            <motion.div key={note.id} layout className="glass rounded-2xl p-5 group hover:border-accent/20 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {note.is_reminder && <Bell size={14} className="text-amber-400" />}
                  <h3 className="font-semibold text-sm">{note.title || "Untitled Note"}</h3>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => edit(note)} className="p-1 rounded hover:bg-white/10 text-muted-foreground text-xs">Edit</button>
                  <button onClick={() => remove(note.id)} className="p-1 rounded hover:bg-danger/20 text-muted-foreground hover:text-danger"><Trash2 size={12} /></button>
                </div>
              </div>
              <p className="text-sm text-muted whitespace-pre-wrap">{note.content}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span>{formatDate(note.created_at)}</span>
                {note.reminder_date && <span className="text-amber-400">🔔 {formatDate(note.reminder_date)}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

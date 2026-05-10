"use client";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import { setLocalUser } from "@/lib/local-db";
import { User, Globe, Trash2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, setUser, logout } = useAppStore();
  const [name, setName] = useState(user?.full_name || "");
  const [lang, setLang] = useState(user?.language || "en");

  const save = () => {
    if (!user || !name.trim()) return;
    const updated = { ...user, full_name: name.trim(), language: lang, updated_at: new Date().toISOString() };
    setLocalUser(updated);
    setUser(updated);
    toast.success("Profile updated!");
  };

  const deleteAccount = () => {
    if (!confirm("Are you sure? This will delete all your data.")) return;
    localStorage.clear();
    logout();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold">Profile & Settings</h1><p className="text-muted text-sm">Manage your account</p></div>

      <div className="glass rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {name ? name[0].toUpperCase() : "T"}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{name || "Traveler"}</h2>
          <p className="text-sm text-muted-foreground">{localStorage.getItem("traveloop_email") || "traveler@traveloop.app"}</p>
          <p className="text-xs text-muted-foreground mt-1">Member since {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold flex items-center gap-2"><User size={16} className="text-accent" /> Personal Info</h3>
        <div><label className="text-xs text-muted mb-1 block">Full Name</label><input value={name} onChange={e => setName(e.target.value)} className="input-field" /></div>
        <div><label className="text-xs text-muted mb-1 block">Language</label>
          <select value={lang} onChange={e => setLang(e.target.value)} className="input-field">
            <option value="en">English</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="ja">日本語</option>
          </select>
        </div>
        <button onClick={save} className="btn-primary"><Save size={14} /> Save Changes</button>
      </div>

      <div className="glass rounded-2xl p-6 border-danger/20">
        <h3 className="text-sm font-semibold text-danger flex items-center gap-2 mb-3"><Trash2 size={16} /> Danger Zone</h3>
        <p className="text-xs text-muted-foreground mb-4">Deleting your account will permanently remove all your trips, notes, and data.</p>
        <button onClick={deleteAccount} className="px-4 py-2 rounded-xl text-sm font-medium bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 transition">Delete Account</button>
      </div>
    </motion.div>
  );
}

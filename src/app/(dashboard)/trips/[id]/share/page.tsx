"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getTrip, createSharedItinerary } from "@/lib/local-db";
import type { Trip } from "@/types";
import { Share2, Copy, Check, Link2, Globe } from "lucide-react";
import { toast } from "sonner";

export default function SharePage() {
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [copied, setCopied] = useState(false);

  const reload = useCallback(() => {
    if (params.id) { const t = getTrip(params.id as string); if (t) setTrip(t); }
  }, [params.id]);

  useEffect(() => { reload(); }, [reload]);

  const generateLink = () => {
    if (!trip) return;
    createSharedItinerary(trip.id);
    reload();
    toast.success("Share link generated!");
  };

  const copyLink = () => {
    if (!trip?.shared_itinerary) return;
    const url = `${window.location.origin}/share/${trip.shared_itinerary.share_token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!trip) return <div className="flex items-center justify-center h-64 text-muted">Loading...</div>;

  const shareUrl = trip.shared_itinerary ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${trip.shared_itinerary.share_token}` : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold">Share Itinerary</h1><p className="text-muted text-sm">{trip.name}</p></div>

      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
          <Globe size={28} className="text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2">Share Your Trip</h2>
        <p className="text-muted text-sm mb-6 max-w-sm mx-auto">Generate a public link to share your itinerary with friends and family</p>

        {!trip.shared_itinerary?.is_active ? (
          <button onClick={generateLink} className="btn-primary text-base px-8 py-3"><Share2 size={18} /> Generate Share Link</button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <Link2 size={16} className="text-accent shrink-0" />
              <span className="text-sm truncate flex-1 text-left">{shareUrl}</span>
              <button onClick={copyLink} className="btn-primary px-3 py-1.5 text-sm shrink-0">
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
            <div className="flex justify-center gap-3">
              <a href={`https://twitter.com/intent/tweet?text=Check out my trip: ${trip.name}&url=${shareUrl}`} target="_blank" rel="noopener" className="btn-secondary text-sm">Share on 𝕏</a>
              <a href={`https://wa.me/?text=Check out my trip plan: ${shareUrl}`} target="_blank" rel="noopener" className="btn-secondary text-sm">WhatsApp</a>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

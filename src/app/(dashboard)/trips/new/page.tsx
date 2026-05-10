"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema, type TripInput } from "@/lib/validators";
import { useAppStore } from "@/stores/app-store";
import { TRAVEL_TYPES } from "@/lib/utils";
import { ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function CreateTripPage() {
  const router = useRouter();
  const { addTrip } = useAppStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<TripInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(tripSchema) as any,
    defaultValues: { travel_type: undefined },
  });

  const selectedType = watch("travel_type");

  const onSubmit = (data: TripInput) => {
    setLoading(true);
    try {
      const trip = addTrip({
        name: data.name,
        description: data.description || null,
        start_date: data.start_date,
        end_date: data.end_date,
        budget_limit: data.budget_limit || null,
        travel_type: data.travel_type || null,
        cover_image: data.cover_image || null,
      });
      toast.success("Trip created! 🎉");
      router.push(`/trips/${trip.id}`);
    } catch {
      toast.error("Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <Link href="/trips" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-6">
        <ArrowLeft size={16} /> Back to trips
      </Link>

      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Plan a New Trip</h1>
            <p className="text-sm text-muted">Fill in the details to get started</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Trip Name *</label>
            <input {...register("name")} placeholder="e.g. Summer in Japan 🌸" className="input-field" />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <textarea {...register("description")} placeholder="What's this trip about?" rows={3} className="input-field resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Start Date *</label>
              <input {...register("start_date")} type="date" className="input-field" />
              {errors.start_date && <p className="text-danger text-xs mt-1">{errors.start_date.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">End Date *</label>
              <input {...register("end_date")} type="date" className="input-field" />
              {errors.end_date && <p className="text-danger text-xs mt-1">{errors.end_date.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Budget Limit (USD)</label>
            <input {...register("budget_limit")} type="number" placeholder="e.g. 3000" className="input-field" />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Travel Type</label>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setValue("travel_type", type.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedType === type.value
                      ? "gradient-bg text-white"
                      : "bg-white/5 text-muted hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Cover Image URL</label>
            <input {...register("cover_image")} placeholder="https://images.unsplash.com/..." className="input-field" />
            <p className="text-xs text-muted-foreground mt-1">Paste an Unsplash URL or leave empty for a gradient</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? "Creating..." : "Create Trip"} <Sparkles size={16} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}

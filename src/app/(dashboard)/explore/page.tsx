"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { searchCities, getPopularCities } from "@/services/cities";
import { useDebounce } from "@/hooks";
import type { GeoDBCity } from "@/types";
import { Search, MapPin, Users, Globe } from "lucide-react";
import Image from "next/image";

export default function ExplorePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<GeoDBCity[]>([]);
  const dq = useDebounce(query, 300);

  useEffect(() => { dq.length >= 2 ? searchCities(dq).then(setCities) : setCities(getPopularCities()); }, [dq]);
  useEffect(() => { setCities(getPopularCities()); }, []);

  const imgs: Record<string, string> = {
    Tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80",
    Paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
    "New York": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80",
    London: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80",
    Rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80",
    Barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=400&q=80",
    Dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80",
    Bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80",
    Sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80",
    Bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
    Singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80",
    Amsterdam: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=400&q=80",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div><h1 className="text-2xl font-bold">Explore Cities</h1><p className="text-muted text-sm">Discover your next destination</p></div>
      <div className="relative max-w-lg">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search cities worldwide..." className="input-field pl-10 text-base py-3" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cities.map((city, i) => (
          <motion.div 
            key={city.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.04 }} 
            whileHover={{ y: -4 }} 
            onClick={() => router.push(`/trips/new`)}
            className="glass rounded-2xl overflow-hidden card-shine group cursor-pointer"
          >
            <div className="h-36 relative overflow-hidden">
              {imgs[city.name] ? (
                <Image 
                  src={imgs[city.name]} 
                  alt={city.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #6366f1, #06b6d4)` }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full text-[10px] font-medium">{city.countryCode}</div>
            </div>
            <div className="p-4 relative">
              <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">{city.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Globe size={12} /> {city.country}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Users size={12} /> Pop: {(city.population / 1e6).toFixed(1)}M</p>
              {city.region && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin size={12} /> {city.region}</p>}
            </div>
          </motion.div>
        ))}
      </div>
      {cities.length === 0 && <div className="text-center py-12"><span className="text-5xl block mb-4">🌍</span><p className="text-muted">No cities found. Try a different search.</p></div>}
    </motion.div>
  );
}

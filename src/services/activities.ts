// OpenTripMap API service with fallback data
import type { OpenTripMapPlace } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_OPENTRIPMAP_API_KEY;
const BASE = "https://api.opentripmap.com/0.1/en/places";

const CATEGORIES = ["museums", "architecture", "cultural", "historic", "natural", "religion", "food", "shops", "amusements"];

const FALLBACK_ACTIVITIES: Record<string, OpenTripMapPlace[]> = {
  default: [
    { xid: "f1", name: "City Walking Tour", kinds: "cultural,tours", point: { lat: 0, lon: 0 }, rate: 7 },
    { xid: "f2", name: "Local Food Market", kinds: "food,markets", point: { lat: 0, lon: 0 }, rate: 8 },
    { xid: "f3", name: "Historic Old Town", kinds: "historic,architecture", point: { lat: 0, lon: 0 }, rate: 9 },
    { xid: "f4", name: "National Museum", kinds: "museums,cultural", point: { lat: 0, lon: 0 }, rate: 8 },
    { xid: "f5", name: "City Park & Gardens", kinds: "natural,gardens", point: { lat: 0, lon: 0 }, rate: 7 },
    { xid: "f6", name: "Ancient Temple", kinds: "religion,historic", point: { lat: 0, lon: 0 }, rate: 9 },
    { xid: "f7", name: "Art Gallery", kinds: "museums,cultural", point: { lat: 0, lon: 0 }, rate: 7 },
    { xid: "f8", name: "Night Market", kinds: "food,shops,amusements", point: { lat: 0, lon: 0 }, rate: 8 },
    { xid: "f9", name: "Viewpoint & Observation Deck", kinds: "architecture,amusements", point: { lat: 0, lon: 0 }, rate: 8 },
    { xid: "f10", name: "Local Cooking Class", kinds: "food,cultural", point: { lat: 0, lon: 0 }, rate: 9 },
    { xid: "f11", name: "Street Art District", kinds: "cultural,architecture", point: { lat: 0, lon: 0 }, rate: 6 },
    { xid: "f12", name: "Sunset Cruise", kinds: "natural,amusements", point: { lat: 0, lon: 0 }, rate: 8 },
  ],
};

export async function searchActivities(lat: number, lon: number, radius = 5000, kinds?: string): Promise<OpenTripMapPlace[]> {
  if (API_KEY) {
    try {
      let url = `${BASE}/radius?radius=${radius}&lon=${lon}&lat=${lat}&rate=2&limit=20&apikey=${API_KEY}`;
      if (kinds) url += `&kinds=${kinds}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return (data.features || data || []).filter((p: OpenTripMapPlace) => p.name && p.name.length > 0);
      }
    } catch { /* fallback */ }
  }
  return FALLBACK_ACTIVITIES.default.map((a) => ({ ...a, point: { lat, lon } }));
}

export function getActivityCategories(): string[] {
  return CATEGORIES;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    museums: "🏛️", architecture: "🏗️", cultural: "🎭", historic: "🏰",
    natural: "🌿", religion: "⛩️", food: "🍜", shops: "🛍️", amusements: "🎡",
    tours: "🚶", markets: "🏪", gardens: "🌺",
  };
  return icons[category] || "📍";
}

// Unsplash API service with gradient fallbacks
import type { UnsplashPhoto } from "@/types";

const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
];

export async function searchPhotos(query: string, perPage = 8): Promise<UnsplashPhoto[]> {
  if (!ACCESS_KEY || !query) return [];
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`, {
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data.results || [];
    }
  } catch { /* fallback */ }
  return [];
}

export function getRandomGradient(seed?: string): string {
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) { hash = ((hash << 5) - hash) + seed.charCodeAt(i); hash |= 0; }
    return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
  }
  return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
}

export function getCoverStyle(imageUrl?: string | null, seed?: string): React.CSSProperties {
  if (imageUrl) return { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" };
  return { background: getRandomGradient(seed) };
}

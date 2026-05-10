// GeoDB Cities API service with fallback data
import type { GeoDBCity } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_GEODB_API_KEY;
const BASE_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";

const FALLBACK_CITIES: GeoDBCity[] = [
  { id: 1, name: "Tokyo", country: "Japan", countryCode: "JP", region: "Kantō", latitude: 35.6762, longitude: 139.6503, population: 13960000 },
  { id: 2, name: "Paris", country: "France", countryCode: "FR", region: "Île-de-France", latitude: 48.8566, longitude: 2.3522, population: 2161000 },
  { id: 3, name: "New York", country: "United States", countryCode: "US", region: "New York", latitude: 40.7128, longitude: -74.006, population: 8336817 },
  { id: 4, name: "London", country: "United Kingdom", countryCode: "GB", region: "England", latitude: 51.5074, longitude: -0.1278, population: 8982000 },
  { id: 5, name: "Rome", country: "Italy", countryCode: "IT", region: "Lazio", latitude: 41.9028, longitude: 12.4964, population: 2873000 },
  { id: 6, name: "Barcelona", country: "Spain", countryCode: "ES", region: "Catalonia", latitude: 41.3874, longitude: 2.1686, population: 1620000 },
  { id: 7, name: "Dubai", country: "UAE", countryCode: "AE", region: "Dubai", latitude: 25.2048, longitude: 55.2708, population: 3331000 },
  { id: 8, name: "Bangkok", country: "Thailand", countryCode: "TH", region: "Central", latitude: 13.7563, longitude: 100.5018, population: 10539000 },
  { id: 9, name: "Istanbul", country: "Turkey", countryCode: "TR", region: "Marmara", latitude: 41.0082, longitude: 28.9784, population: 15462000 },
  { id: 10, name: "Sydney", country: "Australia", countryCode: "AU", region: "NSW", latitude: -33.8688, longitude: 151.2093, population: 5312000 },
  { id: 11, name: "Singapore", country: "Singapore", countryCode: "SG", region: "Singapore", latitude: 1.3521, longitude: 103.8198, population: 5686000 },
  { id: 12, name: "Bali", country: "Indonesia", countryCode: "ID", region: "Bali", latitude: -8.3405, longitude: 115.092, population: 4320000 },
  { id: 13, name: "Amsterdam", country: "Netherlands", countryCode: "NL", region: "North Holland", latitude: 52.3676, longitude: 4.9041, population: 872680 },
  { id: 14, name: "Kyoto", country: "Japan", countryCode: "JP", region: "Kansai", latitude: 35.0116, longitude: 135.7681, population: 1475000 },
  { id: 15, name: "Prague", country: "Czech Republic", countryCode: "CZ", region: "Bohemia", latitude: 50.0755, longitude: 14.4378, population: 1309000 },
  { id: 16, name: "Lisbon", country: "Portugal", countryCode: "PT", region: "Lisbon", latitude: 38.7223, longitude: -9.1393, population: 505526 },
  { id: 17, name: "Seoul", country: "South Korea", countryCode: "KR", region: "Seoul", latitude: 37.5665, longitude: 126.978, population: 9776000 },
  { id: 18, name: "Mumbai", country: "India", countryCode: "IN", region: "Maharashtra", latitude: 19.076, longitude: 72.8777, population: 20411000 },
  { id: 19, name: "Cairo", country: "Egypt", countryCode: "EG", region: "Cairo", latitude: 30.0444, longitude: 31.2357, population: 20076000 },
  { id: 20, name: "Rio de Janeiro", country: "Brazil", countryCode: "BR", region: "RJ", latitude: -22.9068, longitude: -43.1729, population: 6748000 },
];

export async function searchCities(query: string): Promise<GeoDBCity[]> {
  if (!query || query.length < 2) return [];

  if (API_KEY) {
    try {
      const res = await fetch(`${BASE_URL}/cities?namePrefix=${encodeURIComponent(query)}&limit=10&sort=-population`, {
        headers: { "X-RapidAPI-Key": API_KEY, "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com" },
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch { /* fallback */ }
  }

  const q = query.toLowerCase();
  return FALLBACK_CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
}

export function getPopularCities(): GeoDBCity[] {
  return FALLBACK_CITIES.slice(0, 12);
}

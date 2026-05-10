import { createTrip, createTripStop, createTripActivity, createBudget, createPackingItem, createTripNote, getLocalUser } from "./local-db";
import type { Trip } from "@/types";

export function seedDemoData(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("traveloop_seeded")) return;
  const user = getLocalUser();
  if (!user) return;

  const t1 = createTrip({ name: "Tokyo Adventure 🇯🇵", description: "Exploring the vibrant culture, food, and technology of Japan", start_date: "2026-06-15", end_date: "2026-06-25", budget_limit: 3000, travel_type: "solo", cover_image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800" });
  const t2 = createTrip({ name: "European Dream Tour 🇪🇺", description: "Paris, Rome, Barcelona — the ultimate European experience", start_date: "2026-08-01", end_date: "2026-08-20", budget_limit: 5000, travel_type: "couple", cover_image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800" });
  createTrip({ name: "Bali Retreat 🌴", description: "Relaxation and culture in beautiful Bali", start_date: "2026-07-10", end_date: "2026-07-17", budget_limit: 2000, travel_type: "friends", cover_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800" } as Partial<Trip>);

  const s1 = createTripStop(t1.id, { city_name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, arrival_date: "2026-06-15", departure_date: "2026-06-20" });
  const s2 = createTripStop(t1.id, { city_name: "Kyoto", country: "Japan", latitude: 35.0116, longitude: 135.7681, arrival_date: "2026-06-20", departure_date: "2026-06-23" });
  createTripStop(t1.id, { city_name: "Osaka", country: "Japan", latitude: 34.6937, longitude: 135.5023, arrival_date: "2026-06-23", departure_date: "2026-06-25" });

  createTripActivity(t1.id, { stop_id: s1.id, custom_name: "Visit Senso-ji Temple", scheduled_date: "2026-06-15", scheduled_time: "09:00", duration_hours: 2 });
  createTripActivity(t1.id, { stop_id: s1.id, custom_name: "Explore Shibuya Crossing", scheduled_date: "2026-06-15", scheduled_time: "14:00", duration_hours: 1.5 });
  createTripActivity(t1.id, { stop_id: s1.id, custom_name: "Akihabara Electronics", scheduled_date: "2026-06-16", scheduled_time: "10:00", duration_hours: 3 });
  createTripActivity(t1.id, { stop_id: s2.id, custom_name: "Fushimi Inari Shrine", scheduled_date: "2026-06-20", scheduled_time: "08:00", duration_hours: 3 });
  createTripActivity(t1.id, { stop_id: s2.id, custom_name: "Bamboo Forest Walk", scheduled_date: "2026-06-21", scheduled_time: "10:00", duration_hours: 2 });

  createBudget(t1.id, { category: "transport", description: "Round-trip flights", amount: 800, date: "2026-06-15" });
  createBudget(t1.id, { category: "hotel", description: "Tokyo hotel (5 nights)", amount: 600, date: "2026-06-15" });
  createBudget(t1.id, { category: "food", description: "Daily food budget", amount: 300, date: "2026-06-15" });
  createBudget(t1.id, { category: "activities", description: "Temple entries & tours", amount: 150, date: "2026-06-16" });
  createBudget(t1.id, { category: "transport", description: "JR Pass", amount: 250, date: "2026-06-15" });

  createTripStop(t2.id, { city_name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522, arrival_date: "2026-08-01", departure_date: "2026-08-07" });
  createTripStop(t2.id, { city_name: "Rome", country: "Italy", latitude: 41.9028, longitude: 12.4964, arrival_date: "2026-08-07", departure_date: "2026-08-14" });
  createTripStop(t2.id, { city_name: "Barcelona", country: "Spain", latitude: 41.3874, longitude: 2.1686, arrival_date: "2026-08-14", departure_date: "2026-08-20" });

  createBudget(t2.id, { category: "transport", description: "Flights", amount: 1200 });
  createBudget(t2.id, { category: "hotel", description: "Hotels (19 nights)", amount: 1900 });
  createBudget(t2.id, { category: "food", description: "Food budget", amount: 800 });

  createPackingItem(t1.id, { name: "Passport", category: "Documents" });
  createPackingItem(t1.id, { name: "Phone Charger", category: "Electronics" });
  createPackingItem(t1.id, { name: "T-shirts", category: "Clothing", quantity: 5 });
  createPackingItem(t1.id, { name: "Sunscreen", category: "Toiletries" });
  createPackingItem(t1.id, { name: "Camera", category: "Electronics" });

  createTripNote(t1.id, { title: "Restaurant Recommendations", content: "Check out Tsukiji Outer Market for fresh sushi. Ichiran Ramen in Shibuya is a must-try!" });
  createTripNote(t1.id, { title: "JR Pass Info", content: "Activate JR Pass on June 20 for Kyoto-Osaka travel.", is_reminder: true, reminder_date: "2026-06-19T09:00:00Z" });

  localStorage.setItem("traveloop_seeded", "true");
}

// Local storage based data layer - drop-in replacement for Supabase
import type { Trip, TripStop, TripActivity, Budget, PackingItem, TripNote, SharedItinerary, Profile, DashboardStats } from "@/types";

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getStore<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(`traveloop_${key}`);
  return data ? JSON.parse(data) : [];
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`traveloop_${key}`, JSON.stringify(data));
}

// AUTH
export function getLocalUser(): Profile | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("traveloop_user");
  return user ? JSON.parse(user) : null;
}
export function setLocalUser(user: Profile): void { localStorage.setItem("traveloop_user", JSON.stringify(user)); }
export function clearLocalUser(): void { localStorage.removeItem("traveloop_user"); }

export function localSignup(fullName: string, email: string): Profile {
  const user: Profile = { id: generateId(), full_name: fullName, avatar_url: null, language: "en", created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  setLocalUser(user);
  localStorage.setItem("traveloop_email", email);
  return user;
}

export function localLogin(email: string): Profile | null {
  const storedEmail = localStorage.getItem("traveloop_email");
  if (storedEmail === email) return getLocalUser();
  return localSignup("Traveler", email);
}

// TRIPS
export function getTrips(): Trip[] {
  return getStore<Trip>("trips").sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getTrip(id: string): Trip | null {
  const trip = getStore<Trip>("trips").find((t) => t.id === id) || null;
  if (trip) {
    trip.stops = getTripStops(id);
    trip.budgets = getTripBudgets(id);
    trip.packing_items = getTripPackingItems(id);
    trip.notes = getTripNotes(id);
    trip.shared_itinerary = getSharedItinerary(id);
  }
  return trip;
}

export function createTrip(data: Partial<Trip>): Trip {
  const trips = getStore<Trip>("trips");
  const user = getLocalUser();
  const trip: Trip = {
    id: generateId(), user_id: user?.id || "demo", name: data.name || "Untitled Trip",
    description: data.description || null, cover_image: data.cover_image || null,
    start_date: data.start_date || null, end_date: data.end_date || null,
    budget_limit: data.budget_limit || null, travel_type: data.travel_type || null,
    status: (data as Trip).status || "planning", created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
  trips.push(trip);
  setStore("trips", trips);
  return trip;
}

export function updateTrip(id: string, data: Partial<Trip>): Trip | null {
  const trips = getStore<Trip>("trips");
  const i = trips.findIndex((t) => t.id === id);
  if (i === -1) return null;
  trips[i] = { ...trips[i], ...data, updated_at: new Date().toISOString() };
  setStore("trips", trips);
  return trips[i];
}

export function deleteTrip(id: string): void {
  setStore("trips", getStore<Trip>("trips").filter((t) => t.id !== id));
  setStore("trip_stops", getStore<TripStop>("trip_stops").filter((s) => s.trip_id !== id));
  setStore("trip_activities", getStore<TripActivity>("trip_activities").filter((a) => a.trip_id !== id));
  setStore("budgets", getStore<Budget>("budgets").filter((b) => b.trip_id !== id));
  setStore("packing_items", getStore<PackingItem>("packing_items").filter((p) => p.trip_id !== id));
  setStore("trip_notes", getStore<TripNote>("trip_notes").filter((n) => n.trip_id !== id));
  setStore("shared_itineraries", getStore<SharedItinerary>("shared_itineraries").filter((s) => s.trip_id !== id));
}

// TRIP STOPS
export function getTripStops(tripId: string): TripStop[] {
  return getStore<TripStop>("trip_stops").filter((s) => s.trip_id === tripId)
    .sort((a, b) => a.order_index - b.order_index)
    .map((stop) => ({ ...stop, activities: getTripActivities(tripId, stop.id) }));
}

export function createTripStop(tripId: string, data: Partial<TripStop>): TripStop {
  const stops = getStore<TripStop>("trip_stops");
  const count = stops.filter((s) => s.trip_id === tripId).length;
  const stop: TripStop = {
    id: generateId(), trip_id: tripId, city_name: data.city_name || "Unknown",
    country: data.country || null, latitude: data.latitude || null, longitude: data.longitude || null,
    arrival_date: data.arrival_date || null, departure_date: data.departure_date || null,
    order_index: data.order_index ?? count, notes: data.notes || null, created_at: new Date().toISOString(),
  };
  stops.push(stop);
  setStore("trip_stops", stops);
  return stop;
}

export function updateTripStop(id: string, data: Partial<TripStop>): TripStop | null {
  const stops = getStore<TripStop>("trip_stops");
  const i = stops.findIndex((s) => s.id === id);
  if (i === -1) return null;
  stops[i] = { ...stops[i], ...data };
  setStore("trip_stops", stops);
  return stops[i];
}

export function deleteTripStop(id: string): void {
  setStore("trip_stops", getStore<TripStop>("trip_stops").filter((s) => s.id !== id));
  setStore("trip_activities", getStore<TripActivity>("trip_activities").filter((a) => a.stop_id !== id));
}

export function reorderTripStops(tripId: string, orderedIds: string[]): void {
  const stops = getStore<TripStop>("trip_stops");
  orderedIds.forEach((id, index) => { const i = stops.findIndex((s) => s.id === id); if (i !== -1) stops[i].order_index = index; });
  setStore("trip_stops", stops);
}

// TRIP ACTIVITIES
export function getTripActivities(tripId: string, stopId?: string): TripActivity[] {
  return getStore<TripActivity>("trip_activities")
    .filter((a) => a.trip_id === tripId && (!stopId || a.stop_id === stopId))
    .sort((a, b) => a.order_index - b.order_index);
}

export function createTripActivity(tripId: string, data: Partial<TripActivity>): TripActivity {
  const activities = getStore<TripActivity>("trip_activities");
  const activity: TripActivity = {
    id: generateId(), trip_id: tripId, stop_id: data.stop_id || null,
    activity_id: data.activity_id || null, custom_name: data.custom_name || null,
    scheduled_date: data.scheduled_date || null, scheduled_time: data.scheduled_time || null,
    duration_hours: data.duration_hours || null, notes: data.notes || null,
    order_index: data.order_index ?? activities.filter((a) => a.trip_id === tripId && a.stop_id === data.stop_id).length,
    created_at: new Date().toISOString(),
  };
  activities.push(activity);
  setStore("trip_activities", activities);
  return activity;
}

export function deleteTripActivity(id: string): void {
  setStore("trip_activities", getStore<TripActivity>("trip_activities").filter((a) => a.id !== id));
}

// BUDGETS
export function getTripBudgets(tripId: string): Budget[] {
  return getStore<Budget>("budgets").filter((b) => b.trip_id === tripId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createBudget(tripId: string, data: Partial<Budget>): Budget {
  const budgets = getStore<Budget>("budgets");
  const budget: Budget = { id: generateId(), trip_id: tripId, category: data.category || "other", description: data.description || null, amount: data.amount || 0, currency: data.currency || "USD", date: data.date || null, created_at: new Date().toISOString() };
  budgets.push(budget);
  setStore("budgets", budgets);
  return budget;
}

export function deleteBudget(id: string): void {
  setStore("budgets", getStore<Budget>("budgets").filter((b) => b.id !== id));
}

// PACKING ITEMS
export function getTripPackingItems(tripId: string): PackingItem[] {
  return getStore<PackingItem>("packing_items").filter((p) => p.trip_id === tripId);
}

export function createPackingItem(tripId: string, data: Partial<PackingItem>): PackingItem {
  const items = getStore<PackingItem>("packing_items");
  const item: PackingItem = { id: generateId(), trip_id: tripId, name: data.name || "Item", category: data.category || "Other", is_packed: false, quantity: data.quantity || 1, created_at: new Date().toISOString() };
  items.push(item);
  setStore("packing_items", items);
  return item;
}

export function togglePackingItem(id: string): void {
  const items = getStore<PackingItem>("packing_items");
  const i = items.findIndex((p) => p.id === id);
  if (i !== -1) { items[i].is_packed = !items[i].is_packed; setStore("packing_items", items); }
}

export function deletePackingItem(id: string): void { setStore("packing_items", getStore<PackingItem>("packing_items").filter((p) => p.id !== id)); }

export function resetPacking(tripId: string): void {
  const items = getStore<PackingItem>("packing_items");
  items.forEach((item) => { if (item.trip_id === tripId) item.is_packed = false; });
  setStore("packing_items", items);
}

// TRIP NOTES
export function getTripNotes(tripId: string): TripNote[] {
  return getStore<TripNote>("trip_notes").filter((n) => n.trip_id === tripId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createTripNote(tripId: string, data: Partial<TripNote>): TripNote {
  const notes = getStore<TripNote>("trip_notes");
  const note: TripNote = { id: generateId(), trip_id: tripId, stop_id: data.stop_id || null, title: data.title || null, content: data.content || "", is_reminder: data.is_reminder || false, reminder_date: data.reminder_date || null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  notes.push(note);
  setStore("trip_notes", notes);
  return note;
}

export function updateTripNote(id: string, data: Partial<TripNote>): void {
  const notes = getStore<TripNote>("trip_notes");
  const i = notes.findIndex((n) => n.id === id);
  if (i !== -1) { notes[i] = { ...notes[i], ...data, updated_at: new Date().toISOString() }; setStore("trip_notes", notes); }
}

export function deleteTripNote(id: string): void { setStore("trip_notes", getStore<TripNote>("trip_notes").filter((n) => n.id !== id)); }

// SHARED ITINERARIES
export function getSharedItinerary(tripId: string): SharedItinerary | null {
  return getStore<SharedItinerary>("shared_itineraries").find((s) => s.trip_id === tripId && s.is_active) || null;
}

export function getSharedByToken(token: string): { trip: Trip; shared: SharedItinerary } | null {
  const shared = getStore<SharedItinerary>("shared_itineraries").find((s) => s.share_token === token && s.is_active);
  if (!shared) return null;
  const trip = getTrip(shared.trip_id);
  if (!trip) return null;
  return { trip, shared };
}

export function createSharedItinerary(tripId: string): SharedItinerary {
  const shared = getStore<SharedItinerary>("shared_itineraries");
  const existing = shared.find((s) => s.trip_id === tripId);
  if (existing) { existing.is_active = true; setStore("shared_itineraries", shared); return existing; }
  const item: SharedItinerary = { id: generateId(), trip_id: tripId, share_token: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2), is_active: true, created_at: new Date().toISOString(), expires_at: null };
  shared.push(item);
  setStore("shared_itineraries", shared);
  return item;
}

// DASHBOARD STATS
export function getDashboardStats(): DashboardStats {
  const trips = getTrips();
  const budgets = getStore<Budget>("budgets");
  const now = new Date();
  return {
    totalTrips: trips.length, totalStops: getStore<TripStop>("trip_stops").length,
    totalBudgetSpent: budgets.reduce((sum, b) => sum + b.amount, 0),
    upcomingTrips: trips.filter((t) => t.start_date && new Date(t.start_date) > now).length,
  };
}

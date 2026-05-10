export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  start_date: string | null;
  end_date: string | null;
  budget_limit: number | null;
  travel_type: "solo" | "couple" | "family" | "friends" | "business" | null;
  status: "planning" | "ongoing" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  stops?: TripStop[];
  budgets?: Budget[];
  packing_items?: PackingItem[];
  notes?: TripNote[];
  shared_itinerary?: SharedItinerary | null;
}

export interface TripStop {
  id: string;
  trip_id: string;
  city_name: string;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  arrival_date: string | null;
  departure_date: string | null;
  order_index: number;
  notes: string | null;
  created_at: string;
  activities?: TripActivity[];
}

export interface Activity {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  rating: number | null;
  cost_estimate: number | null;
  duration_hours: number | null;
  latitude: number | null;
  longitude: number | null;
  source_id: string | null;
  created_at: string;
}

export interface TripActivity {
  id: string;
  trip_id: string;
  stop_id: string | null;
  activity_id: string | null;
  custom_name: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  duration_hours: number | null;
  notes: string | null;
  order_index: number;
  created_at: string;
  activity?: Activity;
}

export interface Budget {
  id: string;
  trip_id: string;
  category: "transport" | "hotel" | "food" | "activities" | "shopping" | "other";
  description: string | null;
  amount: number;
  currency: string;
  date: string | null;
  created_at: string;
}

export interface PackingItem {
  id: string;
  trip_id: string;
  name: string;
  category: string;
  is_packed: boolean;
  quantity: number;
  created_at: string;
}

export interface TripNote {
  id: string;
  trip_id: string;
  stop_id: string | null;
  title: string | null;
  content: string;
  is_reminder: boolean;
  reminder_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SharedItinerary {
  id: string;
  trip_id: string;
  share_token: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

// API Types
export interface GeoDBCity {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  population: number;
}

export interface OpenTripMapPlace {
  xid: string;
  name: string;
  kinds: string;
  point: { lat: number; lon: number };
  rate: number;
  osm?: string;
  wikidata?: string;
}

export interface OpenTripMapPlaceDetail extends OpenTripMapPlace {
  wikipedia_extracts?: { text: string };
  preview?: { source: string };
  image?: string;
  address?: {
    city?: string;
    country?: string;
    state?: string;
  };
}

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
}

// Dashboard stats
export interface DashboardStats {
  totalTrips: number;
  totalStops: number;
  totalBudgetSpent: number;
  upcomingTrips: number;
}

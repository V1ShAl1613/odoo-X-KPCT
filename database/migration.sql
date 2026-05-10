-- Traveloop Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trips
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  start_date DATE,
  end_date DATE,
  budget_limit NUMERIC(12,2),
  travel_type TEXT CHECK (travel_type IN ('solo','couple','family','friends','business')),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning','ongoing','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trip Stops
CREATE TABLE IF NOT EXISTS public.trip_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  city_name TEXT NOT NULL,
  country TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  arrival_date DATE,
  departure_date DATE,
  order_index INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activities
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  rating NUMERIC(3,1),
  cost_estimate NUMERIC(10,2),
  duration_hours NUMERIC(4,1),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  source_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trip Activities (junction)
CREATE TABLE IF NOT EXISTS public.trip_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  stop_id UUID REFERENCES public.trip_stops(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
  custom_name TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  duration_hours NUMERIC(4,1),
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Budgets
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('transport','hotel','food','activities','shopping','other')),
  description TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Packing Items
CREATE TABLE IF NOT EXISTS public.packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_packed BOOLEAN DEFAULT false,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trip Notes
CREATE TABLE IF NOT EXISTS public.trip_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  stop_id UUID REFERENCES public.trip_stops(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  is_reminder BOOLEAN DEFAULT false,
  reminder_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Shared Itineraries
CREATE TABLE IF NOT EXISTS public.shared_itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON public.trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_trip_id ON public.trip_activities(trip_id);
CREATE INDEX IF NOT EXISTS idx_budgets_trip_id ON public.budgets(trip_id);
CREATE INDEX IF NOT EXISTS idx_packing_items_trip_id ON public.packing_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_notes_trip_id ON public.trip_notes(trip_id);
CREATE INDEX IF NOT EXISTS idx_shared_itineraries_token ON public.shared_itineraries(share_token);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_itineraries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can CRUD own trips" ON public.trips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own trip stops" ON public.trip_stops FOR ALL USING (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own trip activities" ON public.trip_activities FOR ALL USING (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own budgets" ON public.budgets FOR ALL USING (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own packing items" ON public.packing_items FOR ALL USING (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own trip notes" ON public.trip_notes FOR ALL USING (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()));
CREATE POLICY "Users can CRUD own shared itineraries" ON public.shared_itineraries FOR ALL USING (trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid()));

-- Public access for shared itineraries
CREATE POLICY "Anyone can view active shared itineraries" ON public.shared_itineraries FOR SELECT USING (is_active = true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

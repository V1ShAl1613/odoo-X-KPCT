import { create } from "zustand";
import type { Profile, Trip, DashboardStats } from "@/types";
import * as db from "@/lib/local-db";

interface AppState {
  user: Profile | null;
  trips: Trip[];
  stats: DashboardStats;
  isLoading: boolean;
  sidebarOpen: boolean;

  setUser: (user: Profile | null) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  login: (email: string, password: string) => Profile;
  signup: (name: string, email: string, password: string) => Profile;
  logout: () => void;

  loadTrips: () => void;
  loadStats: () => void;
  addTrip: (data: Partial<Trip>) => Trip;
  removeTrip: (id: string) => void;
  refreshTrip: (id: string) => Trip | null;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  trips: [],
  stats: { totalTrips: 0, totalStops: 0, totalBudgetSpent: 0, upcomingTrips: 0 },
  isLoading: false,
  sidebarOpen: true,

  setUser: (user) => set({ user }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  login: (email) => {
    const user = db.localLogin(email);
    if (user) set({ user });
    return user!;
  },

  signup: (name, email) => {
    const user = db.localSignup(name, email);
    set({ user });
    return user;
  },

  logout: () => {
    db.clearLocalUser();
    set({ user: null, trips: [], stats: { totalTrips: 0, totalStops: 0, totalBudgetSpent: 0, upcomingTrips: 0 } });
  },

  loadTrips: () => {
    const trips = db.getTrips();
    set({ trips });
  },

  loadStats: () => {
    const stats = db.getDashboardStats();
    set({ stats });
  },

  addTrip: (data) => {
    const trip = db.createTrip(data);
    get().loadTrips();
    get().loadStats();
    return trip;
  },

  removeTrip: (id) => {
    db.deleteTrip(id);
    get().loadTrips();
    get().loadStats();
  },

  refreshTrip: (id) => {
    return db.getTrip(id);
  },
}));

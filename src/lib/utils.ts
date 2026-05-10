import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateRange(start: string | Date, end: string | Date): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startStr = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(startDate);
  const endStr = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(endDate);
  return `${startStr} - ${endStr}`;
}

export function getDaysBetween(start: string | Date, end: string | Date): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function generateShareToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export const BUDGET_CATEGORIES = [
  { value: "transport", label: "Transport", icon: "✈️", color: "#6366f1" },
  { value: "hotel", label: "Hotel", icon: "🏨", color: "#8b5cf6" },
  { value: "food", label: "Food", icon: "🍽️", color: "#06b6d4" },
  { value: "activities", label: "Activities", icon: "🎯", color: "#10b981" },
  { value: "shopping", label: "Shopping", icon: "🛍️", color: "#f59e0b" },
  { value: "other", label: "Other", icon: "📦", color: "#ef4444" },
] as const;

export const TRAVEL_TYPES = [
  { value: "solo", label: "Solo", icon: "🧍" },
  { value: "couple", label: "Couple", icon: "💑" },
  { value: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { value: "friends", label: "Friends", icon: "👯" },
  { value: "business", label: "Business", icon: "💼" },
] as const;

export const PACKING_CATEGORIES = [
  "Clothing",
  "Toiletries",
  "Electronics",
  "Documents",
  "Medicine",
  "Accessories",
  "Snacks",
  "Other",
] as const;

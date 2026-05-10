import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const tripSchema = z.object({
  name: z.string().min(2, "Trip name must be at least 2 characters").max(100, "Trip name is too long"),
  description: z.string().max(500, "Description is too long").optional().or(z.literal("")),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  budget_limit: z.coerce.number().min(0, "Budget must be positive").optional().or(z.literal(0)),
  travel_type: z.enum(["solo", "couple", "family", "friends", "business"]).optional(),
  cover_image: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) >= new Date(data.start_date);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
});

export const tripStopSchema = z.object({
  city_name: z.string().min(1, "City name is required"),
  country: z.string().optional().or(z.literal("")),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  arrival_date: z.string().optional().or(z.literal("")),
  departure_date: z.string().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export const budgetSchema = z.object({
  category: z.enum(["transport", "hotel", "food", "activities", "shopping", "other"]),
  description: z.string().max(200).optional().or(z.literal("")),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().default("USD"),
  date: z.string().optional().or(z.literal("")),
});

export const packingItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(100),
  category: z.string().default("Other"),
  quantity: z.coerce.number().min(1).default(1),
});

export const tripNoteSchema = z.object({
  title: z.string().max(200).optional().or(z.literal("")),
  content: z.string().min(1, "Note content is required"),
  stop_id: z.string().optional().or(z.literal("")),
  is_reminder: z.boolean().default(false),
  reminder_date: z.string().optional().or(z.literal("")),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  language: z.string().default("en"),
});

export const activitySchema = z.object({
  custom_name: z.string().min(1, "Activity name is required").max(200),
  scheduled_date: z.string().optional().or(z.literal("")),
  scheduled_time: z.string().optional().or(z.literal("")),
  duration_hours: z.coerce.number().min(0).optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type TripInput = z.infer<typeof tripSchema>;
export type TripStopInput = z.infer<typeof tripStopSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
export type PackingItemInput = z.infer<typeof packingItemSchema>;
export type TripNoteInput = z.infer<typeof tripNoteSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ActivityInput = z.infer<typeof activitySchema>;

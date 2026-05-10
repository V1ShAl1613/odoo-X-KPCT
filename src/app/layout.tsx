import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Traveloop — Personalized Travel Planning Made Easy",
  description: "Plan multi-city trips, build itineraries, track budgets, and share your travel plans with Traveloop.",
  keywords: ["travel", "trip planner", "itinerary", "budget", "travel planning"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f1f5f9",
              backdropFilter: "blur(16px)",
            },
          }}
        />
      </body>
    </html>
  );
}

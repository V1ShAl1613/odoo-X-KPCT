"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Globe, Map, DollarSign, Share2, CalendarDays, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

const features = [
  { icon: Map, title: "Multi-City Itineraries", desc: "Plan trips across multiple cities with drag-and-drop reordering" },
  { icon: DollarSign, title: "Budget Analytics", desc: "Track expenses by category with beautiful charts and insights" },
  { icon: CalendarDays, title: "Day-wise Planning", desc: "Organize activities for each day with timeline visualization" },
  { icon: Share2, title: "Share & Collaborate", desc: "Share beautiful itineraries with friends via public links" },
  { icon: CheckCircle, title: "Packing Lists", desc: "Never forget essentials with smart categorized packing lists" },
  { icon: Sparkles, title: "City Discovery", desc: "Explore destinations and find activities powered by real APIs" },
];

const stats = [
  { value: "50K+", label: "Trips Planned" },
  { value: "120+", label: "Countries" },
  { value: "4.9★", label: "User Rating" },
  { value: "Free", label: "To Start" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-end/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 mb-6">
              <Sparkles size={14} /> Personalized Travel Planning
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Plan Your Dream{" "}
            <span className="gradient-text">Adventure</span>
            <br />
            With Ease
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10"
          >
            Create multi-city itineraries, track budgets, discover activities, and share your travel plans — all in one beautiful platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/signup" className="btn-primary text-base px-8 py-3">
              Start Planning Free <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-secondary text-base px-8 py-3">
              Log In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to <span className="gradient-text">Travel Smart</span></h2>
            <p className="text-muted max-w-xl mx-auto">Powerful tools designed to make trip planning effortless and enjoyable.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 card-shine group hover:border-accent/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 gradient-bg opacity-5" />
          <div className="relative">
            <Globe size={48} className="mx-auto mb-6 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore the World?</h2>
            <p className="text-muted mb-8 max-w-md mx-auto">Join thousands of travelers who plan smarter with Traveloop.</p>
            <Link href="/signup" className="btn-primary text-base px-10 py-3.5">
              Get Started — It&apos;s Free <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-bg flex items-center justify-center">
              <Globe size={14} className="text-white" />
            </div>
            <span className="font-semibold gradient-text">Traveloop</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Traveloop. Made with ❤️ for travelers.</p>
        </div>
      </footer>
    </div>
  );
}

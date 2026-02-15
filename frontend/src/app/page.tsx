"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { bars } from "@/data/bars";
import BarCard from "@/components/BarCard";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BentoGrid,
  BentoCard,
  MiniChart,
  EventTicker,
} from "@/components/landing/BentoGrid";

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const heroChild = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const router = useRouter();
  const featuredBars = bars.slice(0, 6);
  const trendyBars = bars.filter(bar => bar.tags.includes("Trendy")).slice(0, 6);
  const topRatedBars = bars.filter(bar => bar.tags.includes("Top rated")).slice(0, 6);

  const handleBarClick = (barName: string) => {
    router.push(`/bars?bar=${encodeURIComponent(barName)}`);
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen">
        {/* ─── Hero Section ─── */}
        <section
          className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: "url(/light-texture.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-kalshi-bg" />

          <motion.div
            className="relative z-10 text-center px-4 -mt-20 max-w-4xl mx-auto"
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={heroChild}
              className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight"
            >
              
              <span className="text-kalshi-green">Kalshi{" "}</span>
              Bars
            </motion.h1>

            <motion.p
              variants={heroChild}
              className="text-lg md:text-2xl text-white mb-10 max-w-2xl mx-auto"
            >
              Find bars affiliated with Kalshi
            </motion.p>

            <motion.div variants={heroChild}>
              <Link href="/bars" className="group relative inline-block">
                <motion.span
                  className="relative z-10 inline-flex items-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-kalshi-green/15 px-10 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 group-hover:bg-kalshi-green/25 group-hover:shadow-[0_0_30px_rgba(40,204,149,0.3)]"

                  whileTap={{ scale: 0.97 }}
                >
                  {/* Inner glass highlight */}
                  <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 via-transparent to-white/5" />
                  <span className="relative">Find a bar near you</span>
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ─── Bento Features Grid ─── */}
        <section className="bg-kalshi-bg px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl md:text-4xl font-semibold text-white text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How it works
            </motion.h2>

            <BentoGrid>
              {/* Live Markets — 2 cols, tall */}
              <BentoCard
                title="Live Markets"
                description="Watch prediction markets move in real-time as the game unfolds."
                className="md:col-span-2 md:row-span-2"
                backgroundImage="/bet.jpeg"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                }
              />


              {/* Find Bars — 1 col */}
              <BentoCard
                title="Find Bars"
                description="25+ bars across the East Coast in NYC, Boston, Philly, DC & more."
                backgroundImage="/soccerbar.jpeg"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />

              {/* Watch Parties — 1 col */}
              <BentoCard
                title="Watch Parties"
                description="NFL, Champions League, March Madness & more. Every big event covered."
                backgroundImage="/bball.jpeg"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                }
              >
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["NFL", "UCL", "March Madness", "UFC", "NBA"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-kalshi-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </BentoCard>

              {/* Bet & Watch — spans 1 col wide on lg */}
              <BentoCard
                title="Bet & Watch"
                description="Place bets while watching the game. Get the full experience in one place."
                backgroundImage="/kalshibet.jpeg"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />

              {/* Live Events — 2 cols */}
              <BentoCard
                title="Live Events"
                description="There's always something on. Browse upcoming events across all venues."
                className="md:col-span-2"
                backgroundImage="/events.jpeg"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
              >
                <EventTicker />
              </BentoCard>
            </BentoGrid>
          </div>
        </section>

        {/* ─── Featured Bars ─── */}
        <section className="bg-kalshi-bg px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <motion.h2
                className="text-3xl font-semibold text-white"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Featured bars
              </motion.h2>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ staggerChildren: 0.12 }}
            >
              {featuredBars.map((bar) => (
                <motion.div key={bar.name} variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }} className="h-full">
                  <BarCard
                    bar={bar}
                    onClick={() => handleBarClick(bar.name)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Trending ─── */}
        <section className="bg-kalshi-bg px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <motion.h2
                className="text-3xl font-semibold text-white"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Trending
              </motion.h2>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ staggerChildren: 0.12 }}
            >
              {trendyBars.map((bar) => (
                <motion.div key={bar.name} variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }} className="h-full">
                  <BarCard
                    bar={bar}
                    onClick={() => handleBarClick(bar.name)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Top Rated ─── */}
        <section className="bg-kalshi-bg px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <motion.h2
                className="text-3xl font-semibold text-white"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Top rated
              </motion.h2>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ staggerChildren: 0.12 }}
            >
              {topRatedBars.map((bar) => (
                <motion.div key={bar.name} variants={fadeUp} transition={{ duration: 0.5, ease: "easeOut" }} className="h-full">
                  <BarCard
                    bar={bar}
                    onClick={() => handleBarClick(bar.name)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

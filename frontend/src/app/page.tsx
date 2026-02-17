"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { bars } from "@/data/bars";
import BarCard from "@/components/BarCard";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BentoGrid,
  BentoCard,
  EventTicker,
} from "@/components/landing/BentoGrid";
import HalftoneWaveBackground from "@/components/HalftoneWaveBackground";

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
  const watchPartyTags = useMemo(() => ["NFL", "UCL", "March Madness", "UFC", "NBA"], []);
  const [visibleTagCount, setVisibleTagCount] = useState(2);
  const tagContainerRef = useRef<HTMLDivElement | null>(null);
  const tagMeasureRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!tagContainerRef.current || !tagMeasureRef.current) return;

    const measure = () => {
      const container = tagContainerRef.current;
      const measureRoot = tagMeasureRef.current;
      if (!container || !measureRoot) return;

      const gapValue = getComputedStyle(container).gap || getComputedStyle(container).columnGap || "0";
      const gap = parseFloat(gapValue) || 0;

      const chips = Array.from(measureRoot.querySelectorAll<HTMLElement>("[data-chip='tag']"));
      const moreChip = measureRoot.querySelector<HTMLElement>("[data-chip='more']");
      const widths = chips.map((chip) => chip.offsetWidth);
      const moreWidth = moreChip ? moreChip.offsetWidth : 0;
      const totalWidth = widths.reduce((acc, width) => acc + width, 0) + gap * Math.max(0, widths.length - 1);
      const maxVisible = widths.length;

      if (totalWidth <= container.clientWidth) {
        setVisibleTagCount(maxVisible);
        return;
      }

      let visible = maxVisible;
      while (visible > 1) {
        const visibleWidth = widths.slice(0, visible).reduce((acc, width) => acc + width, 0);
        const visibleGaps = gap * Math.max(0, visible - 1);
        const withMore = visibleWidth + visibleGaps + gap + moreWidth;
        if (withMore <= container.clientWidth) {
          break;
        }
        visible -= 1;
      }

      setVisibleTagCount(Math.max(1, visible));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(tagContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const { visibleWatchTags, remainingWatchTags } = useMemo(() => {
    const visible = watchPartyTags.slice(0, visibleTagCount);
    return {
      visibleWatchTags: visible,
      remainingWatchTags: Math.max(0, watchPartyTags.length - visible.length),
    };
  }, [watchPartyTags, visibleTagCount]);

  const handleBarClick = (barName: string) => {
    router.push(`/bars?bar=${encodeURIComponent(barName)}`);
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen">
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <HalftoneWaveBackground />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,10,0.85)_0%,rgba(7,12,10,0.2)_35%,rgba(7,12,10,0.9)_100%)]" />

          <motion.div
            className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-4 md:-mt-20"
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={heroChild}
              className="text-5xl font-semibold text-white mb-6 tracking-tight sm:text-6xl md:text-8xl"
              style={{
                textShadow: "0 0 40px rgba(40, 204, 149, 0.5), 0 0 80px rgba(40, 204, 149, 0.3), 0 4px 20px rgba(0, 0, 0, 0.5)"
              }}
            >
              <span className="text-kalshi-green drop-shadow-[0_0_10px_rgba(40,204,149,0.25)]">Kalshi </span>
              <span className="italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Bars</span>
            </motion.h1>

            <motion.p
              variants={heroChild}
              className="mx-auto mb-10 max-w-2xl text-base text-white sm:text-lg md:text-2xl"
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(40, 204, 149, 0.2)"
              }}
            >
              Find bars affiliated with Kalshi
            </motion.p>

            <motion.div variants={heroChild}>
              <Link href="/bars" className="group relative inline-block">
                <motion.span
                  className="relative z-10 inline-flex items-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-kalshi-green/15 px-10 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 group-hover:bg-kalshi-green/25 group-hover:shadow-[0_0_30px_rgba(40,204,149,0.3)]"

                  whileTap={{ scale: 0.97 }}
                >
                  <span className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-b from-white/15 via-transparent to-white/5" />
                  <span className="relative">Find a bar near you</span>
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section className="bg-kalshi-bg px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl md:text-4xl font-semibold text-white text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Kalshi&apos;s Bar Platform
            </motion.h2>

            <BentoGrid>
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
                <div ref={tagContainerRef} className="mt-2 flex items-center gap-1.5 overflow-hidden">
                  {visibleWatchTags.map((tag) => (
                    <span
                      key={tag}
                      className="whitespace-nowrap rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-kalshi-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                  {remainingWatchTags > 0 && (
                    <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-kalshi-text-secondary">
                      +{remainingWatchTags}
                    </span>
                  )}
                </div>
                <div
                  ref={tagMeasureRef}
                  className="pointer-events-none absolute -z-10 h-0 overflow-hidden opacity-0"
                >
                  {watchPartyTags.map((tag) => (
                    <span
                      key={`measure-${tag}`}
                      data-chip="tag"
                      className="whitespace-nowrap rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-kalshi-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    data-chip="more"
                    className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-kalshi-text-secondary"
                  >
                    +99
                  </span>
                </div>
              </BentoCard>

              <BentoCard
                title="Trade & Watch"
                description="Trade while watching the game. Get the full experience in one place."
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
                Featured Bars
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
                Top Rated
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

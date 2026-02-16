"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function BentoGrid({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(230px,auto)] gap-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function BentoCard({
  title,
  description,
  icon,
  className = "",
  children,
  backgroundImage,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
  backgroundImage?: string;
}) {
  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className={`group relative isolate flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-kalshi-card/75 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.55)] transition-shadow duration-300 hover:shadow-[0_26px_70px_rgba(0,0,0,0.7)] ${className}`}
    >
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/45 to-black/85" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)] opacity-60" />
        </>
      )}

      <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_top_left,rgba(40,204,149,0.18),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-linear-to-br from-white/4 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 mt-auto">
        <div className="rounded-xl border border-white/10 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.65)]">
              {title}
            </h3>
            {icon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-kalshi-green/90">
                {icon}
              </div>
            )}
          </div>
          <p className="text-sm text-white/75 leading-relaxed">{description}</p>
        </div>

        {children && <div className="mt-4">{children}</div>}
      </div>
    </motion.div>
  );
}

export function MiniChart() {
  return (
    <svg
      viewBox="0 0 200 80"
      className="w-full h-20 mt-2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[20, 40, 60].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="200"
          y2={y}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
      ))}

      <motion.path
        d="M0 60 Q25 55 40 45 T80 35 T120 40 T160 25 T200 30"
        stroke="#28CC95"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
      />

      <motion.path
        d="M0 60 Q25 55 40 45 T80 35 T120 40 T160 25 T200 30 V80 H0 Z"
        fill="url(#chartGlow)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      <motion.circle
        cx="200"
        cy="30"
        r="3"
        fill="#28CC95"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, duration: 0.3 }}
      />
      <motion.circle
        cx="200"
        cy="30"
        r="6"
        fill="#28CC95"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 0.4, 0] }}
        viewport={{ once: true }}
        transition={{ delay: 1.8, duration: 1.5, repeat: Infinity }}
      />

      <defs>
        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#28CC95" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#28CC95" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function EventTicker() {
  const events = [
    "NFL Sunday Ticket",
    "Champions League Final",
    "March Madness",
    "UFC Fight Night",
    "World Cup Qualifier",
    "NBA Playoffs",
    "Premier League Derby",
    "MLB Opening Day",
  ];

  return (
    <div className="overflow-hidden mt-3">
      <motion.div
        className="flex gap-3 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        {[...events, ...events].map((event, i) => (
          <span
            key={i}
            className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs text-kalshi-text-secondary shrink-0"
          >
            {event}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

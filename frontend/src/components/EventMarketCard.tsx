"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { ShineBorder } from "@/components/ui/ShineBorder";
import type { KalshiMarket } from "./MarketCard";
import Image from "next/image";
import Link from "next/link";

interface CandlestickPoint {
  ts: number;
  price: number;
}

interface OutcomeData {
  market: KalshiMarket;
  candlesticks: CandlestickPoint[];
  color: string;
  label: string;
  logoUrl?: string | null;
}

interface EventMarketCardProps {
  eventTitle: string;
  markets: KalshiMarket[];
}

const COLORS = ["#28CC95", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function buildFallbackCandles(label: string, basePrice: number): CandlestickPoint[] {
  const now = Math.floor(Date.now() / 1000);
  const daySeconds = 24 * 60 * 60;
  const points = 7;
  const seed = hashString(label);
  const series: CandlestickPoint[] = [];
  let price = clamp(basePrice || 50, 5, 95);

  for (let i = points - 1; i >= 0; i--) {
    const ts = now - i * daySeconds;
    const drift = ((seed % 7) - 3) * 0.2;
    const wave = Math.sin((seed + ts / daySeconds) * 0.6) * 1.8;
    price = clamp(price + drift + wave, 2, 98);
    series.push({ ts, price: Math.round(price * 100) / 100 });
  }

  return series;
}

function ensureCandlesticks(outcomes: OutcomeData[]): OutcomeData[] {
  return outcomes.map((outcome) => {
    if (outcome.candlesticks.length >= 2) return outcome;
    const base = outcome.market.yes_bid || outcome.market.last_price || 50;
    return {
      ...outcome,
      candlesticks: buildFallbackCandles(outcome.label, base),
    };
  });
}

function getContextFromSeries(seriesTicker: string): string {
  const contextMap: Record<string, string> = {
    KXUCLGAME: "football club soccer",
    KXEPLGAME: "football club Premier League",
    KXNBAGAME: "NBA basketball team",
    KXNFLGAME: "NFL football team",
    KXMLBGAME: "MLB baseball team",
    KXNHLGAME: "NHL hockey team",
    KXNCAAMGAME: "college basketball team",
    KXUFCGAME: "UFC MMA fighter",
    KXWCGAME: "national football team soccer",
    KXOSCARS: "actor actress film",
    KXGRAMMYS: "musician singer",
    KXPRES: "politician",
    KXBTC: "cryptocurrency",
    KXETH: "cryptocurrency",
    KXSOL: "cryptocurrency",
  };
  return contextMap[seriesTicker] || "";
}

function getOutcomeLabel(market: KalshiMarket): string {
  if (market.yes_sub_title) {
    return market.yes_sub_title;
  }

  const parts = market.ticker.split("-");
  const outcome = parts[parts.length - 1];

  if (outcome === "TIE" || outcome === "DRAW") return "Draw";

  return outcome;
}

function getKalshiMarketUrl(markets: KalshiMarket[]): string | null {
  const market = markets[0];
  if (!market) return null;
  return `https://kalshi.com/markets/${market.ticker}`;
}

export default function EventMarketCard({
  eventTitle,
  markets,
}: EventMarketCardProps) {
  const [outcomes, setOutcomes] = useState<OutcomeData[]>([]);
  const [loading, setLoading] = useState(true);
  const kalshiUrl = useMemo(() => getKalshiMarketUrl(markets), [markets]);

  const totalVolume = markets.reduce((sum, m) => sum + (m.volume || 0), 0);

  useEffect(() => {
    let isActive = true;

    async function fetchAllData() {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      const outcomesData: OutcomeData[] = markets.map((market, index) => ({
        market,
        candlesticks: [],
        color: COLORS[index % COLORS.length],
        label: getOutcomeLabel(market),
        logoUrl: null,
      }));

      const labels = outcomesData
        .map((o) => o.label)
        .filter((l) => l !== "Draw" && l !== "Tie");
      const seriesTicker = markets[0]?.series_ticker || "";
      const context = getContextFromSeries(seriesTicker);
      const logoContext = [context, eventTitle].filter(Boolean).join(" ");

      try {
        if (labels.length > 0) {
          const logoRes = await fetch(`${apiUrl}/kalshi/logos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              queries: labels.map((label) => ({ name: label, context: logoContext })),
            }),
          });
          if (logoRes.ok) {
            const logoData = await logoRes.json();
            const logos: Record<string, string | null> = logoData.logos || {};
            outcomesData.forEach((o) => {
              if (logos[o.label]) {
                o.logoUrl = logos[o.label];
              }
            });
          }
        }

        await Promise.allSettled(
          markets.map(async (market, index) => {
            if (!market.series_ticker || !market.ticker) return;
            try {
              const res = await fetch(
                `${apiUrl}/kalshi/candlesticks/${market.series_ticker}/${market.ticker}?hours=168&interval=60`,
              );
              if (res.ok) {
                const data = await res.json();
                outcomesData[index].candlesticks = data.candlesticks || [];
              }
            } catch (err) {
              console.error("Failed to fetch candlesticks:", err);
            }
          }),
        );
      } finally {
        if (isActive) {
          setOutcomes(ensureCandlesticks(outcomesData));
          setLoading(false);
        }
      }
    }

    fetchAllData();

    return () => {
      isActive = false;
    };
  }, [markets, eventTitle]);

  return (
    <div className="relative rounded-xl bg-kalshi-card overflow-hidden">
      <ShineBorder
        shineColor="#28CC95"
        borderWidth={1}
        duration={12}
        className="z-10 opacity-60"
      />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold text-white">{eventTitle}</h3>
          {kalshiUrl && (
            <Link
              href={kalshiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-kalshi-green/40 bg-kalshi-green/10 px-4 py-2 text-xs font-medium text-kalshi-green hover:bg-kalshi-green/20 transition-colors"
            >
              View on Kalshi
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex items-center text-xs text-kalshi-text-secondary mb-3">
              <span className="flex-1">Market</span>
              <span className="w-20 text-center">Pays out</span>
              <span className="w-20 text-center">Odds</span>
            </div>

            {outcomes.map((outcome) => {
              const price =
                outcome.market.yes_bid || outcome.market.last_price || 50;
              const payout = price > 0 ? (100 / price).toFixed(2) : "—";

              return (
                <div
                  key={outcome.market.ticker}
                  className="flex items-center mb-3"
                >
                  <div className="flex-1 flex items-center gap-3">
                    {outcome.logoUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/5">
                        <Image
                          src={outcome.logoUrl}
                          alt={outcome.label}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{
                          backgroundColor: `${outcome.color}20`,
                          color: outcome.color,
                        }}
                      >
                        {outcome.label.charAt(0)}
                      </div>
                    )}
                    <span className="text-white text-sm">{outcome.label}</span>
                  </div>
                  <span className="w-20 text-center text-kalshi-text-secondary text-sm">
                    {payout}x
                  </span>
                  <div className="w-20 flex justify-center">
                    <span
                      className="px-3 py-1.5 rounded-md border text-sm font-medium"
                      style={{
                        borderColor: `${outcome.color}50`,
                        backgroundColor: `${outcome.color}10`,
                        color: outcome.color,
                      }}
                    >
                      {price}%
                    </span>
                  </div>
                </div>
              );
            })}

            <p className="text-sm text-kalshi-text-secondary mt-4">
              ${(totalVolume / 100).toLocaleString()} vol
            </p>
          </div>

          <div className="w-80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 flex-wrap">
                {outcomes.slice(0, 3).map((outcome) => {
                  const price =
                    outcome.market.yes_bid || outcome.market.last_price || 50;
                  return (
                    <span
                      key={outcome.market.ticker}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: outcome.color }}
                      />
                      <span className="text-kalshi-text-secondary">
                        {outcome.label}
                      </span>
                      <span className="text-white font-medium">{price}%</span>
                    </span>
                  );
                })}
              </div>
              <span className="text-kalshi-green font-semibold text-sm">
                Kalshi
              </span>
            </div>

            <div className="h-40">
              <MultiLineChart outcomes={outcomes} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MultiLineChart({
  outcomes,
  loading,
}: {
  outcomes: OutcomeData[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-full h-full bg-white/5 rounded animate-pulse" />
      </div>
    );
  }

  const outcomesWithData = outcomes.filter((o) => o.candlesticks.length >= 2);

  if (outcomesWithData.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-full h-20 flex items-end justify-center gap-1 opacity-30">
            {[30, 45, 35, 50, 40, 55, 45, 60, 50, 45, 55, 40].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-kalshi-green/50 rounded-t"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="text-xs text-kalshi-text-secondary mt-2">
            Chart loading...
          </p>
        </div>
      </div>
    );
  }

  const allTimes = outcomesWithData.flatMap((o) =>
    o.candlesticks.map((c) => c.ts),
  );
  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);
  const timeRange = maxTime - minTime || 1;
  const textureId = `chartTexture-${
    outcomesWithData[0]?.market.ticker
      ? outcomesWithData[0].market.ticker.replace(/[^a-zA-Z0-9]/g, "")
      : "base"
  }`;

  return (
    <div className="h-full w-full relative">
      <div className="absolute right-0 top-0 bottom-4 flex flex-col justify-between text-[10px] text-kalshi-text-secondary w-10 text-right">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>

      <div className="absolute inset-0 pr-12 pb-4">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <pattern
              id={textureId}
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
            >
              <path
                d="M0 4 L4 0"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
            </pattern>
            {outcomesWithData.map((outcome) => {
              const gradientId = `lineGradient-${outcome.market.ticker.replace(/[^a-zA-Z0-9]/g, "")}`;
              return (
                <linearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={outcome.color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={outcome.color} stopOpacity="0" />
                </linearGradient>
              );
            })}
          </defs>

          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill={`url(#${textureId})`}
            opacity="0.5"
          />

          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {outcomesWithData.map((outcome) => {
            const coords = outcome.candlesticks.map((c) => {
              const x = ((c.ts - minTime) / timeRange) * 100;
              const y = 100 - c.price;
              return { x, y };
            });

            if (!coords.length) return null;

            const points = coords.map((c) => `${c.x},${c.y}`).join(" ");
            const areaPath = `M${coords[0].x},100 ${coords
              .map((c) => `L${c.x},${c.y}`)
              .join(" ")} L${coords[coords.length - 1].x},100 Z`;
            const gradientId = `lineGradient-${outcome.market.ticker.replace(/[^a-zA-Z0-9]/g, "")}`;

            return (
              <g key={outcome.market.ticker}>
                <path
                  d={areaPath}
                  fill={`url(#${gradientId})`}
                  opacity="0.9"
                />
                <polyline
                  fill="none"
                  stroke={outcome.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                  vectorEffect="non-scaling-stroke"
                />
                {coords.map((coord, index) => (
                  <circle
                    key={`${outcome.market.ticker}-point-${index}`}
                    cx={coord.x}
                    cy={coord.y}
                    r="1.5"
                    fill="#0f172a"
                    stroke={outcome.color}
                    strokeWidth="0.8"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-12 flex justify-between text-[10px] text-kalshi-text-secondary">
        {(() => {
          const dates: string[] = [];
          const start = new Date(minTime * 1000);
          const end = new Date(maxTime * 1000);
          const dayMs = 24 * 60 * 60 * 1000;
          const totalDays = Math.ceil(
            (end.getTime() - start.getTime()) / dayMs,
          );
          const step = Math.max(1, Math.floor(totalDays / 4));

          for (let i = 0; i <= 4; i++) {
            const d = new Date(start.getTime() + i * step * dayMs);
            dates.push(
              d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            );
          }
          return dates.map((d, i) => <span key={i}>{d}</span>);
        })()}
      </div>
    </div>
  );
}

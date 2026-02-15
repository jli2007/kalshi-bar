"use client";

import { useEffect, useState } from "react";
import { ShineBorder } from "@/components/ui/ShineBorder";
import PriceChart from "./PriceChart";

export interface KalshiMarket {
  ticker: string;
  event_ticker: string;
  series_ticker: string;
  title: string;
  subtitle?: string;
  yes_bid: number;
  yes_ask: number;
  no_bid: number;
  no_ask: number;
  last_price: number;
  volume: number;
  volume_24h: number;
  open_interest: number;
  status: string;
  image_url?: string | null;
  yes_sub_title?: string;
  no_sub_title?: string;
}

interface CandlestickPoint {
  ts: number;
  price: number;
}

interface MarketCardProps {
  market: KalshiMarket;
}

export default function MarketCard({ market }: MarketCardProps) {
  const [candlesticks, setCandlesticks] = useState<CandlestickPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const yesPrice = market.yes_bid || market.last_price || 50;
  const noPrice = 100 - yesPrice;
  const yesPayout = yesPrice > 0 ? (100 / yesPrice).toFixed(2) : "—";
  const noPayout = noPrice > 0 ? (100 / noPrice).toFixed(2) : "—";

  useEffect(() => {
    async function fetchCandlesticks() {
      if (!market.series_ticker || !market.ticker) {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(
          `${apiUrl}/kalshi/candlesticks/${market.series_ticker}/${market.ticker}?hours=168&interval=60`
        );

        if (res.ok) {
          const data = await res.json();
          setCandlesticks(data.candlesticks || []);
        }
      } catch (err) {
        console.error("Failed to fetch candlesticks:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCandlesticks();
  }, [market.series_ticker, market.ticker]);

  return (
    <div className="relative rounded-xl bg-kalshi-card overflow-hidden">
      <ShineBorder shineColor="#28CC95" borderWidth={1} duration={12} className="z-10 opacity-60" />

      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-4">
          {market.title}
        </h3>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-8 text-xs text-kalshi-text-secondary mb-3">
              <span className="w-24">Market</span>
              <span className="w-16 text-center">Pays out</span>
              <span className="w-16 text-center">Odds</span>
            </div>

            <div className="flex items-center gap-8 mb-2">
              <div className="w-24 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-kalshi-green/20 flex items-center justify-center">
                  <span className="text-kalshi-green text-xs">Y</span>
                </div>
                <span className="text-white text-sm">Yes</span>
              </div>
              <span className="w-16 text-center text-kalshi-text-secondary text-sm">{yesPayout}x</span>
              <div className="w-16 flex justify-center">
                <span className="px-3 py-1 rounded-md border border-kalshi-green/50 bg-kalshi-green/10 text-kalshi-green text-sm font-medium">
                  {yesPrice}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8 mb-4">
              <div className="w-24 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 text-xs">N</span>
                </div>
                <span className="text-white text-sm">No</span>
              </div>
              <span className="w-16 text-center text-kalshi-text-secondary text-sm">{noPayout}x</span>
              <div className="w-16 flex justify-center">
                <span className="px-3 py-1 rounded-md border border-red-500/50 bg-red-500/10 text-red-400 text-sm font-medium">
                  {noPrice}%
                </span>
              </div>
            </div>

            <p className="text-sm text-kalshi-text-secondary">
              ${(market.volume / 100).toLocaleString()} vol
            </p>
          </div>

          <div className="w-64 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-kalshi-green" />
                  <span className="text-kalshi-text-secondary">Yes</span>
                  <span className="text-white font-medium">{yesPrice}%</span>
                </span>
              </div>
              <span className="text-kalshi-green font-semibold text-sm">Kalshi</span>
            </div>

            <div className="flex-1 min-h-25">
              <PriceChart data={candlesticks} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

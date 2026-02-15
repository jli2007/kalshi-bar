"use client";

import { useEffect, useState } from "react";
import EventMarketCard from "./EventMarketCard";
import type { KalshiMarket } from "./MarketCard";

interface MarketsSectionProps {
  eventId: string;
  eventName?: string;
  category?: string;
}

interface MarketsResponse {
  eventId: string;
  seriesTicker: string | null;
  markets: KalshiMarket[];
  count: number;
}

interface GroupedEvent {
  eventTicker: string;
  title: string;
  markets: KalshiMarket[];
}

export default function MarketsSection({ eventId, eventName, category }: MarketsSectionProps) {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 2;

  useEffect(() => {
    async function fetchMarkets() {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const params = new URLSearchParams();
        if (eventName) params.set("name", eventName);
        if (category) params.set("category", category);
        const queryString = params.toString();
        const res = await fetch(`${apiUrl}/kalshi/markets/${eventId}${queryString ? `?${queryString}` : ""}`);

        if (!res.ok) {
          throw new Error("Failed to fetch markets");
        }

        const data: MarketsResponse = await res.json();

        const grouped = new Map<string, KalshiMarket[]>();
        for (const market of data.markets) {
          const eventTicker = market.event_ticker || market.ticker;
          if (!grouped.has(eventTicker)) {
            grouped.set(eventTicker, []);
          }
          grouped.get(eventTicker)!.push(market);
        }

        const events: GroupedEvent[] = Array.from(grouped.entries()).map(([eventTicker, markets]) => {
          let title = markets[0]?.title || "Unknown Event";
          title = title.replace(/\s*Winner\??$/, "");

          return {
            eventTicker,
            title,
            markets: markets.sort((a, b) => (b.yes_bid || 0) - (a.yes_bid || 0)),
          };
        });

        setGroupedEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load markets");
      } finally {
        setLoading(false);
      }
    }

    fetchMarkets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">Related Markets</h2>
          <span className="text-kalshi-green text-lg font-semibold">Kalshi</span>
        </div>
        <div className="rounded-xl bg-kalshi-card p-6 animate-pulse">
          <div className="h-6 bg-white/10 rounded w-1/3 mb-6" />
          <div className="flex gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-white/5 rounded w-1/2" />
              <div className="h-10 bg-white/10 rounded" />
              <div className="h-10 bg-white/10 rounded" />
              <div className="h-10 bg-white/10 rounded" />
            </div>
            <div className="w-80 h-40 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (groupedEvents.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">Related Markets</h2>
          <span className="text-kalshi-green text-lg font-semibold">Kalshi</span>
        </div>
        <div className="rounded-xl bg-kalshi-card p-6 text-center">
          <p className="text-kalshi-text-secondary">No prediction markets available for this event.</p>
        </div>
      </div>
    );
  }

  const displayedEvents = showAll ? groupedEvents : groupedEvents.slice(0, INITIAL_COUNT);
  const hiddenCount = groupedEvents.length - INITIAL_COUNT;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-white">Related Markets</h2>
        <span className="text-kalshi-green text-lg font-semibold">Kalshi</span>
      </div>

      <div className="flex flex-col gap-4">
        {displayedEvents.map((event) => (
          <EventMarketCard
            key={event.eventTicker}
            eventTitle={event.title}
            markets={event.markets}
          />
        ))}
      </div>

      {hiddenCount > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 w-full py-3 rounded-xl border border-kalshi-green/30 bg-kalshi-green/5 text-kalshi-green font-medium text-sm hover:bg-kalshi-green/10 transition-colors"
        >
          Show {hiddenCount} more event{hiddenCount > 1 ? "s" : ""}
        </button>
      )}

      {showAll && groupedEvents.length > INITIAL_COUNT && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-4 w-full py-3 rounded-xl border border-white/10 bg-white/5 text-kalshi-text-secondary font-medium text-sm hover:bg-white/10 transition-colors"
        >
          Show less
        </button>
      )}
    </div>
  );
}

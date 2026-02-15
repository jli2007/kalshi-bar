import { Hono } from "hono";
import { KalshiService } from "../services/kalshi_service";
import { logoService } from "../services/logo_service";
import { EVENT_SERIES_MAP, type KalshiMarket, type KalshiEvent } from "../types";

const kalshi = new Hono();
const kalshiService = new KalshiService();

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getSeriesFromMap = (eventId?: string, eventName?: string): string | null => {
  const candidates = [eventId, eventName].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const normalized = normalizeKey(candidate);
    if (EVENT_SERIES_MAP[normalized]) {
      return EVENT_SERIES_MAP[normalized];
    }
  }
  return null;
};

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const KEYWORD_SERIES_MAP: Array<[string, string]> = [
  ["super bowl", "KXSB"],
  ["superbowl", "KXSB"],
  ["nfl", "KXNFLGAME"],
  ["nba", "KXNBAGAME"],
  ["basketball", "KXNBAGAME"],
  ["mlb", "KXMLBGAME"],
  ["baseball", "KXMLBGAME"],
  ["nhl", "KXNHLGAME"],
  ["hockey", "KXNHLGAME"],
  ["champions league", "KXUCLGAME"],
  ["premier league", "KXEPLGAME"],
  ["world cup", "KXWCGAME"],
  ["soccer", "KXWCGAME"],
  ["ufc", "KXUFCGAME"],
  ["mma", "KXUFCGAME"],
];

function detectSeriesFromKeywords(query: string): string | null {
  const normalized = normalizeText(query);
  for (const [term, series] of KEYWORD_SERIES_MAP) {
    if (normalized.includes(term)) return series;
  }
  return null;
}

function scoreMarketMatch(query: string, market: KalshiMarket): number {
  const haystack = normalizeText([
    market.title,
    market.subtitle,
    market.yes_sub_title,
    market.no_sub_title,
    market.event_ticker,
    market.ticker,
  ]
    .filter(Boolean)
    .join(" "));
  if (!haystack) return 0;
  const tokens = normalizeText(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return 0;
  let hits = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) hits += 1;
  }
  return hits / tokens.length;
}

function pickTopByVolume(markets: KalshiMarket[], limit: number): KalshiMarket[] {
  return [...markets]
    .sort((a, b) => (b.volume || 0) - (a.volume || 0))
    .slice(0, limit);
}

function filterOpenMarkets(markets: KalshiMarket[]): KalshiMarket[] {
  return markets.filter((market) => market.status === "open" || market.status === "active");
}

function isLeagueLevelQuery(query: string): boolean {
  const q = query.toLowerCase();
  return [
    "champions league",
    "premier league",
    "la liga",
    "serie a",
    "bundesliga",
    "ligue 1",
    "world cup",
    "soccer",
    "football",
  ].some((term) => q.includes(term));
}

function scoreEventMatch(query: string, event: KalshiEvent): number {
  const haystack = normalizeText([
    event.title,
    event.subtitle,
    event.category,
    event.series_ticker,
    event.event_ticker,
  ]
    .filter(Boolean)
    .join(" "));
  if (!haystack) return 0;
  const tokens = normalizeText(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return 0;
  let hits = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) hits += 1;
  }
  return hits / tokens.length;
}

function rankEventsByQuery(query: string, events: KalshiEvent[]): KalshiEvent[] {
  return events
    .map((event) => ({ event, score: scoreEventMatch(query, event) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.event);
}

// Get markets for an event (by event ID/slug)
kalshi.get("/markets/:eventId", async (c) => {
  const eventId = c.req.param("eventId");
  const eventName = c.req.query("name");
  const category = c.req.query("category");
  const limitParam = parseInt(c.req.query("limit") || "24", 10);
  const maxMarkets = Number.isFinite(limitParam) ? Math.max(6, Math.min(60, limitParam)) : 24;
  console.log(`\n📊 [GET /kalshi/markets/${eventId}]`);
  if (eventName) console.log(`   📝 Name: ${eventName}`);
  if (category) console.log(`   🏷️ Category: ${category}`);

  if (!eventId) {
    console.log('   ❌ Missing eventId');
    return c.json({ error: "eventId required" }, 400);
  }

  try {
    const mappedSeries = getSeriesFromMap(eventId, eventName);
    if (mappedSeries) {
      console.log(`   Using mapped series: ${mappedSeries}`);
    }

    // Build search context from slug, name, and category
    const searchContext = [eventId, eventName, category].filter(Boolean).join(" ");
    console.log(`   Detecting series for: ${searchContext}`);

    const query = [eventName, category].filter(Boolean).join(" ").trim() || searchContext;
    const keywordSeries = detectSeriesFromKeywords(query);
    let seriesTicker: string | null = mappedSeries || keywordSeries || null;
    let markets: KalshiMarket[] = [];
    if (seriesTicker) {
      console.log(`   Fetching markets for series: ${seriesTicker}`);
      markets = await kalshiService.getMarketsBySeries(seriesTicker, { status: "open", limit: 200 });
      console.log(`   Found ${markets.length} markets`);
    }

    if (markets.length === 0) {
      console.log(`   Fetching events catalog for keyword match`);
      const events = await kalshiService.getAllEvents("open");
      const ranked = rankEventsByQuery(query, events);
      const matchedEvents = ranked.slice(0, 4);
      markets = matchedEvents.flatMap((event) => event.markets || []);
      if (!seriesTicker && matchedEvents[0]?.series_ticker) {
        seriesTicker = matchedEvents[0].series_ticker;
      }
      console.log(`   Matched ${matchedEvents.length} events`);
    }

    if (seriesTicker && markets.length === 0) {
      console.log(`   No open markets found. Retrying without status filter.`);
      markets = await kalshiService.getMarketsBySeries(seriesTicker, { limit: 200 });
      console.log(`   Found ${markets.length} markets`);
    }

    console.log(`   Series ticker: ${seriesTicker || 'None found'}`);

    if (!seriesTicker) {
      return c.json({ eventId, seriesTicker: null, markets: [], count: 0 });
    }

    let openMarkets = filterOpenMarkets(markets);
    if (openMarkets.length > 0 && query) {
      if (isLeagueLevelQuery(query)) {
        openMarkets = pickTopByVolume(openMarkets, maxMarkets);
      } else {
        const scoredMarkets = openMarkets
          .map((market) => ({ market, score: scoreMarketMatch(query, market) }))
          .sort((a, b) => b.score - a.score);
        const directMatches = scoredMarkets.filter((entry) => entry.score > 0.35).map((entry) => entry.market);
        if (directMatches.length > 0) {
          openMarkets = directMatches.slice(0, maxMarkets);
        } else {
          const candidates = pickTopByVolume(openMarkets, Math.max(40, maxMarkets));
          openMarkets = candidates.slice(0, maxMarkets);
        }
      }
    }

    return c.json({
      eventId,
      seriesTicker,
      markets: openMarkets,
      count: openMarkets.length,
    });
  } catch (error: any) {
    console.error(`   ❌ Error:`, error.message);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

// Health check for Kalshi API connectivity
kalshi.get("/health", async (c) => {
  const series = c.req.query("series") || "KXOSCARS";
  const params = new URLSearchParams({
    series_ticker: series,
    limit: "1",
  });

  const results = await kalshiService.testConnectivity("/trade-api/v2/markets", params);
  return c.json({
    series,
    results,
  });
});

// Search series catalog by keyword
kalshi.get("/series-search", async (c) => {
  const query = c.req.query("q") || "";
  const limit = parseInt(c.req.query("limit") || "300", 10);
  if (!query) {
    return c.json({ query, series: [] });
  }

  const series = await kalshiService.searchSeries(query, { limit });
  return c.json({ query, series });
});

// Get logo for an entity (team, country, person, etc.)
kalshi.get("/logo/:query", async (c) => {
  const query = c.req.param("query");
  const context = c.req.query("context"); // e.g., "soccer", "country", "actor"
  console.log(`\n🖼️ [GET /kalshi/logo/${query}]${context ? ` context="${context}"` : ''}`);

  if (!query) {
    return c.json({ error: "query required" }, 400);
  }

  try {
    const logoUrl = await logoService.getLogoUrl(query, context);
    console.log(`   ✅ Logo: ${logoUrl ? 'Found' : 'Not found'}`);
    return c.json({ query, logoUrl });
  } catch (error: any) {
    console.error(`   ❌ Error:`, error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Get logos for multiple entities
kalshi.post("/logos", async (c) => {
  const body = await c.req.json();
  const queries: Array<string | { name: string; context?: string }> = body.queries || [];
  const context: string | undefined = body.context; // Shared context for all queries
  console.log(`\n🖼️ [POST /kalshi/logos] - ${queries.length} queries${context ? `, context="${context}"` : ''}`);

  if (!queries.length) {
    return c.json({ logos: {} });
  }

  try {
    const logos = await logoService.getLogosForTeams(queries, context);
    console.log(`   ✅ Found ${Object.values(logos).filter(Boolean).length}/${queries.length} logos`);
    return c.json({ logos });
  } catch (error: any) {
    console.error(`   ❌ Error:`, error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Get candlesticks for a specific market
kalshi.get("/candlesticks/:seriesTicker/:ticker", async (c) => {
  const seriesTicker = c.req.param("seriesTicker");
  const ticker = c.req.param("ticker");
  const hours = parseInt(c.req.query("hours") || "168");
  // Kalshi valid intervals: 1, 5, 15, 60, 240, 1440 (in minutes)
  const periodInterval = parseInt(c.req.query("interval") || "60");

  console.log(`\n📈 [GET /kalshi/candlesticks/${seriesTicker}/${ticker}]`);
  console.log(`   ⏱️ Hours: ${hours}, Interval: ${periodInterval}min`);

  if (!seriesTicker || !ticker) {
    console.log('   ❌ Missing seriesTicker or ticker');
    return c.json({ error: "seriesTicker and ticker required" }, 400);
  }

  try {
    const candlesticks = await kalshiService.getCandlesticks(
      seriesTicker,
      ticker,
      { hours, periodInterval }
    );

    console.log(`   ✅ Found ${candlesticks.length} candlestick points`);

    return c.json({
      seriesTicker,
      ticker,
      candlesticks,
      count: candlesticks.length,
    });
  } catch (error: any) {
    console.error(`   ❌ Error:`, error.message);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

export default kalshi;

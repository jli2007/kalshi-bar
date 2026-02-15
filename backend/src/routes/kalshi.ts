import { Hono } from "hono";
import { KalshiService } from "../services/kalshi_service";
import { logoService } from "../services/logo_service";
import { EVENT_SERIES_MAP, type KalshiMarket } from "../types";

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

// Get markets for an event (by event ID/slug)
kalshi.get("/markets/:eventId", async (c) => {
  const eventId = c.req.param("eventId");
  const eventName = c.req.query("name");
  const category = c.req.query("category");
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

    let seriesTicker: string | null = mappedSeries || null;
    let markets: KalshiMarket[] = [];
    const query = [eventName, category].filter(Boolean).join(" ").trim() || searchContext;

    const seriesCandidates: string[] = [];
    if (seriesTicker) seriesCandidates.push(seriesTicker);

    const detectedSeries = await kalshiService.getSeriesForEventId(searchContext);
    if (detectedSeries) {
      if (!seriesTicker) seriesTicker = detectedSeries;
      if (!seriesCandidates.includes(detectedSeries)) {
        seriesCandidates.push(detectedSeries);
      }
    }

    const extraCandidates = await kalshiService.getSeriesCandidates(searchContext, 3);
    extraCandidates.forEach((candidate) => {
      if (!seriesCandidates.includes(candidate)) {
        seriesCandidates.push(candidate);
      }
    });

    for (const candidate of seriesCandidates) {
      console.log(`   Fetching markets for series: ${candidate}`);
      markets = await kalshiService.getMarketsBySeries(candidate, { status: "open", limit: 200 });
      console.log(`   Found ${markets.length} markets`);

      if (markets.length === 0) {
        console.log(`   No open markets found. Retrying without status filter.`);
        markets = await kalshiService.getMarketsBySeries(candidate, { limit: 200 });
        console.log(`   Found ${markets.length} markets`);
      }

      if (markets.length > 0) {
        seriesTicker = candidate;
        break;
      }
    }

    console.log(`   Series ticker: ${seriesTicker || 'None found'}`);

    if (!seriesTicker) {
      return c.json({ eventId, seriesTicker: null, markets: [], count: 0 });
    }

    let openMarkets = filterOpenMarkets(markets);
    if (openMarkets.length > 0 && query) {
      const scoredMarkets = openMarkets
        .map((market) => ({ market, score: scoreMarketMatch(query, market) }))
        .sort((a, b) => b.score - a.score);
      const directMatches = scoredMarkets.filter((entry) => entry.score > 0.35).map((entry) => entry.market);
      if (directMatches.length > 0) {
        openMarkets = directMatches;
      } else {
        const candidates = pickTopByVolume(openMarkets, 80);
        const tickers = await kalshiService.selectMarketTickers(query, candidates, 12);
        if (tickers.length > 0) {
          openMarkets = candidates.filter((market) => tickers.includes(market.ticker));
        } else {
          openMarkets = pickTopByVolume(openMarkets, 12);
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

import { Hono } from "hono";
import { KalshiService } from "../services/kalshi_service";
import { logoService } from "../services/logo_service";

const kalshi = new Hono();
const kalshiService = new KalshiService();

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
    // Build search context from slug, name, and category
    const searchContext = [eventId, eventName, category].filter(Boolean).join(" ");
    console.log(`   🔍 Detecting series for: ${searchContext}`);
    const seriesTicker = await kalshiService.getSeriesForEventId(searchContext);
    console.log(`   📌 Series ticker: ${seriesTicker || 'None found'}`);

    if (!seriesTicker) {
      return c.json({ eventId, seriesTicker: null, markets: [], count: 0 });
    }

    console.log(`   📡 Fetching markets for series: ${seriesTicker}`);
    const markets = await kalshiService.getMarketsBySeries(seriesTicker);
    console.log(`   ✅ Found ${markets.length} markets`);

    return c.json({
      eventId,
      seriesTicker,
      markets,
      count: markets.length,
    });
  } catch (error: any) {
    console.error(`   ❌ Error:`, error.message);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
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

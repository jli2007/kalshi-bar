import OpenAI from 'openai';
import crypto from 'crypto';
import type { CandlestickPoint, KalshiMarket } from '../types';

const KALSHI_API_BASE = "https://api.elections.kalshi.com";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export class KalshiService {
  private apiKey: string;
  private privateKey: crypto.KeyObject;

  constructor() {
    this.apiKey = process.env.KALSHI_API_KEY || "";

    try {
      const inlineKey = process.env.KALSHI_PRIVATE_KEY;
      const base64Key = process.env.KALSHI_PRIVATE_KEY_BASE64;

      if (inlineKey || base64Key) {
        const rawValue = (inlineKey || base64Key || '').trim();
        // Support both literal PEM strings and base64 encoded keys coming from env vars.
        const keySource = rawValue.includes('BEGIN')
          ? rawValue.replace(/\\n/g, '\n')
          : Buffer.from(rawValue, 'base64');

        this.privateKey = crypto.createPrivateKey(keySource);
        console.log('   🔑 Private key loaded from environment');
      } else {
        const fs = require('fs');
        const keyPath = process.env.KALSHI_PRIVATE_KEY_PATH || './kalshi_private_key.pem';
        const keyBytes = fs.readFileSync(keyPath);
        this.privateKey = crypto.createPrivateKey(keyBytes);
        console.log(`   🔑 Private key loaded from file: ${keyPath}`);
      }
    } catch (error) {
      console.error('   ❌ Failed to load private key:', error);
      throw error;
    }
  }

  async getSeriesForEventId(searchContext: string): Promise<string | null> {
    const humanReadable = searchContext.replace(/-/g, ' ');
    console.log(`   🤖 Asking OpenAI to detect series for: "${humanReadable}"`);

    const prompt = `You are a Kalshi prediction market expert. Given this event name, return the EXACT Kalshi series ticker that matches.

Event: "${humanReadable}"

Available Kalshi series (return EXACTLY one of these):
SPORTS:
- KXNFLGAME - NFL football games
- KXSB - Super Bowl
- KXNBAGAME - NBA basketball games
- KXNCAAMGAME - NCAA March Madness / college basketball
- KXMLBGAME - MLB baseball games
- KXNHLGAME - NHL hockey games
- KXWCGAME - FIFA World Cup soccer
- KXUCLGAME - UEFA Champions League soccer
- KXEPLGAME - English Premier League soccer
- KXLALIGAGAME - La Liga Spanish soccer
- KXSABORUNFRGAME - Saudi Pro League, Serie A, Bundesliga, Ligue 1, other soccer
- KXUFCGAME - UFC/MMA fights
- KXBOXGAME - Boxing matches
- KXGOLF - Golf tournaments (PGA, Masters)
- KXTENNIS - Tennis (Grand Slams, ATP, WTA)
- KXF1GAME - Formula 1 racing

ENTERTAINMENT:
- KXOSCARS - Academy Awards/Oscars
- KXGRAMMYS - Grammy Awards
- KXEMMYS - Emmy Awards
- KXGOLDENGLOBES - Golden Globes
- KXTONYAWARDS - Tony Awards

CRYPTO:
- KXBTC - Bitcoin price
- KXETH - Ethereum price
- KXSOL - Solana price
- KXXRP - XRP price

POLITICS:
- KXPRES - Presidential election
- KXSENATE - Senate races
- KXHOUSE - House races
- KXGOV - Governor races

FINANCE:
- KXINX - Stock indices (S&P 500, Nasdaq, Dow)
- KXFED - Federal Reserve interest rates
- KXECON - Economic indicators

WEATHER:
- KXWEATHER - Weather events, temperature records

Return ONLY the ticker (e.g. "KXNBAGAME") or "NONE" if no match. No explanation.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 20,
      });

      const result = response.choices[0]?.message?.content?.trim() || "NONE";
      console.log(`   🤖 OpenAI response: ${result}`);

      if (result === "NONE") {
        console.log(`   ⚠️ No matching series found`);
        return null;
      }

      const match = result.match(/KX[A-Z0-9]+/);
      if (!match) {
        console.log(`   ⚠️ No matching series found`);
        return null;
      }

      return match[0];
    } catch (error: any) {
      console.error(`   ❌ OpenAI API error:`, error.message);
      return null;
    }
  }

  async getMarketsBySeries(
    seriesTicker: string,
    options: { limit?: number; status?: string } = {}
  ): Promise<KalshiMarket[]> {
    const path = `/trade-api/v2/markets`;
    const limit = options.limit ?? 20;
    const params = new URLSearchParams({
      series_ticker: seriesTicker,
      limit: limit.toString(),
    });
    if (options.status) {
      params.set("status", options.status);
    }

    const url = `${KALSHI_API_BASE}${path}?${params}`;
    console.log(`   📡 Fetching markets: ${url}`);

    try {
      const response = await fetch(url, {
        headers: this.getHeaders("GET", path),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`   ❌ HTTP ${response.status}:`, errorText.substring(0, 200));
        return [];
      }

      const data = await response.json();
      const markets = data.markets || [];
      console.log(`   📦 Raw markets received: ${markets.length}`);

      if (markets.length > 0) {
        console.log(`   📋 Sample market fields:`, Object.keys(markets[0]));
      }

      return markets.map((m: any) => ({
        ticker: m.ticker,
        event_ticker: m.event_ticker,
        series_ticker: seriesTicker,
        title: m.title || m.yes_sub_title || 'Unknown',
        subtitle: m.subtitle || m.no_sub_title,
        yes_bid: m.yes_bid || 0,
        yes_ask: m.yes_ask || 0,
        no_bid: m.no_bid || 0,
        no_ask: m.no_ask || 0,
        last_price: m.last_price || m.yes_bid || 0,
        volume: m.volume || 0,
        volume_24h: m.volume_24h || 0,
        open_interest: m.open_interest || 0,
        status: m.status || 'unknown',
        result: m.result,
        close_time: m.close_time,
        expiration_time: m.expiration_time,
        image_url: m.image_url || m.icon_url || m.logo_url || null,
        yes_sub_title: m.yes_sub_title,
        no_sub_title: m.no_sub_title,
      }));
    } catch (error: any) {
      console.error(`   ❌ Fetch error:`, error.message);
      return [];
    }
  }

  async getCandlesticks(
    seriesTicker: string,
    ticker: string,
    options: {
      periodInterval?: number;
      hours?: number;
    } = {}
  ): Promise<CandlestickPoint[]> {
    const { periodInterval = 60, hours = 168 } = options;

    const now = Math.floor(Date.now() / 1000);
    const startTs = now - (hours * 3600);

    const path = `/trade-api/v2/series/${seriesTicker}/markets/${ticker}/candlesticks`;
    const params = new URLSearchParams({
      start_ts: startTs.toString(),
      end_ts: now.toString(),
      period_interval: periodInterval.toString(),
    });

    const url = `${KALSHI_API_BASE}${path}?${params}`;
    console.log(`   📡 Fetching candlesticks: ${url}`);

    try {
      const response = await fetch(url, {
        headers: this.getHeaders("GET", path),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`   ❌ HTTP ${response.status}:`, errorText.substring(0, 200));
        return [];
      }

      const data = await response.json();
      const candlesticks = data.candlesticks || [];
      console.log(`   📦 Raw candlesticks received: ${candlesticks.length}`);

      const points: CandlestickPoint[] = [];
      for (const candle of candlesticks) {
        const ts = candle.end_period_ts;
        const priceCents = this.extractCandleCloseCents(candle);

        if (ts == null || priceCents == null) continue;

        points.push({
          ts: parseInt(ts),
          price: Math.max(0, Math.min(100, Math.round(priceCents * 100) / 100)),
        });
      }

      // Deduplicate and sort
      const deduped = new Map<number, number>();
      for (const point of points) {
        deduped.set(point.ts, point.price);
      }

      const result = Array.from(deduped.entries())
        .map(([ts, price]) => ({ ts, price }))
        .sort((a, b) => a.ts - b.ts);

      console.log(`   ✅ Processed ${result.length} candlestick points`);
      return result;
    } catch (error: any) {
      console.error(`   ❌ Candlesticks error:`, error.message);
      return [];
    }
  }

  private extractCandleCloseCents(candle: any): number | null {
    const pricePayload = candle.price || {};

    if (typeof pricePayload === 'object') {
      if (pricePayload.close != null) return this.toFloat(pricePayload.close);
      if (pricePayload.close_dollars != null) return this.toFloat(pricePayload.close_dollars) * 100;
    }

    if (candle.yes_price != null) return this.toFloat(candle.yes_price);

    if (typeof pricePayload === 'object') {
      if (pricePayload.open != null) return this.toFloat(pricePayload.open);
    }

    return null;
  }

  private toFloat(value: any): number | null {
    if (value == null) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  private signRequest(method: string, path: string, timestampMs: number): string {
    const message = `${timestampMs}${method}${path}`;
    const signature = crypto.sign('sha256', Buffer.from(message), {
      key: this.privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN,
    });
    return signature.toString('base64');
  }

  private getHeaders(method: string, path: string): HeadersInit {
    const timestampMs = Date.now();
    const signature = this.signRequest(method, path, timestampMs);

    return {
      "KALSHI-ACCESS-KEY": this.apiKey,
      "KALSHI-ACCESS-SIGNATURE": signature,
      "KALSHI-ACCESS-TIMESTAMP": timestampMs.toString(),
      "Content-Type": "application/json",
    };
  }
}

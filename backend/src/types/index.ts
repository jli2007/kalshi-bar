export interface CandlestickPoint {
  ts: number;
  price: number;
}

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
  result?: string;
  close_time?: string;
  expiration_time?: string;
  image_url?: string | null;
  yes_sub_title?: string;
  no_sub_title?: string;
}

export interface KalshiEvent {
  event_ticker: string;
  series_ticker: string;
  title: string;
  subtitle?: string;
  category: string;
  markets: KalshiMarket[];
}

export interface MarketSearchResult {
  seriesTicker: string;
  markets: KalshiMarket[];
  event?: KalshiEvent;
}

export interface DetectSeriesResponse {
  series: string | null;
  matched: boolean;
}

export interface CandlesticksResponse {
  seriesTicker: string;
  ticker: string;
  candlesticks: CandlestickPoint[];
  count: number;
}

export interface MarketsResponse {
  eventName: string;
  seriesTicker: string | null;
  markets: KalshiMarket[];
  count: number;
}

// Event name to Kalshi series mapping
export const EVENT_SERIES_MAP: Record<string, string> = {
  "oscars-watch-party": "KXOSCARS",
  "oscars": "KXOSCARS",
  "champions-league": "KXUCLGAME",
  "premier-league": "KXEPLGAME",
  "world-cup": "KXWCGAME",
  "nba-finals": "KXNBAGAME",
  "march-madness": "KXNCAAMGAME",
  "nfl-sunday-ticket": "KXNFLGAME",
  "ufc-fight-night": "KXUFCGAME",
};

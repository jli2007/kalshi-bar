"use client";

interface CandlestickPoint {
  ts: number;
  price: number;
}

interface PriceChartProps {
  data: CandlestickPoint[];
  loading?: boolean;
}

export default function PriceChart({ data, loading }: PriceChartProps) {
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-full h-full bg-white/5 rounded animate-pulse" />
      </div>
    );
  }

  if (!data || data.length < 2) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-full h-16 flex items-end justify-center gap-1 opacity-30">
            {[30, 45, 35, 50, 40, 55, 45, 60, 50].map((h, i) => (
              <div key={i} className="w-2 bg-kalshi-green/50 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="text-xs text-kalshi-text-secondary mt-2">Loading chart...</p>
        </div>
      </div>
    );
  }

  // Calculate chart dimensions
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 10;
  const padding = range * 0.1;

  // Normalize prices for SVG
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.price - minPrice + padding) / (range + 2 * padding)) * 100;
    return `${x},${y}`;
  }).join(' ');

  // Determine line color based on trend
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const isUp = lastPrice >= firstPrice;
  const lineColor = isUp ? "#28CC95" : "#ef4444";
  const gradientId = `chart-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="h-full w-full relative">
      {/* Y-axis labels */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-kalshi-text-secondary w-8 text-right">
        <span>{Math.round(maxPrice)}%</span>
        <span>{Math.round((maxPrice + minPrice) / 2)}%</span>
        <span>{Math.round(minPrice)}%</span>
      </div>

      {/* Chart area */}
      <div className="absolute inset-0 pr-10">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Horizontal grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

          {/* Gradient fill */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            fill={`url(#${gradientId})`}
            points={`0,100 ${points} 100,100`}
          />

          {/* Price line */}
          <polyline
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            vectorEffect="non-scaling-stroke"
          />

          {/* End point dot */}
          {data.length > 0 && (
            <circle
              cx="100"
              cy={100 - ((lastPrice - minPrice + padding) / (range + 2 * padding)) * 100}
              r="3"
              fill={lineColor}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>
    </div>
  );
}

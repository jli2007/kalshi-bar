import { ExternalLinkIcon } from "@radix-ui/react-icons";
import type { Bar } from "@/data/bars";

export default function BarCard({ bar }: { bar: Bar }) {
  const mapImgUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${bar.coordinates[0]},${bar.coordinates[1]},14,0/400x200@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-kalshi-card shadow-[0_0_12px_rgba(255,255,255,0.04)]">
      {/* Map thumbnail */}
      <div className="relative">
        <img
          src={mapImgUrl}
          alt={`Map of ${bar.name}`}
          className="h-32 w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-kalshi-card to-transparent" />
      </div>

      <div className="p-4">
        {/* Header row: name + external link */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-white">{bar.name}</h3>
          <a
            href={bar.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 shrink-0 text-kalshi-green transition-opacity hover:opacity-70"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </div>

        {/* Address */}
        <p className="mt-1 text-sm text-kalshi-text-secondary">
          {bar.address}, {bar.location}
        </p>
      </div>
    </div>
  );
}

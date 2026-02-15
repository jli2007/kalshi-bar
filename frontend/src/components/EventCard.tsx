import Link from "next/link";
import type { Event } from "@/data/events";
import type { Bar } from "@/data/bars";
import { ShineBorder } from "@/components/ui/ShineBorder";

interface EventCardProps {
  event: Event;
  bars: Bar[];
}

export default function EventCard({ event, bars }: EventCardProps) {
  const previewBars = bars.slice(0, 2);

  return (
    <Link href={`/events/${event.id}`}>
      <div className="relative rounded-xl bg-kalshi-card transition-transform hover:scale-[1.02] cursor-pointer">
        <ShineBorder shineColor="#28CC95" borderWidth={1} duration={10} className="z-10 opacity-70" />

        {/* Event image */}
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={event.image}
            alt={event.name}
            className="h-40 w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-kalshi-card to-transparent" />
          <span className="absolute top-3 left-3 rounded-full bg-kalshi-green/90 px-2 py-0.5 text-xs font-medium text-black">
            {event.category}
          </span>
        </div>

        <div className="p-4">
          {/* Event name */}
          <h3 className="text-lg font-bold text-white">{event.name}</h3>

          {/* Date & time */}
          <p className="mt-1 text-sm text-kalshi-text-secondary">
            {event.date} • {event.time}
          </p>

          {/* Preview bars */}
          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-xs text-kalshi-text-secondary mb-2">
              {bars.length} bar{bars.length !== 1 ? "s" : ""} showing this event
            </p>
            <div className="flex flex-col gap-1.5">
              {previewBars.map((bar) => (
                <div key={bar.name} className="flex items-center gap-2">
                  {bar.image ? (
                    <img
                      src={bar.image}
                      alt={bar.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-kalshi-green/20 flex items-center justify-center">
                      <span className="text-xs text-kalshi-green">{bar.name[0]}</span>
                    </div>
                  )}
                  <span className="text-sm text-white truncate">{bar.name}</span>
                </div>
              ))}
              {bars.length > 2 && (
                <span className="text-xs text-kalshi-green">
                  +{bars.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

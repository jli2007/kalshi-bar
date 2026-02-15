import { ExternalLinkIcon } from "@radix-ui/react-icons";
import type { Bar } from "@/data/bars";
import { ShineBorder } from "@/components/ui/ShineBorder";
import Image from "next/image";

export default function BarCard({ bar, onClick }: { bar: Bar; onClick?: () => void }) {
  return (
    <div
      className="relative cursor-pointer rounded-xl bg-kalshi-card transition-colors hover:bg-kalshi-card/80"
      onClick={onClick}
    >
      <ShineBorder shineColor="#28CC95" borderWidth={1} duration={30} className="z-10 opacity-70" />

      {bar.image && (
        <div className="relative overflow-hidden rounded-t-xl">
          <Image
            src={bar.image}
            alt={bar.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-kalshi-card to-transparent" />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white">{bar.name}</h3>
          <a
            href={bar.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 shrink-0 text-kalshi-green transition-opacity hover:opacity-70"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-1 text-sm text-kalshi-text-secondary">
          {bar.address}, {bar.location}
        </p>

        {bar.events.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {bar.events.map((event) => (
              <span
                key={event}
                className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-kalshi-text-secondary"
              >
                {event}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

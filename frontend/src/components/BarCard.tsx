import { ExternalLinkIcon } from "@radix-ui/react-icons";
import type { Bar } from "@/data/bars";
import { ShineBorder } from "@/components/ui/ShineBorder";

export default function BarCard({ bar }: { bar: Bar }) {
  return (
    <div className="relative rounded-xl bg-kalshi-card">
      <ShineBorder shineColor="#28CC95" borderWidth={1} duration={30} className="z-10 opacity-70" />

      {/* Bar image */}
      {bar.image && (
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={bar.image}
            alt={bar.name}
            className="h-32 w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-kalshi-card to-transparent" />
        </div>
      )}

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

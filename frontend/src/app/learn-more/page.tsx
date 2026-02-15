import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const mockBars = [
  {
    name: "The Velvet Room",
    handle: "velvetroom_nyc",
    avatar: "https://i.pravatar.cc/150?u=velvetroom",
    address: "127 E 7th St, New York, NY",
    tweet: "Happy hour starts at 5! $8 cocktails and live jazz tonight. Come through!",
    time: "2h",
  },
  {
    name: "Blind Tiger",
    handle: "blindtigerale",
    avatar: "https://i.pravatar.cc/150?u=blindtiger",
    address: "281 Bleecker St, New York, NY",
    tweet: "New craft beers on tap this weekend. 20 rotating drafts, zero excuses not to visit.",
    time: "4h",
  },
  {
    name: "Death & Co",
    handle: "deathandcompany",
    avatar: "https://i.pravatar.cc/150?u=deathco",
    address: "433 E 6th St, New York, NY",
    tweet: "Reservations open for Friday. Our new seasonal menu just dropped - featuring the Oaxacan Old Fashioned.",
    time: "6h",
  },
  {
    name: "Please Don't Tell",
    handle: "pdtnyc",
    avatar: "https://i.pravatar.cc/150?u=pdt",
    address: "113 St Marks Pl, New York, NY",
    tweet: "The phone booth is open. You know the number. See you tonight.",
    time: "8h",
  },
  {
    name: "Attaboy",
    handle: "attaboy_nyc",
    avatar: "https://i.pravatar.cc/150?u=attaboy",
    address: "134 Eldridge St, New York, NY",
    tweet: "No menu, just vibes. Tell us what you're in the mood for and we'll make it happen.",
    time: "12h",
  },
];

function MockTweetCard({
  bar,
  className,
}: {
  bar: (typeof mockBars)[0];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-3 rounded-xl border border-kalshi-border bg-kalshi-card p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={bar.avatar}
            alt={bar.name}
            className="h-12 w-12 rounded-full border border-kalshi-border"
          />
          <div className="flex flex-col">
            <span className="font-medium text-white">{bar.name}</span>
            <span className="text-sm text-kalshi-text-secondary">
              @{bar.handle}
            </span>
          </div>
        </div>
        <span className="text-sm text-kalshi-text-secondary">{bar.time}</span>
      </div>

      {/* Tweet content */}
      <p className="text-[15px] leading-relaxed text-white">{bar.tweet}</p>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-sm text-kalshi-text-secondary">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>{bar.address}</span>
      </div>
    </div>
  );
}

export default function LearnMorePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-white">Learn More</h1>
        <p className="mt-2 text-kalshi-text-secondary">
          See what bars are saying
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockBars.map((bar) => (
            <MockTweetCard key={bar.handle} bar={bar} />
          ))}
        </div>
      </main>
    </>
  );
}

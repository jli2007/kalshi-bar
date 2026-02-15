import Navbar from "@/components/layout/Navbar";
import { MockTweetCard, type MockTweet } from "@/components/ui/tweet-card";
import { ReviewCard, type MockReview } from "@/components/ui/review-card";
import { bars, type Bar } from "@/data/bars";
import { QRCodeSVG } from "qrcode.react";

// Scan lineup helpers
const barsWithImages = bars.filter((bar) => bar.image);

const barScanCopy = [
  "Oscars watch party this weekend. Best screens in the city with early seating and pitchers on deck.",
  "Happy hour all week with $6 drafts and half-price apps. Bring the crew and claim a booth.",
  "Big game Saturday. Reserve your table now before the front room fills up.",
  "New craft cocktails on the menu, led by a signature Old Fashioned with smoke and spice.",
  "Live music every Friday night with no cover charge, just good vibes.",
  "NFL Sunday Ticket is coming up. Wide screens, loud crowd, and a full tap list.",
  "Outdoor patio is open early for Champions League mornings and late-night replays.",
  "Classic pub energy with hearty plates and enough TVs to keep every table locked in.",
];

const barScanCards = barsWithImages.slice(0, 8).map((bar, index) => ({
  bar,
  message: barScanCopy[index] ?? `${bar.events[0]} is on deck. Scan to reserve your spot.`,
}));

const formatWebsite = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

// Bar tweet helpers
const formatHandle = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 15);

const getBar = (name: string, fallbackIndex: number): Bar => {
  const found = bars.find((bar) => bar.name === name);
  return found ?? bars[fallbackIndex];
};

const createUser = (bar: Bar) => ({
  name: bar.name,
  handle: formatHandle(bar.name),
  avatar: bar.image,
  verified: true,
});

const featuredBars = {
  stout: getBar("Stout", 0),
  stans: getBar("Stan's Sports Bar", 1),
  finnertys: getBar("Finnerty's", 2),
  harlem: getBar("Harlem Tavern", 3),
  hairylemon: getBar("The Hairy Lemon", 4),
  bluehaven: getBar("Blue Haven", 5),
};

const mediaLibrary = {
  brickyard: getBar("Brickyard Craft kitchen & Bar", 0).image,
  sluggers: getBar("Sluggers World Class Sports Bar", 0).image,
  finnertys: getBar("Finnerty's", 0).image,
  harlem: getBar("Harlem Tavern", 0).image,
  bluehaven: getBar("Blue Haven", 0).image,
  cask: getBar("Cask 'n Flagon", 0).image,
  banshee: getBar("The Banshee", 0).image,
  chickies: getBar("Chickie's & Pete's", 0).image,
  tonycs: getBar("Tony C's Sports Bar & Grill", 0).image,
};

const barTweets: MockTweet[] = [
  {
    user: createUser(featuredBars.stout),
    platform: "google",
    text: `New ⭐️⭐️⭐️⭐️⭐️ reviews keep coming for our ${featuredBars.stout.events[0]} setup. Sound on every screen at ${featuredBars.stout.location}.`,
    image: mediaLibrary.brickyard,
  },
  {
    user: createUser(featuredBars.stans),
    platform: "instagram",
    text: `Yankees vibes all weekend at ${featuredBars.stans.name}. Pregame, postgame, and the loudest crowd on River Ave. ⚾️`,
    image: mediaLibrary.sluggers,
  },
  {
    user: createUser(featuredBars.finnertys),
    platform: "google",
    text: `Appreciate every Google review about our ${featuredBars.finnertys.events[0]} watch parties. Keep them coming and we’ll keep the pints flowing.`,
    image: mediaLibrary.finnertys,
  },
  {
    user: createUser(featuredBars.harlem),
    platform: "twitter",
    text: `${featuredBars.harlem.name} patio heaters are on for ${featuredBars.harlem.events[0]} this afternoon. Grab a table outside and enjoy.`,
    image: mediaLibrary.harlem,
  },
  {
    user: createUser(featuredBars.hairylemon),
    platform: "instagram",
    text: `Fresh Guinness pours + ${featuredBars.hairylemon.events[0]} at ${featuredBars.hairylemon.name}. Doors at noon, come early. ☘️`,
    image: mediaLibrary.cask,
  },
  {
    user: createUser(featuredBars.bluehaven),
    platform: "twitter",
    text: `${featuredBars.bluehaven.name} brunch + ${featuredBars.bluehaven.events[1]} replays = Sunday sorted. Kitchen opens at 11.`,
    image: mediaLibrary.bluehaven,
  },
];

const customerReviews: MockReview[] = [
  {
    user: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    platform: "google",
    rating: 5,
    text: "The Brickyard staff treated our watch party like family. Perfect pours, sound dialed in, and they even saved us a booth.",
    image: mediaLibrary.brickyard,
  },
  {
    user: {
      name: "Mike Rodriguez",
      avatar: "https://i.pravatar.cc/150?u=mike",
    },
    platform: "google",
    rating: 4,
    text: "Sluggers’ happy hour is undefeated. $6 drafts, batting cages in the back, and every MLB game on.",
    image: mediaLibrary.sluggers,
  },
  {
    user: {
      name: "Lena Patel",
      avatar: "https://i.pravatar.cc/150?u=lena",
    },
    platform: "google",
    rating: 5,
    text: "Tony C’s set us up with a private booth for the playoffs. Huge screens and the wings were elite.",
    image: mediaLibrary.tonycs,
  },
  {
    user: {
      name: "Marcus Lee",
      avatar: "https://i.pravatar.cc/150?u=marcus",
    },
    platform: "google",
    rating: 5,
    text: "Harlem Tavern patio heaters saved us during the Sunday Ticket slate. Service never slowed down.",
    image: mediaLibrary.harlem,
  },
  {
    user: {
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?u=emma",
    },
    platform: "yelp",
    rating: 5,
    text: "Blue Haven’s brunch cocktails + Premier League replays is my new Sunday ritual. Zero bad seats.",
    image: mediaLibrary.bluehaven,
  },
  {
    user: {
      name: "Chris Alvarez",
      avatar: "https://i.pravatar.cc/150?u=chris",
    },
    platform: "yelp",
    rating: 4,
    text: "Cask ’n Flagon still feels like Fenway. Packed, loud, and the staff kept the rounds coming.",
    image: mediaLibrary.cask,
  },
  {
    user: {
      name: "Bianca Flores",
      avatar: "https://i.pravatar.cc/150?u=bianca",
    },
    platform: "yelp",
    rating: 5,
    text: "Chickie’s & Pete’s made us feel like we were at the stadium. Crabfries + playoff crowd = perfection.",
    image: mediaLibrary.chickies,
  },
  {
    user: {
      name: "James Park",
      handle: "jamespark",
      avatar: "https://i.pravatar.cc/150?u=james",
    },
    platform: "twitter",
    text: "The Banshee’s Guinness pour is elite. Champions League nights there feel like being in Dublin. ☘️",
    image: mediaLibrary.banshee,
  },
  {
    user: {
      name: "Nina Carter",
      handle: "ninacarter",
      avatar: "https://i.pravatar.cc/150?u=nina",
    },
    platform: "twitter",
    text: "Blue Haven staying open late for overtime meant we didn’t miss a single play. Bartenders remembered everyone.",
    image: mediaLibrary.bluehaven,
  },
];

export default function LearnMorePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-white">Learn More</h1>
        <p className="mt-2 text-kalshi-text-secondary">
          See what bars and customers are saying
        </p>

        {/* Bar Scan Section */}
        <section className="mt-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Scan The Lineup</h2>
              <p className="text-sm text-kalshi-text-secondary">
                Tap or scan a QR code to jump straight to the bar&apos;s website.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-kalshi-text-secondary">
              <span className="h-2 w-2 rounded-full bg-kalshi-green" />
              Live bar links
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {barScanCards.map(({ bar, message }) => (
              <article
                key={bar.name}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_140%_at_0%_0%,#1f242d_0%,#14181f_55%,#0a0c0f_100%)] p-6 before:absolute before:left-0 before:top-1/2 before:h-12 before:w-12 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-kalshi-bg before:content-[''] after:absolute after:right-0 after:top-1/2 after:h-12 after:w-12 after:translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-kalshi-bg after:content-['']"
              >
                <div className="pointer-events-none absolute -right-20 -top-16 h-40 w-40 rounded-full bg-kalshi-green/10 blur-3xl" />
                <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <img
                          src={bar.image}
                          alt={bar.name}
                          className="h-10 w-10 rounded-xl object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-kalshi-text-secondary">
                          Featured Bar
                        </p>
                        <h3 className="text-lg font-semibold text-white">{bar.name}</h3>
                        <p className="text-sm text-kalshi-text-secondary">
                          {bar.address}, {bar.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-white/85">{message}</p>
                    <div className="flex flex-wrap gap-2">
                      {bar.tags.slice(0, 2).map((tag) => (
                        <span
                          key={`${bar.name}-${tag}`}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="rounded-full border border-kalshi-green/40 bg-kalshi-green/10 px-3 py-1 text-xs text-kalshi-green">
                        {bar.events[0]}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-xs rounded-2xl bg-[#f7f4ed] p-4 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.12)]">
                      <div className="mx-auto w-fit rounded-xl bg-white p-3">
                        <QRCodeSVG
                          value={bar.website}
                          size={128}
                          bgColor="transparent"
                          fgColor="#0a0c0f"
                        />
                      </div>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0a0c0f]">
                        Scan to visit
                      </p>
                      <p className="mt-1 text-xs text-[#2d2f34]">
                        {formatWebsite(bar.website)}
                      </p>
                      <a
                        href={bar.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center justify-center rounded-full border border-[#0a0c0f]/20 px-3 py-1 text-xs font-semibold text-[#0a0c0f] transition hover:border-[#0a0c0f]/40"
                      >
                        Open website
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bar Tweets Section */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Bar News</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {barTweets.map((tweet) => (
              <MockTweetCard key={tweet.user.handle} tweet={tweet} className="h-full" />
            ))}
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-4">What Customers Have Been Saying</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {customerReviews.map((review) => (
              <ReviewCard key={review.user.name} review={review} className="h-full" />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

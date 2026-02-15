import Navbar from "@/components/layout/Navbar";
import { ReviewCard, type MockReview } from "@/components/ui/review-card";
import { bars } from "@/data/bars";
import { QRCodeSVG } from "qrcode.react";

// Get bars that have images for their QR cards
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

const formatWebsite = (url: string) =>
  url.replace(/^https?:\/\//, "").replace(/\/$/, "");

// Reviews FROM customers (people visiting bars) - mixed platforms
const customerReviews: MockReview[] = [
  {
    user: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    platform: "google",
    rating: 5,
    text: "Just had the best Old Fashioned of my life at Death & Co. The bartenders here are actual artists. Incredible atmosphere and top-notch cocktails.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop",
  },
  {
    user: {
      name: "Mike Rodriguez",
      avatar: "https://i.pravatar.cc/150?u=mike",
    },
    platform: "google",
    rating: 4,
    text: "Finally got into Please Don't Tell through the phone booth. Worth every second of the wait. Drinks were creative and the speakeasy vibe is unmatched.",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop",
  },
  {
    user: {
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?u=emma",
    },
    platform: "yelp",
    rating: 5,
    text: "The vibe at Attaboy is unmatched. Told them I wanted something citrusy and they absolutely delivered. No menu, just trust the bartenders.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop",
  },
  {
    user: {
      name: "James Park",
      handle: "jamespark",
      avatar: "https://i.pravatar.cc/150?u=james",
    },
    platform: "twitter",
    text: "Blind Tiger has the best craft beer selection in the village. 20 taps and every single one is fire 🍺",
    image: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&h=400&fit=crop",
  },
  {
    user: {
      name: "Olivia Martinez",
      handle: "olivia.martinez",
      avatar: "https://i.pravatar.cc/150?u=olivia",
    },
    platform: "instagram",
    text: "Live jazz at The Velvet Room on a Tuesday night. This city never disappoints 🎷",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
  },
  {
    user: {
      name: "David Kim",
      handle: "davidkim",
      avatar: "https://i.pravatar.cc/150?u=david",
    },
    platform: "tiktok",
    text: "The Dead Rabbit Irish Coffee hits different when it's 30 degrees outside. Best Irish bar in NYC, no debate.",
    image: "https://images.unsplash.com/photo-1485686531765-ba63b07845a7?w=600&h=400&fit=crop",
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

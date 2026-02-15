import Navbar from "@/components/layout/Navbar";
import { MockTweetCard, type MockTweet } from "@/components/ui/tweet-card";
import { ReviewCard, type MockReview } from "@/components/ui/review-card";
import { bars } from "@/data/bars";

// Get bars that have images for their tweets
const barsWithImages = bars.filter((bar) => bar.image);

// Generate bar tweets from actual bar data
const barTweets: MockTweet[] = [
  {
    user: {
      name: barsWithImages[0].name,
      handle: barsWithImages[0].name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      avatar: barsWithImages[0].image,
      verified: true,
    },
    text: `${barsWithImages[0].events[0]} watch party this weekend! Best screens in ${barsWithImages[0].location}. Doors open at 4pm 🍻`,
  },
  {
    user: {
      name: barsWithImages[1].name,
      handle: barsWithImages[1].name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      avatar: barsWithImages[1].image,
      verified: true,
    },
    text: `Happy hour specials all week. $6 drafts and half-price apps until 7pm 🍺`,
  },
  {
    user: {
      name: barsWithImages[2].name,
      handle: barsWithImages[2].name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      avatar: barsWithImages[2].image,
      verified: true,
    },
    text: `Big game this Saturday! Reserve your table now before we're packed 📺`,
  },
  {
    user: {
      name: barsWithImages[3].name,
      handle: barsWithImages[3].name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      avatar: barsWithImages[3].image,
      verified: true,
    },
    text: `New craft cocktails on the menu. Come try our signature Old Fashioned 🥃`,
  },
  {
    user: {
      name: barsWithImages[4].name,
      handle: barsWithImages[4].name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      avatar: barsWithImages[4].image,
      verified: true,
    },
    text: `Live music every Friday night. No cover charge, just good vibes 🎸`,
  },
  {
    user: {
      name: barsWithImages[5].name,
      handle: barsWithImages[5].name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      avatar: barsWithImages[5].image,
      verified: true,
    },
    text: `${barsWithImages[5].events[0]} is coming up! We've got the best atmosphere in town ⚽`,
  },
];

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

        {/* Bar Tweets Section */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Bar Tweets</h2>
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

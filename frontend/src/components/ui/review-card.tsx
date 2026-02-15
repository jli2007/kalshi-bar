import { ShineBorder } from "@/components/ui/ShineBorder"
import { cn } from "@/lib/utils"

export type ReviewPlatform = "google" | "yelp" | "twitter" | "instagram" | "tiktok"

export interface MockReview {
  user: {
    name: string
    avatar: string
    handle?: string
    verified?: boolean
  }
  platform: ReviewPlatform
  rating?: number
  text: string
  image?: string
}

// Platform Icons

const GoogleIcon = ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
  <svg viewBox="0 0 24 24" className={className} {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

const YelpIcon = ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
  <img src="/yelp.svg" alt="Yelp" className={className} loading="lazy" {...props} />
)

const XIcon = ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const InstagramIcon = ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="#E1306C" stroke="none" />
  </svg>
)

const TikTokIcon = ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
  <svg viewBox="0 0 24 24" className={className} fill="white" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.11V9.03a6.37 6.37 0 0 0-.82-.05 6.28 6.28 0 0 0-6.28 6.28 6.28 6.28 0 0 0 6.28 6.28 6.28 6.28 0 0 0 6.28-6.28V8.69a8.16 8.16 0 0 0 3.82.94V6.26a4.84 4.84 0 0 1-3.82.43z" />
  </svg>
)

const Verified = ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
  <svg
    aria-label="Verified Account"
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <g fill="currentColor">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </g>
  </svg>
)

// Platform metadata

const platformConfig: Record<ReviewPlatform, {
  icon: React.ComponentType<{ className?: string }>
  label: string
  starColor?: string
}> = {
  google: { icon: GoogleIcon, label: "Google", starColor: "#FBBC05" },
  yelp: { icon: YelpIcon, label: "Yelp", starColor: "#FF1A1A" },
  twitter: { icon: XIcon, label: "Twitter" },
  instagram: { icon: InstagramIcon, label: "Instagram" },
  tiktok: { icon: TikTokIcon, label: "TikTok" },
}

// Star Rating

const StarRating = ({ rating, color }: { rating: number; color: string }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} viewBox="0 0 20 20" className="size-4">
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"
          fill={star <= rating ? color : "rgba(255,255,255,0.08)"}
        />
      </svg>
    ))}
  </div>
)

// ReviewCard

export const ReviewCard = ({
  review,
  className,
}: {
  review: MockReview
  className?: string
}) => {
  const config = platformConfig[review.platform]
  const PlatformIcon = config.icon
  const showStars = (review.platform === "google" || review.platform === "yelp") && review.rating

  return (
    <div
      className={cn(
        "relative flex h-full w-full max-w-lg flex-col gap-4 overflow-hidden rounded-xl border border-kalshi-border bg-kalshi-card p-5",
        className
      )}
    >
      <ShineBorder shineColor="#28CC95" borderWidth={1} duration={18} className="opacity-60" />
      {/* Header */}
      <div className="flex flex-row items-start justify-between tracking-normal">
        <div className="flex items-center space-x-3">
          <img
            src={review.user.avatar}
            alt={review.user.name}
            height={48}
            width={48}
            className="border-kalshi-border h-12 w-12 overflow-hidden rounded-full border"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-white flex items-center font-medium whitespace-nowrap">
              {review.user.name}
              {review.user.verified && (
                <Verified className="ml-1 inline size-4 text-blue-500" />
              )}
            </span>
            {review.user.handle && (
              <span className="text-kalshi-text-secondary text-sm">
                @{review.user.handle}
              </span>
            )}
          </div>
        </div>
        <PlatformIcon className={cn(
          "size-5 shrink-0",
          review.platform === "twitter" && "text-[#8a8f98]"
        )} />
      </div>

      {/* Star Rating */}
      {showStars && (
        <StarRating rating={review.rating!} color={config.starColor!} />
      )}

      {/* Review text */}
      <p className="text-[15px] leading-relaxed tracking-normal text-white flex-1">
        {review.text}
      </p>

      {/* Optional image */}
      <div className="mt-auto">
        {review.image ? (
          <img
            src={review.image}
            alt="Review media"
            className="h-48 w-full rounded-xl border border-kalshi-border object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center rounded-xl border border-dashed border-kalshi-border text-sm text-kalshi-text-secondary">
            Photo coming soon
          </div>
        )}
      </div>
    </div>
  )
}

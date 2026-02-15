import { Suspense } from "react"
import { enrichTweet, type EnrichedTweet, type TweetProps } from "react-tweet"
import { getTweet, type Tweet } from "react-tweet/api"

import { SOCIAL_PLATFORM_CONFIG, type SocialPlatform } from "@/components/ui/social-platform-icons"
import { cn } from "@/lib/utils"

interface TwitterIconProps {
  className?: string
  [key: string]: unknown
}
const XIcon = ({ className, ...props }: TwitterIconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const Verified = ({ className, ...props }: TwitterIconProps) => (
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

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length - 3)}...`
}

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("bg-white/10 rounded-md", className)} {...props} />
  )
}

export const TweetSkeleton = ({
  className,
  ...props
}: {
  className?: string
  [key: string]: unknown
}) => (
  <div
    className={cn(
      "flex size-full max-h-max min-w-72 flex-col gap-2 rounded-xl border p-4",
      className
    )}
    {...props}
  >
    <div className="flex flex-row gap-2">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-20 w-full" />
  </div>
)

export const TweetNotFound = ({
  className,
  ...props
}: {
  className?: string
  [key: string]: unknown
}) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-2 rounded-lg border p-4",
      className
    )}
    {...props}
  >
    <h3>Tweet not found</h3>
  </div>
)

export const TweetHeader = ({ tweet }: { tweet: EnrichedTweet }) => (
  <div className="flex flex-row items-start justify-between tracking-normal">
    <div className="flex items-center space-x-3">
      <a
        href={tweet.user.url}
        target="_blank"
        rel="noreferrer"
        className="shrink-0"
      >
        <img
          title={`Profile picture of ${tweet.user.name}`}
          alt={tweet.user.screen_name}
          height={48}
          width={48}
          src={tweet.user.profile_image_url_https}
          className="border-kalshi-border overflow-hidden rounded-full border"
        />
      </a>
      <div className="flex flex-col gap-0.5">
        <a
          href={tweet.user.url}
          target="_blank"
          rel="noreferrer"
          className="text-white flex items-center font-medium whitespace-nowrap transition-opacity hover:opacity-80"
        >
          {truncate(tweet.user.name, 20)}
          {tweet.user.verified ||
            (tweet.user.is_blue_verified && (
              <Verified className="ml-1 inline size-4 text-blue-500" />
            ))}
        </a>
        <div className="flex items-center space-x-1">
          <a
            href={tweet.user.url}
            target="_blank"
            rel="noreferrer"
            className="text-kalshi-text-secondary hover:text-white text-sm transition-colors"
          >
            @{truncate(tweet.user.screen_name, 16)}
          </a>
        </div>
      </div>
    </div>
    <a href={tweet.url} target="_blank" rel="noreferrer">
      <span className="sr-only">Link to tweet</span>
      <XIcon className="text-kalshi-text-secondary hover:text-white size-5 items-start transition-all ease-in-out hover:scale-105" />
    </a>
  </div>
)

export const TweetBody = ({ tweet }: { tweet: EnrichedTweet }) => (
  <div className="text-[15px] leading-relaxed tracking-normal wrap-break-word">
    {tweet.entities.map((entity, idx) => {
      switch (entity.type) {
        case "url":
        case "symbol":
        case "hashtag":
        case "mention":
          return (
            <a
              key={idx}
              href={entity.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-kalshi-text-secondary hover:text-white text-[15px] font-normal transition-colors"
            >
              <span>{entity.text}</span>
            </a>
          )
        case "text":
          return (
            <span
              key={idx}
              className="text-white text-[15px] font-normal"
              dangerouslySetInnerHTML={{ __html: entity.text }}
            />
          )
      }
    })}
  </div>
)

export const TweetMedia = ({ tweet }: { tweet: EnrichedTweet }) => {
  if (!tweet.video && !tweet.photos) return null
  return (
    <div className="flex flex-1 items-center justify-center">
      {tweet.video && (
        <video
          poster={tweet.video.poster}
          autoPlay
          loop
          muted
          playsInline
          className="rounded-xl border shadow-sm"
        >
          <source src={tweet.video.variants[0].src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {tweet.photos && (
        <div className="relative flex transform-gpu snap-x snap-mandatory gap-4 overflow-x-auto">
          <div className="shrink-0 snap-center sm:w-2" />
          {tweet.photos.map((photo) => (
            <img
              key={photo.url}
              src={photo.url}
              width={photo.width}
              height={photo.height}
              title={"Photo by " + tweet.user.name}
              alt={tweet.text}
              className="h-64 w-5/6 shrink-0 snap-center snap-always rounded-xl border object-cover shadow-sm"
            />
          ))}
          <div className="shrink-0 snap-center sm:w-2" />
        </div>
      )}
      {!tweet.video &&
        !tweet.photos &&
        // @ts-expect-error package doesn't have type definitions
        tweet?.card?.binding_values?.thumbnail_image_large?.image_value.url && (
          <img
            src={
              // @ts-expect-error package doesn't have type definitions
              tweet.card.binding_values.thumbnail_image_large.image_value.url
            }
            className="h-64 rounded-xl border object-cover shadow-sm"
            alt={tweet.text}
          />
        )}
    </div>
  )
}

export const MagicTweet = ({
  tweet,
  className,
  ...props
}: {
  tweet: Tweet
  className?: string
}) => {
  const enrichedTweet = enrichTweet(tweet)
  return (
    <div
      className={cn(
        "relative flex h-fit w-full max-w-lg flex-col gap-4 overflow-hidden rounded-xl border p-5",
        className
      )}
      {...props}
    >
      <TweetHeader tweet={enrichedTweet} />
      <TweetBody tweet={enrichedTweet} />
      <TweetMedia tweet={enrichedTweet} />
    </div>
  )
}

/**
 * MockTweetCard - For displaying fake/mock tweets with custom data
 */
type BarPlatform = Extract<SocialPlatform, "google" | "yelp" | "twitter" | "instagram">

export interface MockTweet {
  user: {
    name: string
    handle: string
    avatar: string
    verified?: boolean
  }
  platform: BarPlatform
  text: string
  image?: string
}

export const MockTweetCard = ({
  tweet,
  className,
}: {
  tweet: MockTweet
  className?: string
}) => {
  const platformMeta = SOCIAL_PLATFORM_CONFIG[tweet.platform]
  const PlatformIcon = platformMeta.icon

  return (
    <div
      className={cn(
        "relative flex h-full w-full max-w-lg flex-col gap-4 overflow-hidden rounded-xl border border-kalshi-border bg-kalshi-card p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-row items-start justify-between tracking-normal">
        <div className="flex items-center space-x-3">
          <img
            src={tweet.user.avatar}
            alt={tweet.user.name}
            height={48}
            width={48}
            className="border-kalshi-border h-12 w-12 overflow-hidden rounded-full border"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-white flex items-center font-medium whitespace-nowrap">
              {tweet.user.name}
              {tweet.user.verified && (
                <Verified className="ml-1 inline size-4 text-blue-500" />
              )}
            </span>
            <span className="text-kalshi-text-secondary text-sm">
              @{tweet.user.handle}
            </span>
          </div>
        </div>
        <div className="flex items-center text-kalshi-text-secondary text-sm">
          <PlatformIcon className="size-5" />
        </div>
      </div>

      {/* Tweet content */}
      <p className="text-[15px] leading-relaxed tracking-normal text-white flex-1">
        {tweet.text}
      </p>

      {/* Optional image */}
      <div className="mt-auto">
        {tweet.image ? (
          <img
            src={tweet.image}
            alt="Tweet media"
            className="h-44 w-full rounded-xl border border-kalshi-border object-cover"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center rounded-xl border border-dashed border-kalshi-border text-sm text-kalshi-text-secondary">
            No media
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * TweetCard (Server Side Only)
 */
export const TweetCard = async ({
  id,
  components,
  fallback = <TweetSkeleton />,
  onError,
  ...props
}: TweetProps & {
  className?: string
}) => {
  const tweet = id
    ? await getTweet(id).catch((err) => {
        if (onError) {
          onError(err)
        } else {
          console.error(err)
        }
      })
    : undefined

  if (!tweet) {
    const NotFound = components?.TweetNotFound || TweetNotFound
    return <NotFound {...props} />
  }

  return (
    <Suspense fallback={fallback}>
      <MagicTweet tweet={tweet} {...props} />
    </Suspense>
  )
}

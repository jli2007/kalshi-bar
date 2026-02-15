import type { ComponentType } from "react"

export type SocialPlatform = "google" | "yelp" | "twitter" | "instagram" | "tiktok"

export interface SocialPlatformMeta {
  icon: ComponentType<{ className?: string }>
  label: string
  starColor?: string
}

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

const TwitterIcon = ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
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

export const SOCIAL_PLATFORM_CONFIG: Record<SocialPlatform, SocialPlatformMeta> = {
  google: { icon: GoogleIcon, label: "Google", starColor: "#FBBC05" },
  yelp: { icon: YelpIcon, label: "Yelp", starColor: "#FF1A1A" },
  twitter: { icon: TwitterIcon, label: "Twitter" },
  instagram: { icon: InstagramIcon, label: "Instagram" },
  tiktok: { icon: TikTokIcon, label: "TikTok" },
}

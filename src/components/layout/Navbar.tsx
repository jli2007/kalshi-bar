"use client";

import { usePathname } from "next/navigation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const navLinks = [
  { label: "BARS", href: "/" },
  { label: "EVENTS", href: "/events" },
  { label: "LEARN MORE", href: "/learn-more" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 border-b border-kalshi-border bg-kalshi-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Kalshi
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-kalshi-green"
                    : "text-kalshi-text-secondary hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden flex-1 justify-center px-8 md:flex">
          <div className="relative w-full max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kalshi-text-secondary" />
            <input
              type="text"
              placeholder="Search markets"
              className="h-9 w-full rounded-lg border border-kalshi-border bg-kalshi-card pl-9 pr-4 text-sm text-white placeholder-kalshi-text-secondary outline-none transition-colors focus:border-kalshi-text-secondary"
            />
          </div>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-kalshi-text-secondary transition-colors hover:text-white">
            Log in
          </button>
          <button className="rounded-full bg-kalshi-green px-4 py-1.5 text-sm font-semibold text-black transition-opacity hover:opacity-90">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}

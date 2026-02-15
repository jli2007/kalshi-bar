"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { bars, type Bar } from "@/data/bars";

const navLinks = [
  { label: "Bars", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Learn more", href: "/learn-more" },
];

interface NavbarProps {
  onSelectBar?: (bar: Bar) => void;
}

export default function Navbar({ onSelectBar }: NavbarProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results =
    query.trim().length > 0
      ? bars
          .filter((bar) => {
            const q = query.trim().toLowerCase();
            return (
              bar.name.toLowerCase().includes(q) ||
              bar.location.toLowerCase().includes(q)
            );
          })
          .slice(0, 5)
      : [];

  useEffect(() => {
    setOpen(results.length > 0);
  }, [results.length]);

  const handleSelect = (bar: Bar) => {
    onSelectBar?.(bar);
    setQuery("");
    setOpen(false);
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => setOpen(false), 150);
  };

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    if (results.length > 0) setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-kalshi-border bg-kalshi-bg/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-kalshi-green">
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

        {/* Center: Search (absolutely centered on screen) */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <div className="relative w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kalshi-text-secondary" />
            <input
              type="text"
              placeholder="Search bars"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="h-9 w-full rounded-lg border border-kalshi-border bg-kalshi-card pl-9 pr-8 text-sm text-white placeholder-kalshi-text-secondary outline-none transition-colors focus:border-kalshi-text-secondary"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-kalshi-text-secondary transition-colors hover:text-white"
              >
                <Cross2Icon className="h-3.5 w-3.5" />
              </button>
            )}

            {open && results.length > 0 && (
              <div className="absolute left-0 top-full mt-1 w-full overflow-hidden rounded-lg border border-kalshi-border bg-kalshi-card shadow-lg">
                {results.map((bar) => (
                  <button
                    key={bar.name}
                    onMouseDown={() => handleSelect(bar)}
                    className="flex w-full flex-col px-3 py-2 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="text-sm font-medium text-white">{bar.name}</span>
                    <span className="text-xs text-kalshi-text-secondary">{bar.location}</span>
                  </button>
                ))}
              </div>
            )}
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

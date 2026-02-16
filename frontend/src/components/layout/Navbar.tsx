"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MagnifyingGlassIcon, Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { bars, type Bar } from "@/data/bars";

const navLinks = [
  { label: "Bars", href: "/bars" },
  { label: "Events", href: "/events" },
  { label: "Learn more", href: "/learn-more" },
];

interface NavbarProps {
  onSelectBar?: (bar: Bar) => void;
}

export default function Navbar({ onSelectBar }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setHighlightIndex(-1);
  }, [results.length, query]);

  const handleSelect = (bar: Bar) => {
    // If we have an onSelectBar callback (we're on the /bars page), use it
    if (onSelectBar) {
      onSelectBar(bar);
    } else {
      // Otherwise navigate to bars page with selected bar
      router.push(`/bars?bar=${encodeURIComponent(bar.name)}`);
    }

    // Clear search state
    setQuery("");
    setOpen(false);
    setHighlightIndex(-1);
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => {
      setOpen(false);
      setHighlightIndex(-1);
    }, 150);
  };

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    if (results.length > 0) setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      setHighlightIndex(-1);
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0 && results[highlightIndex]) {
      e.preventDefault();
      handleSelect(results[highlightIndex]);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-kalshi-border bg-kalshi-bg/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-base font-bold tracking-tight text-kalshi-green md:text-xl">
            Kalshi
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ||
                  (pathname.startsWith("/events") && link.href === "/events") ||
                  (pathname === "/bars" && link.href === "/bars")
                    ? "text-kalshi-green"
                    : "text-kalshi-text-secondary hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <div className="relative w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kalshi-text-secondary" />
            <input
              type="text"
              placeholder="Search for bars..."
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
                {results.map((bar, i) => (
                  <button
                    key={bar.name}
                    onMouseDown={() => handleSelect(bar)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    className={`flex w-full flex-col px-3 py-2 text-left transition-colors ${
                      i === highlightIndex ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm font-medium text-white">{bar.name}</span>
                    <span className="text-xs text-kalshi-text-secondary">{bar.location}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden text-sm font-medium text-kalshi-text-secondary transition-colors hover:text-white sm:block">
            Log in
          </button>
          <button className="hidden rounded-full bg-kalshi-green px-4 py-1.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 sm:block">
            Sign up
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-kalshi-text-secondary transition-colors hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <Cross2Icon className="h-5 w-5" />
            ) : (
              <HamburgerMenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-kalshi-border bg-kalshi-bg/95 backdrop-blur-md md:hidden">
          <div className="px-4 py-3">
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kalshi-text-secondary" />
              <input
                type="text"
                placeholder="Search for bars..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="h-10 w-full rounded-lg border border-kalshi-border bg-kalshi-card pl-9 pr-8 text-sm text-white placeholder-kalshi-text-secondary outline-none transition-colors focus:border-kalshi-text-secondary"
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
                  {results.map((bar, i) => (
                    <button
                      key={bar.name}
                      onMouseDown={() => {
                        handleSelect(bar);
                        setMobileMenuOpen(false);
                      }}
                      onMouseEnter={() => setHighlightIndex(i)}
                      className={`flex w-full flex-col px-3 py-2 text-left transition-colors ${
                        i === highlightIndex ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <span className="text-sm font-medium text-white">{bar.name}</span>
                      <span className="text-xs text-kalshi-text-secondary">{bar.location}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href ||
                    (pathname.startsWith("/events") && link.href === "/events") ||
                    (pathname === "/bars" && link.href === "/bars")
                      ? "bg-kalshi-green/10 text-kalshi-green"
                      : "text-kalshi-text-secondary hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-3 flex gap-2 border-t border-kalshi-border pt-3 sm:hidden">
              <button className="flex-1 rounded-lg border border-kalshi-border py-2 text-sm font-medium text-kalshi-text-secondary transition-colors hover:text-white">
                Log in
              </button>
              <button className="flex-1 rounded-full bg-kalshi-green py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90">
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

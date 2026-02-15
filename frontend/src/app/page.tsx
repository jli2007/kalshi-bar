"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { bars } from "@/data/bars";
import BarCard from "@/components/BarCard";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const trendyBars = bars.filter(bar => bar.tags.includes("Trendy")).slice(0, 6);
  const topRatedBars = bars.filter(bar => bar.tags.includes("Top rated")).slice(0, 6);

  const handleBarClick = (barName: string) => {
    // Navigate to /bars with selected bar in URL
    router.push(`/bars?bar=${encodeURIComponent(barName)}`);
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen">
        {/* Hero Section with Light Texture Background */}
        <section
          className="relative min-h-[85vh] flex items-center justify-center"
          style={{
            backgroundImage: 'url(/light-texture.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-kalshi-bg" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6">
              Watch sports with betting markets
            </h1>
            <p className="text-xl md:text-2xl text-kalshi-text-secondary mb-8">
              Find bars showing your favorite events with live prediction markets
            </p>
            <Link
              href="/bars"
              className="inline-block bg-kalshi-green text-black font-semibold px-10 py-5 rounded-lg hover:bg-kalshi-green/90 transition-colors text-xl"
            >
              Explore bars
            </Link>
          </div>
        </section>

        {/* Trendy Section */}
        <section className="bg-kalshi-bg px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold text-white">Trendy</h2>
              <Link
                href="/bars"
                className="text-kalshi-green hover:text-kalshi-green/80 transition-colors flex items-center gap-2"
              >
                View all
                <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendyBars.map((bar) => (
                <BarCard
                  key={bar.name}
                  bar={bar}
                  onClick={() => handleBarClick(bar.name)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Top Rated Section */}
        <section className="bg-kalshi-bg px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold text-white">Top rated</h2>
              <Link
                href="/bars"
                className="text-kalshi-green hover:text-kalshi-green/80 transition-colors flex items-center gap-2"
              >
                View all
                <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRatedBars.map((bar) => (
                <BarCard
                  key={bar.name}
                  bar={bar}
                  onClick={() => handleBarClick(bar.name)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

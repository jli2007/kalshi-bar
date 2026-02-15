"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Map from "@/components/Map";
import { bars, type Bar } from "@/data/bars";

export default function BarsPage() {
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run initialization logic once on mount
    if (hasInitialized.current) return;

    const barParam = searchParams.get("bar");

    if (barParam) {
      // Find the bar by name from URL param
      const bar = bars.find(b => b.name === decodeURIComponent(barParam));
      if (bar) {
        setSelectedBar(bar);
        // Clean up URL after a short delay to prevent race condition
        setTimeout(() => {
          router.replace("/bars", { scroll: false });
        }, 100);
      } else {
        // Bar not found, default to Brickyard
        const brickyard = bars.find((b) => b.name === "Brickyard Craft kitchen & Bar");
        setSelectedBar(brickyard ?? bars[0]);
      }
    } else {
      // No URL param, default to Brickyard
      const brickyard = bars.find((b) => b.name === "Brickyard Craft kitchen & Bar");
      setSelectedBar(brickyard ?? bars[0]);
    }

    // Mark as initialized so this doesn't run again
    hasInitialized.current = true;
  }, [searchParams, router]);

  const handleBarClick = (bar: Bar) => {
    setSelectedBar(bar);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar onSelectBar={handleBarClick} />
      <main>
        <div className="h-[calc(100vh-3.5rem)] w-full">
          <Map
            selectedBar={selectedBar}
            onClose={() => setSelectedBar(null)}
            onSelectBar={setSelectedBar}
            visibleBars={bars}
          />
        </div>
      </main>
    </div>
  );
}

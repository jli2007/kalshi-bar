"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Map from "@/components/Map";
import { bars, type Bar } from "@/data/bars";

export default function BarsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const barParam = searchParams.get("bar");
  const defaultBar = useMemo(() => {
    return bars.find((b) => b.name === "Brickyard Craft kitchen & Bar") ?? bars[0];
  }, []);

  const [selectedBar, setSelectedBar] = useState<Bar | null>(() => {
    if (barParam) {
      const bar = bars.find((b) => b.name === decodeURIComponent(barParam));
      if (bar) return bar;
    }
    return defaultBar;
  });

  useEffect(() => {
    if (!barParam) return;
    const bar = bars.find((b) => b.name === decodeURIComponent(barParam));
    if (!bar) return;
    const timeout = setTimeout(() => {
      router.replace("/bars", { scroll: false });
    }, 100);
    return () => clearTimeout(timeout);
  }, [barParam, router]);

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

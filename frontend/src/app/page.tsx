"use client";

import { useState, useEffect } from "react";
import BarCard from "@/components/BarCard";
import Navbar from "@/components/layout/Navbar";
import Map from "@/components/Map";
import { bars, type Bar } from "@/data/bars";
import { ChevronRightIcon } from "@radix-ui/react-icons";

const categories = ["Trendy", "Top rated", "Fan favorite"];

function getBarsForTag(tag: string): Bar[] {
  return bars.filter((bar) => bar.tags.includes(tag));
}

export default function Home() {
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);

  useEffect(() => {
    const brickyard = bars.find((b) => b.name === "Brickyard Craft kitchen & Bar");
    setSelectedBar(brickyard ?? bars[0]);
  }, []);

  const handleBarClick = (bar: Bar) => {
    setSelectedBar(bar);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar onSelectBar={handleBarClick} />
      <div className="h-[calc(100vh-3.5rem)] w-full">
        <Map
          selectedBar={selectedBar}
          onClose={() => setSelectedBar(null)}
          onSelectBar={setSelectedBar}
          visibleBars={bars}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {categories.map((tag, index) => {
          const tagBars = getBarsForTag(tag);
          if (tagBars.length === 0) return null;
          return (
            <section key={tag}>
              {index > 0 && <hr className="my-6 border-kalshi-border" />}
              <h2 className="mb-3 flex items-center gap-1 text-lg font-semibold text-white">
                {tag}
                <ChevronRightIcon className="h-5 w-5" />
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tagBars.slice(0, 3).map((bar) => (
                  <BarCard
                    key={`${tag}-${bar.name}`}
                    bar={bar}
                    onClick={() => handleBarClick(bar)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

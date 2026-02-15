"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [showHint, setShowHint] = useState(false);
  const hintTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [-74.006, 40.7128],
      zoom: 14,
      pitch: 0,
      bearing: 0,
      scrollZoom: false,
      antialias: true,
      projection: "globe",
    });

    mapRef.current = map;

    map.on("style.load", () => {
      map.setConfigProperty("basemap", "lightPreset", "night");
      map.setConfigProperty("basemap", "showPointOfInterestLabels", false);

      // Remove stars and set space to match our bg
      map.setFog({
        color: "rgb(10, 10, 14)",
        "high-color": "rgb(10, 10, 14)",
        "horizon-blend": 0.02,
        "space-color": "rgb(10, 10, 14)",
        "star-intensity": 0,
      });
    });

    // Cooperative gestures: Ctrl/Cmd + scroll to zoom
    const container = containerRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        map.scrollZoom.enable();
        // Re-dispatch the event so the map handles it
        map.scrollZoom.wheel(e);
        // Disable again after a short delay
        setTimeout(() => map.scrollZoom.disable(), 200);
      } else {
        // Show hint overlay
        setShowHint(true);
        if (hintTimeout.current) clearTimeout(hintTimeout.current);
        hintTimeout.current = setTimeout(() => setShowHint(false), 1500);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (hintTimeout.current) clearTimeout(hintTimeout.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {showHint && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40 transition-opacity">
          <p className="rounded-lg bg-black/70 px-4 py-2 text-sm text-white backdrop-blur">
            Use {isMac ? "⌘" : "Ctrl"} + scroll to zoom the map
          </p>
        </div>
      )}
    </div>
  );
}

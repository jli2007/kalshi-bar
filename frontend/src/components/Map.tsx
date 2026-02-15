"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ExternalLinkIcon, Cross2Icon } from "@radix-ui/react-icons";
import { ShineBorder } from "@/components/ui/ShineBorder";
import { type Bar } from "@/data/bars";
import Image from "next/image";

interface MapProps {
  selectedBar: Bar | null;
  onClose: () => void;
  onSelectBar: (bar: Bar) => void;
  visibleBars?: Bar[];
}

export default function Map({ selectedBar, onClose }: MapProps) {
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
      center: [-74.0082, 40.7133],
      zoom: 18,
      pitch: 55,
      bearing: -17.6,
      scrollZoom: false,
      antialias: true,
      projection: "globe",
    });

    mapRef.current = map;

    map.on("style.load", () => {
      map.setConfigProperty("basemap", "lightPreset", "night");
      map.setConfigProperty("basemap", "showPointOfInterestLabels", false);

      map.setFog({
        color: "#0A0C0F",
        "high-color": "#0A0C0F",
        "horizon-blend": 0.02,
        "space-color": "#0A0C0F",
        "star-intensity": 0,
      });
    });

    const container = containerRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        map.scrollZoom.enable();
        map.scrollZoom.wheel(e);
        setTimeout(() => map.scrollZoom.disable(), 200);
      } else {
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!selectedBar) return;

    map.flyTo({
      center: selectedBar.coordinates,
      zoom: 18,
      pitch: 55,
      bearing: -17.6,
      duration: 2000,
      essential: true,
    });

    const el = document.createElement("div");
    el.innerHTML = `<svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.059 27.941 0 18 0z" fill="#28CC95"/>
      <circle cx="18" cy="18" r="8" fill="#0A0C0F"/>
    </svg>`;
    el.style.cursor = "pointer";
    el.style.filter = "drop-shadow(0 2px 8px rgba(40, 204, 149, 0.6))";

    const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat(selectedBar.coordinates)
      .addTo(map);

    return () => {
      marker.remove();
    };
  }, [selectedBar]);

  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {selectedBar && (
        <div className="absolute left-4 top-4 z-10 w-80 rounded-xl bg-kalshi-bg/90 backdrop-blur-md">
          <ShineBorder shineColor="#28CC95" borderWidth={1} duration={30} className="z-10 opacity-70" />
          {selectedBar.image && (
            <div className="relative overflow-hidden rounded-t-xl">
              <Image
                src={selectedBar.image}
                alt={selectedBar.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-kalshi-bg/90 to-transparent" />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-white">{selectedBar.name}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={selectedBar.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 shrink-0 text-kalshi-green transition-opacity hover:opacity-70"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
                <button
                  onClick={onClose}
                  className="mt-0.5 shrink-0 text-kalshi-text-secondary transition-colors hover:text-white"
                >
                  <Cross2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-kalshi-text-secondary">
              {selectedBar.address}, {selectedBar.location}
            </p>
            {selectedBar.events.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedBar.events.map((event) => (
                  <span
                    key={event}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-kalshi-text-secondary"
                  >
                    {event}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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

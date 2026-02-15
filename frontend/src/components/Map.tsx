"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ExternalLinkIcon, Cross2Icon } from "@radix-ui/react-icons";
import { ShineBorder } from "@/components/ui/ShineBorder";
import { bars, type Bar } from "@/data/bars";

interface MapProps {
  selectedBar: Bar | null;
  onClose: () => void;
  onSelectBar: (bar: Bar) => void;
}

export default function Map({ selectedBar, onClose, onSelectBar }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ bar: Bar; marker: mapboxgl.Marker; el: HTMLDivElement }[]>([]);
  const [showHint, setShowHint] = useState(false);
  const hintTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [-74.006, 40.7128],
      zoom: 2.5,
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

  // Create all bar markers once the map is ready
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const createMarkers = () => {
      // Remove any existing markers
      markersRef.current.forEach((m) => m.marker.remove());
      markersRef.current = [];

      bars.forEach((bar) => {
        const el = document.createElement("div");
        el.style.cursor = "pointer";
        el.style.transformOrigin = "bottom center";
        el.innerHTML = `<div class="bar-pin" style="
          width: 28px; height: 28px;
          background: #28CC95;
          border: 2px solid rgba(255,255,255,0.5);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          transition: all 0.3s ease;
        "></div>`;

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectBar(bar);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat(bar.coordinates)
          .addTo(map);

        markersRef.current.push({ bar, marker, el });
      });

      // Scale all markers with zoom
      const scaleMarkers = () => {
        const zoom = map.getZoom();
        const scale = Math.min(1, Math.max(0.3, (zoom - 2) / 14 * 0.7 + 0.3));
        markersRef.current.forEach(({ el }) => {
          el.style.transform = `scale(${scale})`;
        });
      };

      scaleMarkers();
      map.on("zoom", scaleMarkers);
    };

    if (map.isStyleLoaded()) {
      createMarkers();
    } else {
      map.once("load", createMarkers);
    }
  }, [onSelectBar]);

  // Update marker styles and fly to selected bar
  useEffect(() => {
    markersRef.current.forEach(({ bar, el }) => {
      const pin = el.querySelector(".bar-pin") as HTMLElement;
      if (!pin) return;
      const isSelected = selectedBar?.name === bar.name;
      pin.style.background = isSelected ? "#28CC95" : "#28CC95";
      pin.style.border = isSelected ? "3px solid white" : "2px solid rgba(255,255,255,0.5)";
      pin.style.boxShadow = isSelected ? "0 0 12px rgba(40,204,149,0.6)" : "none";
      pin.style.width = isSelected ? "32px" : "28px";
      pin.style.height = isSelected ? "32px" : "28px";
      el.style.zIndex = isSelected ? "10" : "1";
    });

    if (!selectedBar || !mapRef.current) return;
    mapRef.current.flyTo({
      center: selectedBar.coordinates,
      zoom: 18,
      pitch: 55,
      bearing: -17.6,
      duration: 2000,
      essential: true,
    });
  }, [selectedBar]);

  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Selected bar overlay */}
      {selectedBar && (
        <div className="absolute left-4 top-4 z-10 w-80 rounded-xl bg-kalshi-bg/90 backdrop-blur-md">
          <ShineBorder shineColor="#28CC95" borderWidth={1} duration={30} className="z-10 opacity-70" />
          {selectedBar.image && (
            <div className="relative overflow-hidden rounded-t-xl">
              <img
                src={selectedBar.image}
                alt={selectedBar.name}
                className="h-32 w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-kalshi-bg/90 to-transparent" />
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

      {/* Scroll hint overlay */}
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

"use client";

import { useRef, useEffect } from "react";
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

export default function Map({ selectedBar, onClose, onSelectBar, visibleBars }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [-74.0082, 40.7133],
      zoom: 12,
      pitch: 55,
      bearing: -17.6,
      scrollZoom: true,
      dragPan: true,
      touchZoomRotate: true,
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

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !visibleBars?.length) return;

    const markers: mapboxgl.Marker[] = [];

    const addMarkers = () => {
      visibleBars.forEach((bar) => {
        const el = document.createElement("div");
        el.innerHTML = `<svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.059 27.941 0 18 0z" fill="#28CC95"/>
          <circle cx="18" cy="18" r="8" fill="#0A0C0F"/>
        </svg>`;
        el.style.cursor = "pointer";
        el.style.filter = "drop-shadow(0 2px 8px rgba(40, 204, 149, 0.6))";
        el.addEventListener("click", () => onSelectBar(bar));

        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat(bar.coordinates)
          .addTo(map);
        markers.push(marker);
      });
    };

    if (map.loaded()) {
      addMarkers();
    } else {
      map.on("load", addMarkers);
    }

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [visibleBars, onSelectBar]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedBar) return;

    map.flyTo({
      center: selectedBar.coordinates,
      zoom: 17,
      pitch: 55,
      bearing: -17.6,
      duration: 2000,
      essential: true,
    });
  }, [selectedBar]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {selectedBar && (
        <div className="absolute left-2 top-2 z-10 w-44 rounded-lg bg-kalshi-bg/90 backdrop-blur-md md:left-4 md:top-4 md:w-80 md:rounded-xl">
          <ShineBorder shineColor="#28CC95" borderWidth={1} duration={30} className="z-10 opacity-70" />
          {selectedBar.image && (
            <div className="relative h-16 overflow-hidden rounded-t-lg md:h-32 md:rounded-t-xl">
              <Image
                src={selectedBar.image}
                alt={selectedBar.name}
                fill
                sizes="320px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-kalshi-bg/90 to-transparent md:h-8" />
            </div>
          )}
          <div className="p-1.5 md:p-4">
            <div className="flex items-start justify-between gap-1">
              <h3 className="text-[11px] font-semibold leading-tight text-white md:text-base">{selectedBar.name}</h3>
              <div className="flex items-center gap-1 md:gap-1.5">
                <a
                  href={selectedBar.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-kalshi-green transition-opacity hover:opacity-70"
                >
                  <ExternalLinkIcon className="h-3 w-3 md:h-4 md:w-4" />
                </a>
                <button
                  onClick={onClose}
                  className="shrink-0 text-kalshi-text-secondary transition-colors hover:text-white"
                >
                  <Cross2Icon className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>
            </div>
            <p className="mt-0.5 text-[9px] text-kalshi-text-secondary md:mt-1 md:text-sm">
              {selectedBar.address}, {selectedBar.location}
            </p>
            {selectedBar.events.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-0.5 md:mt-2 md:gap-1.5">
                {selectedBar.events.map((event) => (
                  <span
                    key={event}
                    className="rounded-full bg-white/10 px-1 py-px text-[8px] text-kalshi-text-secondary md:px-2 md:py-0.5 md:text-xs"
                  >
                    {event}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

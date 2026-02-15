"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ExternalLinkIcon, Cross2Icon } from "@radix-ui/react-icons";
import { ShineBorder } from "@/components/ui/ShineBorder";
import { type Bar } from "@/data/bars";

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

  // Fly to selected bar and highlight its building
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const removeHighlight = () => {
      if (map.getLayer("building-highlight")) map.removeLayer("building-highlight");
      if (map.getSource("building-highlight")) map.removeSource("building-highlight");
    };

    removeHighlight();

    if (!selectedBar) return;

    map.flyTo({
      center: selectedBar.coordinates,
      zoom: 18,
      pitch: 55,
      bearing: -17.6,
      duration: 2000,
      essential: true,
    });

    const findBuilding = () => {
      const point = map.project(selectedBar.coordinates);
      const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
        [point.x - 20, point.y - 20],
        [point.x + 20, point.y + 20],
      ];
      const features = map.queryRenderedFeatures(bbox);
      return features.find(
        (f) =>
          (f.sourceLayer === "building" ||
            f.layer?.id?.toLowerCase().includes("building") ||
            f.layer?.type === "fill-extrusion") &&
          (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon")
      );
    };

    const applyHighlight = (building: mapboxgl.GeoJSONFeature) => {
      removeHighlight();
      map.addSource("building-highlight", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: building.geometry,
          properties: building.properties,
        } as GeoJSON.Feature,
      });
      map.addLayer({
        id: "building-highlight",
        type: "fill-extrusion",
        source: "building-highlight",
        paint: {
          "fill-extrusion-color": "#28CC95",
          "fill-extrusion-opacity": 0.7,
          "fill-extrusion-height": (building.properties?.height as number) ?? 20,
          "fill-extrusion-base": (building.properties?.min_height as number) ?? 0,
        },
      });
    };

    let retryTimer: ReturnType<typeof setTimeout>;

    const highlightBuilding = () => {
      removeHighlight();
      const building = findBuilding();
      if (building) {
        applyHighlight(building);
      } else {
        // Tiles may still be loading — retry once after a short delay
        retryTimer = setTimeout(() => {
          const b = findBuilding();
          if (b) applyHighlight(b);
        }, 500);
      }
    };

    map.once("idle", highlightBuilding);

    return () => {
      map.off("idle", highlightBuilding);
      clearTimeout(retryTimer);
    };
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

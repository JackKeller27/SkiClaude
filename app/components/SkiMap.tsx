"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Resort } from "@/app/types";
import ResortPopup from "./ResortPopup";
import TripPanel from "./TripPanel";
import UserMenu from "./UserMenu";
import FilterBar, { type Filters, DEFAULT_FILTERS } from "./FilterBar";

function createPinIcon(visited: boolean, count: number, isDark: boolean) {
  const fill = visited ? "#ef4444" : (isDark ? "#475569" : "#9ca3af");
  const stroke = visited ? "#b91c1c" : (isDark ? "#1e293b" : "#6b7280");
  const countLabel = count > 99 ? "99+" : count > 0 ? String(count) : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40">
    <defs>
      <filter id="ps" x="-30%" y="-10%" width="160%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-opacity="0.25"/>
      </filter>
    </defs>
    <path d="M14 2C8.477 2 4 6.477 4 12c0 7.5 10 22 10 22S24 19.5 24 12c0-5.523-4.477-10-10-10z"
          fill="${fill}" stroke="${stroke}" stroke-width="1.5" filter="url(#ps)"/>
    <circle cx="14" cy="12" r="5.5" fill="white" opacity="${visited ? "0.95" : "0.55"}"/>
    ${countLabel ? `<text x="14" y="15.5" text-anchor="middle" font-size="6.5" font-weight="800" fill="${fill}" font-family="-apple-system,sans-serif">${countLabel}</text>` : ""}
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -42],
  });
}

function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

function activeFilterCount(f: Filters) {
  return (
    f.passTypes.length +
    f.states.length +
    (f.minVertical > 0 ? 1 : 0) +
    (f.minRuns > 0 ? 1 : 0) +
    (f.minAcreage > 0 ? 1 : 0)
  );
}

export default function SkiMap() {
  const { data: session, status } = useSession();
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [visitFilter, setVisitFilter] = useState<"all" | "visited" | "unvisited">("all");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [panelResort, setPanelResort] = useState<Resort | null>(null);
  const [panelDefaultLog, setPanelDefaultLog] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const mapRef = useRef<LeafletMap | null>(null);

  const fetchResorts = useCallback(async () => {
    const res = await fetch("/api/resorts");
    const data = await res.json();
    setResorts(data);
    if (panelResort) {
      const updated = data.find((r: Resort) => r.id === panelResort.id);
      if (updated) setPanelResort(updated);
    }
  }, [panelResort]);

  useEffect(() => {
    fetchResorts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    setTimeout(() => mapRef.current?.invalidateSize(), 300);
  }, [panelResort]);

  const totalTrips = resorts.reduce((sum, r) => sum + r.trips.length, 0);
  const visitedCount = resorts.filter((r) => r.trips.length > 0).length;
  const activeCount = activeFilterCount(filters);

  const filtered = resorts.filter((r) => {
    if (visitFilter === "visited" && r.trips.length === 0) return false;
    if (visitFilter === "unvisited" && r.trips.length > 0) return false;
    if (filters.passTypes.length > 0 && !filters.passTypes.includes(r.passType)) return false;
    if (filters.states.length > 0 && !filters.states.includes(r.state)) return false;
    if (r.verticalDrop < filters.minVertical) return false;
    if (r.numRuns < filters.minRuns) return false;
    if (r.acreage < filters.minAcreage) return false;
    return true;
  });

  // Theme classes
  const headerBg = isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900 border-b border-gray-200";
  const subText = isDark ? "text-slate-400" : "text-gray-500";
  const btnOn = "bg-blue-600 text-white";
  const btnOff = isDark
    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
    : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileAttrib = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className={`${headerBg} px-6 py-3 flex items-center justify-between shrink-0 relative z-[1001]`}>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Northeast Ski Tracker</h1>
          <p className={`${subText} text-xs mt-0.5`}>
            {status === "loading"
              ? "\u00a0"
              : session
              ? `${visitedCount} / ${resorts.length} resorts visited · ${totalTrips} total trips`
              : "Browsing as guest — sign in to log trips"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Visit filter */}
          <div className="flex gap-2">
            {(["all", "visited", "unvisited"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setVisitFilter(f)}
                className={`text-xs px-3 py-1.5 rounded capitalize transition-colors ${visitFilter === f ? btnOn : btnOff}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`relative text-xs px-3 py-1.5 rounded transition-colors ${showFilters || activeCount > 0 ? btnOn : btnOff}`}
          >
            Filters
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-blue-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

          {/* Dark/light toggle */}
          <button
            onClick={() => setIsDark((d) => !d)}
            className={`text-xs px-2.5 py-1.5 rounded transition-colors ${btnOff}`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <UserMenu />
        </div>
      </header>

      {/* Filter bar */}
      {showFilters && (
        <div className="relative z-[1001]">
          <FilterBar filters={filters} onChange={setFilters} isDark={isDark} />
        </div>
      )}

      {/* Map + Panel */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer
          center={[43.5, -71.5]}
          zoom={7}
          className="h-full w-full"
          scrollWheelZoom={true}
          ref={mapRef}
        >
          <MapInvalidator />
          <TileLayer key={tileUrl} attribution={tileAttrib} url={tileUrl} />
          {filtered.map((resort) => {
            const visited = resort.trips.length > 0;
            return (
              <Marker
                key={resort.id}
                position={[resort.lat, resort.lng]}
                icon={createPinIcon(visited, resort.trips.length, isDark)}
              >
                <Popup minWidth={260} maxWidth={300}>
                  <ResortPopup
                    resort={resort}
                    onOpenPanel={(defaultLog = false) => {
                      setPanelDefaultLog(defaultLog);
                      setPanelResort(resort);
                    }}
                    isGuest={status !== "loading" && !session}
                  />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Trip history panel */}
        {panelResort && (
          <TripPanel
            resort={panelResort}
            onClose={() => setPanelResort(null)}
            onDataChange={fetchResorts}
            defaultLog={panelDefaultLog}
          />
        )}

        {/* Legend */}
        <div className={`absolute bottom-6 rounded-lg shadow-md px-3 py-2 text-xs z-[1000] transition-all ${panelResort ? "right-84" : "right-4"} ${isDark ? "bg-slate-800 text-slate-300" : "bg-white text-gray-600"}`}>
          <p className="font-semibold mb-1.5">Legend</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 border-2 border-red-700" />
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full border-2 ${isDark ? "bg-slate-500 border-slate-400" : "bg-gray-300 border-gray-400"}`} />
            <span>Not yet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

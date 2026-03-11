"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ResortPopup from "./ResortPopup";

type Trip = {
  id: number;
  date: string;
  visitNumber: number;
  companions: string;
  favoriteRun: string;
  notes: string;
};

type Resort = {
  id: number;
  name: string;
  state: string;
  lat: number;
  lng: number;
  trips: Trip[];
};

function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

export default function SkiMap() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [filter, setFilter] = useState<"all" | "visited" | "unvisited">("all");

  const fetchResorts = useCallback(async () => {
    const res = await fetch("/api/resorts");
    const data = await res.json();
    setResorts(data);
  }, []);

  useEffect(() => {
    fetchResorts();
  }, [fetchResorts]);

  const totalTrips = resorts.reduce((sum, r) => sum + r.trips.length, 0);
  const visitedCount = resorts.filter((r) => r.trips.length > 0).length;

  const filtered = resorts.filter((r) => {
    if (filter === "visited") return r.trips.length > 0;
    if (filter === "unvisited") return r.trips.length === 0;
    return true;
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Northeast Ski Tracker</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            {visitedCount} / {resorts.length} resorts visited · {totalTrips} total trips
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "visited", "unvisited"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded capitalize transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[43.5, -71.5]}
          zoom={7}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <MapInvalidator />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((resort) => {
            const visited = resort.trips.length > 0;
            return (
              <CircleMarker
                key={resort.id}
                center={[resort.lat, resort.lng]}
                radius={visited ? 10 : 7}
                pathOptions={{
                  color: visited ? "#1d4ed8" : "#6b7280",
                  fillColor: visited ? "#3b82f6" : "#d1d5db",
                  fillOpacity: visited ? 0.9 : 0.6,
                  weight: 2,
                }}
              >
                <Popup minWidth={240} maxWidth={320}>
                  <ResortPopup resort={resort} onDataChange={fetchResorts} />
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-6 right-4 bg-white rounded-lg shadow-md px-3 py-2 text-xs z-[1000]">
          <p className="font-semibold text-gray-700 mb-1.5">Legend</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-700" />
            <span className="text-gray-600">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-200 border-2 border-gray-400" />
            <span className="text-gray-600">Not yet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Resort } from "@/app/types";
import TripForm from "./TripForm";

type Props = {
  resort: Resort;
  onClose: () => void;
  onDataChange: () => void;
  defaultLog?: boolean;
};

export default function TripPanel({ resort, onClose, onDataChange, defaultLog = false }: Props) {
  const [showForm, setShowForm] = useState(defaultLog);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(tripId: number) {
    setDeletingId(tripId);
    await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
    setDeletingId(null);
    onDataChange();
  }

  const nextVisit = resort.trips.length + 1;

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl z-[1001] flex flex-col">
      {/* Panel header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-semibold text-sm">{resort.name}</h2>
          <p className="text-slate-400 text-xs">
            {resort.trips.length} trip{resort.trips.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Log a trip */}
      <div className="px-4 py-3 border-b shrink-0">
        {showForm ? (
          <TripForm
            resort={resort}
            visitNumber={nextVisit}
            onSave={() => { setShowForm(false); onDataChange(); }}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded transition-colors"
          >
            + Log a Trip
          </button>
        )}
      </div>

      {/* Trip history */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {resort.trips.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">No trips logged yet.</p>
        ) : (
          resort.trips.map((trip, i) => (
            <div key={trip.id} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      #{trip.visitNumber}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {new Date(trip.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {i === 0 && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                        Latest
                      </span>
                    )}
                  </div>
                  {trip.companions && (
                    <p className="text-xs text-gray-500 truncate">With: {trip.companions}</p>
                  )}
                  {trip.favoriteRun && (
                    <p className="text-xs text-gray-500">Fav run: {trip.favoriteRun}</p>
                  )}
                  {trip.notes && (
                    <p className="text-xs text-gray-400 italic mt-1">{trip.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(trip.id)}
                  disabled={deletingId === trip.id}
                  className="text-gray-300 hover:text-red-400 transition-colors ml-2 text-lg leading-none shrink-0"
                  title="Delete trip"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import TripForm from "./TripForm";

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

type Props = {
  resort: Resort;
  onDataChange: () => void;
};

export default function ResortPopup({ resort, onDataChange }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(tripId: number) {
    setDeletingId(tripId);
    await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
    setDeletingId(null);
    onDataChange();
  }

  const nextVisit = resort.trips.length + 1;

  return (
    <div className="min-w-[240px] max-w-[280px]">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-900 text-base">{resort.name}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{resort.state}</span>
      </div>
      <p className="text-xs text-gray-500 mb-2">
        {resort.trips.length === 0
          ? "No trips logged yet"
          : `${resort.trips.length} trip${resort.trips.length === 1 ? "" : "s"} logged`}
      </p>

      {resort.trips.length > 0 && (
        <div className="space-y-2 mb-3">
          {resort.trips.map((trip) => (
            <div key={trip.id} className="bg-gray-50 rounded p-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-800">
                    Visit #{trip.visitNumber} — {new Date(trip.date).toLocaleDateString()}
                  </span>
                  {trip.companions && (
                    <p className="text-gray-500 mt-0.5">With: {trip.companions}</p>
                  )}
                  {trip.favoriteRun && (
                    <p className="text-gray-500">Fav run: {trip.favoriteRun}</p>
                  )}
                  {trip.notes && <p className="text-gray-400 italic mt-0.5">{trip.notes}</p>}
                </div>
                <button
                  onClick={() => handleDelete(trip.id)}
                  disabled={deletingId === trip.id}
                  className="text-gray-300 hover:text-red-400 transition-colors ml-2 text-base leading-none"
                  title="Delete trip"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
  );
}

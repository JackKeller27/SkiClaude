"use client";

import { useState } from "react";
import type { Resort } from "@/app/types";

type Props = {
  resort: Resort;
  visitNumber: number;
  onSave: () => void;
  onCancel: () => void;
};

export default function TripForm({ resort, visitNumber, onSave, onCancel }: Props) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [companions, setCompanions] = useState("");
  const [favoriteRun, setFavoriteRun] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resortId: resort.id,
        date,
        visitNumber,
        companions,
        favoriteRun,
        notes,
      }),
    });
    setSaving(false);
    onSave();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Visit #{visitNumber}
        </label>
        <p className="text-xs text-gray-400">Auto-calculated from trip history</p>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Who you went with</label>
        <input
          type="text"
          value={companions}
          onChange={(e) => setCompanions(e.target.value)}
          placeholder="e.g. Jake, Sarah"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Favorite run</label>
        <input
          type="text"
          value={favoriteRun}
          onChange={(e) => setFavoriteRun(e.target.value)}
          placeholder="e.g. Liftline"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Powder day, great conditions..."
          rows={2}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Log Trip"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-1.5 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

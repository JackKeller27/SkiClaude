"use client";

import type { Resort } from "@/app/types";

const PASS_COLORS: Record<string, string> = {
  IKON: "bg-blue-100 text-blue-700",
  EPIC: "bg-indigo-100 text-indigo-700",
  INDEPENDENT: "bg-gray-100 text-gray-600",
};

type Props = {
  resort: Resort;
  onOpenPanel: (defaultLog?: boolean) => void;
  isGuest?: boolean;
};

export default function ResortPopup({ resort, onOpenPanel, isGuest = false }: Props) {
  const mostRecent = resort.trips[0] ?? null;

  return (
    <div className="min-w-[260px] max-w-[300px]">
      {/* Resort header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{resort.name}</h3>
          <span className="text-xs text-gray-400">{resort.state}</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ml-2 ${PASS_COLORS[resort.passType] ?? PASS_COLORS.INDEPENDENT}`}>
          {resort.passType === "INDEPENDENT" ? "Indie" : resort.passType}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-1 mb-3 text-center">
        <div className="bg-gray-50 rounded p-1.5">
          <p className="text-xs font-semibold text-gray-800">{resort.verticalDrop.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">vert (ft)</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5">
          <p className="text-xs font-semibold text-gray-800">{resort.numRuns}</p>
          <p className="text-[10px] text-gray-400">runs</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5">
          <p className="text-xs font-semibold text-gray-800">{resort.acreage}</p>
          <p className="text-[10px] text-gray-400">acres</p>
        </div>
      </div>

      {/* Most recent visit */}
      {mostRecent && (
        <div className="bg-blue-50 border border-blue-100 rounded p-2 mb-2 text-xs">
          <p className="font-medium text-blue-800 mb-0.5">
            Last visit — {new Date(mostRecent.date).toLocaleDateString()}
          </p>
          {mostRecent.companions && <p className="text-blue-600">With: {mostRecent.companions}</p>}
          {mostRecent.favoriteRun && <p className="text-blue-600">Fav run: {mostRecent.favoriteRun}</p>}
          {mostRecent.notes && <p className="text-blue-400 italic mt-0.5">{mostRecent.notes}</p>}
        </div>
      )}

      {/* Actions */}
      {isGuest ? (
        <a
          href="/login"
          className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium py-1.5 rounded transition-colors"
        >
          Sign in to log trips
        </a>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => onOpenPanel(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded transition-colors"
          >
            + Log a Trip
          </button>
          <button
            onClick={() => onOpenPanel(false)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1.5 rounded transition-colors"
          >
            {resort.trips.length > 0 ? `All Visits (${resort.trips.length})` : "View Resort"}
          </button>
        </div>
      )}
    </div>
  );
}

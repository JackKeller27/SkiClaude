"use client";

export type Filters = {
  passTypes: string[];
  states: string[];
  minVertical: number;
  minRuns: number;
  minAcreage: number;
  minBase: number;
};

export const DEFAULT_FILTERS: Filters = {
  passTypes: [],
  states: [],
  minVertical: 0,
  minRuns: 0,
  minAcreage: 0,
  minBase: 0,
};

const PASS_TYPES = ["IKON", "EPIC", "INDEPENDENT"];
const PASS_LABELS: Record<string, string> = { IKON: "Ikon", EPIC: "Epic", INDEPENDENT: "Indie" };
const STATES = ["VT", "NH", "ME", "NY", "MA", "CT", "PA"];

const VERTICAL_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "1,000+ ft", value: 1000 },
  { label: "1,500+ ft", value: 1500 },
  { label: "2,000+ ft", value: 2000 },
  { label: "2,500+ ft", value: 2500 },
];

const RUNS_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "30+", value: 30 },
  { label: "60+", value: 60 },
  { label: "100+", value: 100 },
];

const ACREAGE_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "200+", value: 200 },
  { label: "400+", value: 400 },
  { label: "700+", value: 700 },
];

const BASE_OPTIONS = [
  { label: "Any", value: 0 },
  { label: '6"', value: 6 },
  { label: '12"', value: 12 },
  { label: '24"', value: 24 },
  { label: '36"', value: 36 },
];

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  isDark: boolean;
};

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export default function FilterBar({ filters, onChange, isDark }: Props) {
  const bar = isDark
    ? "bg-slate-800 border-slate-700 text-slate-400"
    : "bg-gray-50 border-gray-200 text-gray-500";
  const btnOn = "bg-blue-600 text-white";
  const btnOff = isDark
    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100";

  return (
    <div className={`${bar} border-t px-6 py-3 flex flex-wrap gap-6 items-start`}>
      {/* Pass type */}
      <div>
        <p className="text-[10px] uppercase tracking-wide mb-1.5">Pass</p>
        <div className="flex gap-1">
          {PASS_TYPES.map((pt) => (
            <button
              key={pt}
              onClick={() => onChange({ ...filters, passTypes: toggle(filters.passTypes, pt) })}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${filters.passTypes.includes(pt) ? btnOn : btnOff}`}
            >
              {PASS_LABELS[pt]}
            </button>
          ))}
        </div>
      </div>

      {/* State */}
      <div>
        <p className="text-[10px] uppercase tracking-wide mb-1.5">State</p>
        <div className="flex gap-1 flex-wrap">
          {STATES.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...filters, states: toggle(filters.states, s) })}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${filters.states.includes(s) ? btnOn : btnOff}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical */}
      <div>
        <p className="text-[10px] uppercase tracking-wide mb-1.5">Vertical</p>
        <div className="flex gap-1">
          {VERTICAL_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => onChange({ ...filters, minVertical: o.value })}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${filters.minVertical === o.value ? btnOn : btnOff}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Runs */}
      <div>
        <p className="text-[10px] uppercase tracking-wide mb-1.5">Runs</p>
        <div className="flex gap-1">
          {RUNS_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => onChange({ ...filters, minRuns: o.value })}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${filters.minRuns === o.value ? btnOn : btnOff}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Acreage */}
      <div>
        <p className="text-[10px] uppercase tracking-wide mb-1.5">Acreage</p>
        <div className="flex gap-1">
          {ACREAGE_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => onChange({ ...filters, minAcreage: o.value })}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${filters.minAcreage === o.value ? btnOn : btnOff}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Base depth */}
      <div>
        <p className="text-[10px] uppercase tracking-wide mb-1.5">Base depth</p>
        <div className="flex gap-1">
          {BASE_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => onChange({ ...filters, minBase: o.value })}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${filters.minBase === o.value ? btnOn : btnOff}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      <div className="flex items-end pb-0.5">
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-xs underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}

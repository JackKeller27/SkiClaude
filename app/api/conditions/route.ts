import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type ResortCondition = {
  id: number;
  tempF: number | null;
  baseInches: number;
};

// Cache for 30 minutes — conditions don't change that fast
let cache: { data: ResortCondition[]; expiresAt: number } | null = null;

export async function GET() {
  if (cache && Date.now() < cache.expiresAt) {
    return NextResponse.json(cache.data);
  }

  const resorts = await prisma.resort.findMany({
    select: { id: true, lat: true, lng: true },
    orderBy: { id: "asc" },
  });

  const lats = resorts.map((r) => r.lat).join(",");
  const lngs = resorts.map((r) => r.lng).join(",");

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lats}&longitude=${lngs}` +
    `&current=temperature_2m,snow_depth` +
    `&temperature_unit=fahrenheit`;

  const res = await fetch(url, { next: { revalidate: 1800 } });
  const json = await res.json();

  // Open-Meteo returns an array when multiple coordinates are passed
  const results: Array<{ current?: { temperature_2m?: number; snow_depth?: number } }> =
    Array.isArray(json) ? json : [json];

  const data: ResortCondition[] = resorts.map((resort, i) => {
    const r = results[i];
    const rawTemp = r?.current?.temperature_2m;
    const snowDepthM = r?.current?.snow_depth ?? 0;
    return {
      id: resort.id,
      tempF: rawTemp != null ? Math.round(rawTemp) : null,
      baseInches: Math.round(snowDepthM * 39.37),
    };
  });

  cache = { data, expiresAt: Date.now() + 30 * 60 * 1000 };
  return NextResponse.json(data);
}

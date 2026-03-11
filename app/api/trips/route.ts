import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { resortId, date, visitNumber, companions, favoriteRun, notes } = body;

  const trip = await prisma.trip.create({
    data: {
      resortId: Number(resortId),
      date: new Date(date),
      visitNumber: Number(visitNumber),
      companions: companions ?? "",
      favoriteRun: favoriteRun ?? "",
      notes: notes ?? "",
    },
  });
  return NextResponse.json(trip, { status: 201 });
}

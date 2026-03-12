import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to log trips" }, { status: 401 });
  }

  const body = await req.json();
  const { resortId, date, visitNumber, companions, favoriteRun, notes } = body;

  const trip = await prisma.trip.create({
    data: {
      resortId: Number(resortId),
      userId: session.user.id,
      date: new Date(date),
      visitNumber: Number(visitNumber),
      companions: companions ?? "",
      favoriteRun: favoriteRun ?? "",
      notes: notes ?? "",
    },
  });
  return NextResponse.json(trip, { status: 201 });
}

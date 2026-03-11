import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.trip.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const trip = await prisma.trip.update({
    where: { id: Number(id) },
    data: {
      date: body.date ? new Date(body.date) : undefined,
      visitNumber: body.visitNumber ? Number(body.visitNumber) : undefined,
      companions: body.companions,
      favoriteRun: body.favoriteRun,
      notes: body.notes,
    },
  });
  return NextResponse.json(trip);
}

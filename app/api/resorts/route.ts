import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  const resorts = await prisma.resort.findMany({
    include: {
      trips: session?.user?.id
        ? { where: { userId: session.user.id }, orderBy: { date: "desc" } }
        : false,
    },
    orderBy: { name: "asc" },
  });

  // Guests get resorts with empty trips array
  return NextResponse.json(
    resorts.map((r) => ({ ...r, trips: "trips" in r ? r.trips : [] }))
  );
}

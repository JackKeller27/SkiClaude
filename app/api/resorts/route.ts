import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const resorts = await prisma.resort.findMany({
    include: { trips: { orderBy: { date: "desc" } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(resorts);
}

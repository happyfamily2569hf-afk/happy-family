import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posters = await prisma.poster.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(posters);
  } catch (e) {
    return NextResponse.json({ error: "Error fetching posters" }, { status: 500 });
  }
}

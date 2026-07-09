import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ebooks = await prisma.ebook.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(ebooks);
  } catch (e) {
    return NextResponse.json({ error: "Error fetching ebooks" }, { status: 500 });
  }
}

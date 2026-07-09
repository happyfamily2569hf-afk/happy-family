import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: { videos: true }
    });
    return NextResponse.json(courses);
  } catch (e) {
    return NextResponse.json({ error: "Error fetching courses" }, { status: 500 });
  }
}

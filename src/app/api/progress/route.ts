import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { videoId, completed } = await req.json();

    if (!videoId) {
      return NextResponse.json({ message: "Video ID is required" }, { status: 400 });
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_videoId: {
          userId: session.user.id,
          videoId,
        }
      },
      update: {
        completed,
      },
      create: {
        userId: session.user.id,
        videoId,
        completed,
      }
    });

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
  }
}

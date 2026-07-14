import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const video = await prisma.video.create({
      data: {
        title: data.title,
        youtubeId: data.youtubeId,
        imageUrl: data.imageUrl || null,
        subjectId: data.subjectId || null,
      }
    });
    return NextResponse.json(video);
  } catch (e) {
    return NextResponse.json({ error: "Error creating video" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const video = await prisma.video.update({
      where: { id: data.id },
      data: {
        title: data.title,
        youtubeId: data.youtubeId,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined,
        subjectId: data.subjectId || null,
      }
    });
    return NextResponse.json(video);
  } catch (e) {
    return NextResponse.json({ error: "Error updating video" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Error deleting video" }, { status: 500 });
  }
}

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
    const activity = await prisma.activity.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        imageUrl: data.imageUrl,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
      }
    });
    return NextResponse.json(activity);
  } catch (e) {
    return NextResponse.json({ error: "Error creating activity" }, { status: 500 });
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
    const activity = await prisma.activity.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
      }
    });
    return NextResponse.json(activity);
  } catch (e) {
    return NextResponse.json({ error: "Error updating activity" }, { status: 500 });
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

    await prisma.activity.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Error deleting activity" }, { status: 500 });
  }
}

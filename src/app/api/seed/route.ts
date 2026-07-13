import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const existing = await prisma.course.findFirst();
  if (existing) {
    return NextResponse.json({ message: "Already seeded" });
  }

  const videos = Array.from({ length: 15 }).map((_, i) => ({
    title: `บทเรียนที่ ${i + 1}: การส่งเสริมสุขภาวะตอนที่ ${i + 1}`,
    youtubeId: 'dQw4w9WgXcQ' // placeholder youtube ID for all
  }));

  const course = await prisma.course.create({
    data: {
      title: 'หลักสูตรส่งเสริมสุขภาพใจ (Mental Health)',
      description: 'เรียนรู้วิธีการจัดการความเครียด และการส่งเสริมสุขภาพจิตใจที่ดีสำหรับทุกช่วงวัย (ทั้งหมด 15 บทเรียน)',
      subjects: {
        create: [
          {
            title: 'วิชาพื้นฐาน (Default Subject)',
            description: 'วิชาพื้นฐานสำหรับหลักสูตร',
            videos: {
              create: videos
            }
          }
        ]
      }
    }
  });

  return NextResponse.json({ message: "Seed completed!", course });
}

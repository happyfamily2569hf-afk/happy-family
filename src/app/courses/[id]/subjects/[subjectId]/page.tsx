import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import VideoPlayerClient from "../../VideoPlayerClient";
import { notFound, redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function SubjectVideoPage({ params }: { params: Promise<{ id: string, subjectId: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!course) {
    return notFound();
  }

  const subject = await prisma.subject.findUnique({
    where: { id: resolvedParams.subjectId },
    include: {
      videos: true
    }
  });

  if (!subject || subject.courseId !== course.id) {
    return notFound();
  }

  let progressMap: Record<string, boolean> = {};
  
  if (session?.user?.id && subject.videos.length > 0) {
    const userProgress = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
        videoId: {
          in: subject.videos.map(v => v.id)
        }
      }
    });
    
    userProgress.forEach(p => {
      progressMap[p.videoId] = p.completed;
    });
  }

  return (
    <main className="container" style={{ padding: '3rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <VideoPlayerClient 
        course={course}
        subject={subject} 
        initialProgressMap={progressMap} 
        isLoggedIn={!!session?.user} 
      />
    </main>
  );
}

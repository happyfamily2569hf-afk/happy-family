import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import VideoPlayerClient from "./VideoPlayerClient";
import { notFound, redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
    include: {
      subjects: {
        include: {
          videos: true
        }
      }
    }
  });

  if (!course) {
    return notFound();
  }

  let progressMap: Record<string, boolean> = {};
  
  const allVideos = course.subjects.flatMap(s => s.videos);

  if (session?.user?.id && allVideos.length > 0) {
    const userProgress = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
        videoId: {
          in: allVideos.map(v => v.id)
        }
      }
    });
    
    userProgress.forEach(p => {
      progressMap[p.videoId] = p.completed;
    });
  }

  return (
    <main className="container" style={{ padding: '3rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{course.title}</h1>
      <p style={{ color: 'var(--text-light)' }}>{course.description}</p>
      
      <VideoPlayerClient 
        course={course} 
        initialProgressMap={progressMap} 
        isLoggedIn={!!session?.user} 
      />
    </main>
  );
}

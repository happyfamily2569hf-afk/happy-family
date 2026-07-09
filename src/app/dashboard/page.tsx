import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Get total videos in the course
  const course = await prisma.course.findFirst({
    include: { videos: true }
  });
  
  const totalVideos = course?.videos.length || 0;

  // Get user progress
  const userProgress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      completed: true
    }
  });

  const completedCount = userProgress.length;
  const progressPercentage = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;
  
  const hasCompletedCourse = progressPercentage === 100 && totalVideos > 0;

  return (
    <main style={{ flex: 1, padding: '4rem 1rem', background: 'var(--bg-gradient)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '2rem', textAlign: 'center' }}>
          ยินดีต้อนรับ, <span style={{ color: 'var(--primary)' }}>{session.user.name || session.user.email}</span>
        </h1>

        <div className="card-medee" style={{ padding: '3rem 2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>ความคืบหน้าของคุณ</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>หลักสูตร: {course?.title || "ไม่พบหลักสูตร"}</span>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{progressPercentage}%</span>
          </div>
          
          <div className="progress-container" style={{ marginBottom: '1.5rem' }}>
            <div 
              className="progress-bar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <p style={{ color: 'var(--text-light)', textAlign: 'center', marginBottom: '2rem' }}>
            เรียนจบแล้ว {completedCount} จาก {totalVideos} บทเรียน
          </p>
          
          <div style={{ textAlign: 'center' }}>
            {hasCompletedCourse ? (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid #10b981',
                padding: '2rem', 
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <span style={{ fontSize: '3rem' }}>🎉</span>
                <h3 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>ขอแสดงความยินดี!</h3>
                <p style={{ color: 'var(--text-dark)', margin: 0 }}>คุณได้เรียนจบหลักสูตรครบ 100% แล้ว</p>
                <Link href="/certificate" className="btn-primary" style={{ marginTop: '1rem', textDecoration: 'none' }}>
                  รับใบประกาศนียบัตร
                </Link>
              </div>
            ) : (
              <Link href="/courses" className="btn-secondary" style={{ textDecoration: 'none' }}>
                เรียนต่อให้จบ
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

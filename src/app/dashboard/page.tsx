import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CertificateButton from "./CertificateButton";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // ดึงข้อมูลหลักสูตรทั้งหมด
  const allCourses = await prisma.course.findMany({
    include: { videos: true }
  });

  // ดึงข้อมูลความคืบหน้าของผู้ใช้
  const userProgress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      completed: true
    }
  });

  // สร้าง Set เพื่อการตรวจสอบวิดีโอที่เรียนจบแล้วได้เร็วขึ้น
  const completedVideoIds = new Set(userProgress.map(p => p.videoId));

  return (
    <main style={{ flex: 1, padding: '4rem 1rem', background: 'var(--bg-gradient)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '2rem', textAlign: 'center' }}>
          ยินดีต้อนรับ, <span style={{ color: 'var(--primary)' }}>{session.user.name || session.user.email}</span>
        </h1>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>ความคืบหน้าของคุณ</h2>
        
        {allCourses.length === 0 ? (
          <div className="card-medee" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)' }}>ยังไม่มีหลักสูตรในระบบ</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {allCourses.map(course => {
              const totalVideos = course.videos.length;
              const completedCount = course.videos.filter(v => completedVideoIds.has(v.id)).length;
              const progressPercentage = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;
              const hasCompletedCourse = progressPercentage === 100 && totalVideos > 0;

              return (
                <div key={course.id} className="card-medee" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
                      {course.title}
                    </h3>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{progressPercentage}%</span>
                  </div>
                  
                  <div className="progress-container" style={{ marginBottom: '1rem' }}>
                    <div 
                      className="progress-bar"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.9rem' }}>
                      เรียนจบแล้ว {completedCount} จาก {totalVideos} บทเรียน
                    </p>
                    
                    <div>
                      {hasCompletedCourse ? (
                        <div style={{ width: '250px' }}>
                          <CertificateButton 
                            userName={session.user.name || session.user.email || "ผู้เรียน"} 
                            courseName={course.title} 
                          />
                        </div>
                      ) : (
                        <Link href="/courses" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                          เรียนต่อให้จบ
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

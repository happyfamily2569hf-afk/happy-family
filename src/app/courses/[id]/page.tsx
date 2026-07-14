import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import CertificateButton from "@/app/dashboard/CertificateButton";

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

  let completedVideoIds = new Set<string>();
  const allVideos = course.subjects.flatMap(s => s.videos);
  const totalVideos = allVideos.length;

  if (session?.user?.id && allVideos.length > 0) {
    const userProgress = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
        videoId: { in: allVideos.map(v => v.id) },
        completed: true
      }
    });
    userProgress.forEach(p => completedVideoIds.add(p.videoId));
  }

  const completedCount = allVideos.filter(v => completedVideoIds.has(v.id)).length;
  const courseProgressPercentage = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;
  const hasCompletedCourse = courseProgressPercentage === 100 && totalVideos > 0;

  return (
    <main className="container" style={{ padding: '3rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/courses" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          <span>← กลับไปหน้ารวมหลักสูตร</span>
        </Link>
      </div>

      <div className="card-medee" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-gradient)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0, textShadow: course.imageUrl ? '0 2px 4px rgba(255,255,255,0.8)' : 'none' }}>{course.title}</h1>
          <p style={{ color: 'var(--text-dark)', fontSize: '1.1rem', margin: 0, marginTop: '0.5rem', background: course.imageUrl ? 'rgba(255,255,255,0.8)' : 'transparent', padding: course.imageUrl ? '0.5rem' : '0', borderRadius: '4px', display: 'inline-block' }}>{course.description}</p>
        </div>
        
        {course.imageUrl && (
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', opacity: 0.3, zIndex: 0 }}>
            <img src={course.imageUrl} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, var(--bg-gradient) 0%, transparent 100%)' }}></div>
          </div>
        )}

        {hasCompletedCourse && (
          <div style={{ padding: '1.5rem', background: 'linear-gradient(to right, #dcfce7, #f0fdf4)', border: '1px solid #22c55e', borderRadius: '12px', marginTop: '1rem', position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', color: '#166534', marginBottom: '1rem' }}>🎉 ยินดีด้วย! คุณเรียนจบหลักสูตรนี้แล้ว</h3>
            <p style={{ color: '#15803d', marginBottom: '1.5rem' }}>คุณได้เรียนรู้ครบทุกวิชาในหลักสูตรนี้เรียบร้อยแล้ว สามารถรับใบประกาศนียบัตรได้เลยครับ</p>
            <div style={{ maxWidth: '400px' }}>
              <CertificateButton userName={session.user.name || session.user.email || "ผู้เรียน"} courseName={course.title} />
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
          เลือกวิชาที่ต้องการเรียน
        </h2>
        
        {course.subjects.length === 0 ? (
          <p style={{ color: 'var(--text-light)' }}>ยังไม่มีวิชาในหลักสูตรนี้</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {course.subjects.map((subject, index) => {
              const subjectTotal = subject.videos.length;
              const subjectCompleted = subject.videos.filter(v => completedVideoIds.has(v.id)).length;
              const subjectProgress = subjectTotal > 0 ? Math.round((subjectCompleted / subjectTotal) * 100) : 0;
              
              return (
                <div key={subject.id} className="card-medee" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '180px', 
                    width: '100%', 
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3rem',
                    overflow: 'hidden'
                  }}>
                    {subject.imageUrl ? (
                      <img src={subject.imageUrl} alt={subject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>📖</span>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-light)', color: 'white', borderRadius: '50px' }}>วิชาที่ {index + 1}</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
                      {subject.title}
                    </h3>
                    
                    <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-light)' }}>
                          เรียนแล้ว {subjectCompleted}/{subjectTotal} วิดีโอ
                        </span>
                        <span style={{ fontWeight: 600, color: subjectProgress === 100 ? '#16a34a' : 'var(--primary)' }}>
                          {subjectProgress}%
                        </span>
                      </div>
                      <div className="progress-container" style={{ marginBottom: '1rem', height: '6px' }}>
                        <div 
                          className="progress-bar"
                          style={{ width: `${subjectProgress}%`, background: subjectProgress === 100 ? '#16a34a' : 'var(--primary)' }}
                        ></div>
                      </div>
                      <Link 
                        href={`/courses/${course.id}/subjects/${subject.id}`} 
                        className="btn-primary" 
                        style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                      >
                        {subjectProgress === 100 ? 'ทบทวนเนื้อหา' : (subjectProgress > 0 ? 'เรียนต่อ' : 'เริ่มเรียน')}
                      </Link>
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

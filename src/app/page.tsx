import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const latestCourses = await prisma.course.findMany({ take: 3, orderBy: { id: 'desc' } });
  const latestEbooks = await prisma.ebook.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
  const latestPosters = await prisma.poster.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
  const latestActivities = await prisma.activity.findMany({ orderBy: { eventDate: 'desc' }, take: 3 });

  return (
    <main style={{ flex: 1 }}>
      <section style={{ 
        background: 'linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(/banner.png) center/cover no-repeat', 
        padding: '6rem 1rem', 
        textAlign: 'center',
        borderBottom: '1px solid var(--card-border)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 700, 
            color: 'var(--primary)', 
            lineHeight: 1.2,
            marginBottom: '1rem'
          }}>
            ครอบครัว<span style={{ color: 'var(--secondary)' }}>มีสุข</span>
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--text-light)', 
            marginBottom: '3rem',
            fontWeight: 300,
            lineHeight: 1.6
          }}>
            “ครอบครัวมีสุข” เป็นส่วนหนึ่งของโครงการที่มุ่งเน้นการสร้างระบบนิเวศ 
            การเรียนรู้ตลอดชีวิต เพื่อพัฒนาทักษะในยุคดิจิทัล สำหรับผู้สูงวัย
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/courses" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1.25rem', padding: '12px 32px', borderRadius: '50px' }}>
              เข้าสู่โรงเรียนดิจิทัล
            </Link>
            <Link href="/register" className="btn-outline" style={{ textDecoration: 'none', fontSize: '1.25rem', padding: '12px 32px', borderRadius: '50px' }}>
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </section>

      {/* 1. Courses Teaser */}
      {latestCourses.length > 0 && (
        <section style={{ padding: '4rem 1rem', background: 'white' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--primary)' }}>📚 แนะนำหลักสูตรน่าสนใจ</h2>
              <Link href="/courses" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                ดูหลักสูตรทั้งหมด ➔
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {latestCourses.map(course => (
                <div key={course.id} className="card-medee" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {course.imageUrl ? (
                    <div style={{ height: '200px', width: '100%' }}>
                      <img src={course.imageUrl} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '200px', width: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#94a3b8' }}>ไม่มีรูปภาพ</span>
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>{course.title}</h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {course.description}
                    </p>
                    <div style={{ marginTop: 'auto' }}>
                      <Link href="/courses" className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                        เข้าเรียน
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. E-Books Teaser */}
      {latestEbooks.length > 0 && (
        <section style={{ padding: '4rem 1rem', background: '#f8fafc' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--secondary)' }}>📖 คลังความรู้ E-Book</h2>
              <Link href="/ebooks" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>
                ดู E-Book ทั้งหมด ➔
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {latestEbooks.map(ebook => (
                <div key={ebook.id} className="card-medee" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '300px', width: '100%', padding: '1rem', background: '#f1f5f9' }}>
                    <img src={ebook.coverUrl} alt={ebook.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>{ebook.title}</h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ebook.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Posters Teaser */}
      {latestPosters.length > 0 && (
        <section style={{ padding: '4rem 1rem', background: 'white' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent)' }}>🖼️ โปสเตอร์ความรู้</h2>
              <Link href="/posters" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                ดูโปสเตอร์ทั้งหมด ➔
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {latestPosters.map(poster => (
                <div key={poster.id} className="card-medee" style={{ overflow: 'hidden' }}>
                  <div style={{ height: '300px', width: '100%' }}>
                    <img src={poster.imageUrl} alt={poster.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0, textAlign: 'center' }}>{poster.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Activities Teaser */}
      {latestActivities.length > 0 && (
        <section style={{ padding: '4rem 1rem', background: '#f8fafc' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-dark)' }}>🗓️ ภาพรวมกิจกรรมล่าสุด</h2>
              <Link href="/activities" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                ดูข่าวทั้งหมด ➔
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {latestActivities.map(act => (
                <div key={act.id} className="card-medee" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {act.imageUrl ? (
                    <div style={{ height: '200px', width: '100%' }}>
                      <img src={act.imageUrl} alt={act.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '200px', width: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#94a3b8' }}>ไม่มีรูปภาพ</span>
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{act.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      📅 {act.eventDate ? new Date(act.eventDate).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่'}<br/>
                      📍 {act.location || 'ไม่ระบุสถานที่'}
                    </p>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

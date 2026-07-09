import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const videoCount = await prisma.video.count();
  const ebookCount = await prisma.ebook.count();
  const posterCount = await prisma.poster.count();

  const latestActivities = await prisma.activity.findMany({
    orderBy: { eventDate: 'desc' },
    take: 3
  });

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

      <section style={{ padding: '5rem 1rem', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>เนื้อหาที่น่าสนใจ</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card-medee" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--primary)', fontSize: '1.75rem', marginBottom: '1rem' }}>วิดีโอ {videoCount} บทเรียน</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>เรียนรู้เคล็ดลับการดูแลสุขภาพจิตและกาย จากผู้เชี่ยวชาญ</p>
            </div>
            <div className="card-medee" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--secondary)', fontSize: '1.75rem', marginBottom: '1rem' }}>E-Book {ebookCount} เรื่อง</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>หนังสืออิเล็กทรอนิกส์อ่านสนุก พร้อมภาพประกอบสวยงาม</p>
            </div>
            <div className="card-medee" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--accent)', fontSize: '1.75rem', marginBottom: '1rem' }}>โปสเตอร์ {posterCount} แผ่น</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>สรุปความรู้แบบรวบรัด นำไปใช้ได้จริงในชีวิตประจำวัน</p>
            </div>
          </div>
        </div>
      </section>

      {latestActivities.length > 0 && (
        <section style={{ padding: '5rem 1rem', background: '#f8fafc' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>ภาพรวมกิจกรรมล่าสุด</h2>
              <Link href="/activities" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>
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

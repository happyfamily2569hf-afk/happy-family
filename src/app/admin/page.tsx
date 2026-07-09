import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const usersCount = await prisma.user.count();
  const coursesCount = await prisma.course.count();
  const ebooksCount = await prisma.ebook.count();
  const postersCount = await prisma.poster.count();
  const activitiesCount = await prisma.activity.count();

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '2rem' }}>
        ภาพรวมระบบ
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="card-medee" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '1rem' }}>ผู้ใช้งานทั้งหมด</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>{usersCount}</p>
        </div>
        
        <div className="card-medee" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '1rem' }}>หลักสูตรทั้งหมด</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary)', margin: 0 }}>{coursesCount}</p>
        </div>
        
        <div className="card-medee" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '1rem' }}>E-Book ทั้งหมด</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent)', margin: 0 }}>{ebooksCount}</p>
        </div>
        
        <div className="card-medee" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '1rem' }}>โปสเตอร์ทั้งหมด</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>{postersCount}</p>
        </div>

        <div className="card-medee" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '1rem' }}>ข่าวสาร/กิจกรรม</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#8b5cf6', margin: 0 }}>{activitiesCount}</p>
        </div>
      </div>
    </div>
  );
}

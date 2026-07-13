import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <main style={{ flex: 1, padding: '4rem 1rem', background: 'var(--bg-gradient)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
            โรงเรียนดิจิทัล <span style={{ color: 'var(--primary)' }}>ครอบครัวมีสุข</span>
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>เลือกหลักสูตรที่คุณสนใจเพื่อเริ่มต้นการเรียนรู้</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {courses.map(course => (
            <div key={course.id} className="card-medee" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                height: '200px', 
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem'
              }}>
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>📚</span>
                )}
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                  {course.title}
                </h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', flex: 1, lineHeight: 1.6 }}>
                  {course.description}
                </p>
                <Link href={`/courses/${course.id}`} className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                  เข้าสู่หลักสูตร
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

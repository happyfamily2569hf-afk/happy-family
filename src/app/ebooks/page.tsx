export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";

export default async function EbooksPage() {
  const ebooks = await prisma.ebook.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main style={{ flex: 1, padding: '4rem 1rem', background: 'var(--bg-gradient)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
            คลัง <span style={{ color: 'var(--primary)' }}>E-Book</span>
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>อ่านหนังสืออิเล็กทรอนิกส์สาระน่ารู้ได้ฟรี</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {ebooks.map((book) => (
            <div key={book.id} className="card-medee" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>{book.title}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{book.description}</p>
                <a href={book.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block', textDecoration: 'none' }}>อ่าน E-Book</a>
              </div>
            </div>
          ))}
          
          {ebooks.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
              ยังไม่มี E-Book ในระบบ
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

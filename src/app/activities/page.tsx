import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function ActivitiesPage() {
  const activities = await prisma.activity.findMany({
    orderBy: { eventDate: 'desc' }
  });

  return (
    <main style={{ flex: 1, padding: '4rem 1rem', background: 'var(--bg-gradient)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
            ข่าวสารและ<span style={{ color: 'var(--primary)' }}>กิจกรรม</span>
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>อัปเดตความเคลื่อนไหวและภาพบรรยากาศโครงการครอบครัวมีสุข</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {activities.map((act) => (
            <div key={act.id} className="card-medee" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {act.imageUrl ? (
                <div style={{ height: '220px', width: '100%' }}>
                  <img src={act.imageUrl} alt={act.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ height: '220px', width: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#94a3b8' }}>ไม่มีรูปภาพ</span>
                </div>
              )}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1rem' }}>{act.title}</h3>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                    📅 {act.eventDate ? new Date(act.eventDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : 'ไม่ระบุวันที่'}
                  </span>
                  {act.location && (
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                      📍 {act.location}
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1.6, flex: 1, whiteSpace: 'pre-wrap' }}>
                  {act.description}
                </p>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-light)', fontSize: '1.1rem' }}>
              ยังไม่มีข่าวกิจกรรมในขณะนี้
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

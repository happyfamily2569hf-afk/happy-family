export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import PosterGallery from "./PosterGallery";

export default async function PostersPage() {
  const posters = await prisma.poster.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main style={{ flex: 1, padding: '4rem 1rem', background: 'var(--bg-gradient)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
            สื่อความรู้ <span style={{ color: 'var(--primary)' }}>(โปสเตอร์)</span>
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>สรุปความรู้แบบรวบรัด นำไปใช้ได้จริงในชีวิตประจำวัน</p>
        </div>

        <PosterGallery posters={posters} />
      </div>
    </main>
  );
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect("/"); // Redirect non-admins to home
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--text-dark)', color: 'white', padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem', textAlign: 'center' }}>ระบบหลังบ้าน</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/admin" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', display: 'block' }} className="hover:bg-gray-700">
            📊 แดชบอร์ด
          </Link>
          <Link href="/admin/courses" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', display: 'block' }} className="hover:bg-gray-700">
            🎬 จัดการหลักสูตร
          </Link>
          <Link href="/admin/activities" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', display: 'block' }} className="hover:bg-gray-700">
            📰 ข่าวสาร/กิจกรรม
          </Link>
          <Link href="/admin/videos" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', display: 'block' }} className="hover:bg-gray-700">
            🎥 จัดการคลังวิดีโอ
          </Link>
          <Link href="/admin/ebooks" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', display: 'block' }} className="hover:bg-gray-700">
            📚 จัดการ E-Book
          </Link>
          <Link href="/admin/posters" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', display: 'block' }} className="hover:bg-gray-700">
            🖼️ จัดการโปสเตอร์
          </Link>
          <Link href="/" style={{ color: '#f87171', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', display: 'block', marginTop: '2rem' }} className="hover:bg-gray-700">
            ⬅️ กลับหน้าหลักเว็บ
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

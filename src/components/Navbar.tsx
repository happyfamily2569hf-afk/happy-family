"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={{ 
      background: 'var(--card-bg)', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '1px solid var(--card-border)',
      boxShadow: 'var(--card-shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img src="/logo.png" alt="ครอบครัวมีสุข โลโก้" style={{ height: '40px', width: 'auto' }} />
        <span style={{ color: 'var(--primary)' }}>ครอบครัวมีสุข</span>
      </Link>
      <div className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link href="/courses" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: 500 }}>หลักสูตรวิดีโอ</Link>
        <Link href="/ebooks" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: 500 }}>E-Book</Link>
        <Link href="/posters" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: 500 }}>สื่อความรู้</Link>
        <Link href="/activities" style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: 500 }}>ข่าวกิจกรรม</Link>
        {session ? (
          <>
            <Link href="/dashboard" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 500 }}>ความคืบหน้าของฉัน</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 500 }}>
                {session.user?.name || session.user?.email}
              </span>
              <button 
                onClick={() => signOut()}
                className="btn-outline"
                style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
              >
                ออกจากระบบ
              </button>
            </div>
          </>
        ) : (
          <Link href="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
            เข้าสู่ระบบ
          </Link>
        )}
      </div>
    </nav>
  );
}

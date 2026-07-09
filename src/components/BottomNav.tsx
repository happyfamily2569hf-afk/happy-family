"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: "หน้าแรก", href: "/", icon: "🏠" },
    { name: "หลักสูตร", href: "/courses", icon: "📚" },
    { name: "E-Book", href: "/ebooks", icon: "📖" },
    { name: "ข้อมูลฉัน", href: session ? "/dashboard" : "/login", icon: "👤" },
  ];

  return (
    <div className="mobile-only" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      zIndex: 50,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      height: '64px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '100%', 
              height: '100%', 
              textDecoration: "none",
              color: isActive ? '#10b981' : '#64748b'
            }}
          >
            <span style={{ fontSize: '1.5rem', marginBottom: '2px' }}>{item.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500 }}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

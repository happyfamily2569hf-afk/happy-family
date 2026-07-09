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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full text-center text-sm transition-colors ${
                isActive ? "text-[#10b981]" : "text-gray-500 hover:text-gray-900"
              }`}
              style={{ textDecoration: "none" }}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className={`text-[11px] font-medium ${isActive ? "font-bold" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

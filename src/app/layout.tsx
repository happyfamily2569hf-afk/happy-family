import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "ครอบครัวมีสุข - The Community Happiness Space",
  description: "ระบบนิเวศการเรียนรู้ตลอดชีวิตเพื่อพัฒนาทักษะสำหรับทุกคน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col pb-[64px] md:pb-0">
        <AuthProvider>
          <Navbar />
          {children}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}

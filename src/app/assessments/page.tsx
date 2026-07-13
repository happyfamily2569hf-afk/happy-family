"use client";

import Link from 'next/link';
import { FaHeartbeat, FaBrain, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function AssessmentsHub() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--primary)', padding: '2rem 1rem', color: 'white', borderRadius: '0 0 24px 24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 500 }}>
            <FaArrowLeft /> กลับหน้าหลัก
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>ศูนย์ประเมินสุขภาพ</h1>
          <p style={{ margin: 0, fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
            เครื่องมือประเมินสุขภาพกายและใจเบื้องต้น เพื่อให้คุณเข้าใจตัวเองและดูแลสุขภาพได้อย่างเหมาะสม
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Card 1: THI-15 */}
        <Link href="/assessments/thi15" style={{ textDecoration: 'none' }}>
          <div style={{ 
            backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', 
            gap: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer', border: '1px solid #e2e8f0'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#dcfce7', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <FaHeartbeat style={{ fontSize: '2rem', color: '#16a34a' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: 700 }}>แบบประเมินความสุข (THI-15)</h2>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
                ดัชนีชี้วัดความสุขคนไทย 15 ข้อ ค้นหาว่าสุขภาพจิตของคุณอยู่ในเกณฑ์ใด พร้อมรับคำแนะนำ
              </p>
            </div>
            <div style={{ color: 'var(--primary)', flexShrink: 0 }}>
              <FaArrowRight style={{ fontSize: '1.2rem' }} />
            </div>
          </div>
        </Link>

        {/* Card 2: ST-5 */}
        <Link href="/assessments/st5" style={{ textDecoration: 'none' }}>
          <div style={{ 
            backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', 
            gap: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer', border: '1px solid #e2e8f0'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#fee2e2', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>
              <FaBrain style={{ fontSize: '2rem', color: '#dc2626' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: 700 }}>แบบประเมินความเครียด (ST-5)</h2>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
                ตรวจเช็คระดับความเครียดเบื้องต้น 5 ข้อ ของกรมสุขภาพจิต ใช้เวลาเพียง 1 นาที
              </p>
            </div>
            <div style={{ color: 'var(--primary)', flexShrink: 0 }}>
              <FaArrowRight style={{ fontSize: '1.2rem' }} />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function CertificateContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "ผู้เข้าร่วมโครงการ";
  const course = searchParams.get("course") || "หลักสูตรครอบครัวมีสุข";
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    setDateStr(today.toLocaleDateString('th-TH', options));
    
    // Automatically trigger print dialog after a short delay for fonts/images to load
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5f9',
      padding: '2rem'
    }} className="print-wrapper">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-wrapper, .print-wrapper * {
            visibility: visible;
          }
          .print-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
            background: white !important;
            min-height: auto;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
      
      <div style={{
        width: '297mm', // A4 Landscape
        height: '210mm',
        background: 'white',
        position: 'relative',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: '20mm',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '10px solid var(--primary)',
        outline: '2px solid #10b981',
        outlineOffset: '-15px',
        fontFamily: "'Prompt', sans-serif"
      }}>
        {/* Certificate Decoration */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100px', background: 'var(--primary)', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100px', height: '100px', background: '#10b981', clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }} />
        
        <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '2px' }}>
          ประกาศนียบัตร
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: '#64748b', marginBottom: '3rem', fontWeight: 400 }}>
          ขอมอบประกาศนียบัตรฉบับนี้เพื่อแสดงว่า
        </h2>
        
        <div style={{ fontSize: '3.5rem', color: 'var(--text-dark)', fontWeight: 600, borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem', marginBottom: '2rem', minWidth: '50%', textAlign: 'center' }}>
          {name}
        </div>
        
        <p style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '1rem', textAlign: 'center', maxWidth: '80%' }}>
          ได้ผ่านการอบรมและเรียนรู้หลักสูตร
        </p>
        
        <h3 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '4rem', textAlign: 'center' }}>
          "{course}"
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 2rem', marginTop: 'auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '200px', borderBottom: '1px solid #94a3b8', marginBottom: '0.5rem', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', color: '#0f172a' }}>{dateStr}</span>
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>วันที่ให้ประกาศนียบัตร</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '200px', borderBottom: '1px solid #94a3b8', marginBottom: '0.5rem', height: '35px' }}>
              {/* Signature placeholder */}
            </div>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>ผู้อำนวยการโครงการ</p>
          </div>
        </div>
        
        <button 
          onClick={() => window.print()}
          className="btn-primary no-print"
          style={{ position: 'absolute', top: '-60px', right: '0' }}
        >
          🖨️ สั่งพิมพ์ (Print) / บันทึกเป็น PDF
        </button>
      </div>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>กำลังสร้างใบประกาศ...</div>}>
      <CertificateContent />
    </Suspense>
  );
}

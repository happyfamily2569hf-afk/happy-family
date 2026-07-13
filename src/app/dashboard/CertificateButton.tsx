"use client";

import { useState } from "react";

export default function CertificateButton({ userName, courseName }: { userName: string, courseName: string }) {
  const [showForm, setShowForm] = useState(false);
  const [certName, setCertName] = useState(userName);

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim()) {
      alert("กรุณากรอกชื่อ-นามสกุล");
      return;
    }
    // Redirect to printable certificate page
    const url = `/certificate?name=${encodeURIComponent(certName)}&course=${encodeURIComponent(courseName)}`;
    window.open(url, '_blank');
    setShowForm(false);
  };

  if (showForm) {
    return (
      <form onSubmit={handleGenerateCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 500, textAlign: 'left' }}>
          กรุณาตรวจสอบหรือแก้ไขชื่อ-นามสกุล<br/>เพื่อพิมพ์ลงบนใบประกาศนียบัตร:
        </label>
        <input 
          type="text" 
          placeholder="พิมพ์ชื่อ-นามสกุล ที่ต้องการแสดง" 
          className="input-medee" 
          value={certName}
          onChange={(e) => setCertName(e.target.value)}
          required
          style={{ fontSize: '1rem', padding: '0.75rem' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn-primary" style={{ background: '#16a34a', border: 'none', padding: '0.75rem', flex: 1, fontSize: '0.95rem' }}>
            ยืนยันและออกใบประกาศ
          </button>
          <button type="button" className="btn-outline" onClick={() => setShowForm(false)} style={{ padding: '0.75rem', fontSize: '0.95rem' }}>
            ยกเลิก
          </button>
        </div>
      </form>
    );
  }

  return (
    <button 
      onClick={() => setShowForm(true)}
      className="btn-primary" 
      style={{ background: '#16a34a', width: '100%', border: 'none' }}
    >
      🎓 รับใบประกาศนียบัตร
    </button>
  );
}

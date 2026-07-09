"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/upload";

export default function AdminPostersPage() {
  const [posters, setPosters] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    const res = await fetch("/api/posters");
    if (res.ok) {
      const data = await res.json();
      setPosters(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }

    setIsUploading(true);
    const imageUrl = await uploadFile(imageFile);

    if (!imageUrl) {
      alert("อัปโหลดไฟล์ล้มเหลว");
      setIsUploading(false);
      return;
    }

    const res = await fetch("/api/admin/posters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, imageUrl })
    });
    if (res.ok) {
      setTitle("");
      setImageFile(null);
      (e.target as HTMLFormElement).reset();
      fetchPosters();
      router.refresh();
    }
    setIsUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณต้องการลบโปสเตอร์นี้ใช่หรือไม่?")) {
      const res = await fetch(`/api/admin/posters?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPosters();
        router.refresh();
      }
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '2rem' }}>
        จัดการโปสเตอร์
      </h1>

      <div className="card-medee" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>เพิ่มโปสเตอร์ใหม่</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
          <input 
            type="text" 
            placeholder="ชื่อโปสเตอร์" 
            className="input-medee" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>รูปโปสเตอร์</label>
            <input 
              type="file" 
              accept="image/*"
              className="input-medee" 
              onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: 'fit-content' }} disabled={isUploading}>
            {isUploading ? 'กำลังอัปโหลด...' : '+ บันทึกโปสเตอร์'}
          </button>
        </form>
      </div>

      <div className="card-medee" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>รายการโปสเตอร์ทั้งหมด</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>ชื่อโปสเตอร์</th>
              <th style={{ padding: '1rem' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {posters.map(poster => (
              <tr key={poster.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>{poster.title}</td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => handleDelete(poster.id)} className="btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
            {posters.length === 0 && (
              <tr>
                <td colSpan={2} style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>ยังไม่มีข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/upload";

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [canvaUrl, setCanvaUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCanvaUrl, setEditCanvaUrl] = useState("");
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [isEditUploading, setIsEditUploading] = useState(false);

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    const res = await fetch("/api/ebooks");
    if (res.ok) {
      const data = await res.json();
      setEbooks(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile || !canvaUrl) {
      alert("กรุณากรอกข้อมูลและเลือกรูปปกให้ครบถ้วน");
      return;
    }
    
    setIsUploading(true);
    const coverUrl = await uploadFile(coverFile);

    if (!coverUrl) {
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูปปก");
      setIsUploading(false);
      return;
    }

    const res = await fetch("/api/admin/ebooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, coverUrl, fileUrl: canvaUrl })
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      setCanvaUrl("");
      setCoverFile(null);
      (e.target as HTMLFormElement).reset();
      fetchEbooks();
      router.refresh();
    }
    setIsUploading(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsEditUploading(true);

    let coverUrl = undefined;
    if (editCoverFile) {
      const uploadedUrl = await uploadFile(editCoverFile);
      if (uploadedUrl) coverUrl = uploadedUrl;
    }

    const res = await fetch("/api/admin/ebooks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: editingId, 
        title: editTitle, 
        description: editDescription,
        fileUrl: editCanvaUrl,
        coverUrl
      })
    });

    if (res.ok) {
      setEditingId(null);
      fetchEbooks();
      router.refresh();
    } else {
      alert("เกิดข้อผิดพลาดในการอัปเดต E-Book");
    }
    setIsEditUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณต้องการลบ E-Book นี้ใช่หรือไม่?")) {
      const res = await fetch(`/api/admin/ebooks?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEbooks();
        router.refresh();
      }
    }
  };

  const startEdit = (ebook: any) => {
    setEditingId(ebook.id);
    setEditTitle(ebook.title);
    setEditDescription(ebook.description);
    setEditCanvaUrl(ebook.fileUrl);
    setEditCoverFile(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '2rem' }}>
        จัดการ E-Book
      </h1>

      <div className="card-medee" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>เพิ่ม E-Book ใหม่</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
          <input 
            type="text" 
            placeholder="ชื่อหนังสือ" 
            className="input-medee" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          <textarea 
            placeholder="คำอธิบาย" 
            className="input-medee" 
            rows={3} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>รูปหน้าปกหนังสือ</label>
            <input 
              type="file" 
              accept="image/*"
              className="input-medee" 
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)} 
              required 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>ลิงก์ E-Book (เช่น ลิงก์จาก Canva)</label>
            <input 
              type="text" 
              placeholder="https://www.canva.com/..."
              className="input-medee" 
              value={canvaUrl}
              onChange={(e) => setCanvaUrl(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: 'fit-content' }} disabled={isUploading}>
            {isUploading ? 'กำลังอัปโหลด...' : '+ บันทึก E-Book'}
          </button>
        </form>
      </div>

      {editingId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card-medee" style={{ padding: '2rem', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>แก้ไข E-Book</h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="ชื่อหนังสือ" 
                className="input-medee" 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
                required 
              />
              <textarea 
                placeholder="คำอธิบาย" 
                className="input-medee" 
                rows={3} 
                value={editDescription} 
                onChange={(e) => setEditDescription(e.target.value)} 
                required 
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>เปลี่ยนรูปหน้าปก (เลือกเฉพาะเมื่อต้องการเปลี่ยน)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="input-medee" 
                  onChange={(e) => setEditCoverFile(e.target.files?.[0] || null)} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>ลิงก์ E-Book</label>
                <input 
                  type="text" 
                  className="input-medee" 
                  value={editCanvaUrl}
                  onChange={(e) => setEditCanvaUrl(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" disabled={isEditUploading}>
                  {isEditUploading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
                <button type="button" className="btn-outline" onClick={() => setEditingId(null)} disabled={isEditUploading}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card-medee" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>รายการ E-Book ทั้งหมด</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '1rem', width: '80px' }}>รูปปก</th>
              <th style={{ padding: '1rem' }}>ชื่อหนังสือ</th>
              <th style={{ padding: '1rem' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {ebooks.map(ebook => (
              <tr key={ebook.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>
                  {ebook.coverUrl ? (
                    <img src={ebook.coverUrl} alt="cover" style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '50px', height: '70px', background: '#e2e8f0', borderRadius: '4px' }} />
                  )}
                </td>
                <td style={{ padding: '1rem' }}>{ebook.title}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => startEdit(ebook)} className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>แก้ไข</button>
                    <button onClick={() => handleDelete(ebook.id)} className="btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444' }}>
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {ebooks.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>ยังไม่มีข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

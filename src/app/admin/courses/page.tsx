"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/upload";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  // New course form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Edit course state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [isEditUploading, setIsEditUploading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    if (res.ok) {
      const data = await res.json();
      setCourses(data);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let imageUrl = "";
    if (imageFile) {
      const uploadedUrl = await uploadFile(imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, imageUrl })
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      setImageFile(null);
      (e.target as HTMLFormElement).reset();
      fetchCourses();
      router.refresh();
    }
    setIsUploading(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsEditUploading(true);
    
    let imageUrl = undefined;
    if (editImageFile) {
      const uploadedUrl = await uploadFile(editImageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const res = await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: editingId, 
        title: editTitle, 
        description: editDescription,
        imageUrl
      })
    });

    if (res.ok) {
      setEditingId(null);
      fetchCourses();
      router.refresh();
    } else {
      alert("เกิดข้อผิดพลาดในการอัปเดตหลักสูตร");
    }
    setIsEditUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณต้องการลบหลักสูตรนี้ใช่หรือไม่?\n\nหมายเหตุ: วิดีโอที่อยู่ในหลักสูตรนี้จะไม่ถูกลบ แต่จะเปลี่ยนสถานะเป็น 'ยังไม่มีหลักสูตร' ในหน้าจัดการคลังวิดีโอ")) {
      const res = await fetch(`/api/admin/courses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCourses();
        router.refresh();
      } else {
        alert("ลบข้อมูลไม่สำเร็จ");
      }
    }
  };

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setEditTitle(c.title);
    setEditDescription(c.description);
    setEditImageFile(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '2rem' }}>
        จัดการหลักสูตร
      </h1>

      <div className="card-medee" style={{ padding: '2rem', marginBottom: '2rem', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>สร้างหลักสูตรใหม่</h2>
        <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" placeholder="ชื่อหลักสูตร" className="input-medee" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea placeholder="รายละเอียด" className="input-medee" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>รูปหน้าปกหลักสูตร (ถ้ามี)</label>
            <input type="file" accept="image/*" className="input-medee" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: 'fit-content' }} disabled={isUploading}>
            {isUploading ? 'กำลังอัปโหลด...' : '+ สร้างหลักสูตร'}
          </button>
        </form>
      </div>

      {editingId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card-medee" style={{ padding: '2rem', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>แก้ไขหลักสูตร</h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="ชื่อหลักสูตร" className="input-medee" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
              <textarea placeholder="รายละเอียด" className="input-medee" rows={3} value={editDescription} onChange={e => setEditDescription(e.target.value)} required />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>เปลี่ยนรูปหน้าปกใหม่ (เลือกเฉพาะเมื่อต้องการเปลี่ยน)</label>
                <input type="file" accept="image/*" className="input-medee" onChange={e => setEditImageFile(e.target.files?.[0] || null)} />
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
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>รายการหลักสูตรทั้งหมด ({courses.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '1rem', width: '80px' }}>รูปภาพ</th>
              <th style={{ padding: '1rem' }}>ชื่อหลักสูตร</th>
              <th style={{ padding: '1rem' }}>จำนวนวิดีโอ</th>
              <th style={{ padding: '1rem' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => {
              const totalVideos = course.subjects?.reduce((acc: number, s: any) => acc + (s.videos?.length || 0), 0) || 0;
              const totalSubjects = course.subjects?.length || 0;
              return (
              <tr key={course.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt="cover" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '60px', height: '40px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#64748b' }}>ไม่มีรูป</div>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>{course.title}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                    {totalSubjects} วิชา ({totalVideos} คลิป)
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => startEdit(course)} className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>แก้ไข</button>
                    <button onClick={() => handleDelete(course.id)} className="btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444' }}>ลบ</button>
                  </div>
                </td>
              </tr>
            );})}
            {courses.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>ยังไม่มีหลักสูตร</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

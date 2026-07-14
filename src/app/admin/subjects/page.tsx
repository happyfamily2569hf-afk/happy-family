"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { uploadFile } from "@/lib/upload";

export default function AdminSubjectsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCourseId, setEditCourseId] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api/courses");
    if (res.ok) {
      const data = await res.json();
      setCourses(data);
      
      const allSubjects = data.flatMap((c: any) => 
        (c.subjects || []).map((s: any) => ({ ...s, courseTitle: c.title }))
      );
      setSubjects(allSubjects);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      alert("กรุณาเลือกหลักสูตรที่วิชานี้สังกัดอยู่");
      return;
    }
    
    setIsSubmitting(true);
    let imageUrl = "";
    if (imageFile) {
      const uploadedUrl = await uploadFile(imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const res = await fetch("/api/admin/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, courseId, imageUrl })
    });
    
    if (res.ok) {
      setTitle("");
      setDescription("");
      setCourseId("");
      setImageFile(null);
      (e.target as HTMLFormElement).reset();
      fetchData();
      router.refresh();
    } else {
      alert("เกิดข้อผิดพลาดในการสร้างวิชา");
    }
    setIsSubmitting(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editCourseId) return;
    setIsSubmitting(true);

    let imageUrl = undefined;
    if (editImageFile) {
      const uploadedUrl = await uploadFile(editImageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const res = await fetch("/api/admin/subjects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: editingId, 
        title: editTitle, 
        description: editDescription,
        courseId: editCourseId,
        imageUrl
      })
    });

    if (res.ok) {
      setEditingId(null);
      fetchData();
      router.refresh();
    } else {
      alert("เกิดข้อผิดพลาดในการอัปเดตวิชา");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณต้องการลบวิชานี้ใช่หรือไม่?\n\nคำเตือน: วิดีโอที่อยู่ในวิชานี้จะไม่ถูกลบ แต่สถานะจะกลายเป็น 'ยังไม่จัดเข้าหลักสูตร'")) {
      const res = await fetch(`/api/admin/subjects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        router.refresh();
      } else {
        alert("ลบข้อมูลไม่สำเร็จ");
      }
    }
  };

  const startEdit = (s: any) => {
    setEditingId(s.id);
    setEditTitle(s.title);
    setEditDescription(s.description || "");
    setEditCourseId(s.courseId);
    setEditImageFile(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '2rem' }}>
        จัดการวิชา (Subjects)
      </h1>

      <div className="card-medee" style={{ padding: '2rem', marginBottom: '2rem', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>สร้างวิชาใหม่</h2>
        <form onSubmit={handleAddSubject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <select 
            className="input-medee" 
            value={courseId} 
            onChange={e => setCourseId(e.target.value)}
            required
          >
            <option value="">-- เลือกหลักสูตร --</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input type="text" placeholder="ชื่อวิชา" className="input-medee" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea placeholder="รายละเอียดวิชา (ถ้ามี)" className="input-medee" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>รูปหน้าปกวิชา (ถ้ามี)</label>
            <input type="file" accept="image/*" className="input-medee" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: 'fit-content' }} disabled={isSubmitting}>
            {isSubmitting ? 'กำลังบันทึก...' : '+ สร้างวิชา'}
          </button>
        </form>
      </div>

      {editingId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card-medee" style={{ padding: '2rem', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>แก้ไขวิชา</h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select 
                className="input-medee" 
                value={editCourseId} 
                onChange={e => setEditCourseId(e.target.value)}
                required
              >
                <option value="">-- เลือกหลักสูตร --</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <input type="text" placeholder="ชื่อวิชา" className="input-medee" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
              <textarea placeholder="รายละเอียด" className="input-medee" rows={2} value={editDescription} onChange={e => setEditDescription(e.target.value)} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>เปลี่ยนรูปหน้าปกวิชา (ถ้ามี)</label>
                <input type="file" accept="image/*" className="input-medee" onChange={e => setEditImageFile(e.target.files?.[0] || null)} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>บันทึกการแก้ไข</button>
                <button type="button" className="btn-outline" onClick={() => setEditingId(null)} disabled={isSubmitting}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card-medee" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>รายการวิชาทั้งหมด ({subjects.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>ชื่อวิชา</th>
              <th style={{ padding: '1rem' }}>สังกัดหลักสูตร</th>
              <th style={{ padding: '1rem' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(subject => (
              <tr key={subject.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>{subject.title}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                    {subject.courseTitle}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => startEdit(subject)} className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>แก้ไข</button>
                    <button onClick={() => handleDelete(subject.id)} className="btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444' }}>ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
            {subjects.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>ยังไม่มีวิชาในระบบ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

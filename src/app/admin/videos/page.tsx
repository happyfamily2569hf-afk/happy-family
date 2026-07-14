"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { uploadFile } from "@/lib/upload";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create video form
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Edit video state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editYoutubeId, setEditYoutubeId] = useState("");
  const [editSubjectId, setEditSubjectId] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [videosRes, coursesRes] = await Promise.all([
      fetch("/api/videos"),
      fetch("/api/courses")
    ]);
    
    if (videosRes.ok) {
      setVideos(await videosRes.json());
    }
    if (coursesRes.ok) {
      const data = await coursesRes.json();
      const allSubjects = data.flatMap((c: any) => 
        (c.subjects || []).map((s: any) => ({ ...s, courseTitle: c.title }))
      );
      setSubjects(allSubjects);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let imageUrl = "";
    if (imageFile) {
      const uploadedUrl = await uploadFile(imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title, 
        youtubeId, 
        imageUrl,
        subjectId: subjectId === "" ? null : subjectId 
      })
    });
    
    if (res.ok) {
      setTitle("");
      setYoutubeId("");
      setSubjectId("");
      setImageFile(null);
      (e.target as HTMLFormElement).reset();
      fetchData();
      router.refresh();
    } else {
      alert("เกิดข้อผิดพลาดในการเพิ่มวิดีโอ");
    }
    setIsSubmitting(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsSubmitting(true);

    let imageUrl = undefined;
    if (editImageFile) {
      const uploadedUrl = await uploadFile(editImageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const res = await fetch("/api/admin/videos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: editingId, 
        title: editTitle, 
        youtubeId: editYoutubeId,
        imageUrl,
        subjectId: editSubjectId === "" ? null : editSubjectId
      })
    });

    if (res.ok) {
      setEditingId(null);
      fetchData();
      router.refresh();
    } else {
      alert("เกิดข้อผิดพลาดในการอัปเดตวิดีโอ");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณต้องการลบวิดีโอนี้ออกจากระบบใช่หรือไม่?")) {
      const res = await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
        router.refresh();
      } else {
        alert("ลบข้อมูลไม่สำเร็จ");
      }
    }
  };

  const startEdit = (v: any) => {
    setEditingId(v.id);
    setEditTitle(v.title);
    setEditYoutubeId(v.youtubeId);
    setEditSubjectId(v.subjectId || "");
    setEditImageFile(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '2rem' }}>
        จัดการคลังวิดีโอ (Videos)
      </h1>

      <div className="card-medee" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>เพิ่มวิดีโอใหม่เข้าคลัง</h2>
        <form onSubmit={handleAddVideo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
          <input 
            type="text" 
            placeholder="ชื่อวิดีโอ/หัวข้อ" 
            className="input-medee" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="YouTube ID (เช่น dQw4w9WgXcQ)" 
            className="input-medee" 
            value={youtubeId} 
            onChange={e => setYoutubeId(e.target.value)} 
            required 
          />
          <select 
            className="input-medee" 
            value={subjectId} 
            onChange={e => setSubjectId(e.target.value)}
          >
            <option value="">-- ยังไม่จัดเข้าวิชาใดๆ (ว่าง) --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.courseTitle} - {s.title}</option>)}
          </select>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>ภาพปกวิดีโอ (ถ้ามี)</label>
            <input type="file" accept="image/*" className="input-medee" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'fit-content' }} disabled={isSubmitting}>
            {isSubmitting ? 'กำลังอัปโหลด...' : '+ อัปโหลดเข้าคลังวิดีโอ'}
          </button>
        </form>
      </div>

      {editingId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card-medee" style={{ padding: '2rem', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>แก้ไขวิดีโอ</h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="ชื่อวิดีโอ" 
                className="input-medee" 
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="YouTube ID" 
                className="input-medee" 
                value={editYoutubeId} 
                onChange={e => setEditYoutubeId(e.target.value)} 
                required 
              />
              <select 
                className="input-medee" 
                value={editSubjectId} 
                onChange={e => setEditSubjectId(e.target.value)}
              >
                <option value="">-- ยังไม่จัดเข้าวิชาใดๆ (ว่าง) --</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.courseTitle} - {s.title}</option>)}
              </select>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>เปลี่ยนภาพปกวิดีโอ (ถ้ามี)</label>
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
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>วิดีโอทั้งหมดในคลัง ({videos.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>ชื่อวิดีโอ</th>
              <th style={{ padding: '1rem' }}>YouTube ID</th>
              <th style={{ padding: '1rem' }}>วิชาที่สังกัด</th>
              <th style={{ padding: '1rem' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {videos.map(video => {
              const assignedSubject = subjects.find(s => s.id === video.subjectId);
              return (
                <tr key={video.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem' }}>{video.title}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{video.youtubeId}</td>
                  <td style={{ padding: '1rem' }}>
                    {video.subjectId && assignedSubject ? (
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                        {assignedSubject.courseTitle} &gt; {assignedSubject.title}
                      </span>
                    ) : (
                      <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                        ยังไม่จัดเข้าวิชา
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => startEdit(video)} className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>แก้ไข</button>
                      <button onClick={() => handleDelete(video.id)} className="btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444' }}>ลบ</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {videos.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>ยังไม่มีวิดีโอในคลัง</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

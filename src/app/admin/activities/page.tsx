"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/upload";

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // Create state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [isEditUploading, setIsEditUploading] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const res = await fetch("/api/activities");
    if (res.ok) {
      setActivities(await res.json());
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    setIsUploading(true);
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadFile(imageFile);
    }

    const res = await fetch("/api/admin/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title, 
        description, 
        location,
        eventDate: eventDate ? eventDate : null,
        imageUrl 
      })
    });
    
    if (res.ok) {
      setTitle("");
      setDescription("");
      setLocation("");
      setEventDate("");
      setImageFile(null);
      (e.target as HTMLFormElement).reset();
      fetchActivities();
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
      const uploaded = await uploadFile(editImageFile);
      if (uploaded) imageUrl = uploaded;
    }

    const res = await fetch("/api/admin/activities", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: editingId, 
        title: editTitle, 
        description: editDescription,
        location: editLocation,
        eventDate: editEventDate ? editEventDate : null,
        imageUrl
      })
    });

    if (res.ok) {
      setEditingId(null);
      fetchActivities();
      router.refresh();
    }
    setIsEditUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณต้องการลบข่าวกิจกรรมนี้ใช่หรือไม่?")) {
      const res = await fetch(`/api/admin/activities?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchActivities();
        router.refresh();
      }
    }
  };

  const startEdit = (a: any) => {
    setEditingId(a.id);
    setEditTitle(a.title);
    setEditDescription(a.description);
    setEditLocation(a.location || "");
    setEditEventDate(a.eventDate ? new Date(a.eventDate).toISOString().split('T')[0] : "");
    setEditImageFile(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '2rem' }}>
        จัดการข่าวสารและกิจกรรม
      </h1>

      <div className="card-medee" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>เพิ่มกิจกรรมใหม่</h2>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: '1 / -1' }}>
            <input type="text" placeholder="หัวข้อข่าว/กิจกรรม" className="input-medee" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea placeholder="รายละเอียด" className="input-medee" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          
          <input type="text" placeholder="สถานที่จัดกิจกรรม (ถ้ามี)" className="input-medee" value={location} onChange={e => setLocation(e.target.value)} />
          <input type="date" className="input-medee" value={eventDate} onChange={e => setEventDate(e.target.value)} />
          
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>รูปภาพกิจกรรม (ถ้ามี)</label>
            <input type="file" accept="image/*" className="input-medee" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          </div>

          <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', width: 'fit-content' }} disabled={isUploading}>
            {isUploading ? 'กำลังอัปโหลด...' : '+ สร้างข่าวกิจกรรม'}
          </button>
        </form>
      </div>

      {editingId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card-medee" style={{ padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>แก้ไขข่าวกิจกรรม</h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="หัวข้อข่าว" className="input-medee" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
              <textarea placeholder="รายละเอียด" className="input-medee" rows={3} value={editDescription} onChange={e => setEditDescription(e.target.value)} required />
              <input type="text" placeholder="สถานที่" className="input-medee" value={editLocation} onChange={e => setEditLocation(e.target.value)} />
              <input type="date" className="input-medee" value={editEventDate} onChange={e => setEditEventDate(e.target.value)} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>เปลี่ยนรูปภาพใหม่</label>
                <input type="file" accept="image/*" className="input-medee" onChange={e => setEditImageFile(e.target.files?.[0] || null)} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" disabled={isEditUploading}>บันทึก</button>
                <button type="button" className="btn-outline" onClick={() => setEditingId(null)} disabled={isEditUploading}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card-medee" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>กิจกรรมทั้งหมด ({activities.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {activities.map(act => (
            <div key={act.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              {act.imageUrl ? (
                <div style={{ height: '180px', width: '100%' }}>
                  <img src={act.imageUrl} alt={act.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ height: '180px', width: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  ไม่มีรูปภาพ
                </div>
              )}
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{act.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  📅 {act.eventDate ? new Date(act.eventDate).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่'} <br/>
                  📍 {act.location || 'ไม่ระบุสถานที่'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => startEdit(act)} className="btn-primary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.9rem' }}>แก้ไข</button>
                  <button onClick={() => handleDelete(act.id)} className="btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444' }}>ลบ</button>
                </div>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p style={{ color: '#64748b' }}>ยังไม่มีกิจกรรมในระบบ</p>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import YouTube, { YouTubePlayer } from "react-youtube";
import Link from "next/link";

export default function VideoPlayerClient({ 
  course, 
  subject,
  initialProgressMap,
  isLoggedIn 
}: { 
  course: any, 
  subject: any,
  initialProgressMap: Record<string, boolean>,
  isLoggedIn: boolean 
}) {
  const allVideos = subject.videos || [];
  const [activeVideo, setActiveVideo] = useState(allVideos[0] || null);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>(initialProgressMap);
  const [loading, setLoading] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  const router = useRouter();

  const allCompleted = allVideos.length > 0 && allVideos.every((v: any) => progressMap[v.id]);

  useEffect(() => {
    setCanComplete(false);
    setPlayer(null);
  }, [activeVideo]);

  useEffect(() => {
    if (!player) return;
    const interval = setInterval(async () => {
      try {
        const currentTime = await player.getCurrentTime();
        const duration = await player.getDuration();
        if (duration > 0 && currentTime / duration >= 0.8) {
          if (!canComplete) setCanComplete(true);
        }
      } catch (e) {}
    }, 1000);
    return () => clearInterval(interval);
  }, [player, canComplete]);

  const markComplete = async (videoId: string) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, completed: true })
      });
      if (res.ok) {
        setProgressMap(prev => ({ ...prev, [videoId]: true }));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (allVideos.length === 0) {
    return (
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href={`/courses/${course.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
            <span>← กลับไปหน้ารวมวิชาในหลักสูตร</span>
          </Link>
        </div>
        <p>ยังไม่มีวิดีโอในวิชานี้</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <Link href={`/courses/${course.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
            <span>← กลับไปหน้ารวมวิชา ({course.title})</span>
          </Link>
        </div>

        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', background: '#000', boxShadow: 'var(--card-shadow)' }}>
          {activeVideo && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <YouTube
                videoId={activeVideo.youtubeId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 0,
                    rel: 0
                  },
                }}
                onReady={(e) => setPlayer(e.target)}
                onStateChange={(e) => {
                  if (e.data === 0) setCanComplete(true);
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </div>
        <div className="card-medee" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0, marginBottom: '0.5rem' }}>
              {activeVideo?.title}
            </h2>
            {!progressMap[activeVideo?.id] && !canComplete && (
              <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', margin: 0 }}>
                💡 กรุณาดูวิดีโอให้จบเพื่อปลดล็อกปุ่มเรียนจบ
              </p>
            )}
          </div>
          
          {progressMap[activeVideo?.id] ? (
            <span className="badge-success" style={{ fontSize: '1.1rem', padding: '8px 16px' }}>
              ✅ เรียนจบแล้ว
            </span>
          ) : (
            <button 
              onClick={() => markComplete(activeVideo?.id)}
              disabled={loading || !canComplete}
              className="btn-secondary"
              style={{ 
                opacity: (!canComplete) ? 0.5 : 1,
                cursor: (!canComplete) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'กำลังบันทึก...' : 'คลิกเมื่อเรียนจบ'}
            </button>
          )}
        </div>

        {allCompleted && (
          <div className="card-medee" style={{ padding: '2rem', background: 'linear-gradient(to right, #dcfce7, #f0fdf4)', border: '1px solid #22c55e', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#166534', marginBottom: '1rem' }}>🎉 เยี่ยมมาก! คุณเรียนจบวิชานี้แล้ว</h3>
            <p style={{ color: '#15803d', marginBottom: '1.5rem' }}>คุณสามารถย้อนกลับไปหน้าเลือกวิชา เพื่อเรียนวิชาอื่นต่อได้เลยครับ</p>
            <Link 
              href={`/courses/${course.id}`} 
              className="btn-primary" 
              style={{ background: '#16a34a', border: 'none', display: 'inline-block', textDecoration: 'none' }}
            >
              กลับไปหน้าเลือกวิชา
            </Link>
          </div>
        )}
      </div>
      
      <div className="card-medee" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '1rem' }}>
          บทเรียนในวิชานี้
        </h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
            {subject.imageUrl && (
              <img 
                src={subject.imageUrl} 
                alt={subject.title} 
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} 
              />
            )}
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', margin: 0 }}>
              {subject.title}
            </h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {subject.videos?.map((v: any, vIdx: number) => (
              <div 
                key={v.id} 
                onClick={() => setActiveVideo(v)}
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  background: activeVideo?.id === v.id ? 'rgba(16, 185, 129, 0.1)' : 'white',
                  border: activeVideo?.id === v.id ? '1px solid var(--primary)' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                }}
                className={activeVideo?.id !== v.id ? 'hover:bg-gray-50' : ''}
              >
                <div style={{ width: '80px', height: '45px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', background: '#e2e8f0' }}>
                  <img 
                    src={v.imageUrl || `https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} 
                    alt={v.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem', color: activeVideo?.id === v.id ? 'var(--primary)' : 'var(--text-dark)' }}>
                    {vIdx + 1}. {v.title}
                  </span>
                  {progressMap[v.id] && <span style={{ fontSize: '0.75rem', color: '#10b981' }}>✅ เรียนจบแล้ว</span>}
                </div>
              </div>
            ))}
            {(!subject.videos || subject.videos.length === 0) && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', paddingLeft: '1rem' }}>ยังไม่มีเนื้อหา</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import YouTube, { YouTubePlayer } from "react-youtube";

export default function VideoPlayerClient({ 
  course, 
  initialProgressMap,
  isLoggedIn 
}: { 
  course: any, 
  initialProgressMap: Record<string, boolean>,
  isLoggedIn: boolean 
}) {
  const [activeVideo, setActiveVideo] = useState(course.videos[0]);
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>(initialProgressMap);
  const [loading, setLoading] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  
  const router = useRouter();

  // Reset completion unlock when changing video
  useEffect(() => {
    setCanComplete(false);
    setPlayer(null);
  }, [activeVideo]);

  // Track progress manually for YouTube iframe
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

  if (!course.videos || course.videos.length === 0) {
    return <p>ไม่มีวิดีโอในหลักสูตรนี้</p>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                  // YouTube.PlayerState.ENDED = 0
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
      </div>
      
      <div className="card-medee" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
          บทเรียนทั้งหมด
        </h3>
        {course.videos.map((v: any, index: number) => (
          <div 
            key={v.id} 
            onClick={() => setActiveVideo(v)}
            style={{ 
              padding: '1rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              background: activeVideo?.id === v.id ? 'rgba(16, 185, 129, 0.1)' : 'white',
              border: activeVideo?.id === v.id ? '1px solid var(--primary)' : '1px solid var(--card-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontWeight: 500, color: activeVideo?.id === v.id ? 'var(--primary)' : 'var(--text-dark)' }}>
              {index + 1}. {v.title}
            </span>
            {progressMap[v.id] && <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>✅ เรียนจบแล้ว</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

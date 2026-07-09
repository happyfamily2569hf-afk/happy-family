"use client";

import { useState } from "react";

export default function PosterGallery({ posters }: { posters: any[] }) {
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
        {posters.map((poster) => (
          <div 
            key={poster.id} 
            className="card-medee" 
            style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => setSelectedPoster(poster.imageUrl)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ height: '350px', width: '100%', position: 'relative' }}>
              <img 
                src={poster.imageUrl} 
                alt={poster.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-dark)', textAlign: 'center', margin: 0 }}>
                {poster.title}
              </h3>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--primary)', marginTop: '0.5rem', marginBottom: 0 }}>
                🔍 คลิกเพื่อขยาย
              </p>
            </div>
          </div>
        ))}

        {posters.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            ยังไม่มีโปสเตอร์ในระบบ
          </div>
        )}
      </div>

      {/* Modal / Lightbox */}
      {selectedPoster && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '2rem'
          }}
          onClick={() => setSelectedPoster(null)}
        >
          <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedPoster(null); }}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            <img 
              src={selectedPoster} 
              alt="Expanded Poster" 
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }} 
            />
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// Placeholder standard questions for PDDSQ 40-items (1-4 years)
const questions1to4 = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  text: `ข้อคำถามคัดกรองพัฒนาการ ข้อที่ ${i + 1} (เด็กตอบสนอง สื่อสาร หรือมีพฤติกรรมตามข้อนี้หรือไม่?)`
}));

// Placeholder standard questions for PDDSQ 40-items (4-18 years)
const questions4to18 = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  text: `ข้อคำถามคัดกรองพัฒนาการ ข้อที่ ${i + 1} (เด็กตอบสนอง สื่อสาร หรือมีพฤติกรรมตามข้อนี้หรือไม่?)`
}));

export default function PDDSQAssessment() {
  const [ageGroup, setAgeGroup] = useState<'1-4' | '4-18' | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number, level: string, text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestions = ageGroup === '1-4' ? questions1to4 : questions4to18;
  const cutoffScore = ageGroup === '1-4' ? 13 : 18;

  const handleSelect = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    for (const val of Object.values(answers)) {
      totalScore += val;
    }
    return totalScore;
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < 40) {
      alert("กรุณาตอบคำถามให้ครบทั้ง 40 ข้อครับ");
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();
    let level = "";
    let text = "";

    if (score >= cutoffScore) {
      level = "มีความเสี่ยง (เสี่ยงต่อ PDDs)";
      text = `เด็กมีคะแนน ${score} คะแนน (จุดตัดคือ ${cutoffScore}) ซึ่งจัดว่ามีความเสี่ยงต่อกลุ่มโรคพัฒนาการผิดปกติอย่างรอบด้าน (PDDs) เช่น ออทิสติก ควรปรึกษากุมารแพทย์หรือจิตแพทย์เด็ก`;
    } else {
      level = "อยู่ในเกณฑ์ปกติ";
      text = `เด็กมีคะแนน ${score} คะแนน (จุดตัดคือ ${cutoffScore}) ซึ่งอยู่ในเกณฑ์ปกติของการคัดกรองเบื้องต้น`;
    }

    setResult({ score, level, text });

    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentName: `PDDSQ-${ageGroup}`,
          answers,
          score,
          level,
          timestamp: new Date().toISOString()
        })
      });
      if (!response.ok) console.error("Failed to submit to Google Sheets");
    } catch (error) {
      console.error("Error submitting:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <Link href="/assessments" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <FaArrowLeft /> กลับ
          </Link>
          <h1 style={{ marginLeft: 'auto', fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>แบบคัดกรอง PDDs (PDDSQ)</h1>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        {!ageGroup ? (
          <div style={{ backgroundColor: 'white', padding: '3rem 2rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '1.5rem' }}>เลือกระดับอายุของผู้รับการประเมิน</h2>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setAgeGroup('1-4')}
                className="btn-primary"
                style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px' }}
              >
                เด็กอายุ 1-4 ปี
              </button>
              <button 
                onClick={() => setAgeGroup('4-18')}
                className="btn-outline"
                style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px', border: '2px solid var(--primary)', color: 'var(--primary)' }}
              >
                เด็กอายุ 4-18 ปี
              </button>
            </div>
          </div>
        ) : !result ? (
          <>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>
                  แบบประเมินสำหรับเด็กอายุ {ageGroup} ปี
                </h2>
                <button 
                  onClick={() => { setAgeGroup(null); setAnswers({}); }} 
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  เปลี่ยนช่วงอายุ
                </button>
              </div>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                กรุณาตอบคำถามโดยเลือก "ใช่/ทำบ่อยๆ" หรือ "ไม่ใช่/ไม่ค่อยทำ" ตามพฤติกรรมที่เกิดขึ้นจริง
                (ข้อความคำถามเป็นตัวอย่างชั่วคราว คุณสามารถนำคำถามฉบับเต็ม 40 ข้อมาใส่แทนที่ได้ในภายหลัง)
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {currentQuestions.map((q) => (
                <div key={q.id} style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontWeight: 500, color: '#1e293b', margin: 0 }}>
                    {q.id}. {q.text}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name={`q${q.id}`} 
                        checked={answers[q.id] === 1}
                        onChange={() => handleSelect(q.id, 1)}
                        style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--primary)' }}
                      />
                      <span>ใช่ / ทำบ่อยๆ</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginLeft: '1rem' }}>
                      <input 
                        type="radio" 
                        name={`q${q.id}`} 
                        checked={answers[q.id] === 0}
                        onChange={() => handleSelect(q.id, 0)}
                        style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--primary)' }}
                      />
                      <span>ไม่ใช่ / ไม่ค่อยทำ</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem', color: '#64748b' }}>ตอบแล้ว {Object.keys(answers).length} / 40 ข้อ</div>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '50px',
                  width: '100%', maxWidth: '300px'
                }}
              >
                {isSubmitting ? 'กำลังประมวลผล...' : 'ส่งแบบประเมิน'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '3rem 2rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            {result.score < cutoffScore ? (
              <FaCheckCircle style={{ fontSize: '4rem', color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
            ) : (
              <FaExclamationTriangle style={{ fontSize: '4rem', color: '#ef4444', margin: '0 auto 1.5rem' }} />
            )}
            
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>ผลการคัดกรอง PDDSQ ({ageGroup} ปี)</h2>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: result.score < cutoffScore ? 'var(--primary)' : '#ef4444', margin: '1rem 0' }}>
              {result.score} <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 500 }}>คะแนน</span>
            </div>
            
            <div style={{ 
              display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '50px', 
              backgroundColor: result.score < cutoffScore ? '#dcfce7' : '#fee2e2',
              color: result.score < cutoffScore ? '#166534' : '#991b1b',
              fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem'
            }}>
              {result.level}
            </div>

            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 2rem' }}>
              {result.text}
            </p>

            <button 
              onClick={() => {
                setAnswers({});
                setResult(null);
                setAgeGroup(null);
                window.scrollTo(0,0);
              }}
              className="btn-outline"
              style={{ padding: '0.75rem 2rem', borderRadius: '50px' }}
            >
              กลับหน้าหลัก PDDSQ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

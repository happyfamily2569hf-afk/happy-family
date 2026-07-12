"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const questions = [
  { id: 1, text: "มีปัญหาการนอน (นอนไม่หลับ หรือนอนมาก)" },
  { id: 2, text: "มีสมาธิน้อยลง" },
  { id: 3, text: "หงุดหงิด / กระวนกระวาย / ว้าวุ่นใจ" },
  { id: 4, text: "รู้สึกเบื่อ เซ็ง" },
  { id: 5, text: "ไม่อยากพบปะผู้คน" },
];

const options = [
  { value: 0, label: "แทบไม่มี (ไม่มีอาการ หรือ 1 ครั้ง)" },
  { value: 1, label: "เป็นบางครั้ง (มากกว่า 1 ครั้ง แต่ไม่บ่อย)" },
  { value: 2, label: "บ่อยครั้ง (เกือบทุกวัน)" },
  { value: 3, label: "เป็นประจำ (ทุกวัน)" },
];

export default function ST5Assessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number, level: string, text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    for (const q of questions) {
      totalScore += (answers[q.id] || 0);
    }
    return totalScore;
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("กรุณาตอบคำถามให้ครบทุกข้อครับ");
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();
    let level = "";
    let text = "";

    if (score <= 4) {
      level = "เครียดน้อย (ปกติ)";
      text = "คุณมีความเครียดในระดับปกติที่พบได้ในชีวิตประจำวัน สามารถจัดการและปรับตัวได้ด้วยตนเองครับ";
    } else if (score <= 7) {
      level = "เครียดปานกลาง";
      text = "ควรหาเวลาผ่อนคลายความเครียด เช่น พูดคุยระบายกับคนใกล้ชิด ฝึกหายใจคลายเครียด หรือทำกิจกรรมที่ช่วยให้สบายใจขึ้นครับ";
    } else if (score <= 9) {
      level = "เครียดมาก";
      text = "ควรหาทางจัดการความเครียดอย่างจริงจัง ปรับเปลี่ยนกิจกรรม หากความเครียดยังคงอยู่ควรปรึกษาบุคลากรสาธารณสุขหรือผู้เชี่ยวชาญครับ";
    } else {
      level = "เครียดมากที่สุด";
      text = "ระดับความเครียดส่งผลกระทบต่อร่างกายและจิตใจอย่างรุนแรง แนะนำให้พบแพทย์หรือผู้เชี่ยวชาญเพื่อรับคำปรึกษาครับ (สายด่วนสุขภาพจิต 1323)";
    }

    setResult({ score, level, text });

    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentName: 'ST-5',
          answers,
          score,
          level,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        console.error("Failed to submit to Google Sheets");
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <FaArrowLeft /> กลับหน้าหลัก
          </Link>
          <h1 style={{ marginLeft: 'auto', fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>แบบประเมินความเครียด (ST-5)</h1>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        
        {!result ? (
          <>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem' }}>คำชี้แจง</h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                ให้ท่านประเมินตนเองว่า ในช่วง 2-4 สัปดาห์ที่ผ่านมา ท่านมีความรู้สึกหรืออาการเหล่านี้บ่อยแค่ไหน
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {questions.map((q, index) => (
                <div key={q.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                  <p style={{ fontWeight: 600, color: '#1e293b', marginBottom: '1rem', fontSize: '1.05rem' }}>
                    ข้อ {index + 1}. {q.text}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {options.map((opt) => (
                      <label key={opt.value} style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.75rem', 
                        padding: '0.75rem 1rem', border: '1px solid',
                        borderColor: answers[q.id] === opt.value ? 'var(--primary)' : '#e2e8f0',
                        backgroundColor: answers[q.id] === opt.value ? '#f0fdf4' : 'transparent',
                        borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                      }}>
                        <input 
                          type="radio" 
                          name={`q${q.id}`} 
                          value={opt.value}
                          checked={answers[q.id] === opt.value}
                          onChange={() => handleSelect(q.id, opt.value)}
                          style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                        />
                        <span style={{ color: answers[q.id] === opt.value ? '#15803d' : '#334155', fontWeight: answers[q.id] === opt.value ? 600 : 400 }}>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--primary)', color: 'white', border: 'none',
                  padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '50px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', width: '100%', maxWidth: '300px'
                }}
              >
                {isSubmitting ? 'กำลังประมวลผล...' : 'ส่งแบบประเมิน'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '3rem 2rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            {result.score <= 4 ? (
              <FaCheckCircle style={{ fontSize: '4rem', color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
            ) : (
              <FaExclamationTriangle style={{ fontSize: '4rem', color: result.score <= 7 ? '#f59e0b' : '#ef4444', margin: '0 auto 1.5rem' }} />
            )}
            
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>ผลการประเมินของคุณ</h2>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: result.score <= 4 ? 'var(--primary)' : result.score <= 7 ? '#f59e0b' : '#ef4444', margin: '1rem 0' }}>
              {result.score} <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 500 }}>/ 15 คะแนน</span>
            </div>
            
            <div style={{ 
              display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '50px', 
              backgroundColor: result.score <= 4 ? '#dcfce7' : result.score <= 7 ? '#fef3c7' : '#fee2e2',
              color: result.score <= 4 ? '#166534' : result.score <= 7 ? '#92400e' : '#991b1b',
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
                window.scrollTo(0,0);
              }}
              style={{
                backgroundColor: 'transparent', color: 'var(--primary)', border: '2px solid var(--primary)',
                padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 600, borderRadius: '50px',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              ทำแบบประเมินอีกครั้ง
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

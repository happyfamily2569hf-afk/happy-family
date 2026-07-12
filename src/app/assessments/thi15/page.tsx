"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const questions = [
  { id: 1, text: "ท่านรู้สึกพึงพอใจในชีวิต", reverse: false },
  { id: 2, text: "ท่านรู้สึกผ่อนคลาย", reverse: false },
  { id: 3, text: "ท่านรู้สึกเบื่อหน่าย ท้อแท้กับการดำเนินชีวิตประจำวัน", reverse: true },
  { id: 4, text: "ท่านรู้สึกผิดหวังในตัวเอง", reverse: true },
  { id: 5, text: "ท่านรู้สึกว่าชีวิตมีแต่ความทุกข์", reverse: true },
  { id: 6, text: "ท่านสามารถทำใจยอมรับได้สำหรับปัญหาที่แก้ไขไม่ได้", reverse: false },
  { id: 7, text: "ท่านมั่นใจว่าจะสามารถควบคุมอารมณ์ได้เมื่อมีเหตุการณ์คับขันหรือร้ายแรงเกิดขึ้น", reverse: false },
  { id: 8, text: "ท่านมั่นใจที่จะเผชิญกับเหตุการณ์ร้ายแรงที่เกิดขึ้นในชีวิต", reverse: false },
  { id: 9, text: "ท่านรู้สึกเห็นอกเห็นใจเมื่อผู้อื่นมีความทุกข์", reverse: false },
  { id: 10, text: "ท่านรู้สึกเป็นสุขในการช่วยเหลือผู้อื่นที่มีปัญหา", reverse: false },
  { id: 11, text: "ท่านให้ความช่วยเหลือแก่ผู้อื่นเมื่อมีโอกาส", reverse: false },
  { id: 12, text: "ท่านรู้สึกภูมิใจในตนเอง", reverse: false },
  { id: 13, text: "ท่านรู้สึกมั่นคงปลอดภัยเมื่ออยู่ในครอบครัว", reverse: false },
  { id: 14, text: "หากท่านป่วยหนัก เชื่อว่าครอบครัวจะดูแลท่านเป็นอย่างดี", reverse: false },
  { id: 15, text: "สมาชิกในครอบครัวมีความรักและผูกพันต่อกัน", reverse: false },
];

const options = [
  { value: 1, label: "ไม่เลย" },
  { value: 2, label: "เล็กน้อย" },
  { value: 3, label: "มาก" },
  { value: 4, label: "มากที่สุด" },
];

export default function THI15Assessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number, level: string, text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    for (const q of questions) {
      const ans = answers[q.id] || 1; // Default to 1 if skipped (though we should validate)
      if (q.reverse) {
        // Reverse scoring: 1->4, 2->3, 3->2, 4->1
        totalScore += (5 - ans);
      } else {
        totalScore += ans;
      }
    }
    return totalScore;
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < questions.length) {
      alert("กรุณาตอบคำถามให้ครบทุกข้อครับ");
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();
    let level = "";
    let text = "";

    if (score >= 51) {
      level = "สุขภาพจิตดีกว่าคนทั่วไป (Good)";
      text = "ยอดเยี่ยมมากครับ! คุณมีภาวะสุขภาพจิตและความสุขในระดับที่ดีมาก ขอให้รักษาความสุขแบบนี้ต่อไปเรื่อยๆ นะครับ";
    } else if (score >= 44) {
      level = "สุขภาพจิตเท่ากับคนทั่วไป (Fair)";
      text = "คุณมีภาวะสุขภาพจิตอยู่ในเกณฑ์ปกติครับ สามารถดูแลจิตใจตนเองได้ดีในระดับหนึ่งครับ";
    } else {
      level = "สุขภาพจิตต่ำกว่าคนทั่วไป (Poor)";
      text = "คุณอาจกำลังมีความเครียดหรือความกังวลใจ แนะนำให้หาเวลาพักผ่อน หรือพูดคุยระบายความรู้สึกกับคนใกล้ชิด หากรู้สึกไม่ดีขึ้นสามารถปรึกษาผู้เชี่ยวชาญได้ครับ (สายด่วนสุขภาพจิต 1323)";
    }

    setResult({ score, level, text });
    setIsSubmitting(false);

    // TODO: Send data to Google Sheets API here
    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentName: 'THI-15',
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
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <FaArrowLeft /> กลับหน้าหลัก
          </Link>
          <h1 style={{ marginLeft: 'auto', fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>แบบประเมินความสุข (THI-15)</h1>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        
        {!result ? (
          <>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem' }}>คำชี้แจง</h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                ให้ท่านประเมินตนเองว่า ในช่วง 1 เดือนที่ผ่านมา ท่านมีความรู้สึกหรือความคิดเห็นตรงกับข้อความต่อไปนี้ในระดับใด 
                แล้วเลือกคำตอบที่ตรงกับตัวท่านมากที่สุด
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
            {result.score >= 44 ? (
              <FaCheckCircle style={{ fontSize: '4rem', color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
            ) : (
              <FaExclamationTriangle style={{ fontSize: '4rem', color: '#f59e0b', margin: '0 auto 1.5rem' }} />
            )}
            
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>ผลการประเมินของคุณ</h2>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', margin: '1rem 0' }}>
              {result.score} <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 500 }}>/ 60 คะแนน</span>
            </div>
            
            <div style={{ 
              display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '50px', 
              backgroundColor: result.score >= 51 ? '#dcfce7' : result.score >= 44 ? '#fef3c7' : '#fee2e2',
              color: result.score >= 51 ? '#166534' : result.score >= 44 ? '#92400e' : '#991b1b',
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

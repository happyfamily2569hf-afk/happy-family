"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const q1_7 = [
  { id: 1, text: "ส่วนใหญ่จะตื่นเช้ามาด้วยความรู้สึกสดชื่น กระปรี้กระเปร่า", yesScore: 2, noScore: 0 },
  { id: 2, text: "มักมีอาการหลับๆตื่นๆ", yesScore: 0, noScore: 2 },
  { id: 3, text: "มีกิจกรรมส่งเสริม ฝึกจิตใจ ฝึกสมาธิ อย่างน้อย 2 ครั้ง/สัปดาห์ (ทำสมาธิ สวดมนต์ เข้าโบสถ์)", yesScore: 2, noScore: 0 },
  { id: 4, text: "รู้สึกว่าโดยปกติสามารถจัดการความเครียดได้อย่างดี", yesScore: 3, noScore: 0 },
  { id: 5, text: "สามารถรับฟังความเห็นต่างของผู้อื่นเป็นส่วนใหญ่", yesScore: 2, noScore: 0 },
  { id: 6, text: "พูดคุย หรือ พบปะ กับเพื่อนสนิท คนในครอบครัว ≥ 3 ครั้ง/สัปดาห์", yesScore: 3, noScore: 0 },
  { id: 7, text: "สูบบุหรี่ บุหรี่ไฟฟ้า หรือ สารระเหย", yesScore: 0, noScore: 6 },
];

const q8_16 = [
  { 
    id: 8, 
    text: "จำนวนมื้ออาหาร ที่กินอาหารนอกบ้านหรือซื้ออาหารกล่อง/ถุงนอกบ้าน ใน 1 สัปดาห์",
    options: ["<1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
    scores: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    id: 9,
    text: "จำนวนวันที่ออกกำลังกายแบบแรงต้าน ใน 1 สัปดาห์ เช่น วิดพื้น ซิตอัพ สควอช",
    options: ["<1", "1", "2", "3", "4", "5", "6", "7"],
    scores: [0, 1, 2, 2, 2, 2, 2, 2] // The table is limited for days/week
  },
  {
    id: 10,
    text: "จำนวนแก้วที่ดื่มเครื่องดื่มรสหวานใน 1 สัปดาห์ เช่น น้ำผลไม้ กาแฟหรือชารสหวาน น้ำอัดลม",
    options: ["<1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
    scores: [3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    id: 11,
    text: "จำนวนชั่วโมงการนอนต่อวัน",
    options: ["<4", "4", "5", "6", "7", "8", "9", "10+"], // simplified from 0-10+ to match realistic hours
    scores: [0, 0, 0, 0, 5, 6, 6, 6]
  },
  {
    id: 12,
    text: "กินผลไม้ กี่ส่วน ต่อวัน (1 ส่วน = ผลไม้ขนาดเล็ก 6-8 ผล, กลาง 1 ผล, ใหญ่ 6-8 ชิ้น)",
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8+"],
    scores: [0, 0, 0, 2, 3, 2, 2, 0, 0]
  },
  {
    id: 13,
    text: "จำนวนชั่วโมงที่นั่งอยู่กับที่ต่อวัน",
    options: ["<1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
    scores: [3, 3, 3, 3, 3, 3, 1, 1, 0, 0, 0]
  },
  {
    id: 14,
    text: "จำนวน ดื่มมาตรฐาน (Standard Drink) ของเครื่องดื่มแอลกอฮอล์ต่อวัน (หากไม่ดื่มให้ใส่ 0)",
    options: ["0", "1 (หญิง)", "1 (ชาย)", "2 (ชาย)", ">2"],
    scores: [4, 4, 4, 0, 0] // logic from text is slightly ambiguous, standard safe limits used
  },
  {
    id: 15,
    text: "กินผัก กี่ส่วนต่อวัน (1 ส่วน = ผักสุก 1 ทัพพี, ผักดิบ 2 ทัพพี)",
    options: ["<1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
    scores: [0, 0, 1, 1, 2, 2, 3, 3, 3, 2, 2]
  },
  {
    id: 16,
    text: "จำนวนชั่วโมงต่อสัปดาห์ที่ออกกำลังกายชนิดแอโรบิก เช่น เดินเร็ว วิ่งเหยาะ ปั่นจักรยาน ว่ายน้ำ",
    options: ["< 30 นาที", "30 นาที", "45 นาที", "1 ชม", "1.5 ชม", "2 ชม", "2.5 ชม", "3 ชม", "3.5 ชม", "4 ชม", "4.5 ชม", "5+ ชม"],
    scores: [0, 1, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5]
  }
];

export default function LifestyleAssessment() {
  // Store the selected option index or identifier to avoid highlighting multiple options with same score
  const [answers, setAnswers] = useState<Record<number, { score: number, selected: string | number }>>({});
  const [result, setResult] = useState<{ score: number, level: string, text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (questionId: number, score: number, selected: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: { score, selected } }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    for (const val of Object.values(answers)) {
      totalScore += val.score;
    }
    return totalScore;
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < 16) {
      alert("กรุณาตอบคำถามให้ครบทั้ง 16 ข้อครับ");
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();
    let level = "";
    let text = "";

    if (score <= 20) {
      level = "ต่ำกว่าค่าเฉลี่ย";
      text = "เป็นโอกาสดีที่จะได้คำแนะนำจากผู้เชี่ยวชาญเพื่อช่วยให้คุณปรับวิถีชีวิต เพื่อพัฒนาสุขภาพให้ดีขึ้นได้อย่างชัดเจน";
    } else if (score <= 30) {
      level = "เท่าค่าเฉลี่ย";
      text = "คุณมีวิถีชีวิตที่เหมาะสม และดีในบางเรื่อง ซึ่งยังมีบางส่วนที่จะช่วยเสริมให้คุณมีสุขภาพดียิ่งขึ้น ลดความเสี่ยงการเกิดโรคในอนาคต";
    } else if (score <= 40) {
      level = "ดีมาก";
      text = "คุณมีวิถีชีวิตที่ดีต่อสุขภาพหลายด้าน มีแค่ส่วนน้อยที่คุณควรลองพิจารณาว่าจะสามารถพัฒนาให้ดียิ่งขึ้นไปได้อีกหรือไม่";
    } else {
      level = "ดีเยี่ยม";
      text = "คุณมีวิถีชีวิตที่ดีเยี่ยม มีแค่จุดเล็กๆน้อยๆที่คุณอาจจะเพิ่มเติมให้ดีเพิ่มขึ้นครบทุกด้าน";
    }

    setResult({ score, level, text });

    try {
      // Just extract scores for saving to API if needed, but we can pass the whole object
      const formattedAnswers = Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, v.score])
      );

      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentName: 'Lifestyle-Medicine',
          answers: formattedAnswers,
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
          <h1 style={{ marginLeft: 'auto', fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>เวชศาสตร์วิถีชีวิต</h1>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        {!result ? (
          <>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem' }}>คำชี้แจง</h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                แบบประเมินพฤติกรรมสุขภาพ เวชศาสตร์วิถีชีวิต (Lifestyle Assessment) 
                โปรดตอบคำถามโดยพิจารณาจากพฤติกรรมของคุณในช่วง 1 สัปดาห์ที่ผ่านมา
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Part 1: Yes/No Questions */}
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>ส่วนที่ 1: พฤติกรรมทั่วไป</h3>
                {q1_7.map((q) => (
                  <div key={q.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px dashed #e2e8f0' }}>
                    <p style={{ fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>ข้อ {q.id}. {q.text}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`q${q.id}`} 
                          checked={answers[q.id]?.selected === 'yes'}
                          onChange={() => handleSelect(q.id, q.yesScore, 'yes')}
                          style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                        />
                        <span>ใช่</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginLeft: '2rem' }}>
                        <input 
                          type="radio" 
                          name={`q${q.id}`} 
                          checked={answers[q.id]?.selected === 'no'}
                          onChange={() => handleSelect(q.id, q.noScore, 'no')}
                          style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                        />
                        <span>ไม่ใช่</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Part 2: Multiple Choice Questions */}
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>ส่วนที่ 2: ความถี่และปริมาณ</h3>
                {q8_16.map((q) => (
                  <div key={q.id} style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px dashed #e2e8f0' }}>
                    <p style={{ fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>ข้อ {q.id}. {q.text}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
                      {q.options.map((opt, idx) => (
                        <label key={opt} style={{ 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0.5rem', border: '1px solid',
                          borderColor: answers[q.id]?.selected === idx ? 'var(--primary)' : '#e2e8f0',
                          backgroundColor: answers[q.id]?.selected === idx ? '#f0fdf4' : 'transparent',
                          borderRadius: '8px', cursor: 'pointer', textAlign: 'center'
                        }}>
                          <input 
                            type="radio" 
                            name={`q${q.id}`} 
                            style={{ display: 'none' }}
                            onChange={() => handleSelect(q.id, q.scores[idx], idx)}
                          />
                          <span style={{ color: answers[q.id]?.selected === idx ? '#15803d' : '#334155', fontWeight: answers[q.id]?.selected === idx ? 600 : 400 }}>
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
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
            <FaCheckCircle style={{ fontSize: '4rem', color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>ผลการประเมินของคุณ</h2>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', margin: '1rem 0' }}>
              {result.score} <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 500 }}>/ 50 คะแนน</span>
            </div>
            
            <div style={{ 
              display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '50px', 
              backgroundColor: '#dcfce7', color: '#166534',
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
              className="btn-outline"
              style={{ padding: '0.75rem 2rem', borderRadius: '50px' }}
            >
              ทำแบบประเมินอีกครั้ง
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// CDI 27 items (Children's Depression Inventory) - Adapted Thai Version
const questions = [
  { id: 1, options: [{ text: "ฉันรู้สึกเศร้านานๆ ครั้ง", score: 0 }, { text: "ฉันรู้สึกเศร้าบ่อยครั้ง", score: 1 }, { text: "ฉันรู้สึกเศร้าตลอดเวลา", score: 2 }] },
  { id: 2, options: [{ text: "ไม่มีอะไรจะผิดพลาดสำหรับฉัน", score: 0 }, { text: "ฉันไม่แน่ใจว่าสิ่งต่างๆ จะเป็นไปด้วยดี", score: 1 }, { text: "ทุกสิ่งทุกอย่างผิดพลาดไปหมดสำหรับฉัน", score: 2 }] },
  { id: 3, options: [{ text: "ฉันทำสิ่งต่างๆ ได้ดีพอสมควร", score: 0 }, { text: "ฉันทำผิดพลาดหลายอย่าง", score: 1 }, { text: "ฉันทำทุกอย่างผิดพลาดไปหมด", score: 2 }] },
  { id: 4, options: [{ text: "ฉันสนุกกับหลายๆ อย่าง", score: 0 }, { text: "ฉันสนุกกับบางอย่างเท่านั้น", score: 1 }, { text: "ไม่มีอะไรที่ทำให้ฉันสนุกเลย", score: 2 }] },
  { id: 5, options: [{ text: "ฉันเป็นเด็กดี", score: 0 }, { text: "ฉันเป็นเด็กไม่ดีบ่อยครั้ง", score: 1 }, { text: "ฉันเป็นเด็กไม่ดีตลอดเวลา", score: 2 }] },
  { id: 6, options: [{ text: "บางครั้งฉันคิดว่าจะมีสิ่งไม่ดีเกิดขึ้นกับฉัน", score: 0 }, { text: "ฉันกังวลว่าจะมีสิ่งไม่ดีเกิดขึ้นกับฉัน", score: 1 }, { text: "ฉันแน่ใจว่าสิ่งเลวร้ายจะเกิดขึ้นกับฉัน", score: 2 }] },
  { id: 7, options: [{ text: "ฉันชอบตัวเอง", score: 0 }, { text: "ฉันไม่ชอบตัวเอง", score: 1 }, { text: "ฉันเกลียดตัวเอง", score: 2 }] },
  { id: 8, options: [{ text: "สิ่งไม่ดีที่เกิดขึ้นไม่ใช่ความผิดของฉัน", score: 0 }, { text: "สิ่งไม่ดีหลายอย่างที่เกิดขึ้นเป็นความผิดของฉัน", score: 1 }, { text: "สิ่งไม่ดีทุกอย่างที่เกิดขึ้นเป็นความผิดของฉันทั้งหมด", score: 2 }] },
  { id: 9, options: [{ text: "ฉันไม่เคยคิดจะฆ่าตัวตาย", score: 0 }, { text: "ฉันคิดถึงการฆ่าตัวตายแต่ไม่ทำ", score: 1 }, { text: "ฉันอยากฆ่าตัวตาย", score: 2 }] },
  { id: 10, options: [{ text: "ฉันรู้สึกอยากร้องไห้เป็นบางครั้ง", score: 0 }, { text: "ฉันรู้สึกอยากร้องไห้บ่อยครั้ง", score: 1 }, { text: "ฉันรู้สึกอยากร้องไห้ทุกวัน", score: 2 }] },
  { id: 11, options: [{ text: "สิ่งต่างๆ กวนใจฉันเป็นบางครั้ง", score: 0 }, { text: "สิ่งต่างๆ กวนใจฉันบ่อยครั้ง", score: 1 }, { text: "สิ่งต่างๆ กวนใจฉันตลอดเวลา", score: 2 }] },
  { id: 12, options: [{ text: "ฉันชอบอยู่กับคนอื่น", score: 0 }, { text: "ฉันไม่ค่อยอยากอยู่กับคนอื่นบ่อยนัก", score: 1 }, { text: "ฉันไม่อยากอยู่กับใครเลย", score: 2 }] },
  { id: 13, options: [{ text: "ฉันตัดสินใจเรื่องต่างๆ ได้", score: 0 }, { text: "ฉันตัดสินใจเรื่องต่างๆ ได้ลำบาก", score: 1 }, { text: "ฉันไม่สามารถตัดสินใจอะไรได้เลย", score: 2 }] },
  { id: 14, options: [{ text: "ฉันดูดี", score: 0 }, { text: "มีบางอย่างที่น่าเกลียดเกี่ยวกับตัวฉัน", score: 1 }, { text: "ฉันดูน่าเกลียด", score: 2 }] },
  { id: 15, options: [{ text: "ฉันไม่ต้องพยายามมากในการทำการบ้าน", score: 0 }, { text: "ฉันต้องพยายามอย่างมากในการทำการบ้าน", score: 1 }, { text: "ฉันทำการบ้านไม่ได้เลย", score: 2 }] },
  { id: 16, options: [{ text: "ฉันนอนหลับได้ดีตามปกติ", score: 0 }, { text: "ฉันนอนหลับยากในหลายๆ คืน", score: 1 }, { text: "ฉันนอนไม่หลับเลย", score: 2 }] },
  { id: 17, options: [{ text: "ฉันรู้สึกเหนื่อยเป็นบางครั้ง", score: 0 }, { text: "ฉันรู้สึกเหนื่อยบ่อยครั้ง", score: 1 }, { text: "ฉันรู้สึกเหนื่อยตลอดเวลา", score: 2 }] },
  { id: 18, options: [{ text: "ฉันกินอาหารได้ตามปกติ", score: 0 }, { text: "ฉันกินอาหารได้น้อยลง", score: 1 }, { text: "ฉันไม่อยากกินอะไรเลย", score: 2 }] },
  { id: 19, options: [{ text: "ฉันไม่กังวลเรื่องความเจ็บป่วย", score: 0 }, { text: "ฉันกังวลเรื่องความเจ็บป่วยบ่อยครั้ง", score: 1 }, { text: "ฉันกังวลเรื่องความเจ็บป่วยตลอดเวลา", score: 2 }] },
  { id: 20, options: [{ text: "ฉันไม่รู้สึกเหงา", score: 0 }, { text: "ฉันรู้สึกเหงาบ่อยครั้ง", score: 1 }, { text: "ฉันรู้สึกเหงาตลอดเวลา", score: 2 }] },
  { id: 21, options: [{ text: "ฉันสนุกสนานที่โรงเรียน", score: 0 }, { text: "ฉันสนุกสนานที่โรงเรียนเป็นบางครั้ง", score: 1 }, { text: "ฉันไม่สนุกสนานที่โรงเรียนเลย", score: 2 }] },
  { id: 22, options: [{ text: "ฉันมีเพื่อนเยอะ", score: 0 }, { text: "ฉันมีเพื่อนน้อยและอยากมีมากกว่านี้", score: 1 }, { text: "ฉันไม่มีเพื่อนเลย", score: 2 }] },
  { id: 23, options: [{ text: "ผลการเรียนของฉันดี", score: 0 }, { text: "ผลการเรียนของฉันไม่ดีเท่าที่เคยเป็น", score: 1 }, { text: "ผลการเรียนของฉันแย่มากในวิชาที่เคยทำได้ดี", score: 2 }] },
  { id: 24, options: [{ text: "ฉันทำสิ่งต่างๆ ได้ดีเท่ากับเด็กคนอื่นๆ", score: 0 }, { text: "ฉันทำสิ่งต่างๆ ได้ไม่ดีเท่าเด็กคนอื่นๆ", score: 1 }, { text: "ฉันทำอะไรไม่ได้เรื่องเลยเมื่อเทียบกับเด็กคนอื่นๆ", score: 2 }] },
  { id: 25, options: [{ text: "มีคนรักฉัน", score: 0 }, { text: "ฉันไม่แน่ใจว่ามีคนรักฉันไหม", score: 1 }, { text: "ไม่มีใครรักฉันเลย", score: 2 }] },
  { id: 26, options: [{ text: "ฉันมักจะทำในสิ่งที่คนอื่นบอกให้ทำ", score: 0 }, { text: "ฉันไม่ค่อยทำในสิ่งที่คนอื่นบอกให้ทำ", score: 1 }, { text: "ฉันไม่เคยทำในสิ่งที่คนอื่นบอกให้ทำเลย", score: 2 }] },
  { id: 27, options: [{ text: "ฉันเข้ากับผู้คนได้ดี", score: 0 }, { text: "ฉันทะเลาะกับคนอื่นบ่อยครั้ง", score: 1 }, { text: "ฉันทะเลาะกับคนอื่นตลอดเวลา", score: 2 }] }
];

export default function CDIAssessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number, level: string, text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (Object.keys(answers).length < questions.length) {
      alert("กรุณาตอบคำถามให้ครบทั้ง 27 ข้อครับ");
      return;
    }

    setIsSubmitting(true);
    const score = calculateScore();
    let level = "";
    let text = "";

    if (score < 15) {
      level = "อยู่ในเกณฑ์ปกติ";
      text = "เด็กไม่มีภาวะซึมเศร้าที่น่าเป็นห่วง สามารถใช้ชีวิตและปรับตัวได้ตามปกติ";
    } else {
      level = "มีความเสี่ยงภาวะซึมเศร้า";
      text = "เด็กมีคะแนนตั้งแต่ 15 คะแนนขึ้นไป ซึ่งบ่งบอกถึงความเสี่ยงของภาวะซึมเศร้า ควรได้รับการประเมินเพิ่มเติมโดยจิตแพทย์เด็กและวัยรุ่น หรือนักจิตวิทยา";
    }

    setResult({ score, level, text });

    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentName: 'CDI',
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
          <h1 style={{ marginLeft: 'auto', fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>แบบประเมินภาวะซึมเศร้าในเด็ก (CDI)</h1>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        {!result ? (
          <>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '1rem' }}>คำชี้แจง</h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                แบบประเมินภาวะซึมเศร้าในเด็ก (Children’s Depression Inventory) 
                กรุณาเลือกข้อความที่ตรงกับความรู้สึกของเด็กมากที่สุดในช่วง 2 สัปดาห์ที่ผ่านมา
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {questions.map((q, index) => (
                <div key={q.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                    ข้อที่ {index + 1}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {q.options.map((opt, optIndex) => (
                      <label key={optIndex} style={{ 
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '1rem', border: '1px solid',
                        borderColor: answers[q.id] === opt.score ? 'var(--primary)' : '#e2e8f0',
                        backgroundColor: answers[q.id] === opt.score ? '#f0fdf4' : 'transparent',
                        borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                      }}>
                        <input 
                          type="radio" 
                          name={`q${q.id}`} 
                          checked={answers[q.id] === opt.score}
                          onChange={() => handleSelect(q.id, opt.score)}
                          style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)', flexShrink: 0 }}
                        />
                        <span style={{ color: answers[q.id] === opt.score ? '#15803d' : '#334155', fontWeight: answers[q.id] === opt.score ? 500 : 400 }}>
                          {opt.text}
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
            {result.score < 15 ? (
              <FaCheckCircle style={{ fontSize: '4rem', color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
            ) : (
              <FaExclamationTriangle style={{ fontSize: '4rem', color: '#ef4444', margin: '0 auto 1.5rem' }} />
            )}
            
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.5rem' }}>ผลการประเมิน CDI</h2>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: result.score < 15 ? 'var(--primary)' : '#ef4444', margin: '1rem 0' }}>
              {result.score} <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 500 }}>/ 54 คะแนน</span>
            </div>
            
            <div style={{ 
              display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '50px', 
              backgroundColor: result.score < 15 ? '#dcfce7' : '#fee2e2',
              color: result.score < 15 ? '#166534' : '#991b1b',
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

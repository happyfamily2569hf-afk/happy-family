"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// PDDSQ 1-4 years
const q1to4_text = [
  "ตอบสนองเช่นหันมามองทันทีที่ท่านเรียกชื่อเขา",
  "สามารถเล่นสมมติเป็นเช่นทำท่าป้อนอาหารให้ตุ๊กตาเล่นขายของหรือสมมติเป็นสิ่งอื่น",
  "ชอบให้พ่อแม่อุ้มกอดหรือจูบ",
  "ใช้นิ้วชี้ของเขาชี้ไปที่สิ่งของเพื่อแสดงว่าเขาสนใจหรือต้องการสิ่งนั้น",
  "สนใจอยากเข้าไปเล่นกับเด็กคนอื่นเวลาไปโรงเรียนหรืออยู่ในสนามเด็กเล่น",
  "ปรับตัวยากต่อสิ่งใหม่ๆเช่นไม่ยอมลองอาหารใหม่ร้องไห้เวลาไปที่ไม่เคยไป",
  "ชอบที่จะเล่นคนเดียวหรืออยู่คนเดียวตามลำพัง",
  "เป็นเด็กหน้าเฉยๆ ไม่ค่อยแสดงอารมณ์",
  "ชอบพูดทวนคำที่คนพูดจบ บ่อยๆ",
  "ร้องไห้อุดหูหรือวิ่งหนีเวลาได้ยินเสียงดังๆ",
  "ยิ้มเวลาเห็นหน้าคนหรือยิ้มตอบเวลาเห็นคนยิ้ม",
  "สามารถทำท่าเลียนแบบผู้ใหญ่เช่นแต่งหน้าหวีผมโกนหนวดเตรียมตัวไปทำงาน",
  "รู้จักแบ่งขนมหรือของเล่นให้เด็กคนอื่น",
  "วิ่งเข้ามาหาคนเพื่อขอความช่วยเหลือหรือให้คนปลอบเวลาได้รับบาดเจ็บหรืออุบัติเหตุ",
  "พยักหน้าหรือส่ายหน้าเพื่อบอกกับคนว่าเอาหรือไม่เอา",
  "ทำท่าทางเหมือนไม่ได้ฟังคนเวลาคนพูดกับเขา",
  "สนใจที่จะเล่นกับเด็กคนอื่นน้อยมาก",
  "ชอบทำตาลอยหรือจ้องมองโดยไร้จุดหมาย",
  "ชอบเอาของเล่นมาเรียงเป็นแถวเป็นแนวและจะโมโหมากถ้ามีใครมาจัดใหม่",
  "ยังบอกไม่ได้ว่าต้องการอะไรไม่ว่าจะด้วยการพูดหรือชี้",
  "พยายามทำให้คนสนใจในสิ่งที่เขากำลังทำอยู่โดยการเรียกคนหรือยื่นของสิ่งนั้นให้คนดู",
  "ตอบสนองอย่างเหมาะสมเช่นมองหน้าสบตายิ้มหรือยื่นของเล่นให้เวลามีเด็กอื่นเดินเข้ามาหา",
  "เลียนแบบท่าทางคนเช่นแลบลิ้นตามเวลาที่คนแลบลิ้นให้เขา",
  "มองหน้าสบตาคนเวลาคนพูดคุยหรือเล่นกับเขา",
  "เวลาคนชี้ให้เขาดูของที่น่าสนใจเช่นเครื่องบินของเล่นเขามองตามทิศทางที่ชี้ไปได้อย่างถูกต้อง",
  "คนเคยสงสัยว่าเขาอาจจะหูหนวก",
  "กิจวัตรประจำวันที่ทำให้เขาต้องทำเหมือนๆเดิมหรือมีรูปแบบเฉพาะตัวเปลี่ยนแปลงไม่ได้",
  "ทำท่าทางแปลกๆซ้ำๆเช่นโยกตัวเดินเขย่งเท้าสะบัดมือ",
  "ดูเป็นเด็ก \"เจ้าอารมณ์\" มากกว่าเด็กคนอื่นในวัยเดียวกัน",
  "จับมือคนไปหยิบของที่เขาอยากได้โดยไม่มองหน้าคน",
  "ชอบเข้ามาแสดงความรักกับพ่อแม่โดยการกอดหอมซบตัก",
  "ใช้นิ้วชี้ของเขาชี้ให้คนมองของบางสิ่งบางอย่างที่อยู่ไกลออกไป",
  "ยิ้มให้พ่อแม่เมื่อเห็นพ่อแม่มาแต่ไกล",
  "รู้จักปลอบเด็กคนอื่นเวลาเด็กคนอื่นไม่สบายใจหรือได้รับบาดเจ็บ",
  "มองสิ่งของที่คนกำลังมองอยู่หรือสนใจในสิ่งเดียวกันกับสิ่งที่คนกำลังสนใจ",
  "ชอบทำอะไรซ้ำๆหรือพูดประโยคซ้ำๆ",
  "คนเคยรู้สึกว่าลูกพูดช้าหรือเคยกังวลว่าทำไมลูกยังไม่พูดเสียที",
  "ดูไม่ค่อยเดือดร้อนหรือไม่ค่อยสนใจว่าคนกำลังอยู่หรือไม่อยู่กับเขา",
  "มีความสนใจในของเล่นไม่กี่ชิ้นหรือสิ่งต่างๆไม่กี่เรื่อง",
  "เล่นของเล่นไม่เป็นเช่นมักจะเอามาเคาะหมุนถือไปถือมาหรือเอาเข้าปาก"
];
// Group 1 (risk if yes = 1): 6, 7, 8, 9, 10, 16, 17, 18, 19, 20, 26, 27, 28, 29, 30, 36, 37, 38, 39, 40
const group1_1to4 = [6, 7, 8, 9, 10, 16, 17, 18, 19, 20, 26, 27, 28, 29, 30, 36, 37, 38, 39, 40];

const questions1to4 = q1to4_text.map((text, i) => {
  const id = i + 1;
  const isGroup1 = group1_1to4.includes(id);
  return {
    id,
    text,
    yesScore: isGroup1 ? 1 : 0,
    noScore: isGroup1 ? 0 : 1
  };
});

// PDDSQ 4-18 years
const q4to18_text = [
  "เลียนแบบกิริยาท่าทางของคนอื่นได้",
  "ชอบเก็บตัวหรืออยู่คนเดียวตามลำพัง",
  "มีเพื่อนสนิทหรือเพื่อนที่เล่นด้วยกันบ่อยๆ",
  "รู้จักปลอบเด็กคนอื่นเวลาเด็กคนอื่นไม่สบายใจหรือได้รับบาดเจ็บ",
  "ใช้ภาษาหรือคำพูดที่ฟังแล้วแปลกๆ",
  "ใช้คำพูดที่มีแต่ตัวเขาเองเท่านั้นที่เข้าใจความหมาย",
  "เป็นเด็กหน้าเฉยไม่ค่อยแสดงอารมณ์",
  "ชอบจำแต่สิ่งไร้สาระหรือสิ่งที่ไม่มีประโยชน์",
  "ใช้ภาษาที่ไม่ค่อยเหมาะสมกับกาลเทศะหรือผู้ฟัง",
  "รู้จักสงสารหรือเห็นอกเห็นใจผู้อื่น",
  "ชอบพูดวิจารณ์หรือแซวคนอื่นแรงๆให้อับอาย",
  "ต้องการเข้าสังคมหรือเล่นกับเด็กคนอื่นแต่ไม่รู้จะเริ่มอย่างไร",
  "เล่นกับเด็กคนอื่นได้แต่ต้องเล่นเฉพาะสิ่งที่ตัวเขาเองอยากเล่นเท่านั้น",
  "มีอารมณ์ขันสามารถเข้าใจเรื่องตลกได้",
  "รู้ว่าอะไรสมควรทำอะไรไม่สมควรทำ",
  "เล่นกีฬาที่ต้องเล่นเป็นทีมเช่นฟุตบอลบาสเกตบอลได้ไม่ดี",
  "งุ่มง่ามเก้งก้างซุ่มซ่ามมากกว่าเด็กคนอื่นในวัยเดียวกัน",
  "ชอบคิดอะไรซ้ำๆวนเวียนหรือทำอะไรซ้ำๆหลายๆครั้ง",
  "ไม่ยอมให้มีการเปลี่ยนแปลงของสิ่งที่คุ้นเคย",
  "ผูกพันกับสิ่งของบางอย่างมากเป็นพิเศษ",
  "ถูกเด็กอื่นแกล้งหรือถูกล้อเลียนบ่อยๆ",
  "ชอบถามคำถามเดิมซ้ำๆ",
  "คนเคยรู้สึกว่าลูกพูดช้าหรือเคยกังวลว่าทำไมลูกยังไม่พูดเสียที",
  "ดูเป็นเด็ก \"เจ้าอารมณ์\" มากกว่าเด็กคนอื่นในวัยเดียวกัน",
  "ไม่ค่อยรับรู้ว่าคนอื่นกำลังคิดหรือรู้สึกอย่างไร",
  "สีหน้ามักไม่ไปกับสิ่งที่เขากำลังพูด",
  "มีความสุขเวลาที่ได้อยู่คนเดียวมากกว่าเวลาอยู่เป็นกลุ่มกับคนอื่น",
  "ไม่ค่อยรู้ตัวว่ากำลังถูกเด็กคนอื่นหลอกหรือเอาเปรียบ",
  "สามารถบอกอารมณ์หรือความรู้สึกของตัวเองให้คนอื่นรู้ได้",
  "สามารถสังเกตเข้าใจสีหน้าและอารมณ์ของคนรอบข้าง",
  "ชอบพูดเฉพาะเรื่องที่ตนเองสนใจโดยไม่สังเกตว่าเพื่อนเริ่มเบื่อไม่อยากฟัง",
  "ไม่ค่อยฟังเพื่อนถ้าเพื่อนไม่ได้พูดในสิ่งที่เขาสนใจ",
  "มองหน้าสบตาผู้ฟังทุกครั้งเวลาพูดคุย",
  "เข้ากับเพื่อนได้ยากแม้ว่าเขาจะพยายามเต็มที่",
  "มักถูกเด็กคนอื่นมองว่าเป็น \"ตัวตลก\" หรือ \"ตัวประหลาด\"",
  "ชอบเล่นเป็นกลุ่มกับเพื่อน",
  "ต่อต้านปรับตัวไม่ได้เวลาที่มีการเปลี่ยนแปลงของสิ่งที่ทำอยู่ประจำ",
  "สนใจในสิ่งต่างๆเพียงไม่กี่อย่าง",
  "เดินผ่าตรงกลางที่คนสองคนกำลังคุยกัน",
  "ตรงไปตรงมาไม่รู้จักยืดหยุ่น"
];
// Group 1 (risk if yes = 1): 2,5,6,7,8,9,11,12,13,16,17,18,19,20,21,22,23,24,25,26,27,28,31,32,34,35,37,38,39,40
const group1_4to18 = [2,5,6,7,8,9,11,12,13,16,17,18,19,20,21,22,23,24,25,26,27,28,31,32,34,35,37,38,39,40];

const questions4to18 = q4to18_text.map((text, i) => {
  const id = i + 1;
  const isGroup1 = group1_4to18.includes(id);
  return {
    id,
    text,
    yesScore: isGroup1 ? 1 : 0,
    noScore: isGroup1 ? 0 : 1
  };
});

export default function PDDSQAssessment() {
  const [ageGroup, setAgeGroup] = useState<'1-4' | '4-18' | null>(null);
  // Store answer value to properly handle re-renders and highlights
  const [answers, setAnswers] = useState<Record<number, { score: number, value: 'yes' | 'no' }>>({});
  const [result, setResult] = useState<{ score: number, level: string, text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestions = ageGroup === '1-4' ? questions1to4 : questions4to18;
  const cutoffScore = ageGroup === '1-4' ? 13 : 18;

  const handleSelect = (questionId: number, score: number, value: 'yes' | 'no') => {
    setAnswers(prev => ({ ...prev, [questionId]: { score, value } }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    for (const val of Object.values(answers)) {
      totalScore += val.score;
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
      const formattedAnswers = Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, v.score])
      );

      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentName: `PDDSQ-${ageGroup}`,
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
                        checked={answers[q.id]?.value === 'yes'}
                        onChange={() => handleSelect(q.id, q.yesScore, 'yes')}
                        style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--primary)' }}
                      />
                      <span>ใช่ / ทำบ่อยๆ</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginLeft: '1rem' }}>
                      <input 
                        type="radio" 
                        name={`q${q.id}`} 
                        checked={answers[q.id]?.value === 'no'}
                        onChange={() => handleSelect(q.id, q.noScore, 'no')}
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

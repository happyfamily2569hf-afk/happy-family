"use client";

import jsPDF from "jspdf";

export default function CertificateButton({ userName, courseName }: { userName: string, courseName: string }) {
  
  const generatePDF = () => {
    // A4 Landscape: 297 x 210 mm
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    // We use a basic generic design until the user's template is integrated.
    // To integrate a template:
    // doc.addImage("/template.jpg", "JPEG", 0, 0, 297, 210);

    // Draw border
    doc.setDrawColor(79, 70, 229); // Primary color
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);

    // Draw Title
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(36);
    doc.text("Certificate of Completion", 148.5, 60, { align: "center" });

    doc.setFontSize(18);
    doc.text("This certifies that", 148.5, 90, { align: "center" });

    // Draw Name
    doc.setFontSize(32);
    doc.setTextColor(79, 70, 229);
    doc.text(userName, 148.5, 115, { align: "center" });

    // Draw Line under name
    doc.setLineWidth(0.5);
    doc.line(70, 120, 227, 120);

    // Draw Course
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text("has successfully completed the course", 148.5, 140, { align: "center" });

    doc.setFontSize(24);
    doc.setTextColor(16, 185, 129); // Secondary color
    doc.text(courseName, 148.5, 160, { align: "center" });

    // Date
    const date = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${date}`, 148.5, 185, { align: "center" });

    doc.save(`${userName}_Certificate.pdf`);
  };

  return (
    <button 
      onClick={generatePDF}
      className="btn-primary" 
      style={{ background: 'var(--primary)', width: '100%' }}
    >
      📄 ดาวน์โหลดใบประกาศนียบัตร
    </button>
  );
}

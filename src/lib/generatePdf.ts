import { jsPDF } from "jspdf";
import type { NumerologyResult } from "./numerology";
import { numberDescriptions, categoryDescriptions } from "./numerology";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

type CategoryKey = keyof typeof categoryDescriptions;

export async function generateNumerologyPdf(result: NumerologyResult, name: string): Promise<void> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkNewPage = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - margin) {
      pdf.addPage();
      pdf.setFillColor(20, 25, 45);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      y = margin;
      return true;
    }
    return false;
  };

  const addWrappedText = (text: string, x: number, maxWidth: number, lineHeight: number): number => {
    const lines = pdf.splitTextToSize(text, maxWidth);
    lines.forEach((line: string, index: number) => {
      checkNewPage(lineHeight);
      pdf.text(line, x, y + index * lineHeight);
    });
    return lines.length * lineHeight;
  };

  // Background
  pdf.setFillColor(20, 25, 45);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Title
  pdf.setTextColor(212, 175, 55);
  pdf.setFontSize(24);
  pdf.text("NUMEROLOGY REPORT", pageWidth / 2, y, { align: "center" });
  y += 12;

  pdf.setFontSize(16);
  pdf.text("KeyTo Method", pageWidth / 2, y, { align: "center" });
  y += 15;

  // User info
  pdf.setTextColor(200, 200, 220);
  pdf.setFontSize(12);
  if (name) {
    pdf.text(`Name: ${name}`, margin, y);
    y += 8;
  }
  const formattedDate = format(result.birthDate, "d MMMM yyyy", { locale: ru });
  pdf.text(`Birth date: ${formattedDate}`, margin, y);
  y += 15;

  // Numbers summary box
  pdf.setFillColor(35, 40, 60);
  pdf.roundedRect(margin, y, contentWidth, 35, 3, 3, "F");
  
  pdf.setTextColor(212, 175, 55);
  pdf.setFontSize(14);
  pdf.text("YOUR NUMBERS", pageWidth / 2, y + 8, { align: "center" });
  
  const numbersY = y + 20;
  const colWidth = contentWidth / 4;
  
  const numbersData = [
    { label: "Mind", value: result.mindNumber },
    { label: "Action", value: result.actionNumber },
    { label: "Realization", value: result.realizationNumber },
    { label: "Total", value: result.totalNumber },
  ];
  
  numbersData.forEach((num, i) => {
    const x = margin + colWidth * i + colWidth / 2;
    pdf.setTextColor(212, 175, 55);
    pdf.setFontSize(18);
    pdf.text(String(num.value), x, numbersY, { align: "center" });
    pdf.setTextColor(150, 150, 170);
    pdf.setFontSize(8);
    pdf.text(num.label, x, numbersY + 6, { align: "center" });
  });
  
  y += 45;

  // Categories and their details
  const categories: Array<{ key: CategoryKey; number: number; label: string }> = [
    { key: "mind", number: result.mindNumber, label: "MIND NUMBER" },
    { key: "action", number: result.actionNumber, label: "ACTION NUMBER" },
    { key: "realization", number: result.realizationNumber, label: "REALIZATION NUMBER" },
    { key: "total", number: result.totalNumber, label: "TOTAL NUMBER" },
  ];

  for (const cat of categories) {
    const catInfo = categoryDescriptions[cat.key];
    const numInfo = numberDescriptions[cat.number];
    
    if (!numInfo) continue;
    
    checkNewPage(60);
    
    // Section header
    pdf.setFillColor(35, 40, 60);
    pdf.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");
    pdf.setTextColor(212, 175, 55);
    pdf.setFontSize(12);
    pdf.text(`${cat.label}: ${cat.number} - ${numInfo.title}`, margin + 5, y + 8);
    y += 18;
    
    // Description
    pdf.setTextColor(150, 150, 170);
    pdf.setFontSize(9);
    y += addWrappedText(catInfo.description, margin, contentWidth, 5);
    y += 5;
    
    // Get interpretation based on category
    const interpretationKey = `${cat.key}Interpretation` as keyof typeof numInfo;
    const interpretation = numInfo[interpretationKey] as string;
    
    if (interpretation) {
      pdf.setTextColor(200, 200, 220);
      pdf.setFontSize(10);
      y += addWrappedText(interpretation, margin, contentWidth, 5);
      y += 5;
    }
    
    // Details row
    pdf.setTextColor(150, 150, 170);
    pdf.setFontSize(8);
    const colorFirst = numInfo.color.split(',')[0];
    pdf.text(`Planet: ${numInfo.planet} | Day: ${numInfo.day} | Color: ${colorFirst}`, margin, y);
    y += 8;
    
    // Positive qualities
    checkNewPage(20);
    pdf.setTextColor(100, 200, 150);
    pdf.setFontSize(8);
    pdf.text(`Positive: ${numInfo.positive.join(", ")}`, margin, y);
    y += 5;
    
    // Negative qualities
    pdf.setTextColor(200, 100, 100);
    pdf.text(`Shadow: ${numInfo.negative.join(", ")}`, margin, y);
    y += 10;
    
    // Advice box
    if (numInfo.advice) {
      checkNewPage(25);
      pdf.setFillColor(30, 35, 55);
      pdf.roundedRect(margin, y, contentWidth, 18, 2, 2, "F");
      pdf.setTextColor(212, 175, 55);
      pdf.setFontSize(8);
      pdf.text("Advice:", margin + 3, y + 5);
      pdf.setTextColor(200, 200, 220);
      pdf.setFontSize(9);
      const adviceLines = pdf.splitTextToSize(numInfo.advice, contentWidth - 6);
      adviceLines.slice(0, 2).forEach((line: string, i: number) => {
        pdf.text(line, margin + 3, y + 10 + i * 4);
      });
      y += 25;
    }
  }

  // Additional sections from mind number
  const mindInfo = numberDescriptions[result.mindNumber];
  if (mindInfo) {
    // Relationships section
    if (mindInfo.relationships) {
      checkNewPage(50);
      pdf.setFillColor(35, 40, 60);
      pdf.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
      pdf.setTextColor(212, 175, 55);
      pdf.setFontSize(11);
      pdf.text("RELATIONSHIPS & LOVE", margin + 5, y + 7);
      y += 15;

      pdf.setTextColor(200, 200, 220);
      pdf.setFontSize(9);
      y += addWrappedText(mindInfo.relationships, margin, contentWidth, 5);
      y += 10;
    }

    // Career section
    if (mindInfo.career && mindInfo.career.length > 0) {
      checkNewPage(40);
      pdf.setFillColor(35, 40, 60);
      pdf.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
      pdf.setTextColor(212, 175, 55);
      pdf.setFontSize(11);
      pdf.text("CAREER PATHS", margin + 5, y + 7);
      y += 15;

      pdf.setTextColor(200, 200, 220);
      pdf.setFontSize(9);
      y += addWrappedText(mindInfo.career.join(", "), margin, contentWidth, 5);
      y += 10;
    }

    // Health section
    if (mindInfo.health) {
      checkNewPage(40);
      pdf.setFillColor(35, 40, 60);
      pdf.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
      pdf.setTextColor(212, 175, 55);
      pdf.setFontSize(11);
      pdf.text("HEALTH", margin + 5, y + 7);
      y += 15;

      pdf.setTextColor(200, 200, 220);
      pdf.setFontSize(9);
      y += addWrappedText(mindInfo.health, margin, contentWidth, 5);
      y += 15;
    }
  }

  // CTA Footer
  checkNewPage(35);
  pdf.setFillColor(50, 45, 30);
  pdf.roundedRect(margin, y, contentWidth, 28, 3, 3, "F");
  pdf.setTextColor(212, 175, 55);
  pdf.setFontSize(11);
  pdf.text("Want a full personal analysis?", pageWidth / 2, y + 8, { align: "center" });
  pdf.setFontSize(9);
  pdf.setTextColor(180, 180, 200);
  pdf.text("Book a personal consultation:", pageWidth / 2, y + 16, { align: "center" });
  pdf.setTextColor(100, 180, 255);
  pdf.setFontSize(10);
  pdf.text("t.me/galiullin_ruzal", pageWidth / 2, y + 23, { align: "center" });

  // Footer
  pdf.setTextColor(100, 100, 120);
  pdf.setFontSize(8);
  pdf.text("KeyTo Method - Key to Yourself, Key to Everything", pageWidth / 2, pageHeight - 10, { align: "center" });

  // Save
  const fileName = name ? `numerology_${name.replace(/\s/g, "_")}.pdf` : "numerology_report.pdf";
  pdf.save(fileName);
}

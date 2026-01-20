import jsPDF from "jspdf";

interface PDFOptions {
  title: string;
  subtitle?: string;
  birthDate: string;
  name?: string;
  sections: PDFSection[];
}

interface PDFSection {
  title: string;
  content: string | string[];
  highlight?: boolean;
}

// Gold/cream color palette
const COLORS = {
  gold: [212, 175, 55] as [number, number, number],
  goldDark: [178, 134, 11] as [number, number, number],
  cream: [255, 253, 245] as [number, number, number],
  text: [51, 51, 51] as [number, number, number],
  textMuted: [102, 102, 102] as [number, number, number],
};

// Transliteration map for Cyrillic to Latin
const cyrillicToLatin: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
  'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
  'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
  'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
  'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
  'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts',
  'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
  'Я': 'Ya'
};

function transliterate(text: string): string {
  return text.split('').map(char => cyrillicToLatin[char] || char).join('');
}

function drawWavyLine(pdf: jsPDF, startX: number, startY: number, width: number, amplitude: number, frequency: number) {
  const segments = 100;
  const segmentWidth = width / segments;
  
  pdf.setDrawColor(...COLORS.gold);
  pdf.setLineWidth(0.5);
  
  let prevX = startX;
  let prevY = startY;
  
  for (let i = 1; i <= segments; i++) {
    const x = startX + i * segmentWidth;
    const y = startY + Math.sin((i / segments) * Math.PI * frequency) * amplitude;
    pdf.line(prevX, prevY, x, y);
    prevX = x;
    prevY = y;
  }
}

function drawTitlePage(pdf: jsPDF, options: PDFOptions) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Background
  pdf.setFillColor(...COLORS.cream);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Decorative wavy lines at top
  for (let i = 0; i < 5; i++) {
    drawWavyLine(pdf, 0, 15 + i * 8, pageWidth, 3, 2 + i * 0.5);
  }
  
  // Decorative wavy lines at bottom
  for (let i = 0; i < 5; i++) {
    drawWavyLine(pdf, 0, pageHeight - 50 + i * 8, pageWidth, 3, 2 + i * 0.5);
  }
  
  // Gold decorative circle
  pdf.setFillColor(...COLORS.gold);
  pdf.circle(pageWidth / 2, pageHeight / 2 - 30, 40, "F");
  
  // Inner circle
  pdf.setFillColor(...COLORS.cream);
  pdf.circle(pageWidth / 2, pageHeight / 2 - 30, 35, "F");
  
  // Star symbol in center
  pdf.setFontSize(48);
  pdf.setTextColor(...COLORS.gold);
  pdf.text("*", pageWidth / 2, pageHeight / 2 - 25, { align: "center" });
  
  // Title (transliterated)
  pdf.setFontSize(28);
  pdf.setTextColor(...COLORS.goldDark);
  pdf.text(transliterate(options.title), pageWidth / 2, pageHeight / 2 + 30, { align: "center" });
  
  // Subtitle
  if (options.subtitle) {
    pdf.setFontSize(14);
    pdf.setTextColor(...COLORS.textMuted);
    pdf.text(transliterate(options.subtitle), pageWidth / 2, pageHeight / 2 + 45, { align: "center" });
  }
  
  // Name
  if (options.name) {
    pdf.setFontSize(18);
    pdf.setTextColor(...COLORS.text);
    pdf.text(transliterate(options.name), pageWidth / 2, pageHeight / 2 + 65, { align: "center" });
  }
  
  // Birth date
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.textMuted);
  pdf.text(`Data rozhdeniya: ${options.birthDate}`, pageWidth / 2, pageHeight / 2 + 80, { align: "center" });
  
  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.gold);
  pdf.text("serdce-calculator.lovable.app", pageWidth / 2, pageHeight - 20, { align: "center" });
}

function drawContentPage(pdf: jsPDF, sections: PDFSection[], startIndex: number): number {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;
  let y = 30;
  let sectionIndex = startIndex;
  
  // Background
  pdf.setFillColor(...COLORS.cream);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Gold top border
  pdf.setFillColor(...COLORS.gold);
  pdf.rect(0, 0, pageWidth, 5, "F");
  
  while (sectionIndex < sections.length && y < pageHeight - 40) {
    const section = sections[sectionIndex];
    
    // Section title
    if (section.highlight) {
      pdf.setFillColor(...COLORS.gold);
      pdf.roundedRect(margin - 5, y - 5, contentWidth + 10, 12, 3, 3, "F");
      pdf.setTextColor(255, 255, 255);
    } else {
      pdf.setTextColor(...COLORS.goldDark);
    }
    
    pdf.setFontSize(14);
    pdf.text(transliterate(section.title), margin, y + 4);
    y += 18;
    
    // Section content
    pdf.setTextColor(...COLORS.text);
    pdf.setFontSize(11);
    
    const contentLines = Array.isArray(section.content) 
      ? section.content.map(transliterate)
      : [transliterate(section.content)];
    
    for (const line of contentLines) {
      if (y > pageHeight - 40) {
        return sectionIndex; // Need new page
      }
      
      const wrappedLines = pdf.splitTextToSize(line, contentWidth);
      for (const wrappedLine of wrappedLines) {
        if (y > pageHeight - 40) {
          return sectionIndex;
        }
        pdf.text(wrappedLine, margin, y);
        y += 6;
      }
      y += 2;
    }
    
    y += 10;
    sectionIndex++;
  }
  
  // Gold bottom border
  pdf.setFillColor(...COLORS.gold);
  pdf.rect(0, pageHeight - 5, pageWidth, 5, "F");
  
  return sectionIndex;
}

export function generatePDF(options: PDFOptions): void {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  // Title page
  drawTitlePage(pdf, options);
  
  // Content pages
  if (options.sections.length > 0) {
    let currentSection = 0;
    
    while (currentSection < options.sections.length) {
      pdf.addPage();
      currentSection = drawContentPage(pdf, options.sections, currentSection);
    }
  }
  
  // Generate filename
  const safeName = transliterate(options.name || "report").replace(/[^a-zA-Z0-9]/g, "_");
  const safeTitle = transliterate(options.title).replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${safeName}_${safeTitle}.pdf`;
  
  pdf.save(fileName);
}

// Helper to format birth date
export function formatBirthDateForPDF(day: number, month: number, year: number): string {
  const dayStr = day.toString().padStart(2, "0");
  const monthStr = month.toString().padStart(2, "0");
  return `${dayStr}.${monthStr}.${year}`;
}

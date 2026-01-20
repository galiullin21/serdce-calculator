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

// Warm brown/cream color palette matching site design
const COLORS = {
  // Primary brown: hsl(20, 45%, 32%)
  brown: [118, 73, 45] as [number, number, number],
  // Brown dark: hsl(18, 50%, 22%)
  brownDark: [84, 48, 28] as [number, number, number],
  // Brown light: hsl(25, 35%, 45%)
  brownLight: [155, 110, 75] as [number, number, number],
  // Gold/accent: hsl(30, 50%, 45%)
  gold: [172, 128, 57] as [number, number, number],
  // Gold light: hsl(35, 55%, 60%)
  goldLight: [203, 171, 98] as [number, number, number],
  // Cream background: hsl(35, 30%, 95%)
  cream: [247, 243, 237] as [number, number, number],
  // Cream dark: hsl(35, 25%, 88%)
  creamDark: [232, 224, 212] as [number, number, number],
  // Text foreground: hsl(20, 40%, 20%)
  text: [71, 49, 31] as [number, number, number],
  // Muted text: hsl(20, 20%, 45%)
  textMuted: [138, 110, 92] as [number, number, number],
};

// Cache for loaded font
let fontLoaded = false;

async function loadCyrillicFont(pdf: jsPDF): Promise<void> {
  if (fontLoaded) {
    pdf.setFont("Roboto", "normal");
    return;
  }

  try {
    // Fetch Roboto font with Cyrillic support from Google Fonts
    const fontUrl = "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf";
    const response = await fetch(fontUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // Convert to Base64
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    
    // Add font to jsPDF
    pdf.addFileToVFS("Roboto-Regular.ttf", base64);
    pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    pdf.setFont("Roboto", "normal");
    fontLoaded = true;
  } catch (error) {
    console.error("Failed to load Cyrillic font:", error);
    // Fallback to default font
  }
}

function drawWavyLine(pdf: jsPDF, startX: number, startY: number, width: number, amplitude: number, frequency: number, color: [number, number, number] = COLORS.brown) {
  const segments = 100;
  const segmentWidth = width / segments;
  
  pdf.setDrawColor(...color);
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
  
  // Decorative wavy lines at top with brown gradient effect
  for (let i = 0; i < 5; i++) {
    const color = i % 2 === 0 ? COLORS.brown : COLORS.goldLight;
    drawWavyLine(pdf, 0, 15 + i * 8, pageWidth, 3, 2 + i * 0.5, color);
  }
  
  // Decorative wavy lines at bottom
  for (let i = 0; i < 5; i++) {
    const color = i % 2 === 0 ? COLORS.brown : COLORS.goldLight;
    drawWavyLine(pdf, 0, pageHeight - 50 + i * 8, pageWidth, 3, 2 + i * 0.5, color);
  }
  
  // Brown decorative circle (primary color)
  pdf.setFillColor(...COLORS.brown);
  pdf.circle(pageWidth / 2, pageHeight / 2 - 30, 40, "F");
  
  // Inner cream circle
  pdf.setFillColor(...COLORS.cream);
  pdf.circle(pageWidth / 2, pageHeight / 2 - 30, 35, "F");
  
  // Heart symbol in center (matching site theme)
  pdf.setFontSize(36);
  pdf.setTextColor(...COLORS.brown);
  pdf.text("♥", pageWidth / 2, pageHeight / 2 - 22, { align: "center" });
  
  // Title
  pdf.setFontSize(28);
  pdf.setTextColor(...COLORS.brownDark);
  pdf.text(options.title, pageWidth / 2, pageHeight / 2 + 30, { align: "center" });
  
  // Subtitle
  if (options.subtitle) {
    pdf.setFontSize(14);
    pdf.setTextColor(...COLORS.textMuted);
    pdf.text(options.subtitle, pageWidth / 2, pageHeight / 2 + 45, { align: "center" });
  }
  
  // Name
  if (options.name) {
    pdf.setFontSize(18);
    pdf.setTextColor(...COLORS.text);
    pdf.text(options.name, pageWidth / 2, pageHeight / 2 + 65, { align: "center" });
  }
  
  // Birth date
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.textMuted);
  pdf.text(`Дата рождения: ${options.birthDate}`, pageWidth / 2, pageHeight / 2 + 80, { align: "center" });
  
  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.brown);
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
  
  // Brown top border (primary color)
  pdf.setFillColor(...COLORS.brown);
  pdf.rect(0, 0, pageWidth, 5, "F");
  
  while (sectionIndex < sections.length && y < pageHeight - 40) {
    const section = sections[sectionIndex];
    
    // Section title
    if (section.highlight) {
      pdf.setFillColor(...COLORS.brown);
      pdf.roundedRect(margin - 5, y - 5, contentWidth + 10, 12, 3, 3, "F");
      pdf.setTextColor(...COLORS.cream);
    } else {
      pdf.setTextColor(...COLORS.brownDark);
    }
    
    pdf.setFontSize(14);
    const titleLines = pdf.splitTextToSize(section.title, contentWidth);
    for (const titleLine of titleLines) {
      pdf.text(titleLine, margin, y + 4);
      y += 7;
    }
    y += 8;
    
    // Section content
    pdf.setTextColor(...COLORS.text);
    pdf.setFontSize(11);
    
    const contentLines = Array.isArray(section.content) 
      ? section.content 
      : [section.content];
    
    for (const line of contentLines) {
      if (y > pageHeight - 40) {
        return sectionIndex; // Need new page
      }
      
      if (!line || line.trim() === "") {
        y += 4;
        continue;
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
    
    // Decorative separator between sections
    if (sectionIndex < sections.length - 1) {
      y += 5;
      pdf.setDrawColor(...COLORS.goldLight);
      pdf.setLineWidth(0.3);
      pdf.line(margin + 20, y, pageWidth - margin - 20, y);
      y += 8;
    } else {
      y += 10;
    }
    
    sectionIndex++;
  }
  
  // Brown bottom border
  pdf.setFillColor(...COLORS.brown);
  pdf.rect(0, pageHeight - 5, pageWidth, 5, "F");
  
  return sectionIndex;
}

export async function generatePDF(options: PDFOptions): Promise<void> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  // Load Cyrillic font
  await loadCyrillicFont(pdf);
  
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
  
  // Generate filename with safe characters
  const safeName = (options.name || "report").replace(/[^\w\s-]/g, "").replace(/\s+/g, "_") || "report";
  const safeTitle = options.title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_") || "analysis";
  const fileName = `${safeName}_${safeTitle}.pdf`;
  
  pdf.save(fileName);
}

// Helper to format birth date
export function formatBirthDateForPDF(day: number, month: number, year: number): string {
  const dayStr = day.toString().padStart(2, "0");
  const monthStr = month.toString().padStart(2, "0");
  return `${dayStr}.${monthStr}.${year}`;
}

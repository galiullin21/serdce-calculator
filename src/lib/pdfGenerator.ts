import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface GeneratePDFOptions {
  filename: string;
  onProgress?: (progress: number) => void;
}

export async function generatePDF(
  element: HTMLElement,
  options: GeneratePDFOptions
): Promise<void> {
  const { filename, onProgress } = options;
  
  // Клонируем элемент для рендеринга
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  document.body.appendChild(clone);
  
  try {
    onProgress?.(10);
    
    // Находим все страницы
    const pages = clone.querySelectorAll('[data-pdf-page]');
    
    if (pages.length === 0) {
      // Если нет разметки страниц, рендерим весь элемент
      await generateSinglePage(clone, filename);
      return;
    }
    
    // Создаём PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = 210;
    const pageHeight = 297;
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      
      onProgress?.(10 + (80 * (i / pages.length)));
      
      // Рендерим страницу в canvas
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FAF6F1',
        logging: false,
        windowWidth: 794, // A4 в пикселях при 96 DPI
        windowHeight: 1123
      });
      
      // Добавляем страницу в PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      if (i > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
    }
    
    onProgress?.(95);
    
    // Сохраняем PDF
    pdf.save(filename);
    
    onProgress?.(100);
  } finally {
    document.body.removeChild(clone);
  }
}

async function generateSinglePage(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#FAF6F1',
    logging: false
  });
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = 210;
  const pageHeight = 297;
  
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  
  // Масштабируем изображение
  const ratio = Math.min(pageWidth / (imgWidth / 2), pageHeight / (imgHeight / 2));
  const scaledWidth = (imgWidth / 2) * ratio;
  const scaledHeight = (imgHeight / 2) * ratio;
  
  // Центрируем
  const x = (pageWidth - scaledWidth) / 2;
  const y = 0;
  
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);
  
  pdf.save(filename);
}

// Утилита для разбиения контента на страницы
export function splitIntoPages<T>(items: T[], itemsPerPage: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }
  return pages;
}

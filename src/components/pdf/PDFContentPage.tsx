import { ReactNode } from "react";

interface PDFContentPageProps {
  title: string;
  children: ReactNode;
  pageNumber?: number;
  totalPages?: number;
}

export function PDFContentPage({ title, children, pageNumber, totalPages }: PDFContentPageProps) {
  return (
    <div 
      className="relative w-[210mm] min-h-[297mm] overflow-hidden"
      style={{ 
        backgroundColor: '#FAF6F1',
        fontFamily: 'Arial, sans-serif',
        pageBreakAfter: 'always',
        pageBreakInside: 'avoid'
      }}
    >
      {/* Верхняя декоративная линия */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: '#C9A86C' }}
      />
      
      {/* Боковая линия */}
      <div 
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: '#C9A86C', opacity: 0.3 }}
      />
      
      {/* Контент */}
      <div className="px-12 py-10">
        {/* Заголовок секции */}
        <div className="mb-8">
          <h2 
            className="text-2xl font-semibold tracking-wide mb-2"
            style={{ 
              color: '#5C4033',
              fontFamily: 'Cormorant, Georgia, serif'
            }}
          >
            {title}
          </h2>
          <div 
            className="w-20 h-0.5"
            style={{ backgroundColor: '#C9A86C' }}
          />
        </div>
        
        {/* Контент страницы */}
        <div 
          className="text-base leading-relaxed"
          style={{ color: '#5C4033' }}
        >
          {children}
        </div>
      </div>
      
      {/* Нижний колонтитул */}
      {pageNumber && (
        <div 
          className="absolute bottom-6 left-0 right-0 flex justify-center items-center"
          style={{ color: '#8B7355' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-px"
              style={{ backgroundColor: '#C9A86C' }}
            />
            <span className="text-sm">
              {pageNumber}{totalPages ? ` / ${totalPages}` : ''}
            </span>
            <div 
              className="w-8 h-px"
              style={{ backgroundColor: '#C9A86C' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

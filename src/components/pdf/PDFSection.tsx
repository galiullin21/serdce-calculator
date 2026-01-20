import { ReactNode } from "react";

interface PDFSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  highlight?: boolean;
}

export function PDFSection({ title, icon, children, highlight }: PDFSectionProps) {
  return (
    <div 
      className="mb-6 p-5 rounded-lg"
      style={{ 
        backgroundColor: highlight ? 'rgba(201, 168, 108, 0.1)' : 'rgba(255, 255, 255, 0.5)',
        border: highlight ? '1px solid #C9A86C' : '1px solid rgba(201, 168, 108, 0.3)'
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#C9A86C' }}
          >
            {icon}
          </div>
        )}
        <h3 
          className="text-lg font-semibold"
          style={{ 
            color: '#5C4033',
            fontFamily: 'Cormorant, Georgia, serif'
          }}
        >
          {title}
        </h3>
      </div>
      <div 
        className="text-sm leading-relaxed whitespace-pre-line"
        style={{ color: '#5C4033' }}
      >
        {children}
      </div>
    </div>
  );
}

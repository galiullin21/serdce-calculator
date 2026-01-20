import { WavePattern } from "./WavePattern";

interface PDFCoverPageProps {
  title: string;
  subtitle: string;
  birthDate: string;
  name?: string;
  extraInfo?: string;
}

export function PDFCoverPage({ title, subtitle, birthDate, name, extraInfo }: PDFCoverPageProps) {
  return (
    <div 
      className="relative w-[210mm] h-[297mm] overflow-hidden"
      style={{ 
        backgroundColor: '#FAF6F1',
        fontFamily: 'Cormorant, Georgia, serif'
      }}
    >
      {/* Волновой паттерн на фоне */}
      <WavePattern />
      
      {/* Золотая рамка */}
      <div 
        className="absolute inset-6 border-2 rounded-lg"
        style={{ borderColor: '#C9A86C' }}
      />
      <div 
        className="absolute inset-8 border rounded-lg"
        style={{ borderColor: '#C9A86C', opacity: 0.5 }}
      />
      
      {/* Контент */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 text-center">
        {/* Декоративный элемент сверху */}
        <div className="mb-12">
          <svg width="120" height="40" viewBox="0 0 120 40">
            <path
              d="M0,20 Q30,5 60,20 T120,20"
              fill="none"
              stroke="#C9A86C"
              strokeWidth="2"
            />
            <circle cx="60" cy="20" r="4" fill="#C9A86C" />
          </svg>
        </div>
        
        {/* Заголовок */}
        <h1 
          className="text-5xl font-light tracking-widest mb-6"
          style={{ color: '#5C4033' }}
        >
          {title}
        </h1>
        
        {/* Подзаголовок */}
        <p 
          className="text-xl font-light tracking-wide mb-16 max-w-md"
          style={{ color: '#8B7355' }}
        >
          {subtitle}
        </p>
        
        {/* Имя */}
        {name && (
          <p 
            className="text-3xl font-medium mb-8"
            style={{ color: '#5C4033' }}
          >
            {name}
          </p>
        )}
        
        {/* Дата рождения */}
        <div 
          className="px-8 py-4 rounded-full mb-6"
          style={{ 
            backgroundColor: 'rgba(201, 168, 108, 0.1)',
            border: '1px solid #C9A86C'
          }}
        >
          <p 
            className="text-2xl tracking-wider"
            style={{ color: '#5C4033' }}
          >
            {birthDate}
          </p>
        </div>
        
        {/* Дополнительная информация */}
        {extraInfo && (
          <p 
            className="text-lg"
            style={{ color: '#8B7355' }}
          >
            {extraInfo}
          </p>
        )}
        
        {/* Декоративный элемент снизу */}
        <div className="mt-16">
          <svg width="200" height="30" viewBox="0 0 200 30">
            <path
              d="M0,15 L80,15 M120,15 L200,15"
              stroke="#C9A86C"
              strokeWidth="1"
            />
            <circle cx="100" cy="15" r="8" fill="none" stroke="#C9A86C" strokeWidth="1" />
            <circle cx="100" cy="15" r="3" fill="#C9A86C" />
          </svg>
        </div>
      </div>
    </div>
  );
}

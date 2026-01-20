export function WavePattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 800 1200"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.15 }}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A86C" />
          <stop offset="50%" stopColor="#D4B896" />
          <stop offset="100%" stopColor="#C9A86C" />
        </linearGradient>
      </defs>
      
      {/* Волнистые линии */}
      {[...Array(12)].map((_, i) => (
        <path
          key={i}
          d={`M${-100 + i * 80},0 
              Q${50 + i * 80},${150 + (i % 3) * 50} ${-100 + i * 80},300 
              T${-100 + i * 80},600 
              T${-100 + i * 80},900 
              T${-100 + i * 80},1200`}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth={1.5 + (i % 2) * 0.5}
        />
      ))}
      
      {/* Дополнительные диагональные линии */}
      {[...Array(8)].map((_, i) => (
        <path
          key={`diag-${i}`}
          d={`M${i * 120},0 
              C${i * 120 + 60},300 ${i * 120 - 30},600 ${i * 120 + 40},900
              S${i * 120 + 80},1100 ${i * 120},1200`}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth={1}
          opacity={0.6}
        />
      ))}
    </svg>
  );
}

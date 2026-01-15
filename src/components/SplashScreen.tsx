import { useState, useEffect, useRef } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if splash was already shown this session
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setIsVisible(false);
      onComplete();
      return;
    }
  }, [onComplete]);

  const handleVideoEnd = () => {
    setIsFading(true);
    sessionStorage.setItem("splashShown", "true");
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleVideoEnd();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#4a3228] flex items-center justify-center transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleSkip}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full text-sm font-medium backdrop-blur-sm transition-all border border-white/20"
      >
        Пропустить
      </button>
    </div>
  );
}

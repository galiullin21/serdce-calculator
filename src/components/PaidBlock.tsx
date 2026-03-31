import { Lock, Crown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaidBlockProps {
  children: React.ReactNode;
  isLocked: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export function PaidBlock({ children, isLocked, title, description, className }: PaidBlockProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  return (
    <div className={cn("relative", className)}>
      {/* Blurred content preview */}
      <div className="select-none pointer-events-none" aria-hidden="true">
        <div className="filter blur-[6px] opacity-50">
          {children}
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-background/80 to-background/95 rounded-xl">
        <div className="text-center p-6 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-foreground text-lg mb-2">
            {title || "Профессиональный разбор"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {description || "Полный детальный анализ с расширенными описаниями и рекомендациями доступен после оплаты"}
          </p>
          <Button
            onClick={handleTelegramClick}
            className="btn-fill bg-primary text-primary-foreground"
          >
            Получить полный разбор
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Маркетинговый CTA-блок «Ваш результат активирован на 37%» */
export function ActivationBanner({ score = 37 }: { score?: number }) {
  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 rounded-2xl p-6 text-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Crown className="w-6 h-6 text-primary" />
        <h3 className="font-display font-semibold text-xl text-primary">Life COD Club</h3>
      </div>
      <p className="text-foreground font-medium">
        Ваш результат активирован на <span className="text-primary font-bold text-lg">{score}%</span>
      </p>
      <p className="text-muted-foreground text-sm max-w-lg mx-auto">
        Полная активация судьбы доступна в Life COD Club — получите глубокий профессиональный разбор 
        с детальными описаниями, рекомендациями и прогнозами.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" size="lg" onClick={handleTelegramClick}>
          Стандарт — полный разбор
        </Button>
        <Button size="lg" className="bg-primary text-primary-foreground" onClick={handleTelegramClick}>
          <Crown className="w-4 h-4 mr-2" /> Премиум — Книга судьбы
        </Button>
      </div>
    </div>
  );
}

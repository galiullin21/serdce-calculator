import { Lock, ExternalLink } from "lucide-react";
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

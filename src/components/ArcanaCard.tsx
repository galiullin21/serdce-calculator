import { getArcana } from "@/lib/arcana";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ArcanaCardProps {
  number: number;
  position?: number;
  positionTitle?: string;
  positionDescription?: string;
  showYearForecast?: boolean;
  isReversed?: boolean;
  isMirror?: boolean;
  compact?: boolean;
}

export function ArcanaCard({
  number,
  position,
  positionTitle,
  positionDescription,
  showYearForecast = false,
  isReversed = false,
  isMirror = false,
  compact = false,
}: ArcanaCardProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const arcana = getArcana(number);

  if (!arcana) return null;

  const description = showYearForecast 
    ? arcana.yearForecast 
    : isReversed 
      ? arcana.personalReversed 
      : arcana.personalDescription;

  return (
    <div
      className={cn(
        "gradient-card rounded-xl border transition-all duration-300",
        isMirror && "border-primary/50 bg-primary/5",
        isReversed && !isMirror && "border-destructive/50 bg-destructive/5",
        !isMirror && !isReversed && "border-border"
      )}
    >
      <div
        className={cn(
          "p-4 cursor-pointer",
          compact && "p-3"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Номер аркана */}
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-display font-bold",
                isMirror && "bg-primary/20 text-primary",
                isReversed && !isMirror && "bg-destructive/20 text-destructive",
                !isMirror && !isReversed && "bg-primary/10 text-primary"
              )}
            >
              {number}
            </div>

            <div className="flex-1">
              {/* Позиция */}
              {position && positionTitle && (
                <div className="text-xs text-muted-foreground mb-0.5">
                  Позиция {position}: {positionTitle}
                </div>
              )}
              
              {/* Название аркана */}
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-foreground">
                  {arcana.name}
                </h3>
                {isMirror && (
                  <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Зеркальный
                  </span>
                )}
                {isReversed && !isMirror && (
                  <span className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Перевёрнутый
                  </span>
                )}
              </div>

              {/* Планета и элемент */}
              <div className="text-xs text-muted-foreground mt-0.5">
                {arcana.planet} • {arcana.element}
              </div>
            </div>
          </div>

          <button className="text-muted-foreground hover:text-foreground transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Краткое описание позиции */}
        {positionDescription && !isExpanded && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {positionDescription}
          </p>
        )}
      </div>

      {/* Развёрнутое содержимое */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {positionDescription && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Значение позиции:</span>{" "}
                {positionDescription}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              {showYearForecast ? "Прогноз на год" : isReversed ? "Перевёрнутое значение" : "Описание"}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Профессии */}
          {!showYearForecast && arcana.professions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                Подходящие профессии
              </h4>
              <div className="flex flex-wrap gap-2">
                {arcana.professions.map((profession, index) => (
                  <span
                    key={index}
                    className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground"
                  >
                    {profession}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

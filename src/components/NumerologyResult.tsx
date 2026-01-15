import { NumerologyResult as Result } from "@/lib/numerology";
import { NumberCard } from "./NumberCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface NumerologyResultProps {
  result: Result;
  name: string;
  onReset: () => void;
}

export function NumerologyResult({ result, name, onReset }: NumerologyResultProps) {
  const formattedDate = format(result.birthDate, "d MMMM yyyy", { locale: ru });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <Button
          variant="ghost"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Новый расчёт
        </Button>

        <div className="gradient-card rounded-2xl p-8 shadow-elevated border border-border/50">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            {name ? `${name}, ваша нумерология` : "Ваша нумерология"}
          </h2>
          <p className="text-muted-foreground">
            Дата рождения: <span className="text-primary font-medium">{formattedDate}</span>
          </p>

          {/* Summary Numbers */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { label: "Ум", value: result.mindNumber },
              { label: "Действие", value: result.actionNumber },
              { label: "Реализация", value: result.realizationNumber },
              { label: "Итог", value: result.totalNumber },
            ].map((item, i) => (
              <div key={item.label} className="text-center">
                <div 
                  className="w-14 h-14 mx-auto rounded-full bg-secondary flex items-center justify-center mb-2 animate-scale-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-2xl font-display font-bold text-primary number-glow">
                    {item.value}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Number Cards */}
      <div className="space-y-4">
        <NumberCard number={result.mindNumber} category="mind" delay={0} />
        <NumberCard number={result.actionNumber} category="action" delay={100} />
        <NumberCard number={result.realizationNumber} category="realization" delay={200} />
        <NumberCard number={result.totalNumber} category="total" delay={300} />
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 pb-8">
        <Button
          variant="outline"
          className="border-border/50 hover:border-primary/50 hover:bg-secondary/50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Поделиться
        </Button>
        <Button
          variant="outline"
          className="border-border/50 hover:border-primary/50 hover:bg-secondary/50"
        >
          <Download className="w-4 h-4 mr-2" />
          Сохранить PDF
        </Button>
      </div>
    </div>
  );
}

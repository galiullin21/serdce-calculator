import { cn } from "@/lib/utils";
import { Sparkles, Calendar, CalendarDays, Compass, Brain, Zap, Target, Award } from "lucide-react";

interface MethodSelectorProps {
  selectedMethod: string;
  selectedMethodology: "1" | "2";
  onMethodChange: (method: string) => void;
}

export function MethodSelector({ selectedMethod, selectedMethodology, onMethodChange }: MethodSelectorProps) {
  // Methods for Methodology 1 (numbers 1-9)
  const methodsMethodology1 = [
    {
      id: "classic-full",
      name: "Полный разбор",
      description: "4 главных числа вашей судьбы",
      available: true,
      icon: Brain,
    },
  ];

  // Methods for Methodology 2 (22 Arcana)
  const methodsMethodology2 = [
    {
      id: "month",
      name: "Прогноз на месяц",
      description: "Расчёт энергий на текущий месяц",
      available: true,
      icon: Calendar,
    },
    {
      id: "year",
      name: "Прогноз на год",
      description: "Полный годовой прогноз",
      available: true,
      icon: CalendarDays,
    },
    {
      id: "purpose",
      name: "Ваше предназначение",
      description: "Профессии и таланты по дате рождения",
      available: true,
      icon: Compass,
    },
  ];

  const methods = selectedMethodology === "1" ? methodsMethodology1 : methodsMethodology2;
  const gridCols = selectedMethodology === "1" ? "grid-cols-1" : "grid-cols-3";

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <p className="text-sm text-muted-foreground text-center mb-4">
        Выберите тип расчёта
      </p>
      <div className={cn("grid gap-3", gridCols)}>
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => method.available && onMethodChange(method.id)}
            disabled={!method.available}
            className={cn(
              "relative p-4 rounded-xl border transition-all duration-300 text-left",
              method.available
                ? selectedMethod === method.id
                  ? "bg-primary/10 border-primary shadow-warm"
                  : "bg-card border-border hover:border-primary/50"
                : "bg-muted border-border cursor-not-allowed opacity-60"
            )}
          >
            <div className="flex items-start gap-3">
              <method.icon className="w-6 h-6 text-primary mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-foreground">
                    {method.name}
                  </h3>
                  {method.available && selectedMethod === method.id && (
                    <Sparkles className="w-3 h-3 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {method.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

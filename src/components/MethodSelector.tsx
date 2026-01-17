import { cn } from "@/lib/utils";
import { Sparkles, Calendar, CalendarDays, Compass } from "lucide-react";

interface MethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

export function MethodSelector({ selectedMethod, onMethodChange }: MethodSelectorProps) {
  const methods = [
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

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <p className="text-sm text-muted-foreground text-center mb-4">
        Выберите тип расчёта
      </p>
      <div className="grid grid-cols-3 gap-3">
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

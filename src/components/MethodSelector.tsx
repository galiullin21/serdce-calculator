import { cn } from "@/lib/utils";
import { Sparkles, Calendar, CalendarDays, Compass, Brain, Zap, Target, Award } from "lucide-react";

interface MethodSelectorProps {
  selectedMethod: string;
  selectedMethodology: "1" | "2";
  onMethodChange: (method: string) => void;
}

export function MethodSelector({ selectedMethod, selectedMethodology, onMethodChange }: MethodSelectorProps) {
  // Methods for Methodology 2 (22 Arcana) - now shown first
  const methodsMethodology2 = [
    // Row 1
    {
      id: "purpose",
      name: "Предназначение",
      description: "Профессии и таланты по дате рождения",
      available: true,
      icon: Compass,
      row: 1,
    },
    {
      id: "compatibility",
      name: "Совместимость",
      description: "Анализ совместимости с партнёром",
      available: false,
      icon: Brain,
      row: 1,
    },
    // Row 2
    {
      id: "year",
      name: "Прогноз на год",
      description: "Полный годовой прогноз",
      available: true,
      icon: CalendarDays,
      row: 2,
    },
    {
      id: "month",
      name: "Прогноз на месяц",
      description: "Расчёт энергий на текущий месяц",
      available: true,
      icon: Calendar,
      row: 2,
    },
    // Row 3
    {
      id: "day",
      name: "Прогноз на день",
      description: "Энергия и рекомендации на день",
      available: false,
      icon: Calendar,
      row: 3,
    },
    {
      id: "ancestral",
      name: "Родовые программы",
      description: "Анализ родовых программ",
      available: false,
      icon: Brain,
      row: 3,
    },
  ];

  // Methods for Methodology 1 (Classic - numbers 1-9) - now shown second
  const methodsMethodology1 = [
    {
      id: "classic-full",
      name: "Полный разбор",
      description: "4 главных числа вашей судьбы",
      available: true,
      icon: Brain,
    },
  ];

  const methods = selectedMethodology === "1" ? methodsMethodology1 : methodsMethodology2;
  const isArcana = selectedMethodology === "2";

  // Group methods by row for Arcana methodology
  const row1 = isArcana ? methods.filter((m: any) => m.row === 1) : [];
  const row2 = isArcana ? methods.filter((m: any) => m.row === 2) : [];
  const row3 = isArcana ? methods.filter((m: any) => m.row === 3) : [];

  const renderMethod = (method: typeof methods[0]) => (
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
        <method.icon className={cn("w-6 h-6 mt-0.5", method.available ? "text-primary" : "text-muted-foreground")} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-foreground">
              {method.name}
            </h3>
            {method.available && selectedMethod === method.id && (
              <Sparkles className="w-3 h-3 text-primary" />
            )}
            {!method.available && (
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">Скоро</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {method.description}
          </p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <p className="text-sm text-muted-foreground text-center mb-4">
        Выберите тип расчёта
      </p>
      
      {isArcana ? (
        <div className="space-y-3">
          {/* Row 1: Предназначение, Совместимость */}
          <div className="grid grid-cols-2 gap-3">
            {row1.map(renderMethod)}
          </div>
          {/* Row 2: Год, Месяц */}
          <div className="grid grid-cols-2 gap-3">
            {row2.map(renderMethod)}
          </div>
          {/* Row 3: День, Родовые программы */}
          <div className="grid grid-cols-2 gap-3">
            {row3.map(renderMethod)}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
          {methods.map(renderMethod)}
        </div>
      )}
    </div>
  );
}

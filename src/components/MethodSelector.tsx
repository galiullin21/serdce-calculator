import { cn } from "@/lib/utils";
import { Lock, Sparkles } from "lucide-react";

interface MethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

export function MethodSelector({ selectedMethod, onMethodChange }: MethodSelectorProps) {
  const methods = [
    {
      id: "method1",
      name: "Методика 1",
      description: "Классическая нумерология по дате рождения",
      available: true,
      icon: "✨",
    },
    {
      id: "method2",
      name: "Методика 2",
      description: "Расширенный анализ энергий",
      available: false,
      icon: "🔮",
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <p className="text-sm text-muted-foreground text-center mb-4">
        Выберите методику расчёта
      </p>
      <div className="grid grid-cols-2 gap-4">
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
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-foreground">
                    {method.name}
                  </h3>
                  {!method.available && (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  )}
                  {method.available && selectedMethod === method.id && (
                    <Sparkles className="w-3 h-3 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {method.description}
                </p>
              </div>
            </div>
            {!method.available && (
              <span className="absolute top-2 right-2 text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                Скоро
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

import { NumerologyResult as Result } from "@/lib/numerology";
import { NumberCard } from "./NumberCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface NumerologyResultProps {
  result: Result;
  name: string;
  onReset: () => void;
}

export function NumerologyResult({ result, name, onReset }: NumerologyResultProps) {
  const formattedDate = format(result.birthDate, "d MMMM yyyy", { locale: ru });

  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

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
              { label: "Ум", value: result.mindNumber, icon: "💭" },
              { label: "Действие", value: result.actionNumber, icon: "⚡" },
              { label: "Реализация", value: result.realizationNumber, icon: "🎯" },
              { label: "Итог", value: result.totalNumber, icon: "✨" },
            ].map((item, i) => (
              <div key={item.label} className="text-center">
                <div 
                  className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-2 animate-scale-in relative"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-2xl font-display font-bold text-primary number-glow">
                    {item.value}
                  </span>
                  <span className="absolute -top-1 -right-1 text-sm">{item.icon}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Number Cards */}
      <div className="space-y-6">
        <NumberCard number={result.mindNumber} category="mind" delay={0} />
        <NumberCard number={result.actionNumber} category="action" delay={100} />
        <NumberCard number={result.realizationNumber} category="realization" delay={200} />
        <NumberCard number={result.totalNumber} category="total" delay={300} />
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden rounded-2xl p-6 shadow-elevated border-2 border-primary/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center flex-shrink-0 shadow-glow">
            <Crown className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-display font-bold text-foreground">
                Получить полный разбор
              </h3>
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded-full">
                PREMIUM
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Индивидуальная консультация с экспертом-нумерологом. Глубокий анализ вашей личности, 
              кармических задач, отношений, карьеры и здоровья. Персональные рекомендации и ответы на все вопросы.
            </p>
            <ul className="text-xs text-muted-foreground mb-4 space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Личная консультация 60-90 минут
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Анализ всех 22 энергий
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Прогноз на год по месяцам
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Совместимость с партнёром
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Ответы на ваши вопросы
              </li>
            </ul>
            <Button
              onClick={handleTelegramClick}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-gold-dark hover:from-primary/90 hover:to-gold-dark/90 text-primary-foreground font-bold shadow-glow"
            >
              <Crown className="w-4 h-4 mr-2" />
              Записаться на консультацию
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-muted-foreground pb-8">
        Это базовый бесплатный расчёт. Для полного понимания вашей нумерологии 
        рекомендуется консультация специалиста.
      </p>
    </div>
  );
}

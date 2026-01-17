import { YearForecast, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { ArcanaCard } from "./ArcanaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";

interface YearForecastResultProps {
  forecast: YearForecast;
  name: string;
  onReset: () => void;
}

export function YearForecastResult({ forecast, name, onReset }: YearForecastResultProps) {
  const arcana = getArcana(forecast.arcana);
  const formattedDate = formatBirthDate(
    forecast.birthDate.day,
    forecast.birthDate.month,
    forecast.birthDate.year
  );

  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={onReset}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Новый расчёт
        </Button>

        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          Прогноз на {forecast.targetYear} год
        </h1>
        
        {name && (
          <p className="text-lg text-foreground mb-1">
            для {name}
          </p>
        )}
        
        <p className="text-muted-foreground">
          Дата рождения: {formattedDate}
        </p>
      </div>

      {/* Главный аркан года */}
      <div className="gradient-card rounded-2xl p-6 border border-primary/30">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-display text-foreground">
            Ваш аркан года: {arcana?.name}
          </h2>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-5xl font-display font-bold text-primary">
              {forecast.arcana}
            </span>
          </div>
        </div>

        <ArcanaCard
          number={forecast.arcana}
          showYearForecast={true}
          compact={false}
        />
      </div>

      {/* CTA для консультации */}
      <div className="gradient-card rounded-2xl p-6 border border-border text-center">
        <h3 className="text-lg font-display text-foreground mb-2">
          Хотите узнать больше?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Получите профессиональный разбор с учётом всех нюансов вашей личной матрицы
          и индивидуальные рекомендации на год.
        </p>
        <Button
          onClick={handleTelegramClick}
          className="btn-fill bg-primary text-primary-foreground"
        >
          Записаться на консультацию
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

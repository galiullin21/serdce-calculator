import { useTranslation } from "react-i18next";
import { MonthForecast, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { ArcanaCard } from "./ArcanaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";

interface MonthForecastResultProps {
  forecast: MonthForecast;
  name: string;
  onReset: () => void;
}

export function MonthForecastResult({ forecast, name, onReset }: MonthForecastResultProps) {
  const { t } = useTranslation();
  const formattedDate = formatBirthDate(
    forecast.birthDate.day,
    forecast.birthDate.month,
    forecast.birthDate.year
  );
  const monthName = t(`forecast.months.${forecast.targetMonth}`);

  const arcana1 = getArcana(forecast.position1);
  const arcana2 = getArcana(forecast.position2);
  const arcana3 = getArcana(forecast.position3);

  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={onReset}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>

        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          {t("forecast.monthForecast")} — {monthName} {forecast.targetYear}
        </h1>
        
        {name && (
          <p className="text-lg text-foreground mb-1">
            {t("forecast.for")} {name}
          </p>
        )}
        
        <p className="text-muted-foreground">
          {t("results.birthDate")}: {formattedDate}
        </p>
      </div>

      <div className="gradient-card rounded-2xl p-6 border border-primary/30">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-display text-foreground">
            {t("forecast.monthTriangle")}
          </h2>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-primary">
              <span className="text-3xl font-display font-bold text-primary">
                {forecast.position3}
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {t("forecast.monthResult")}
            </span>
          </div>

          <div className="w-32 h-8 relative">
            <div className="absolute left-1/2 top-0 w-px h-full bg-border transform -translate-x-1/2" />
            <div className="absolute left-0 bottom-0 w-1/2 h-px bg-border transform rotate-45 origin-left" />
            <div className="absolute right-0 bottom-0 w-1/2 h-px bg-border transform -rotate-45 origin-right" />
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center border border-border">
                <span className="text-2xl font-display font-bold text-foreground">
                  {forecast.position1}
                </span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {t("forecast.yearArcana")}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center border border-border">
                <span className="text-2xl font-display font-bold text-foreground">
                  {forecast.position2}
                </span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {t("forecast.monthNum")} ({forecast.targetMonth})
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-2">
              {t("forecast.howToRead")}:
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>{arcana1?.name}</strong> ({forecast.position1}) — {t("forecast.yearEnergyBackground")}</li>
              <li>• <strong>{arcana2?.name}</strong> ({forecast.position2}) — {t("forecast.monthEnergy")}</li>
              <li>• <strong>{arcana3?.name}</strong> ({forecast.position3}) — {t("forecast.monthResultEnergy")}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-display text-foreground">
          {t("forecast.mainMonthArcana")}
        </h2>
        <ArcanaCard
          number={forecast.position3}
          showMonthForecast={true}
          compact={false}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-display text-foreground">
          {t("forecast.influencingEnergies")}
        </h2>
        <div className="grid gap-4">
          <ArcanaCard
            number={forecast.position1}
            positionTitle={t("forecast.yearEnergyTitle")}
            showMonthForecast={true}
            compact={true}
          />
          <ArcanaCard
            number={forecast.position2}
            positionTitle={`${t("forecast.energyOf")} ${monthName}`}
            showMonthForecast={true}
            compact={true}
          />
        </div>
      </div>

      <div className="gradient-card rounded-2xl p-6 border border-border text-center">
        <h3 className="text-lg font-display text-foreground mb-2">
          {t("forecast.wantFullMonthForecast")}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t("forecast.wantFullMonthForecastDesc")}
        </p>
        <Button
          onClick={handleTelegramClick}
          className="btn-fill bg-primary text-primary-foreground"
        >
          {t("results.bookConsultation")}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
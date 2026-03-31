import { useTranslation } from "react-i18next";
import { YearForecast, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { ArcanaCard } from "./ArcanaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import { PaidBlock } from "./PaidBlock";
interface YearForecastResultProps {
  forecast: YearForecast;
  name: string;
  onReset: () => void;
  isPro?: boolean;
  showProSections?: boolean;
}

export function YearForecastResult({ forecast, name, onReset, isPro = false, showProSections = false }: YearForecastResultProps) {
  const { t } = useTranslation();
  const arcana = getArcana(forecast.arcana);
  const formattedDate = formatBirthDate(
    forecast.birthDate.day,
    forecast.birthDate.month,
    forecast.birthDate.year
  );

  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  const handleDownloadPDF = async () => {
    await generatePDF({
      title: t("forecast.yearForecast"),
      subtitle: `${forecast.targetYear} ${t("forecast.year")}`,
      birthDate: formatBirthDateForPDF(forecast.birthDate.day, forecast.birthDate.month, forecast.birthDate.year),
      name: name || undefined,
      sections: [
        {
          title: `${t("forecast.yourYearArcana")}: ${arcana?.name || forecast.arcana}`,
          content: arcana?.yearForecast || "",
          highlight: true,
        },
        {
          title: t("forecast.arcanaDetails"),
          content: [
            `${t("forecast.planet")}: ${arcana?.planet || "-"}`,
            `${t("forecast.element")}: ${arcana?.element || "-"}`,
          ],
        },
        {
          title: t("forecast.recommendations"),
          content: arcana?.personalDescription || "",
        },
      ],
    });
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={onReset}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      <div className="text-center">
          {t("results.newCalculation")}

        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          {t("forecast.yearForecast")} {t("forecast.forYear", { year: forecast.targetYear })}
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
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-display text-foreground">
            {t("forecast.yourYearArcana")}: {arcana?.name}
          </h2>
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-5xl font-display font-bold text-primary">
              {forecast.arcana}
            </span>
          </div>
        </div>

        {showProSections && (
          <PaidBlock isLocked={!isPro} title="Полный прогноз на год" description="Детальное описание энергий года, рекомендации и подходящие профессии доступны в профессиональном разборе">
            <ArcanaCard
              number={forecast.arcana}
              showYearForecast={true}
              compact={false}
            />
          </PaidBlock>
        )}
      </div>

      
    </div>
  );
}
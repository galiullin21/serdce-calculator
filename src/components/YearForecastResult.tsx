import { useTranslation } from "react-i18next";
import { YearForecast, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { ArcanaCard } from "./ArcanaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, TrendingUp, Heart, Briefcase, Activity, AlertTriangle, Sparkles, CheckCircle, Target } from "lucide-react";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import { cn } from "@/lib/utils";
import { getYearProInterpretation } from "@/lib/proInterpretations";
import type { TierType } from "@/lib/analysisConfig";

interface YearForecastResultProps {
  forecast: YearForecast;
  name: string;
  onReset: () => void;
  tier?: TierType;
}

export function YearForecastResult({ forecast, name, onReset, tier = 'basic' }: YearForecastResultProps) {
  const { t } = useTranslation();
  const isPro = tier === 'professional';
  const arcana = getArcana(forecast.arcana);
  const formattedDate = formatBirthDate(forecast.birthDate.day, forecast.birthDate.month, forecast.birthDate.year);
  const proData = isPro ? getYearProInterpretation(forecast.arcana) : null;

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
          content: [`${t("forecast.planet")}: ${arcana?.planet || "-"}`, `${t("forecast.element")}: ${arcana?.element || "-"}`],
        },
        {
          title: t("forecast.recommendations"),
          content: arcana?.personalDescription || "",
        },
      ],
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onReset}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      <div className="text-center">
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2",
          isPro ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {isPro ? "Профессиональный разбор" : "Базовый разбор"}
        </span>
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          {t("forecast.yearForecast")} {t("forecast.forYear", { year: forecast.targetYear })}
        </h1>
        {name && <p className="text-lg text-foreground mb-1">{t("forecast.for")} {name}</p>}
        <p className="text-muted-foreground">{t("results.birthDate")}: {formattedDate}</p>
      </div>

      {/* Main arcana card */}
      <div className="gradient-card rounded-2xl p-6 border border-primary/30">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-display text-foreground">{t("forecast.yourYearArcana")}: {arcana?.name}</h2>
        </div>
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-5xl font-display font-bold text-primary">{forecast.arcana}</span>
          </div>
        </div>

        <div className="p-4 bg-muted/30 rounded-xl mb-4">
          <p className="text-sm text-muted-foreground">
            <strong>Планета:</strong> {arcana?.planet || "—"} · <strong>Стихия:</strong> {arcana?.element || "—"}
          </p>
        </div>

        <ArcanaCard number={forecast.arcana} showYearForecast={true} compact={false} />
      </div>

      {/* ===== PRO CONTENT ===== */}
      {isPro && proData && (
        <>
          {/* Overview */}
          <div className="gradient-card rounded-2xl p-6 border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display text-foreground">Общий обзор года</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{proData.overview}</p>
          </div>

          {/* Life spheres */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="gradient-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Карьера и работа</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{proData.career}</p>
            </div>
            <div className="gradient-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Финансы</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{proData.money}</p>
            </div>
            <div className="gradient-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Отношения</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{proData.relationships}</p>
            </div>
            <div className="gradient-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Здоровье</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{proData.health}</p>
            </div>
          </div>

          {/* Risks & Opportunities */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="gradient-card rounded-xl p-5 border border-destructive/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-display font-semibold text-foreground">Риски года</h3>
              </div>
              <ul className="space-y-2">
                {proData.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-destructive mt-0.5 flex-shrink-0">⚠</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gradient-card rounded-xl p-5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Возможности</h3>
              </div>
              <ul className="space-y-2">
                {proData.opportunities.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 flex-shrink-0">★</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Monthly focus */}
          <div className="gradient-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display text-foreground">Помесячный фокус</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(proData.monthlyFocus).map(([month, focus]) => {
                const monthNames = ["", "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
                return (
                  <div key={month} className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-xs font-medium text-primary mb-1">{monthNames[Number(month)]}</div>
                    <div className="text-[11px] text-muted-foreground leading-tight">{focus}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="gradient-card rounded-2xl p-6 border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display text-foreground">Рекомендации</h2>
            </div>
            <ul className="space-y-3">
              {proData.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">{i + 1}</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Basic tier upsell */}
      {!isPro && (
        <div className="bg-muted/30 rounded-xl border border-border p-5 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            В профессиональном разборе: детальный анализ по сферам жизни (деньги, карьера, отношения, здоровье), 
            риски и возможности, помесячный фокус и персональные рекомендации.
          </p>
        </div>
      )}
    </div>
  );
}

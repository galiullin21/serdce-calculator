import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, Sparkles, AlertTriangle, TrendingUp, Shield, MessageCircle, Wallet, Flame, CheckCircle } from "lucide-react";
import { CompatibilityResult, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { cn } from "@/lib/utils";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import { getCompatibilityProInterpretation } from "@/lib/proInterpretations";
import type { TierType } from "@/lib/analysisConfig";

interface CompatibilityResultProps {
  result: CompatibilityResult;
  onReset: () => void;
  tier?: TierType;
}

export function CompatibilityResultComponent({ result, onReset, tier = 'basic' }: CompatibilityResultProps) {
  const { t } = useTranslation();
  const isPro = tier === 'professional';

  const unionArcana = getArcana(result.unionArcana);
  const harmonyArcana = getArcana(result.harmonyArcana);
  const karmaArcana = getArcana(result.karmaArcana);
  const person1DestinyArcana = getArcana(result.person1.destinyArcana);
  const person2DestinyArcana = getArcana(result.person2.destinyArcana);
  
  const proData = isPro ? getCompatibilityProInterpretation(
    result.unionArcana, result.harmonyArcana, result.karmaArcana, result.compatibilityPercent
  ) : null;

  const getCompatibilityColor = (percent: number) => {
    if (percent >= 80) return "text-green-600";
    if (percent >= 60) return "text-primary";
    if (percent >= 40) return "text-yellow-600";
    return "text-red-500";
  };
  const getCompatibilityLabel = (percent: number) => {
    if (percent >= 80) return t("compatibility.excellent");
    if (percent >= 60) return t("compatibility.good");
    if (percent >= 40) return t("compatibility.moderate");
    return t("compatibility.challenging");
  };

  const handleDownloadPDF = async () => {
    const person1Date = formatBirthDateForPDF(result.person1.birthDate.day, result.person1.birthDate.month, result.person1.birthDate.year);
    const person2Date = formatBirthDateForPDF(result.person2.birthDate.day, result.person2.birthDate.month, result.person2.birthDate.year);
    await generatePDF({
      title: t("compatibility.title"),
      subtitle: `${result.person1.name} & ${result.person2.name}`,
      birthDate: `${person1Date} / ${person2Date}`,
      sections: [
        { title: `${t("compatibility.compatibilityScore")}: ${result.compatibilityPercent}%`, content: getCompatibilityLabel(result.compatibilityPercent), highlight: true },
        { title: `${t("compatibility.unionArcana")}: ${result.unionArcana} — ${unionArcana?.name || ""}`, content: unionArcana?.compatibilityDescription || unionArcana?.personalDescription || "" },
        { title: t("compatibility.strengths"), content: result.strengths },
        { title: t("compatibility.challenges"), content: result.challenges },
      ],
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      <div className="text-center mb-8">
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2",
          isPro ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {isPro ? "Профессиональный разбор" : "Базовый разбор"}
        </span>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-display text-primary">{t("compatibility.title")}</h1>
        </div>
        <p className="text-muted-foreground">{result.person1.name} & {result.person2.name}</p>
      </div>

      {/* Score */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border mb-8 text-center">
        <div className="mb-4">
          <span className={cn("text-5xl md:text-6xl font-display font-bold", getCompatibilityColor(result.compatibilityPercent))}>
            {result.compatibilityPercent}%
          </span>
        </div>
        <p className={cn("text-lg font-medium", getCompatibilityColor(result.compatibilityPercent))}>
          {getCompatibilityLabel(result.compatibilityPercent)}
        </p>
      </div>

      {/* Partners Info */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[result.person1, result.person2].map((person, idx) => {
          const destinyArcana = idx === 0 ? person1DestinyArcana : person2DestinyArcana;
          return (
            <div key={idx} className="gradient-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">{person.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {formatBirthDate(person.birthDate.day, person.birthDate.month, person.birthDate.year)}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t("compatibility.destinyArcana")}:</span>
                <span className="px-2 py-1 bg-primary/10 rounded text-sm font-medium text-primary">
                  {person.destinyArcana} - {destinyArcana?.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Union Arcana — always shown */}
      <div className="mb-8">
        <h2 className="text-xl font-display text-primary mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          {t("compatibility.unionArcana")}: {result.unionArcana} — {unionArcana?.name}
        </h2>
        <div className="gradient-card rounded-xl p-5 border border-primary/30">
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {unionArcana?.compatibilityDescription || unionArcana?.personalDescription}
          </p>
        </div>
      </div>

      {/* ===== PRO CONTENT ===== */}
      {isPro && proData && (
        <>
          {/* Pair Dynamics */}
          <div className="gradient-card rounded-2xl p-6 border border-primary/20 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display text-foreground">Динамика пары</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{proData.pairDynamics}</p>
          </div>

          {/* Harmony */}
          <div className="mb-8">
            <h3 className="text-lg font-display text-primary mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t("compatibility.harmonyArcana")}: {result.harmonyArcana} — {harmonyArcana?.name}
            </h3>
            <div className="gradient-card rounded-xl p-5 border border-border">
              <p className="text-xs text-muted-foreground mb-3">{t("compatibility.emotionalConnection")}</p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {harmonyArcana?.compatibilityDescription || harmonyArcana?.personalDescription}
              </p>
            </div>
          </div>

          {/* Karma */}
          <div className="mb-8">
            <h3 className="text-lg font-display text-primary mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t("compatibility.karmaArcana")}: {result.karmaArcana} — {karmaArcana?.name}
            </h3>
            <div className="gradient-card rounded-xl p-5 border border-destructive/30">
              <p className="text-xs text-muted-foreground mb-3">{t("compatibility.karmicLesson")}</p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {karmaArcana?.personalDescription}
              </p>
            </div>
          </div>

          {/* Conflict Zones & Growth Areas */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="gradient-card rounded-xl p-5 border border-destructive/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-display font-semibold text-foreground">Зоны конфликтов</h3>
              </div>
              <ul className="space-y-2">
                {proData.conflictZones.map((z, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-destructive mt-0.5 flex-shrink-0">⚠</span>
                    <span>{z}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="gradient-card rounded-xl p-5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Зоны роста</h3>
              </div>
              <ul className="space-y-2">
                {proData.growthAreas.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 flex-shrink-0">↑</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sexual Chemistry & Financial Dynamics */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="gradient-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Сексуальная совместимость</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{proData.sexualChemistry}</p>
            </div>
            <div className="gradient-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Финансовая динамика</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{proData.financialDynamics}</p>
            </div>
          </div>

          {/* Scenarios */}
          <div className="gradient-card rounded-2xl p-6 border border-border mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display text-foreground">Сценарии развития отношений</h2>
            </div>
            <div className="space-y-4">
              {proData.scenarios.map((s, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-xl border",
                  i === 0 ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" :
                  i === 1 ? "bg-muted/30 border-border" :
                  "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                )}>
                  <h4 className="font-display font-semibold text-foreground text-sm mb-2">{s.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Life Tips */}
          <div className="gradient-card rounded-2xl p-6 border border-primary/20 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display text-foreground">Советы на каждый день</h2>
            </div>
            <ul className="space-y-3">
              {proData.dailyLifeTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">{i + 1}</span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Long-term outlook */}
          <div className="gradient-card rounded-2xl p-6 border border-primary/30 bg-primary/5 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display text-foreground">Долгосрочный прогноз</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{proData.longTermOutlook}</p>
          </div>

          {/* Strengths & Challenges */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="gradient-card rounded-xl p-5 border border-border">
              <h3 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {t("compatibility.strengths")}
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="gradient-card rounded-xl p-5 border border-border">
              <h3 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t("compatibility.challenges")}
              </h3>
              <ul className="space-y-2">
                {result.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent mt-0.5">!</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Basic tier: show basic strengths/challenges + upsell */}
      {!isPro && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="gradient-card rounded-xl p-5 border border-border">
              <h3 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {t("compatibility.strengths")}
              </h3>
              <ul className="space-y-2">
                {result.strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="gradient-card rounded-xl p-5 border border-border">
              <h3 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t("compatibility.challenges")}
              </h3>
              <ul className="space-y-2">
                {result.challenges.slice(0, 3).map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent mt-0.5">!</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl border border-border p-5 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              В профессиональном разборе: динамика пары, зоны конфликтов, сексуальная совместимость, 
              финансовая динамика, 3 сценария развития, советы на каждый день и долгосрочный прогноз.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

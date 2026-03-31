import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, Sparkles, AlertTriangle, ExternalLink } from "lucide-react";
import { CompatibilityResult, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { cn } from "@/lib/utils";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";

interface CompatibilityResultProps {
  result: CompatibilityResult;
  onReset: () => void;
}

export function CompatibilityResultComponent({ result, onReset }: CompatibilityResultProps) {
  const { t } = useTranslation();

  const unionArcana = getArcana(result.unionArcana);
  const harmonyArcana = getArcana(result.harmonyArcana);
  const karmaArcana = getArcana(result.karmaArcana);

  const person1DestinyArcana = getArcana(result.person1.destinyArcana);
  const person2DestinyArcana = getArcana(result.person2.destinyArcana);

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
        {
          title: `${t("compatibility.compatibilityScore")}: ${result.compatibilityPercent}%`,
          content: getCompatibilityLabel(result.compatibilityPercent),
          highlight: true,
        },
        {
          title: result.person1.name,
          content: [
            `${t("results.birthDate")}: ${person1Date}`,
            `${t("compatibility.destinyArcana")}: ${result.person1.destinyArcana} — ${person1DestinyArcana?.name || ""}`,
            "",
            person1DestinyArcana?.personalDescription || "",
          ],
        },
        {
          title: result.person2.name,
          content: [
            `${t("results.birthDate")}: ${person2Date}`,
            `${t("compatibility.destinyArcana")}: ${result.person2.destinyArcana} — ${person2DestinyArcana?.name || ""}`,
            "",
            person2DestinyArcana?.personalDescription || "",
          ],
        },
        {
          title: `${t("compatibility.unionArcana")}: ${result.unionArcana} — ${unionArcana?.name || ""}`,
          content: unionArcana?.compatibilityDescription || unionArcana?.personalDescription || "",
        },
        {
          title: `${t("compatibility.harmonyArcana")}: ${result.harmonyArcana} — ${harmonyArcana?.name || ""}`,
          content: [
            t("compatibility.emotionalConnection"),
            "",
            harmonyArcana?.compatibilityDescription || harmonyArcana?.personalDescription || "",
          ],
        },
        {
          title: `${t("compatibility.karmaArcana")}: ${result.karmaArcana} — ${karmaArcana?.name || ""}`,
          content: [
            t("compatibility.karmicLesson"),
            "",
            karmaArcana?.personalDescription || "",
          ],
        },
        {
          title: t("compatibility.strengths"),
          content: result.strengths,
        },
        {
          title: t("compatibility.challenges"),
          content: result.challenges,
        },
      ],
    });
  };
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-display text-primary">
            {t("compatibility.title")}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {result.person1.name} & {result.person2.name}
        </p>
      </div>

      {/* Compatibility Score */}
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
        <div className="gradient-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">{result.person1.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {formatBirthDate(result.person1.birthDate.day, result.person1.birthDate.month, result.person1.birthDate.year)}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t("compatibility.destinyArcana")}:</span>
            <span className="px-2 py-1 bg-primary/10 rounded text-sm font-medium text-primary">
              {result.person1.destinyArcana} - {person1DestinyArcana?.name}
            </span>
          </div>
        </div>

        <div className="gradient-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">{result.person2.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {formatBirthDate(result.person2.birthDate.day, result.person2.birthDate.month, result.person2.birthDate.year)}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t("compatibility.destinyArcana")}:</span>
            <span className="px-2 py-1 bg-primary/10 rounded text-sm font-medium text-primary">
              {result.person2.destinyArcana} - {person2DestinyArcana?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Union Arcana */}
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

      {/* Harmony Arcana */}
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

      {/* Karma Arcana */}
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

      {/* Strengths & Challenges */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="gradient-card rounded-xl p-5 border border-border">
          <h3 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {t("compatibility.strengths")}
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5">✓</span>
                {strength}
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
            {result.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-accent mt-0.5">!</span>
                {challenge}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border text-center">
        <h3 className="text-xl font-display text-primary mb-2">
          {t("compatibility.wantDeepAnalysis")}
        </h3>
        <p className="text-muted-foreground mb-4 text-sm">
          {t("compatibility.deepAnalysisDesc")}
        </p>
        <Button
          onClick={() => window.open("https://t.me/BisnessWomenN", "_blank")}
          className="btn-fill bg-primary text-primary-foreground border-2 border-primary"
        >
          {t("results.bookConsultation")}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FinancialCodeResult as FinancialCodeType } from "@/lib/financialCode";
import { getArcana } from "@/lib/arcana";
import { ArrowLeft, Wallet, Star, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TierType } from "@/lib/analysisConfig";

interface Props {
  result: FinancialCodeType;
  name: string;
  onReset: () => void;
  tier?: TierType;
}

export function FinancialCodeResultComponent({ result, name, onReset, tier = 'basic' }: Props) {
  const isPro = tier === 'professional';

  const allCards = [
    { arcana: result.talentArcana, title: 'Талант для заработка', desc: result.talentDesc, icon: Star, color: 'text-yellow-500' },
    { arcana: result.resourceArcana, title: 'Финансовый ресурс', desc: result.resourceDesc, icon: Wallet, color: 'text-green-500' },
    { arcana: result.missionArcana, title: 'Финансовая миссия', desc: result.missionDesc, icon: Shield, color: 'text-blue-500' },
    { arcana: result.blockArcana, title: 'Финансовый блок', desc: result.blockDesc, icon: AlertTriangle, color: 'text-red-400' },
  ];

  // Basic: first 2 cards. Pro: all 4
  const shownCards = isPro ? allCards : allCards.slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={onReset} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Новый расчёт
      </Button>

      <div className="text-center mb-4">
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2",
          isPro ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {isPro ? "Профессиональный разбор" : "Базовый разбор"}
        </span>
      </div>

      <div className="gradient-card rounded-2xl p-6 border border-border mb-6">
        <h2 className="text-2xl font-display text-primary mb-1">Финансовый код</h2>
        <p className="text-muted-foreground text-sm mb-6">
          {name ? `${name}, ` : ''}дата рождения: {result.birthDate.day}.{String(result.birthDate.month).padStart(2, '0')}.{result.birthDate.year}
        </p>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {allCards.map((card) => {
            const arcanaData = getArcana(card.arcana);
            return (
              <div key={card.title} className="bg-card rounded-xl border border-border p-4 text-center">
                <card.icon className={`w-5 h-5 mx-auto mb-2 ${card.color}`} />
                <div className="text-2xl font-display text-primary mb-1">{card.arcana}</div>
                <div className="text-xs text-muted-foreground">{arcanaData?.name}</div>
                <div className="text-[10px] text-muted-foreground/70 mt-1">{card.title}</div>
              </div>
            );
          })}
        </div>

        {/* Shown card details */}
        <Accordion type="single" collapsible defaultValue="card-0">
          {shownCards.map((card, i) => (
            <AccordionItem key={i} value={`card-${i}`} className="border-border">
              <AccordionTrigger className="hover:no-underline py-3">
                <span className="font-display text-foreground text-sm flex items-center gap-2">
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                  {card.title} — {card.arcana} ({getArcana(card.arcana)?.name})
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-4">{card.desc}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Professions — only in pro */}
        {isPro && result.professions.length > 0 && (
          <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <h3 className="font-display text-foreground text-sm mb-2">Рекомендуемые профессии для заработка</h3>
            <div className="flex flex-wrap gap-2">
              {result.professions.map((p, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground">{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

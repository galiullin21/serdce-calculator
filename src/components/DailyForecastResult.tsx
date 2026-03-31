import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DailyForecastResult as DailyForecastType } from "@/lib/dailyForecast";
import { getArcana } from "@/lib/arcana";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TierType } from "@/lib/analysisConfig";

interface Props {
  result: DailyForecastType;
  name: string;
  onReset: () => void;
  tier?: TierType;
}

export function DailyForecastResultComponent({ result, name, onReset, tier = 'basic' }: Props) {
  const isPro = tier === 'professional';
  const { targetDate, positions } = result;
  const dateStr = `${targetDate.day}.${String(targetDate.month).padStart(2, '0')}.${targetDate.year}`;

  // Basic: first 4. Pro: all positions
  const shownPositions = isPro ? positions : positions.slice(0, 4);

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
        <h2 className="text-2xl font-display text-primary mb-1">Прогноз на день</h2>
        <p className="text-muted-foreground text-sm mb-4">
          {name ? `${name}, ` : ''}дата: {dateStr}
        </p>

        <Accordion type="single" collapsible defaultValue={`pos-${shownPositions[0]?.position}`}>
          {shownPositions.map((pos) => {
            const arcanaData = getArcana(pos.arcana);
            return (
              <AccordionItem key={pos.position} value={`pos-${pos.position}`} className="border-border">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{pos.arcana}</span>
                    <div>
                      <span className="font-display text-foreground text-sm">{pos.title}</span>
                      <span className="text-xs text-muted-foreground ml-2">{arcanaData?.name}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">{pos.description}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

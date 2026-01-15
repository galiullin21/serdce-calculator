import { useState } from "react";
import { DateInput } from "@/components/DateInput";
import { MethodSelector } from "@/components/MethodSelector";
import { NumerologyResult } from "@/components/NumerologyResult";
import { StarField } from "@/components/StarField";
import { calculateNumerology, NumerologyResult as Result } from "@/lib/numerology";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [selectedMethod, setSelectedMethod] = useState("keyto");
  const [result, setResult] = useState<Result | null>(null);
  const [userName, setUserName] = useState("");

  const handleCalculate = (day: number, month: number, year: number, name: string) => {
    const numerologyResult = calculateNumerology(day, month, year);
    setResult(numerologyResult);
    setUserName(name);
  };

  const handleReset = () => {
    setResult(null);
    setUserName("");
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <StarField />
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Нумерология KeyTo</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            Ключ к себе —{" "}
            <span className="text-primary">ключ ко всему</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Откройте тайны своей судьбы через древнее искусство нумерологии. 
            Узнайте свои числа и поймите свой истинный путь.
          </p>
        </header>

        {/* Main Content */}
        {!result ? (
          <>
            <MethodSelector
              selectedMethod={selectedMethod}
              onMethodChange={setSelectedMethod}
            />
            <DateInput onCalculate={handleCalculate} />
          </>
        ) : (
          <NumerologyResult
            result={result}
            name={userName}
            onReset={handleReset}
          />
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Методика основана на книге "KeyTo. Ключ к себе — ключ ко всему"
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

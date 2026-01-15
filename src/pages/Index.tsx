import { useState } from "react";
import { Header } from "@/components/Header";
import { DateInput } from "@/components/DateInput";
import { MethodSelector } from "@/components/MethodSelector";
import { NumerologyResult } from "@/components/NumerologyResult";
import { StarField } from "@/components/StarField";
import { calculateNumerology, NumerologyResult as Result } from "@/lib/numerology";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, FileText, Building, Type, Wallet, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const analysisTypes = [
  {
    id: "full",
    title: "Полный разбор",
    description: "Описание Ваших данностей и жизненного пути. Разбор матрицы и главные рекомендации.",
    icon: FileText,
    available: true,
    hasPro: true,
  },
  {
    id: "compatibility",
    title: "Разбор совместимости",
    description: "Проверка общей энергии в паре или в группе людей. Главные рекомендации для вашей общей энергии.",
    icon: Users,
    available: false,
    hasPro: true,
  },
  {
    id: "contract",
    title: "Энергия договора",
    description: "Совместимость партнеров с договором (брак, бизнес и другие документы) или определенной датой.",
    icon: Building,
    available: false,
    hasPro: true,
  },
  {
    id: "name",
    title: "Энергия названия",
    description: "Проверьте энергию названия вашего продукта или компании. Выберите лучшее название!",
    icon: Type,
    available: false,
    hasPro: false,
  },
  {
    id: "finance",
    title: "Финансовый код",
    description: "Узнайте свой финансовый потенциал и лучшие способы заработка по вашей дате рождения.",
    icon: Wallet,
    available: false,
    hasPro: false,
  },
];

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

  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  return (
    <div className="min-h-screen relative">
      <StarField />
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {!result ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Нумерология KeyTo</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                Ключ к себе — <span className="text-primary">ключ ко всему</span>
              </h1>
              
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Откройте тайны своей судьбы через древнее искусство нумерологии
              </p>
            </div>

            {/* Business Analysis Hero Card */}
            <div className="gradient-card rounded-2xl p-6 md:p-8 shadow-elevated border border-primary/30 mb-8 max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-3">
                Бизнес разбор
              </h2>
              <p className="text-muted-foreground mb-6">
                Профессиональный разбор для Ваших сотрудников и для Вас. Способности человека, 
                подходящая сфера работы и наилучший путь реализации.
              </p>
              
              <MethodSelector
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
              />
              <DateInput onCalculate={handleCalculate} />
            </div>

            {/* Analysis Types Grid */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {analysisTypes.map((type) => (
                <div
                  key={type.id}
                  className={cn(
                    "gradient-card rounded-2xl p-6 shadow-card border transition-all duration-300",
                    type.available 
                      ? "border-border/50 hover:border-primary/30 hover:shadow-elevated cursor-pointer" 
                      : "border-border/30 opacity-70"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      type.available ? "bg-primary/20" : "bg-muted"
                    )}>
                      <type.icon className={cn(
                        "w-6 h-6",
                        type.available ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-display font-bold text-foreground">
                          {type.title}
                        </h3>
                        {!type.available && <Lock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {type.description}
                      </p>
                      
                      {type.available ? (
                        <div className="flex gap-3">
                          {type.hasPro && (
                            <Button
                              variant="outline"
                              onClick={handleTelegramClick}
                              className="border-primary/50 text-primary hover:bg-primary/10"
                            >
                              Профессиональный
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            className="bg-foreground text-background hover:bg-foreground/90"
                          >
                            Базовый
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            disabled
                            className="border-border/50"
                          >
                            Скоро
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <NumerologyResult
            result={result}
            name={userName}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default Index;

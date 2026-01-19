import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { DateInput } from "@/components/DateInput";
import { MethodSelector } from "@/components/MethodSelector";
import { MethodologySelector } from "@/components/MethodologySelector";
import { YearForecastResult } from "@/components/YearForecastResult";
import { MonthForecastResult } from "@/components/MonthForecastResult";
import { PersonalMatrixResult } from "@/components/PersonalMatrixResult";
import { KeyToResultComponent } from "@/components/KeyToResult";
import { 
  calculateYearForecast, 
  calculateMonthForecast, 
  calculatePersonalMatrix,
  YearForecast,
  MonthForecast,
  PersonalMatrix
} from "@/lib/calculations";
import { calculateKeyTo, KeyToResult } from "@/lib/keyto";
import { Button } from "@/components/ui/button";
import { Users, FileText, Building, Type, Wallet, Lock, ExternalLink, Calendar, CalendarDays } from "lucide-react";
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
    id: "contract",
    title: "Энергия договора",
    description: "Совместимость партнеров с договором (брак, бизнес и другие документы) или определенной датой.",
    icon: Building,
    available: false,
    hasPro: true,
  },
  {
    id: "month",
    title: "Прогноз на месяц",
    description: "Узнайте энергии предстоящего месяца и получите рекомендации для достижения ваших целей.",
    icon: Calendar,
    available: true,
    hasPro: true,
  },
  {
    id: "year",
    title: "Прогноз на год",
    description: "Полный прогноз на год с помесячной разбивкой и ключевыми периодами для важных решений.",
    icon: CalendarDays,
    available: true,
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

const marqueeWords = ["Трансформация", "Смысл", "Гармония"];

type ResultType = 
  | { type: "year"; data: YearForecast }
  | { type: "month"; data: MonthForecast }
  | { type: "purpose"; data: PersonalMatrix }
  | { type: "keyto"; data: KeyToResult }
  | null;

const Index = () => {
  const [selectedMethodology, setSelectedMethodology] = useState<"1" | "2">("2");
  const [selectedMethod, setSelectedMethod] = useState("purpose");
  const [result, setResult] = useState<ResultType>(null);
  const [userName, setUserName] = useState("");

  // Reset method when methodology changes
  useEffect(() => {
    if (selectedMethodology === "1") {
      setSelectedMethod("classic-full");
    } else {
      setSelectedMethod("purpose");
    }
  }, [selectedMethodology]);

  const handleCalculate = (
    day: number, 
    month: number, 
    year: number, 
    name: string,
    targetMonth?: number,
    targetYear?: number
  ) => {
    setUserName(name);
    
    // Methodology 1 - Classic numerology
    if (selectedMethodology === "1") {
      const classicResult = calculateKeyTo(day, month, year);
      setResult({ type: "keyto", data: classicResult });
      return;
    }
    
    // Methodology 2 - 22 Arcana
    switch (selectedMethod) {
      case "year":
        const yearForecast = calculateYearForecast(day, month, year, targetYear || new Date().getFullYear());
        setResult({ type: "year", data: yearForecast });
        break;
      case "month":
        const monthForecast = calculateMonthForecast(
          day, 
          month, 
          year, 
          targetMonth || new Date().getMonth() + 1,
          targetYear || new Date().getFullYear()
        );
        setResult({ type: "month", data: monthForecast });
        break;
      case "purpose":
        const personalMatrix = calculatePersonalMatrix(day, month, year);
        setResult({ type: "purpose", data: personalMatrix });
        break;
    }
  };

  const handleReset = () => {
    setResult(null);
    setUserName("");
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="relative z-10">
        {!result ? (
          <>
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 overflow-hidden">
              <div className="container mx-auto px-4 relative">
                <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display text-primary mb-6 tracking-wide">
                    СЕРДЦЕ ПИЛИГРИМА
                  </h1>
                  
                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
                    «Сердце Пилигрима» — это пространство поддержки, где психология и нумерология помогают разобраться в себе и своих жизненных ситуациях.
                  </p>
                  
                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
                    Здесь мы разбираем конкретные вопросы — отношения, деньги, выбор пути, внутренние конфликты.
                  </p>
                  
                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                    Простыми словами: помогаем понять, почему в жизни происходит именно так и что с этим можно сделать дальше. Здесь вы получите полный разбор вашей ситуации и рабочий план действий. <span className="font-semibold text-foreground">Добро пожаловать!</span>
                  </p>
                  
                  <Button
                    onClick={handleTelegramClick}
                    size="lg"
                    className="btn-fill animate-gentle-shake bg-primary hover:bg-primary text-primary-foreground font-medium px-8 py-6 text-base rounded-full border-2 border-primary"
                  >
                    Записаться на консультацию
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Marquee */}
            <div className="gradient-brown text-white py-3 overflow-hidden">
              <div className="flex animate-marquee whitespace-nowrap">
                {[...Array(6)].map((_, groupIndex) => (
                  <div key={groupIndex} className="flex items-center">
                    {marqueeWords.map((word, index) => (
                      <span key={`${groupIndex}-${index}`} className="flex items-center">
                        <span className="mx-6 text-sm md:text-base font-medium">{word}</span>
                        <span className="text-white/50">•</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Calculator Section */}
            <section className="py-12 md:py-16">
              <div className="container mx-auto px-4">
                <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border mb-12 max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-display text-primary mb-6 text-center">
                    Путь к себе начинается здесь ❤️
                  </h2>
                  
                  <MethodologySelector
                    selectedMethodology={selectedMethodology}
                    onMethodologyChange={setSelectedMethodology}
                  />
                  
                  <MethodSelector
                    selectedMethod={selectedMethod}
                    selectedMethodology={selectedMethodology}
                    onMethodChange={setSelectedMethod}
                  />
                  <DateInput 
                    selectedMethod={selectedMethod}
                    onCalculate={handleCalculate} 
                  />
                </div>

                {/* Analysis Types Grid */}
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {analysisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={cn(
                        "gradient-card rounded-2xl p-6 border transition-all duration-300",
                        type.available 
                          ? "border-border hover:border-primary/30 cursor-pointer" 
                          : "border-border/50 opacity-70"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                          type.available ? "bg-primary/10" : "bg-muted"
                        )}>
                          <type.icon className={cn(
                            "w-6 h-6",
                            type.available ? "text-primary" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-display text-foreground">
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
                                  className="btn-fill border-primary text-primary hover:text-white"
                                >
                                  Профессиональный
                                </Button>
                              )}
                              <Button
                                className="btn-fill animate-gentle-shake bg-primary text-primary-foreground border-2 border-primary"
                              >
                                Базовый
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                disabled
                                className="border-border"
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
              </div>
            </section>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8">
            {result.type === "year" && (
              <YearForecastResult
                forecast={result.data}
                name={userName}
                onReset={handleReset}
              />
            )}
            {result.type === "month" && (
              <MonthForecastResult
                forecast={result.data}
                name={userName}
                onReset={handleReset}
              />
            )}
            {result.type === "purpose" && (
              <PersonalMatrixResult
                matrix={result.data}
                name={userName}
                onReset={handleReset}
              />
            )}
            {result.type === "keyto" && (
              <KeyToResultComponent
                result={result.data}
                name={userName}
                onReset={handleReset}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

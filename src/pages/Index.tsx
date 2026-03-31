import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { DateInput } from "@/components/DateInput";
import { CompatibilityDateInput } from "@/components/CompatibilityDateInput";
import { YearForecastResult } from "@/components/YearForecastResult";
import { MonthForecastResult } from "@/components/MonthForecastResult";
import { PersonalMatrixResult } from "@/components/PersonalMatrixResult";
import { KeyToResultComponent } from "@/components/KeyToResult";
import { CompatibilityResultComponent } from "@/components/CompatibilityResult";
import { AncestralResultComponent } from "@/components/AncestralResult";
import { DailyForecastResultComponent } from "@/components/DailyForecastResult";
import { FinancialCodeResultComponent } from "@/components/FinancialCodeResult";
import { NameEnergyResultComponent } from "@/components/NameEnergyResult";
import { ContractEnergyResultComponent } from "@/components/ContractEnergyResult";
import { OnboardingFlow, ScenarioType } from "@/components/onboarding/OnboardingFlow";
import { LifeCodInputForm, LifeCodResult, UnifiedPersonalResult } from "@/components/lifecod";
import { 
  calculateYearForecast, 
  calculateMonthForecast, 
  calculatePersonalMatrix,
  calculateCompatibility,
  YearForecast,
  MonthForecast,
  PersonalMatrix,
  CompatibilityResult
} from "@/lib/calculations";
import { calculateKeyTo, KeyToResult } from "@/lib/keyto";
import { calculateAncestralPrograms, AncestralResult } from "@/lib/ancestral";
import { calculateLifeCodCompatibility, LifeCodCompatibilityResult, RelationType, calculateUnifiedPersonalAnalysis, UnifiedPersonalAnalysis } from "@/lib/lifecod";
import { calculateDailyForecast, DailyForecastResult as DailyForecastType } from "@/lib/dailyForecast";
import { calculateFinancialCode, FinancialCodeResult as FinancialCodeType } from "@/lib/financialCode";
import { calculateNameEnergy, NameEnergyResult as NameEnergyType } from "@/lib/nameEnergy";
import { LifeCodPersonalResult } from "@/components/lifecod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, FileText, Building, Type, Wallet, Lock, ExternalLink, Calendar, CalendarDays, Compass, Brain, Clock, Sparkles, Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Check if user has seen onboarding
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const seen = localStorage.getItem("lifecod-onboarding-seen");
    return !seen;
  });
  const analysisTypes = [
    {
      id: "full",
      titleKey: "analysisTypes.fullAnalysis",
      descKey: "analysisTypes.fullAnalysisDesc",
      icon: FileText,
      available: true,
      hasPro: true,
    },
    {
      id: "contract",
      titleKey: "analysisTypes.contractEnergy",
      descKey: "analysisTypes.contractEnergyDesc",
      icon: Building,
      available: true,
      hasPro: true,
    },
    {
      id: "month",
      titleKey: "analysisTypes.monthForecast",
      descKey: "analysisTypes.monthForecastDesc",
      icon: Calendar,
      available: true,
      hasPro: true,
    },
    {
      id: "year",
      titleKey: "analysisTypes.yearForecast",
      descKey: "analysisTypes.yearForecastDesc",
      icon: CalendarDays,
      available: true,
      hasPro: true,
    },
    {
      id: "name",
      titleKey: "analysisTypes.nameEnergy",
      descKey: "analysisTypes.nameEnergyDesc",
      icon: Type,
      available: true,
      hasPro: false,
    },
    {
      id: "finance",
      titleKey: "analysisTypes.financialCode",
      descKey: "analysisTypes.financialCodeDesc",
      icon: Wallet,
      available: true,
      hasPro: false,
    },
  ];

  const marqueeWords = [
    t("marquee.transformation"),
    t("marquee.meaning"),
    t("marquee.harmony")
  ];

  // Methods for Methodology 1 (22 Arcana)
  const arcanaMethodsList = [
    {
      id: "purpose",
      name: t("methods.purpose"),
      description: t("methods.purposeDesc"),
      available: true,
      icon: Compass,
    },
    {
      id: "compatibility",
      name: t("methods.compatibility"),
      description: t("methods.compatibilityDesc"),
      available: true,
      icon: Users,
    },
    {
      id: "year",
      name: t("methods.yearForecast"),
      description: t("methods.yearForecastDesc"),
      available: true,
      icon: CalendarDays,
    },
    {
      id: "month",
      name: t("methods.monthForecast"),
      description: t("methods.monthForecastDesc"),
      available: true,
      icon: Calendar,
    },
    {
      id: "day",
      name: t("methods.dayForecast"),
      description: t("methods.dayForecastDesc"),
      available: true,
      icon: Clock,
    },
    {
      id: "ancestral",
      name: t("methods.ancestral"),
      description: t("methods.ancestralDesc"),
      available: true,
      icon: Brain,
    },
    {
      id: "contract",
      name: t("analysisTypes.contractEnergy"),
      description: t("analysisTypes.contractEnergyDesc"),
      available: true,
      icon: Building,
    },
    {
      id: "name",
      name: t("analysisTypes.nameEnergy"),
      description: t("analysisTypes.nameEnergyDesc"),
      available: true,
      icon: Type,
    },
    {
      id: "finance",
      name: t("analysisTypes.financialCode"),
      description: t("analysisTypes.financialCodeDesc"),
      available: true,
      icon: Wallet,
    },
  ];

type ResultType = 
  | { type: "year"; data: YearForecast }
  | { type: "month"; data: MonthForecast }
  | { type: "purpose"; data: PersonalMatrix }
  | { type: "keyto"; data: KeyToResult }
  | { type: "compatibility"; data: CompatibilityResult }
  | { type: "ancestral"; data: AncestralResult }
  | { type: "lifecod"; data: LifeCodCompatibilityResult }
  | { type: "lifecod-personal"; data: { name: string; day: number; month: number; year: number } }
  | { type: "unified-personal"; data: UnifiedPersonalAnalysis }
  | { type: "day"; data: DailyForecastType }
  | { type: "finance"; data: FinancialCodeType }
  | { type: "name"; data: NameEnergyType }
  | { type: "contract"; data: DailyForecastType }
  | null;

   const [selectedMethodology, setSelectedMethodology] = useState<"1" | "2">("1");
  const [selectedMethod, setSelectedMethod] = useState("purpose");
  const [result, setResult] = useState<ResultType>(null);
  const [userName, setUserName] = useState("");
  const [nameEnergyInput, setNameEnergyInput] = useState("");
  const [showPro, setShowPro] = useState(false);

  // Life C⚙D compatibility handler
  const handleLifeCodCalculate = (
    person1Name: string, person1Day: number, person1Month: number, person1Year: number,
    person2Name: string, person2Day: number, person2Month: number, person2Year: number,
    relationType: RelationType
  ) => {
    const lifecodResult = calculateLifeCodCompatibility(
      person1Name, person1Day, person1Month, person1Year,
      person2Name, person2Day, person2Month, person2Year,
      relationType
    );
    setResult({ type: "lifecod", data: lifecodResult });
  };

  // Reset method when methodology changes
  useEffect(() => {
    if (selectedMethodology === "2") {
      setSelectedMethod("lifecod-personal");
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
    targetYear?: number,
    gender?: 'male' | 'female',
    targetDay?: number
  ) => {
    setUserName(name);
    
    // Methodology 2 - Unified personal analysis
    if (selectedMethodology === "2") {
      if (selectedMethod === "lifecod-personal") {
        const unifiedResult = calculateUnifiedPersonalAnalysis(name || "Вы", day, month, year, targetYear || new Date().getFullYear());
        setResult({ type: "unified-personal", data: unifiedResult });
        return;
      }
      const classicResult = calculateKeyTo(day, month, year);
      setResult({ type: "keyto", data: classicResult });
      return;
    }
    
    // Methodology 1 - 22 Arcana
    switch (selectedMethod) {
      case "year":
        const yearForecast = calculateYearForecast(day, month, year, targetYear || new Date().getFullYear());
        setResult({ type: "year", data: yearForecast });
        break;
      case "month":
        const monthForecast = calculateMonthForecast(
          day, month, year, 
          targetMonth || new Date().getMonth() + 1,
          targetYear || new Date().getFullYear()
        );
        setResult({ type: "month", data: monthForecast });
        break;
      case "day": {
        const daily = calculateDailyForecast(
          day, month, year,
          targetDay || new Date().getDate(),
          targetMonth || new Date().getMonth() + 1,
          targetYear || new Date().getFullYear()
        );
        setResult({ type: "day", data: daily });
        break;
      }
      case "contract": {
        const contract = calculateDailyForecast(
          day, month, year,
          targetDay || new Date().getDate(),
          targetMonth || new Date().getMonth() + 1,
          targetYear || new Date().getFullYear()
        );
        setResult({ type: "contract", data: contract });
        break;
      }
      case "finance": {
        const finance = calculateFinancialCode(day, month, year);
        setResult({ type: "finance", data: finance });
        break;
      }
      case "ancestral":
        const ancestralResult = calculateAncestralPrograms(day, month, year, gender || 'female');
        setResult({ type: "ancestral", data: ancestralResult });
        break;
      case "purpose":
      default:
        const personalMatrix = calculatePersonalMatrix(day, month, year);
        setResult({ type: "purpose", data: personalMatrix });
        break;
    }
  };

  const handleNameEnergyCalculate = () => {
    if (nameEnergyInput.trim()) {
      const nameResult = calculateNameEnergy(nameEnergyInput.trim());
      setResult({ type: "name", data: nameResult });
    }
  };

  const handleCompatibilityCalculate = (
    person1Day: number, person1Month: number, person1Year: number, person1Name: string,
    person2Day: number, person2Month: number, person2Year: number, person2Name: string
  ) => {
    const compatResult = calculateCompatibility(
      person1Day, person1Month, person1Year, person1Name,
      person2Day, person2Month, person2Year, person2Name
    );
    setResult({ type: "compatibility", data: compatResult });
  };

  const handleReset = () => {
    setResult(null);
    setUserName("");
    setShowPro(false);
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/BisnessWomenN", "_blank");
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleOnboardingComplete = (scenario: ScenarioType) => {
    localStorage.setItem("lifecod-onboarding-seen", "true");
    setShowOnboarding(false);
    
    // Redirect based on scenario
    if (scenario === "crisis") {
      navigate("/crisis");
    } else if (scenario === "forecast") {
      setSelectedMethod("year");
    } else if (scenario === "period") {
      setSelectedMethod("purpose");
    }
    // diagnosis -> stays on purpose (default)
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem("lifecod-onboarding-seen", "true");
    setShowOnboarding(false);
  };

  // Show onboarding flow for first-time visitors
  if (showOnboarding) {
    return (
      <div className="min-h-screen">
        <Header />
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="relative z-10">
        {!result ? (
          <>
            {/* Hero Section */}
            <section className="relative py-8 md:py-16 lg:py-24 overflow-hidden">
              <div className="container mx-auto px-4 relative">
                <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display text-primary mb-4 md:mb-6 tracking-wide">
                    {t("hero.title")}
                  </h1>
                  
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-3 md:mb-4 leading-relaxed">
                    {t("hero.description1")}
                  </p>
                  
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-3 md:mb-4 leading-relaxed">
                    {t("hero.description2")}
                  </p>
                  
                  <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
                    {t("hero.description3")} <span className="font-semibold text-foreground">{t("hero.welcome")}</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Marquee */}
            <div className="gradient-brown text-white py-2 md:py-3 overflow-hidden">
              <div className="flex animate-marquee whitespace-nowrap">
                {[...Array(6)].map((_, groupIndex) => (
                  <div key={groupIndex} className="flex items-center">
                    {marqueeWords.map((word, index) => (
                      <span key={`${groupIndex}-${index}`} className="flex items-center">
                        <span className="mx-4 md:mx-6 text-xs md:text-sm lg:text-base font-medium">{word}</span>
                        <span className="text-white/50">•</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Calculator Section */}
            <section className="py-8 md:py-12 lg:py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display text-primary mb-6 md:mb-8 text-center">
                    {t("calculator.title")}
                  </h2>
                  
                  <p className="text-sm text-muted-foreground text-center mb-4 md:mb-6">
                    {t("calculator.selectMethodology")}
                  </p>

                  {/* Methodology 1 - 22 Arcana */}
                  <div className="mb-4 md:mb-6">
                    <button
                      onClick={() => setSelectedMethodology("1")}
                      className={cn(
                        "relative w-full p-4 md:p-5 rounded-xl border-2 transition-all duration-300 text-left",
                        selectedMethodology === "1"
                          ? "bg-primary/5 border-primary shadow-warm"
                          : "bg-card border-border hover:border-primary/50"
                      )}
                    >
                      <div className="absolute -top-3 left-4 md:left-1/2 md:-translate-x-1/2 px-2 md:px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {t("methodology.moreAccurate")}
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          selectedMethodology === "1"
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        )}>
                          {selectedMethodology === "1" && (
                            <Check className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-display font-semibold text-foreground text-base md:text-lg">
                              {t("methodology.methodology1")}
                            </h3>
                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                              {t("methodology.arcana22")}
                            </span>
                          </div>
                          
                          <p className="text-xs md:text-sm text-muted-foreground mb-3">
                            {t("methodology.arcanaDescription")}
                          </p>
                          
                          <div className="flex flex-wrap gap-1">
                            {[
                              t("methodology.features.purpose"),
                              t("methodology.features.compatibility"),
                              t("methodology.features.forecasts"),
                              t("methodology.features.lifePeriods"),
                            ].map((feature, i) => (
                              <span 
                                key={i}
                                className="text-xs px-2 py-1 bg-secondary/50 rounded-full text-muted-foreground"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Methods grid - shown when Methodology 1 is selected */}
                  {selectedMethodology === "1" && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                        {arcanaMethodsList.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => method.available && handleMethodSelect(method.id)}
                            disabled={!method.available}
                            className={cn(
                              "relative p-3 md:p-4 rounded-xl border transition-all duration-300 text-left",
                              method.available
                                ? selectedMethod === method.id
                                  ? "bg-primary/10 border-primary shadow-warm"
                                  : "bg-card border-border hover:border-primary/50"
                                : "bg-muted border-border cursor-not-allowed opacity-60"
                            )}
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <method.icon className={cn("w-4 h-4 md:w-5 md:h-5", method.available ? "text-primary" : "text-muted-foreground")} />
                                {selectedMethod === method.id && method.available && (
                                  <Sparkles className="w-3 h-3 text-primary" />
                                )}
                                {!method.available && (
                                  <span className="text-[10px] md:text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{t("methods.soon")}</span>
                                )}
                              </div>
                              <div>
                                <h4 className="font-display font-semibold text-foreground text-xs md:text-sm">
                                  {method.name}
                                </h4>
                                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                  {method.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Methodology 2 - Classic with Life C⚙D Compatibility */}
                  <div className="mb-6 md:mb-8">
                    <button
                      onClick={() => setSelectedMethodology("2")}
                      className={cn(
                        "relative w-full p-4 md:p-5 rounded-xl border-2 transition-all duration-300 text-left",
                        selectedMethodology === "2"
                          ? "bg-primary/5 border-primary shadow-warm"
                          : "bg-card border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          selectedMethodology === "2"
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        )}>
                          {selectedMethodology === "2" && (
                            <Check className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-display font-semibold text-foreground text-base md:text-lg">
                              {t("methodology.methodology2")}
                            </h3>
                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                              {t("methodology.classic")}
                            </span>
                          </div>
                          
                          <p className="text-xs md:text-sm text-muted-foreground mb-3">
                            {t("methodology.classicDescription")}
                          </p>
                          
                          <div className="flex flex-wrap gap-1">
                            {[
                              t("methodology.features.mindNumber"),
                              t("methodology.features.actionNumber"),
                              t("methodology.features.realizationNumber"),
                              t("methodology.features.outcomeNumber"),
                            ].map((feature, i) => (
                              <span 
                                key={i}
                                className="text-xs px-2 py-1 bg-secondary/50 rounded-full text-muted-foreground"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Life C⚙D Compatibility Section for Methodology 2 */}
                    {selectedMethodology === "2" && (
                      <div className="mt-4 space-y-4">
                        {/* Personal Analysis */}
                        <button
                          onClick={() => setSelectedMethod("lifecod-personal")}
                          className={cn(
                            "w-full p-4 rounded-xl border-2 transition-all duration-300 text-left",
                            selectedMethod === "lifecod-personal"
                              ? "bg-primary/10 border-primary"
                              : "bg-card border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Brain className={cn(
                              "w-5 h-5",
                              selectedMethod === "lifecod-personal" ? "text-primary" : "text-muted-foreground"
                            )} />
                            <div>
                              <h4 className="font-medium text-sm">Персональный разбор</h4>
                              <p className="text-xs text-muted-foreground">Сознание, действия, пиннакли, кризисы, помесячный прогноз</p>
                            </div>
                          </div>
                        </button>

                        {/* Extended Compatibility Option */}
                        <button
                          onClick={() => setSelectedMethod("lifecod-compatibility")}
                          className={cn(
                            "w-full p-4 rounded-xl border-2 transition-all duration-300 text-left",
                            selectedMethod === "lifecod-compatibility"
                              ? "bg-pink-50 border-pink-400 dark:bg-pink-950/30 dark:border-pink-600"
                              : "bg-card border-border hover:border-pink-200"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Heart className={cn(
                              "w-5 h-5",
                              selectedMethod === "lifecod-compatibility" ? "text-pink-500 fill-pink-500" : "text-muted-foreground"
                            )} />
                            <div>
                              <h4 className="font-medium text-sm">{t("lifecod.methodSelector.title")}</h4>
                              <p className="text-xs text-muted-foreground">{t("lifecod.methodSelector.description")}</p>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setSelectedMethod("classic-full")}
                          className={cn(
                            "w-full p-4 rounded-xl border transition-all duration-300 text-left",
                            selectedMethod === "classic-full"
                              ? "bg-primary/10 border-primary"
                              : "bg-card border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className={cn(
                              "w-5 h-5",
                              selectedMethod === "classic-full" ? "text-primary" : "text-muted-foreground"
                            )} />
                            <div>
                              <h4 className="font-medium text-sm">{t("methods.fullAnalysis")}</h4>
                              <p className="text-xs text-muted-foreground">{t("methods.fullAnalysisDesc")}</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Date Input Form - conditional based on method */}
                  {selectedMethodology === "1" && selectedMethod === "name" ? (
                    <div className="w-full max-w-xl mx-auto">
                    <div className="gradient-card rounded-2xl p-5 sm:p-8 border border-border">
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Название для проверки</label>
                            <Input
                              placeholder="Введите название компании, продукта или имя"
                              value={nameEnergyInput}
                              onChange={(e) => setNameEnergyInput(e.target.value)}
                              className="bg-background border-border focus:border-primary focus:ring-primary/20 h-12 text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                          <Button
                            onClick={handleNameEnergyCalculate}
                            disabled={!nameEnergyInput.trim()}
                            className="w-full h-14 text-lg font-display btn-fill animate-gentle-shake bg-primary hover:bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none transition-all duration-300 rounded-full border-2 border-primary"
                          >
                            Рассчитать энергию названия
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : selectedMethodology === "2" && selectedMethod === "lifecod-compatibility" ? (
                    <LifeCodInputForm onCalculate={handleLifeCodCalculate} />
                  ) : selectedMethodology === "2" && selectedMethod === "lifecod-personal" ? (
                    <DateInput 
                      selectedMethod="lifecod-personal"
                      onCalculate={handleCalculate} 
                    />
                  ) : selectedMethodology === "1" && selectedMethod === "compatibility" ? (
                    <CompatibilityDateInput onCalculate={handleCompatibilityCalculate} />
                  ) : (
                    <DateInput 
                      selectedMethod={selectedMethodology === "1" ? selectedMethod : "classic-full"}
                      onCalculate={handleCalculate} 
                    />
                  )}
                </div>

                {/* Analysis Types Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 max-w-5xl mx-auto mt-8 md:mt-12">
                  {analysisTypes.map((type) => (
                    <div
                      key={type.id}
                      className={cn(
                        "gradient-card rounded-xl md:rounded-2xl p-4 md:p-6 border transition-all duration-300",
                        type.available 
                          ? "border-border hover:border-primary/30 cursor-pointer" 
                          : "border-border/50 opacity-70"
                      )}
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0",
                          type.available ? "bg-primary/10" : "bg-muted"
                        )}>
                          <type.icon className={cn(
                            "w-5 h-5 md:w-6 md:h-6",
                            type.available ? "text-primary" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base md:text-lg font-display text-foreground">
                              {t(type.titleKey)}
                            </h3>
                            {!type.available && <Lock className="w-4 h-4 text-muted-foreground" />}
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                            {t(type.descKey)}
                          </p>
                          
                          {type.available ? (
                            <div className="flex flex-wrap gap-2 md:gap-3">
                              {type.hasPro && (
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const methodMap: Record<string, string> = { full: 'purpose', contract: 'contract', month: 'month', year: 'year', name: 'name', finance: 'finance' };
                                    const method = methodMap[type.id];
                                    if (method) {
                                      setSelectedMethod(method);
                                      setShowPro(true);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                  }}
                                  className="btn-fill border-primary text-primary hover:text-white text-xs md:text-sm px-3 py-1 h-auto"
                                >
                                  {t("analysisTypes.professional")}
                                </Button>
                              )}
                              <Button
                                onClick={() => {
                                  const methodMap: Record<string, string> = { full: 'purpose', contract: 'contract', month: 'month', year: 'year', name: 'name', finance: 'finance' };
                                  const method = methodMap[type.id];
                                  if (method) {
                                    setSelectedMethod(method);
                                    setShowPro(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }
                                }}
                                className="btn-fill animate-gentle-shake bg-primary text-primary-foreground border-2 border-primary text-xs md:text-sm px-3 py-1 h-auto"
                              >
                                {t("analysisTypes.basic")}
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                disabled
                                className="border-border text-xs md:text-sm"
                              >
                                {t("analysisTypes.soon")}
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
          <div className="container mx-auto px-4 py-6 md:py-8">
            {result.type === "year" && (
              <YearForecastResult
                forecast={result.data}
                name={userName}
                onReset={handleReset}
                isPro={false}
                showProSections={showPro}
              />
            )}
            {result.type === "month" && (
              <MonthForecastResult
                forecast={result.data}
                name={userName}
                onReset={handleReset}
                isPro={false}
                showProSections={showPro}
              />
            )}
            {result.type === "purpose" && (
              <PersonalMatrixResult
                matrix={result.data}
                name={userName}
                onReset={handleReset}
                isPro={false}
                showProSections={showPro}
              />
            )}
            {result.type === "keyto" && (
              <KeyToResultComponent
                result={result.data}
                name={userName}
                onReset={handleReset}
              />
            )}
            {result.type === "compatibility" && (
              <CompatibilityResultComponent
                result={result.data}
                onReset={handleReset}
              />
            )}
            {result.type === "ancestral" && (
              <AncestralResultComponent
                result={result.data}
                name={userName}
                onReset={handleReset}
              />
            )}
            {result.type === "lifecod" && (
              <LifeCodResult
                result={result.data}
                onReset={handleReset}
              />
            )}
            {result.type === "lifecod-personal" && (
              <LifeCodPersonalResult
                name={result.data.name}
                day={result.data.day}
                month={result.data.month}
                year={result.data.year}
                onReset={handleReset}
              />
            )}
            {result.type === "unified-personal" && (
              <UnifiedPersonalResult
                analysis={result.data}
                onReset={handleReset}
                isPaid={false}
              />
            )}
            {result.type === "day" && (
              <DailyForecastResultComponent
                result={result.data}
                name={userName}
                onReset={handleReset}
              />
            )}
            {result.type === "finance" && (
              <FinancialCodeResultComponent
                result={result.data}
                name={userName}
                onReset={handleReset}
              />
            )}
            {result.type === "name" && (
              <NameEnergyResultComponent
                result={result.data}
                onReset={handleReset}
              />
            )}
            {result.type === "contract" && (
              <ContractEnergyResultComponent
                result={result.data}
                personName={userName}
                onReset={handleReset}
                isPro={false}
                showProSections={showPro}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

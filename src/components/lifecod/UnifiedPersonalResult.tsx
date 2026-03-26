import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  UnifiedPersonalAnalysis, 
  CalcTrace,
  RiskScoreLevel,
} from "@/lib/lifecod/personalAnalysis";
import { ArrowLeft, Activity, Mountain, Calculator, Brain, Zap, Shield, TrendingUp, TrendingDown, AlertTriangle, Lock, ChevronDown, ChevronUp, Flame, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnifiedPersonalResultProps {
  analysis: UnifiedPersonalAnalysis;
  onReset: () => void;
  isPaid?: boolean;
}

// Компонент calc_trace
function CalcTraceBlock({ trace, isPaid }: { trace: CalcTrace; isPaid?: boolean }) {
  const [open, setOpen] = useState(false);
  
  if (!isPaid) {
    return (
      <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground flex items-center gap-2">
        <Lock className="w-3 h-3" />
        <span>Расчёт доступен в полном отчёте</span>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg border border-border/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Calculator className="w-3 h-3" />
          Показать расчёт
        </span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1 text-xs font-mono border-t border-border/50 pt-2">
          <p className="text-muted-foreground">Вход: {trace.input}</p>
          {trace.steps.map((step, i) => (
            <p key={i} className="text-foreground">{step}</p>
          ))}
          <p className="font-semibold text-primary">{trace.result}</p>
        </div>
      )}
    </div>
  );
}

// Заблюренный блок
function PaidBlock({ children, isPaid, label }: { children: React.ReactNode; isPaid: boolean; label?: string }) {
  if (isPaid) return <>{children}</>;
  
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl">
        <div className="text-center space-y-2 p-4">
          <Lock className="w-6 h-6 text-primary mx-auto" />
          <p className="text-sm font-medium">{label || 'Доступно в полном отчёте'}</p>
          <Button size="sm" variant="default" onClick={() => window.open("https://t.me/galiullin_ruzal", "_blank")}>
            Получить полный разбор
          </Button>
        </div>
      </div>
    </div>
  );
}

export function UnifiedPersonalResult({ analysis, onReset, isPaid = false }: UnifiedPersonalResultProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'ly' | 'consciousness' | 'actions' | 'pinnacles' | 'risk'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: Activity },
    { id: 'ly' as const, label: 'Личные годы', icon: TrendingUp },
    { id: 'consciousness' as const, label: 'Сознание', icon: Brain },
    { id: 'actions' as const, label: 'Действия', icon: Zap },
    { id: 'pinnacles' as const, label: 'Пиннакли', icon: Mountain },
    { id: 'risk' as const, label: 'Risk Score', icon: BarChart3 },
  ];

  const riskColors: Record<RiskScoreLevel, string> = {
    LOW: 'text-green-600 dark:text-green-400',
    MEDIUM: 'text-amber-600 dark:text-amber-400',
    HIGH: 'text-red-600 dark:text-red-400',
  };

  const riskBgColors: Record<RiskScoreLevel, string> = {
    LOW: 'bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-800',
    MEDIUM: 'bg-amber-100 border-amber-300 dark:bg-amber-950 dark:border-amber-800',
    HIGH: 'bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800',
  };

  const crisisColors: Record<number, string> = {
    0: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400',
    1: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-400',
    2: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-400',
    3: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400',
  };

  const { a: an } = { a: analysis };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary">Персональный анализ</h1>
          <p className="text-muted-foreground">{an.name} • {an.birthDay}.{String(an.birthMonth).padStart(2, '0')}.{an.birthYear}</p>
        </div>
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад
        </Button>
      </div>

      {/* Risk Score Badge */}
      <div className={cn("rounded-xl border-2 p-4 flex items-center justify-between flex-wrap gap-3", riskBgColors[an.riskScore.level])}>
        <div className="flex items-center gap-3">
          <div className={cn("text-3xl font-display font-bold", riskColors[an.riskScore.level])}>
            {an.riskScore.score}
          </div>
          <div>
            <p className={cn("font-semibold", riskColors[an.riskScore.level])}>{an.riskScore.label}</p>
            <p className="text-xs text-muted-foreground">Risk Score на {an.targetYear} год</p>
          </div>
        </div>
        <div className="text-sm">
          <span className="font-medium">Личный год: </span>
          <span className={cn(an.currentPersonalYear.isCrisis ? "text-red-600 font-bold" : "text-foreground")}>
            {an.currentPersonalYear.personalYear} — {an.currentPersonalYear.name}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW ===== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SummaryCard label="Личный год" value={an.currentPersonalYear.personalYear} sub={an.currentPersonalYear.name} crisis={an.currentPersonalYear.isCrisis} />
            <SummaryCard label="Год в действиях" value={an.yearInActions.value} sub={`LY(${an.currentPersonalYear.personalYear})+День(${an.birthDay})`} />
            <SummaryCard label="Сознание" value={an.consciousness.result} sub={an.consciousness.name} />
            <SummaryCard label="Действия" value={an.actions.result} sub={an.actions.name} />
          </div>

          {/* Current crisis level */}
          <div className={cn("rounded-xl border-2 p-4 md:p-6 space-y-3", crisisColors[an.currentCrisisLevel.level])}>
            <h3 className="font-display font-semibold text-lg">Текущее состояние ({an.targetYear})</h3>
            <p className="font-medium">{an.currentCrisisLevel.label}: {an.currentCrisisLevel.description}</p>
          </div>

          {/* Free summary */}
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3">
            <h3 className="font-display font-semibold text-lg">Базовый вывод</h3>
            <div className="space-y-2 text-sm">
              <p>🔢 Ваш личный год — <strong>{an.currentPersonalYear.personalYear}</strong> ({an.currentPersonalYear.name}): {an.currentPersonalYear.theme}</p>
              <p>🎯 Год в действиях — <strong>{an.yearInActions.value}</strong>: {an.yearInActions.behavior[0]}</p>
              {an.currentPersonalYear.isCrisis && (
                <p className="text-red-600 dark:text-red-400 font-medium">
                  ⚠️ Высокая вероятность кризисных событий при неосознанном проживании
                </p>
              )}
            </div>
          </div>

          {/* Базовые риски (free) */}
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3">
            <h3 className="font-display font-semibold text-lg">Базовые риски</h3>
            <div className="space-y-1 text-sm">
              {an.riskScore.factors.slice(0, 2).map((f, i) => (
                <p key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  {f}
                </p>
              ))}
            </div>
          </div>

          {/* Базовые рекомендации (free) */}
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3">
            <h3 className="font-display font-semibold text-lg">Рекомендации</h3>
            <div className="space-y-1 text-sm">
              {an.riskScore.recommendations.slice(0, 2).map((r, i) => (
                <p key={i} className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {r}
                </p>
              ))}
            </div>
          </div>

          {/* CTA for paid */}
          {!isPaid && <PaidCTA />}
        </div>
      )}

      {/* ===== ЛИЧНЫЕ ГОДЫ ===== */}
      {activeTab === 'ly' && (
        <div className="space-y-4">
          {/* Текущий год с calc_trace (free) */}
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
            <h3 className="font-display font-semibold text-lg">
              {an.targetYear}: Личный год {an.currentPersonalYear.personalYear} — {an.currentPersonalYear.name}
            </h3>
            <CalcTraceBlock trace={an.currentPersonalYear.calcTrace} isPaid={isPaid} />
            <p className="text-sm">{an.currentPersonalYear.theme}</p>
            
            <PaidBlock isPaid={isPaid} label="Подробности доступны в полном отчёте">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-pink-600 dark:text-pink-400 flex items-center gap-1 mb-1">
                    <Flame className="w-3 h-3" /> Отношения
                  </p>
                  <p>{an.currentPersonalYear.forRelationships}</p>
                </div>
                <div>
                  <p className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3" /> Бизнес
                  </p>
                  <p>{an.currentPersonalYear.forBusiness}</p>
                </div>
              </div>
            </PaidBlock>
          </div>

          {/* Год в действиях */}
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
            <h3 className="font-display font-semibold text-lg">
              Год в действиях: {an.yearInActions.value}
            </h3>
            <CalcTraceBlock trace={an.yearInActions.calcTrace} isPaid={isPaid} />
            
            <PaidBlock isPaid={isPaid} label="Поведенческий разбор доступен в полном отчёте">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">Как действует:</p>
                  {an.yearInActions.behavior.map((b, i) => <p key={i} className="text-green-700 dark:text-green-400">✓ {b}</p>)}
                </div>
                <div>
                  <p className="font-medium mb-1">Минус-поведение:</p>
                  {an.yearInActions.minusBehavior.map((b, i) => <p key={i} className="text-red-700 dark:text-red-400">✗ {b}</p>)}
                </div>
                <div>
                  <p className="font-medium mb-1">Стоп-сигналы:</p>
                  {an.yearInActions.stopSignals.map((s, i) => <p key={i} className="text-amber-700 dark:text-amber-400">⚠ {s}</p>)}
                </div>
                <div>
                  <p className="font-medium mb-1">Что делать:</p>
                  {an.yearInActions.whatToDo.map((w, i) => <p key={i}>💡 {w}</p>)}
                </div>
              </div>
            </PaidBlock>
          </div>

          {/* Прогноз на 5 лет */}
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
            <h3 className="font-display font-semibold text-lg">Прогноз на 5 лет</h3>
            <div className="space-y-2">
              {an.personalYears.map((py, i) => (
                <div key={py.year} className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  py.isCrisis ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" : "bg-card border-border",
                  i === 0 && "ring-2 ring-primary"
                )}>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-lg text-primary">{py.year}</span>
                    <div>
                      <span className="font-medium">{py.personalYear} — {py.name}</span>
                      {py.isCrisis && <AlertTriangle className="w-3 h-3 text-red-500 inline ml-1" />}
                    </div>
                  </div>
                  {/* Подсветка перехода 6→7 */}
                  {i > 0 && an.personalYears[i - 1].personalYear === 6 && py.personalYear === 7 && (
                    <span className="text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 px-2 py-0.5 rounded-full">
                      Переход 6→7
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!isPaid && <PaidCTA />}
        </div>
      )}

      {/* ===== СОЗНАНИЕ ===== */}
      {activeTab === 'consciousness' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-primary">{an.consciousness.result}</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl">{an.consciousness.name}</h3>
                <p className="text-sm text-muted-foreground">Число сознания</p>
              </div>
            </div>

            <CalcTraceBlock trace={an.consciousness.calcTrace} isPaid={isPaid} />

            {/* Free: итоговое число без цепочки */}
            <p className="text-sm">{an.consciousness.innerState}</p>

            <PaidBlock isPaid={isPaid} label="Полная цепочка и трактовка доступны в полном отчёте">
              <div className="space-y-4 text-sm">
                {/* Цепочка */}
                <div>
                  <p className="font-medium mb-2">Цепочка энергий:</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {an.consciousness.chain.map((n, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {i > 0 && <span className="text-muted-foreground">→</span>}
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {n}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-pink-600 dark:text-pink-400 mb-1">Личная жизнь:</p>
                    <p>{an.consciousness.personalLife}</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">Влияние на других:</p>
                    <p>{an.consciousness.influenceOnOthers}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-green-600 dark:text-green-400 mb-1">Плюс:</p>
                    {an.consciousness.plus.map((p, i) => <p key={i}>✓ {p}</p>)}
                  </div>
                  <div>
                    <p className="font-medium text-red-600 dark:text-red-400 mb-1">Минус:</p>
                    {an.consciousness.minus.map((m, i) => <p key={i}>✗ {m}</p>)}
                  </div>
                </div>

                {an.consciousness.warning && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-700 dark:text-amber-400">{an.consciousness.warning}</p>
                  </div>
                )}
              </div>
            </PaidBlock>
          </div>

          {!isPaid && <PaidCTA />}
        </div>
      )}

      {/* ===== ДЕЙСТВИЯ ===== */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-primary">{an.actions.result}</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl">{an.actions.name}</h3>
                <p className="text-sm text-muted-foreground">Число действий</p>
              </div>
            </div>

            <CalcTraceBlock trace={an.actions.calcTrace} isPaid={isPaid} />

            <PaidBlock isPaid={isPaid} label="Цепочка и полный разбор доступны в полном отчёте">
              <div className="space-y-4 text-sm">
                {/* Цепочка */}
                <div>
                  <p className="font-medium mb-2">Цепочка действий:</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {an.actions.chain.map((n, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {i > 0 && <span className="text-muted-foreground">→</span>}
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {n}
                        </span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-muted-foreground">{an.actions.chainMeaning}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-green-600 dark:text-green-400 mb-1">Плюс:</p>
                    {an.actions.plus.map((p, i) => <p key={i}>✓ {p}</p>)}
                  </div>
                  <div>
                    <p className="font-medium text-red-600 dark:text-red-400 mb-1">Минус:</p>
                    {an.actions.minus.map((m, i) => <p key={i}>✗ {m}</p>)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-pink-600 dark:text-pink-400 mb-1">Любовь:</p>
                    <p>{an.actions.love}</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">Бизнес:</p>
                    <p>{an.actions.business}</p>
                  </div>
                </div>

                {an.actions.redFlags.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 space-y-1">
                    <p className="font-medium text-red-600 dark:text-red-400">🚩 Красные флаги:</p>
                    {an.actions.redFlags.map((f, i) => <p key={i} className="text-red-700 dark:text-red-400 text-xs">• {f}</p>)}
                  </div>
                )}
              </div>
            </PaidBlock>
          </div>

          {!isPaid && <PaidCTA />}
        </div>
      )}

      {/* ===== ПИННАКЛИ ===== */}
      {activeTab === 'pinnacles' && (
        <div className="space-y-4">
          <PaidBlock isPaid={isPaid} label="Пиннакли доступны в полном отчёте">
            <div className="bg-card rounded-xl border p-4">
              <h3 className="font-display font-semibold mb-2">Шаги расчёта</h3>
              <CalcTraceBlock trace={an.pinnaclesCalcTrace} isPaid={true} />
            </div>

            {an.pinnacles.map((p) => (
              <div key={p.index} className={cn(
                "bg-card rounded-xl border-2 p-4 md:p-6 space-y-3",
                p.isActive ? "border-primary bg-primary/5" : "border-border",
                p.isCrisis && "ring-1 ring-red-300"
              )}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-primary">P{p.index + 1} = {p.value}</span>
                    {p.isActive && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Сейчас</span>}
                    {p.isCrisis && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {p.startAge}–{p.endAge ?? '∞'} лет ({p.startYear}–{p.endYear ?? '...'})
                  </span>
                </div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.essence}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="font-medium text-pink-600 dark:text-pink-400 flex items-center gap-1"><Flame className="w-3 h-3" /> Любовь</p>
                    {p.lovePlus.map((s, j) => <p key={j} className="text-green-700 dark:text-green-400 flex items-start gap-1"><TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />{s}</p>)}
                    {p.loveMinus.map((s, j) => <p key={j} className="text-red-700 dark:text-red-400 flex items-start gap-1"><TrendingDown className="w-3 h-3 mt-0.5 flex-shrink-0" />{s}</p>)}
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Бизнес</p>
                    {p.businessPlus.map((s, j) => <p key={j} className="text-green-700 dark:text-green-400 flex items-start gap-1"><TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />{s}</p>)}
                    {p.businessMinus.map((s, j) => <p key={j} className="text-red-700 dark:text-red-400 flex items-start gap-1"><TrendingDown className="w-3 h-3 mt-0.5 flex-shrink-0" />{s}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </PaidBlock>

          {!isPaid && <PaidCTA />}
        </div>
      )}

      {/* ===== RISK SCORE ===== */}
      {activeTab === 'risk' && (
        <div className="space-y-4">
          {/* Risk Score visual */}
          <div className={cn("rounded-xl border-2 p-6 space-y-4", riskBgColors[an.riskScore.level])}>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/20" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className={riskColors[an.riskScore.level]}
                    strokeDasharray={`${an.riskScore.score} ${100 - an.riskScore.score}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn("text-xl font-display font-bold", riskColors[an.riskScore.level])}>{an.riskScore.score}</span>
                </div>
              </div>
              <div>
                <h3 className={cn("font-display font-semibold text-xl", riskColors[an.riskScore.level])}>{an.riskScore.label}</h3>
                <p className="text-sm text-muted-foreground">Risk Score на {an.targetYear}</p>
              </div>
            </div>
            <CalcTraceBlock trace={an.riskScore.calcTrace} isPaid={isPaid} />
          </div>

          {/* Суммарные числа */}
          <PaidBlock isPaid={isPaid} label="Суммарные числа доступны в полном отчёте">
            <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg">Суммарные числа</h3>
              <CalcTraceBlock trace={an.summaryNumbers.calcTrace} isPaid={true} />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-display font-bold text-primary">{an.summaryNumbers.sumBase}</p>
                  <p className="text-xs text-muted-foreground">SUM_base</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-display font-bold text-primary">{an.summaryNumbers.sumFull}</p>
                  <p className="text-xs text-muted-foreground">SUM_full</p>
                </div>
              </div>
              <div className={cn("rounded-lg border p-3", {
                'bg-green-50 border-green-200 dark:bg-green-950/30': an.summaryNumbers.intensityLevel === 'SOFT',
                'bg-amber-50 border-amber-200 dark:bg-amber-950/30': an.summaryNumbers.intensityLevel === 'TRANSFORM',
                'bg-orange-50 border-orange-200 dark:bg-orange-950/30': an.summaryNumbers.intensityLevel === 'PRESSURE',
                'bg-red-50 border-red-200 dark:bg-red-950/30': an.summaryNumbers.intensityLevel === 'OVERHEAT',
              })}>
                <p className="font-medium text-sm">{an.summaryNumbers.intensityLabel}</p>
                <p className="text-sm text-muted-foreground">{an.summaryNumbers.interpretation}</p>
              </div>
            </div>
          </PaidBlock>

          {/* Факторы */}
          <PaidBlock isPaid={isPaid} label="Полная карта рисков доступна в полном отчёте">
            <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg">Факторы риска</h3>
              <div className="space-y-2 text-sm">
                {an.riskScore.factors.map((f, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </p>
                ))}
                {an.riskScore.factors.length === 0 && (
                  <p className="text-muted-foreground">Критических факторов не обнаружено</p>
                )}
              </div>
            </div>

            <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg">Рекомендации</h3>
              <div className="space-y-2 text-sm">
                {an.riskScore.recommendations.map((r, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {r}
                  </p>
                ))}
              </div>
            </div>
          </PaidBlock>

          {!isPaid && <PaidCTA />}
        </div>
      )}
    </div>
  );
}

// ===== Helper Components =====

function SummaryCard({ label, value, sub, crisis }: { label: string; value: number; sub: string; crisis?: boolean }) {
  return (
    <div className={cn(
      "bg-card rounded-xl border p-3 text-center",
      crisis && "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
    )}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-2xl font-display font-bold", crisis ? "text-red-600 dark:text-red-400" : "text-primary")}>{value}</p>
      <p className="text-[10px] text-muted-foreground truncate">{sub}</p>
    </div>
  );
}

function PaidCTA() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-4">
      <h3 className="font-display font-semibold text-xl text-primary">Получить полный разбор</h3>
      <p className="text-muted-foreground max-w-xl mx-auto text-sm">
        Полный отчёт включает: цепочки сознания и действий, все пиннакли с трактовками, 
        суммарные числа, карту рисков периода, подробный разбор по любви и бизнесу.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground"
          onClick={() => window.open("https://t.me/galiullin_ruzal", "_blank")}
        >
          Записаться на консультацию
        </Button>
      </div>
    </div>
  );
}

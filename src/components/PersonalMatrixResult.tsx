import { useTranslation } from "react-i18next";
import { PersonalMatrix, formatBirthDate } from "@/lib/calculations";
import { positionDescriptions, successCodePositions, lifePeriods, getArcanaName } from "@/lib/arcana";
import { ArcanaCard } from "./ArcanaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass, Star, Clock, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PersonalMatrixResultProps {
  matrix: PersonalMatrix;
  name: string;
  onReset: () => void;
}

type TabType = "main" | "diagonal" | "karmic" | "success" | "periods" | "calculations";

export function PersonalMatrixResult({ matrix, name, onReset }: PersonalMatrixResultProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("calculations");
  
  const formattedDate = formatBirthDate(
    matrix.birthDate.day,
    matrix.birthDate.month,
    matrix.birthDate.year
  );

  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  const isMirrorPosition = (position: number): boolean => {
    return matrix.mirrorArcana.some(m => m.positions.includes(position));
  };

  const isReversedPosition = (position: number): boolean => {
    return matrix.reversedArcana.some(r => r.positions.includes(position));
  };

  // Расчёт пошаговых вычислений для таблицы
  const { day, month, year } = matrix.birthDate;
  const pos1 = day > 22 ? day - 22 : day;
  const pos2 = month;
  const yearSum = year.toString().split('').reduce((sum, d) => sum + parseInt(d), 0);
  const pos4 = yearSum > 22 ? yearSum - 22 : yearSum;
  
  const pos3Raw = pos1 + pos2;
  const pos3 = pos3Raw > 22 ? pos3Raw - 22 : pos3Raw;
  
  const pos5Raw = pos2 + pos4;
  const pos5 = pos5Raw > 22 ? pos5Raw - 22 : pos5Raw;
  
  const pos6Raw = pos3 + pos5;
  const pos6 = pos6Raw > 22 ? pos6Raw - 22 : pos6Raw;
  
  const pos7Raw = pos3 + pos4;
  const pos7 = pos7Raw > 22 ? pos7Raw - 22 : pos7Raw;
  
  const pos8Raw = pos2 + pos6;
  const pos8 = pos8Raw > 22 ? pos8Raw - 22 : pos8Raw;
  
  const pos9Raw = pos7 + pos8;
  const pos9 = pos9Raw > 22 ? pos9Raw - 22 : pos9Raw;
  
  const pos10Raw = pos1 - pos2;
  const pos10 = pos10Raw < 0 ? pos10Raw + 22 : (pos10Raw === 0 ? 22 : pos10Raw);
  
  const pos11Raw = pos2 - pos4;
  const pos11 = pos11Raw < 0 ? pos11Raw + 22 : (pos11Raw === 0 ? 22 : pos11Raw);
  
  const pos12Raw = pos10 - pos11;
  const pos12 = pos12Raw < 0 ? pos12Raw + 22 : (pos12Raw === 0 ? 22 : pos12Raw);
  
  const calculationSteps = [
    { pos: 1, formula: `День: ${day}`, raw: day, result: pos1 },
    { pos: 2, formula: `Месяц: ${month}`, raw: month, result: pos2 },
    { pos: 4, formula: `Год: ${year.toString().split('').join('+')} = ${yearSum}`, raw: yearSum, result: pos4 },
    { pos: 3, formula: `Поз.1 + Поз.2 = ${pos1} + ${pos2}`, raw: pos3Raw, result: pos3 },
    { pos: 5, formula: `Поз.2 + Поз.4 = ${pos2} + ${pos4}`, raw: pos5Raw, result: pos5 },
    { pos: 6, formula: `Поз.3 + Поз.5 = ${pos3} + ${pos5}`, raw: pos6Raw, result: pos6 },
    { pos: 7, formula: `Поз.3 + Поз.4 = ${pos3} + ${pos4}`, raw: pos7Raw, result: pos7 },
    { pos: 8, formula: `Поз.2 + Поз.6 = ${pos2} + ${pos6}`, raw: pos8Raw, result: pos8 },
    { pos: 9, formula: `Поз.7 + Поз.8 = ${pos7} + ${pos8}`, raw: pos9Raw, result: pos9 },
    { pos: 10, formula: `Поз.1 - Поз.2 = ${pos1} - ${pos2}`, raw: pos10Raw, result: pos10 },
    { pos: 11, formula: `Поз.2 - Поз.4 = ${pos2} - ${pos4}`, raw: pos11Raw, result: pos11 },
    { pos: 12, formula: `Поз.10 - Поз.11 = ${pos10} - ${pos11}`, raw: pos12Raw, result: pos12 },
  ];

  const tabs = [
    { id: "calculations" as TabType, label: "📊 Расчёты", positions: [] },
    { id: "main" as TabType, label: t("results.mainTriangle"), positions: [1, 2, 3, 4, 5, 6] },
    { id: "diagonal" as TabType, label: t("results.lifeGoals"), positions: [7, 8, 9] },
    { id: "karmic" as TabType, label: t("results.karma"), positions: [10, 11, 12] },
    { id: "success" as TabType, label: t("results.successCode"), positions: successCodePositions },
    { id: "periods" as TabType, label: t("results.lifePeriods"), positions: [] },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={onReset}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>

        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          {t("results.yourPurpose")}
        </h1>
        
        {name && (
          <p className="text-lg text-foreground mb-1">
            {name}
          </p>
        )}
        
        <p className="text-muted-foreground">
          {t("results.birthDate")}: {formattedDate}
        </p>
      </div>

      <div className="gradient-card rounded-2xl p-6 border border-primary/30">
        <div className="flex items-center gap-3 mb-6">
          <Compass className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-display text-foreground">
            {t("results.personalMatrix")}
          </h2>
        </div>

        {/* Визуальная структура матрицы по методике 22 Арканов */}
        <div className="flex flex-col items-center gap-3 mb-6">
          
          {/* Кармический треугольник (вверху) */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <MatrixCell 
              position={10} 
              value={matrix.positions[9]} 
            />
            <MatrixCell 
              position={11} 
              value={matrix.positions[10]} 
            />
            <MatrixCell 
              position={12} 
              value={matrix.positions[11]} 
              isHighlight 
            />
          </div>

          {/* Разделитель */}
          <div className="w-full h-px bg-border/50 my-2" />

          {/* Вводные данные: Позиции 1, 2, 4 */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <MatrixCell 
              position={1} 
              value={matrix.positions[0]} 
              isMirror={isMirrorPosition(1)}
              isReversed={isReversedPosition(1)}
            />
            <MatrixCell 
              position={2} 
              value={matrix.positions[1]} 
              isMirror={isMirrorPosition(2)}
              isReversed={isReversedPosition(2)}
            />
            <MatrixCell 
              position={4} 
              value={matrix.positions[3]} 
              isMirror={isMirrorPosition(4)}
              isReversed={isReversedPosition(4)}
            />
          </div>
          
          {/* Основной треугольник: Позиции 3, 5 */}
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <MatrixCell 
              position={3} 
              value={matrix.positions[2]} 
              isMirror={isMirrorPosition(3)}
              isReversed={isReversedPosition(3)}
            />
            <MatrixCell 
              position={5} 
              value={matrix.positions[4]} 
              isMirror={isMirrorPosition(5)}
              isReversed={isReversedPosition(5)}
            />
          </div>

          {/* Вершина основного треугольника: Позиция 6 */}
          <div className="flex justify-center">
            <MatrixCell 
              position={6} 
              value={matrix.positions[5]} 
              isMirror={isMirrorPosition(6)}
              isReversed={isReversedPosition(6)}
            />
          </div>

          {/* Диагональный ряд */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4">
            <MatrixCell position={7} value={matrix.positions[6]} />
            <MatrixCell position={8} value={matrix.positions[7]} />
            <MatrixCell position={9} value={matrix.positions[8]} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-primary/20 border border-primary" />
            <span className="text-muted-foreground">{t("results.legend.mirror")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive" />
            <span className="text-muted-foreground">{t("results.legend.reversed")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500" />
            <span className="text-muted-foreground">{t("results.legend.mainTask")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeTab === "calculations" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              📊 Таблица вычислений
            </h2>
            <p className="text-sm text-muted-foreground">
              Пошаговые расчёты для даты {day}.{month.toString().padStart(2, '0')}.{year}
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium text-foreground">Позиция</th>
                    <th className="text-left py-2 px-3 font-medium text-foreground">Формула</th>
                    <th className="text-center py-2 px-3 font-medium text-foreground">Результат</th>
                    <th className="text-center py-2 px-3 font-medium text-foreground">После норм.</th>
                    <th className="text-center py-2 px-3 font-medium text-foreground">В матрице</th>
                  </tr>
                </thead>
                <tbody>
                  {calculationSteps.map((step) => (
                    <tr key={step.pos} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-2 px-3 font-medium text-primary">{step.pos}</td>
                      <td className="py-2 px-3 text-muted-foreground">{step.formula}</td>
                      <td className="py-2 px-3 text-center">{step.raw}</td>
                      <td className="py-2 px-3 text-center font-medium">{step.result}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold",
                          matrix.positions[step.pos - 1] === step.result 
                            ? "bg-green-500/20 text-green-600" 
                            : "bg-destructive/20 text-destructive"
                        )}>
                          {matrix.positions[step.pos - 1]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="gradient-card rounded-xl p-4 border border-border mt-4">
              <h3 className="font-medium text-foreground mb-2">Правила нормализации:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Если число &gt; 22, вычитаем 22</li>
                <li>• Если число = 0, заменяем на 22</li>
                <li>• Если число отрицательное, прибавляем 22</li>
              </ul>
            </div>
          </>
        )}

        {activeTab === "main" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              {t("results.mainTriangle")}
              <span className="text-sm text-muted-foreground font-normal">({t("results.positions")} 1-6)</span>
            </h2>
            <div className="grid gap-4">
              {[1, 2, 3, 4, 5, 6].map((pos) => (
                <ArcanaCard
                  key={pos}
                  number={matrix.positions[pos - 1]}
                  position={pos}
                  positionTitle={positionDescriptions[pos]?.title}
                  positionDescription={positionDescriptions[pos]?.description}
                  isMirror={isMirrorPosition(pos)}
                  isReversed={isReversedPosition(pos)}
                  compact={true}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "diagonal" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              {t("results.diagonalRow")}
            </h2>
            <div className="grid gap-4">
              {[7, 8, 9].map((pos) => (
                <ArcanaCard
                  key={pos}
                  number={matrix.positions[pos - 1]}
                  position={pos}
                  positionTitle={positionDescriptions[pos]?.title}
                  positionDescription={positionDescriptions[pos]?.description}
                  compact={false}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "karmic" && (
          <>
            <h2 className="text-lg font-display text-foreground">
              {t("results.karmicTriangle")}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t("results.karmicTriangleDesc")}
            </p>
            <div className="grid gap-4">
              {[10, 11, 12].map((pos) => (
                <ArcanaCard
                  key={pos}
                  number={matrix.positions[pos - 1]}
                  position={pos}
                  positionTitle={positionDescriptions[pos]?.title}
                  positionDescription={positionDescriptions[pos]?.description}
                  compact={pos !== 12}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "success" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              {t("results.successCode")}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t("results.successCodeDesc")}
            </p>
            
            <div className="flex justify-center gap-3 mb-6">
              {matrix.successCode.map((arcana, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
                    <span className="text-xl font-display font-bold text-amber-600">
                      {arcana}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {t("results.pos")} {successCodePositions[index]}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              {successCodePositions.map((pos, index) => (
                <ArcanaCard
                  key={pos}
                  number={matrix.successCode[index]}
                  position={pos}
                  positionTitle={positionDescriptions[pos]?.title}
                  positionDescription={positionDescriptions[pos]?.description}
                  compact={true}
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "periods" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {t("results.lifePeriods")}
            </h2>
            <div className="grid gap-4">
              {lifePeriods.map((period, index) => (
                <div key={index} className="gradient-card rounded-xl p-4 border border-border">
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {period.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {period.description}
                  </p>
                  <div className="flex gap-2">
                    {period.positions.map((pos) => (
                      <div
                        key={pos}
                        className="flex flex-col items-center bg-muted/50 rounded-lg p-2"
                      >
                        <span className="text-lg font-display font-bold text-primary">
                          {matrix.positions[pos - 1]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {getArcanaName(matrix.positions[pos - 1])}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="gradient-card rounded-2xl p-6 border border-border text-center">
        <h3 className="text-lg font-display text-foreground mb-2">
          {t("results.wantDeepAnalysis")}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t("results.deepAnalysisDesc")}
        </p>
        <Button
          onClick={handleTelegramClick}
          className="btn-fill bg-primary text-primary-foreground"
        >
          {t("results.bookConsultation")}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function MatrixCell({ 
  position, 
  value, 
  isMirror = false, 
  isReversed = false,
  isHighlight = false 
}: { 
  position: number; 
  value: number; 
  isMirror?: boolean;
  isReversed?: boolean;
  isHighlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-14 h-14 md:w-16 md:h-16 rounded-xl flex flex-col items-center justify-center transition-all",
        isMirror && "bg-primary/20 border-2 border-primary",
        isReversed && !isMirror && "bg-destructive/20 border-2 border-destructive",
        isHighlight && !isMirror && !isReversed && "bg-amber-500/20 border-2 border-amber-500",
        !isMirror && !isReversed && !isHighlight && "bg-muted border border-border"
      )}
    >
      <span className={cn(
        "text-xl font-display font-bold",
        isMirror && "text-primary",
        isReversed && !isMirror && "text-destructive",
        isHighlight && !isMirror && !isReversed && "text-amber-600",
        !isMirror && !isReversed && !isHighlight && "text-foreground"
      )}>
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground">
        {position}
      </span>
    </div>
  );
}
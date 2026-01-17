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

type TabType = "main" | "diagonal" | "karmic" | "success" | "periods";

export function PersonalMatrixResult({ matrix, name, onReset }: PersonalMatrixResultProps) {
  const [activeTab, setActiveTab] = useState<TabType>("main");
  
  const formattedDate = formatBirthDate(
    matrix.birthDate.day,
    matrix.birthDate.month,
    matrix.birthDate.year
  );

  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  // Проверка, является ли позиция зеркальной
  const isMirrorPosition = (position: number): boolean => {
    return matrix.mirrorArcana.some(m => m.positions.includes(position));
  };

  // Проверка, является ли позиция перевёрнутой
  const isReversedPosition = (position: number): boolean => {
    return matrix.reversedArcana.some(r => r.positions.includes(position));
  };

  const tabs = [
    { id: "main" as TabType, label: "Основной треугольник", positions: [1, 2, 3, 4, 5, 6] },
    { id: "diagonal" as TabType, label: "Цели жизни", positions: [7, 8, 9] },
    { id: "karmic" as TabType, label: "Карма", positions: [10, 11, 12] },
    { id: "success" as TabType, label: "Код успеха", positions: successCodePositions },
    { id: "periods" as TabType, label: "Периоды жизни", positions: [] },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={onReset}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Новый расчёт
        </Button>

        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          Ваше предназначение
        </h1>
        
        {name && (
          <p className="text-lg text-foreground mb-1">
            {name}
          </p>
        )}
        
        <p className="text-muted-foreground">
          Дата рождения: {formattedDate}
        </p>
      </div>

      {/* Визуальная схема матрицы */}
      <div className="gradient-card rounded-2xl p-6 border border-primary/30">
        <div className="flex items-center gap-3 mb-6">
          <Compass className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-display text-foreground">
            Личная матрица
          </h2>
        </div>

        {/* Схема матрицы */}
        <div className="flex flex-col items-center gap-4 mb-6">
          {/* Основной треугольник */}
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
              position={3} 
              value={matrix.positions[2]} 
              isMirror={isMirrorPosition(3)}
              isReversed={isReversedPosition(3)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <MatrixCell 
              position={4} 
              value={matrix.positions[3]} 
              isMirror={isMirrorPosition(4)}
              isReversed={isReversedPosition(4)}
            />
            <MatrixCell 
              position={5} 
              value={matrix.positions[4]} 
              isMirror={isMirrorPosition(5)}
              isReversed={isReversedPosition(5)}
            />
            <MatrixCell 
              position={6} 
              value={matrix.positions[5]} 
              isMirror={isMirrorPosition(6)}
              isReversed={isReversedPosition(6)}
            />
          </div>

          {/* Диагональный ряд */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <MatrixCell position={7} value={matrix.positions[6]} />
            <MatrixCell position={8} value={matrix.positions[7]} />
            <MatrixCell position={9} value={matrix.positions[8]} />
          </div>

          {/* Кармический треугольник */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <MatrixCell position={10} value={matrix.positions[9]} />
            <MatrixCell position={11} value={matrix.positions[10]} />
            <MatrixCell position={12} value={matrix.positions[11]} isHighlight />
          </div>
        </div>

        {/* Легенда */}
        <div className="flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-primary/20 border border-primary" />
            <span className="text-muted-foreground">Зеркальный (усиление)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive" />
            <span className="text-muted-foreground">Перевёрнутый (проработка)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500" />
            <span className="text-muted-foreground">Главная задача</span>
          </div>
        </div>
      </div>

      {/* Табы */}
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

      {/* Содержимое табов */}
      <div className="space-y-4">
        {activeTab === "main" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              Основной треугольник
              <span className="text-sm text-muted-foreground font-normal">(позиции 1-6)</span>
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
              Диагональный ряд — Цели и способы достижения
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
              Кармический треугольник
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Задачи и ошибки прошлых воплощений, которые влияют на эту жизнь.
              Позиция 12 — главная кармическая задача, которую достаточно выполнить один раз.
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
              Код успеха
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Арканы позиций 4, 5, 7 и 12 формируют ваш код успеха — жизненную программу,
              при следовании которой вы будете чувствовать себя счастливым.
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
                    Поз. {successCodePositions[index]}
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
              Периоды жизни
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

      {/* CTA для консультации */}
      <div className="gradient-card rounded-2xl p-6 border border-border text-center">
        <h3 className="text-lg font-display text-foreground mb-2">
          Хотите глубокий разбор?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Получите профессиональную консультацию с детальным анализом вашей матрицы,
          персональными рекомендациями и ответами на ваши вопросы.
        </p>
        <Button
          onClick={handleTelegramClick}
          className="btn-fill bg-primary text-primary-foreground"
        >
          Записаться на консультацию
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Компонент ячейки матрицы
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DateInputProps {
  selectedMethod: string;
  onCalculate: (day: number, month: number, year: number, name: string, targetMonth?: number, targetYear?: number) => void;
}

const months = [
  { value: "1", label: "Январь" },
  { value: "2", label: "Февраль" },
  { value: "3", label: "Март" },
  { value: "4", label: "Апрель" },
  { value: "5", label: "Май" },
  { value: "6", label: "Июнь" },
  { value: "7", label: "Июль" },
  { value: "8", label: "Август" },
  { value: "9", label: "Сентябрь" },
  { value: "10", label: "Октябрь" },
  { value: "11", label: "Ноябрь" },
  { value: "12", label: "Декабрь" },
];

const days = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const years = Array.from({ length: 100 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

// Годы для прогноза (текущий + 5 лет вперед)
const forecastYears = Array.from({ length: 10 }, (_, i) => ({
  value: String(currentYear - 2 + i),
  label: String(currentYear - 2 + i),
}));

export function DateInput({ selectedMethod, onCalculate }: DateInputProps) {
  const [name, setName] = useState("");
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [targetMonth, setTargetMonth] = useState<string>(String(currentMonth));
  const [targetYear, setTargetYear] = useState<string>(String(currentYear));

  const handleCalculate = () => {
    if (day && month && year) {
      const targetMonthNum = selectedMethod === "month" ? parseInt(targetMonth) : undefined;
      const targetYearNum = (selectedMethod === "month" || selectedMethod === "year") 
        ? parseInt(targetYear) 
        : undefined;
      
      onCalculate(
        parseInt(day), 
        parseInt(month), 
        parseInt(year), 
        name,
        targetMonthNum,
        targetYearNum
      );
    }
  };

  const isValid = day && month && year;

  const getButtonText = () => {
    switch (selectedMethod) {
      case "month":
        return "Рассчитать прогноз на месяц";
      case "year":
        return "Рассчитать прогноз на год";
      case "purpose":
        return "Узнать предназначение";
      default:
        return "Рассчитать";
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="gradient-card rounded-2xl p-8 border border-border">
        <div className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Ваше имя
            </label>
            <Input
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-border focus:border-primary focus:ring-primary/20 h-12 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Date Selects */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Дата рождения
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                  <SelectValue placeholder="День" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-60">
                  {days.map((d) => (
                    <SelectItem key={d.value} value={d.value} className="focus:bg-secondary">
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                  <SelectValue placeholder="Месяц" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-60">
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="focus:bg-secondary">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                  <SelectValue placeholder="Год" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-60">
                  {years.map((y) => (
                    <SelectItem key={y.value} value={y.value} className="focus:bg-secondary">
                      {y.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Date for Forecasts */}
          {(selectedMethod === "month" || selectedMethod === "year") && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {selectedMethod === "month" ? "Месяц и год прогноза" : "Год прогноза"}
              </label>
              <div className={`grid gap-3 ${selectedMethod === "month" ? "grid-cols-2" : "grid-cols-1"}`}>
                {selectedMethod === "month" && (
                  <Select value={targetMonth} onValueChange={setTargetMonth}>
                    <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                      <SelectValue placeholder="Месяц" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border max-h-60">
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value} className="focus:bg-secondary">
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Select value={targetYear} onValueChange={setTargetYear}>
                  <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                    <SelectValue placeholder="Год" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border max-h-60">
                    {forecastYears.map((y) => (
                      <SelectItem key={y.value} value={y.value} className="focus:bg-secondary">
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={!isValid}
            className="w-full h-14 text-lg font-display btn-fill animate-gentle-shake bg-primary hover:bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none transition-all duration-300 rounded-full border-2 border-primary"
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
}

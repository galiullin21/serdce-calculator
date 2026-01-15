import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

interface DateInputProps {
  onCalculate: (day: number, month: number, year: number, name: string) => void;
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
const years = Array.from({ length: 100 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

export function DateInput({ onCalculate }: DateInputProps) {
  const [name, setName] = useState("");
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const handleCalculate = () => {
    if (day && month && year) {
      onCalculate(parseInt(day), parseInt(month), parseInt(year), name);
    }
  };

  const isValid = day && month && year;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="gradient-card rounded-2xl p-8 shadow-elevated border border-border/50 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Ваше имя
            </label>
            <Input
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 h-12 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Date Selects */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Дата рождения
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary h-12">
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
                <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary h-12">
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
                <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary h-12">
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

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            disabled={!isValid}
            className="w-full h-14 text-lg font-display font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-glow"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Рассчитать
          </Button>
        </div>
      </div>
    </div>
  );
}

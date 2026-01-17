// Функции расчётов для нумерологии
import { getArcana } from './arcana';

// Интерфейсы
export interface PersonalMatrix {
  birthDate: { day: number; month: number; year: number };
  positions: number[]; // 12 позиций
  mirrorArcana: { positions: [number, number]; arcana: number }[];
  reversedArcana: { positions: number[]; arcana: number }[];
  successCode: number[]; // позиции 4, 5, 7, 12
}

export interface YearForecast {
  birthDate: { day: number; month: number; year: number };
  targetYear: number;
  arcana: number;
}

export interface MonthForecast {
  birthDate: { day: number; month: number; year: number };
  targetMonth: number;
  targetYear: number;
  // Треугольник месяца
  position1: number; // Аркан года
  position2: number; // Аркан месяца (1-12)
  position3: number; // Сумма позиций 1 и 2
}

// Базовые правила приведения числа к аркану (1-22)
export function normalizeToArcana(num: number): number {
  // Правило 1: Если число > 22, вычитаем 22
  while (num > 22) {
    num -= 22;
  }
  // Правило 2: Если число = 0, заменяем на 22
  if (num === 0) {
    return 22;
  }
  // Правило 3: Если число отрицательное, прибавляем 22
  while (num < 0) {
    num += 22;
  }
  // После прибавления 22 число может стать > 22
  while (num > 22) {
    num -= 22;
  }
  if (num === 0) {
    return 22;
  }
  return num;
}

// Сумма цифр числа
export function sumDigits(num: number): number {
  return Math.abs(num)
    .toString()
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

// Приведение года к аркану
export function yearToArcana(year: number): number {
  let sum = sumDigits(year);
  return normalizeToArcana(sum);
}

// Приведение дня к аркану
export function dayToArcana(day: number): number {
  return normalizeToArcana(day);
}

// Расчёт личной матрицы (12 позиций)
export function calculatePersonalMatrix(day: number, month: number, year: number): PersonalMatrix {
  const positions: number[] = new Array(12).fill(0);
  
  // Позиция 1: День рождения
  positions[0] = dayToArcana(day);
  
  // Позиция 2: Месяц рождения
  positions[1] = month;
  
  // Позиция 3: Год рождения (сумма цифр)
  positions[2] = yearToArcana(year);
  
  // Позиция 4: Позиция 1 + 2
  positions[3] = normalizeToArcana(positions[0] + positions[1]);
  
  // Позиция 5: Позиция 2 + 3
  positions[4] = normalizeToArcana(positions[1] + positions[2]);
  
  // Позиция 6: Позиция 4 - 3 (может быть отрицательным)
  positions[5] = normalizeToArcana(positions[3] - positions[2]);
  
  // Позиция 7: Позиция 1 + 4
  positions[6] = normalizeToArcana(positions[0] + positions[3]);
  
  // Позиция 8: Позиция 5 + 7
  positions[7] = normalizeToArcana(positions[4] + positions[6]);
  
  // Позиция 9: Позиция 6 + 8
  positions[8] = normalizeToArcana(positions[5] + positions[7]);
  
  // Позиция 10: Позиция 4 - 5
  positions[9] = normalizeToArcana(positions[3] - positions[4]);
  
  // Позиция 11: Позиция 10 + 5
  positions[10] = normalizeToArcana(positions[9] + positions[4]);
  
  // Позиция 12: Позиция 10 + 11
  positions[11] = normalizeToArcana(positions[9] + positions[10]);
  
  // Определение зеркальных и перевёрнутых арканов
  const { mirrorArcana, reversedArcana } = findSpecialArcana(positions);
  
  // Код успеха: позиции 4, 5, 7, 12
  const successCode = [positions[3], positions[4], positions[6], positions[11]];
  
  return {
    birthDate: { day, month, year },
    positions,
    mirrorArcana,
    reversedArcana,
    successCode
  };
}

// Поиск зеркальных и перевёрнутых арканов в основном треугольнике (позиции 1-6)
function findSpecialArcana(positions: number[]): {
  mirrorArcana: { positions: [number, number]; arcana: number }[];
  reversedArcana: { positions: number[]; arcana: number }[];
} {
  const mirrorArcana: { positions: [number, number]; arcana: number }[] = [];
  const reversedArcana: { positions: number[]; arcana: number }[] = [];
  
  // Только основной треугольник (позиции 0-5, т.е. 1-6)
  const mainTriangle = positions.slice(0, 6);
  
  // Находим все повторяющиеся арканы
  const arcanaOccurrences: Map<number, number[]> = new Map();
  
  mainTriangle.forEach((arcana, index) => {
    const pos = index + 1; // 1-based position
    if (!arcanaOccurrences.has(arcana)) {
      arcanaOccurrences.set(arcana, []);
    }
    arcanaOccurrences.get(arcana)!.push(pos);
  });
  
  // Проверяем каждый повторяющийся аркан
  arcanaOccurrences.forEach((occurrences, arcana) => {
    if (occurrences.length >= 2) {
      // Зеркальные: позиции 1-4 или 3-5
      const isMirror1_4 = occurrences.includes(1) && occurrences.includes(4);
      const isMirror3_5 = occurrences.includes(3) && occurrences.includes(5);
      
      if (isMirror1_4) {
        mirrorArcana.push({ positions: [1, 4], arcana });
      }
      if (isMirror3_5) {
        mirrorArcana.push({ positions: [3, 5], arcana });
      }
      
      // Перевёрнутые: все остальные комбинации (исключая зеркальные пары)
      const remainingPositions = occurrences.filter(pos => {
        if (isMirror1_4 && (pos === 1 || pos === 4)) return false;
        if (isMirror3_5 && (pos === 3 || pos === 5)) return false;
        return true;
      });
      
      // Если есть другие повторения или это не зеркальная пара
      if (!isMirror1_4 && !isMirror3_5 && occurrences.length >= 2) {
        reversedArcana.push({ positions: occurrences, arcana });
      } else if (remainingPositions.length >= 1 && (isMirror1_4 || isMirror3_5)) {
        // Тройной аркан - остаток после зеркальной пары
        const allPositions = [...occurrences];
        if (allPositions.length >= 3) {
          // Это тройной аркан - супер-усиление
          reversedArcana.push({ positions: allPositions, arcana });
        }
      }
    }
  });
  
  return { mirrorArcana, reversedArcana };
}

// Расчёт годового прогноза
export function calculateYearForecast(day: number, month: number, year: number, targetYear: number): YearForecast {
  // Формула: аркан_года_рождения + аркан_целевого_года
  const birthYearArcana = yearToArcana(year);
  const targetYearArcana = yearToArcana(targetYear);
  const arcana = normalizeToArcana(birthYearArcana + targetYearArcana);
  
  return {
    birthDate: { day, month, year },
    targetYear,
    arcana
  };
}

// Расчёт месячного прогноза
export function calculateMonthForecast(
  day: number, 
  month: number, 
  year: number, 
  targetMonth: number, 
  targetYear: number
): MonthForecast {
  // Позиция 1: Аркан года (годовой прогноз)
  const yearForecast = calculateYearForecast(day, month, year, targetYear);
  const position1 = yearForecast.arcana;
  
  // Позиция 2: Номер месяца (1-12)
  const position2 = targetMonth;
  
  // Позиция 3: Сумма позиций 1 и 2
  const position3 = normalizeToArcana(position1 + position2);
  
  return {
    birthDate: { day, month, year },
    targetMonth,
    targetYear,
    position1,
    position2,
    position3
  };
}

// Получение названия месяца
export function getMonthName(month: number): string {
  const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  return months[month - 1] || "";
}

// Форматирование даты
export function formatBirthDate(day: number, month: number, year: number): string {
  const monthName = getMonthName(month);
  return `${day} ${monthName} ${year}`;
}

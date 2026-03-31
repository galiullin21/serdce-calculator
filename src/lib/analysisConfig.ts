// Конфигурация всех типов разборов и их тарифов

export type TierType = 'basic' | 'professional';

export interface TierConfig {
  available: boolean;
  isFree: boolean;
  label: string;
  description: string;
}

export interface AnalysisTypeConfig {
  id: string;
  methodId: string; // maps to selectedMethod
  title: string;
  description: string;
  icon: string; // lucide icon name
  basic: TierConfig;
  professional: TierConfig | null; // null = no professional tier
  inputType: 'date' | 'name' | 'compatibility' | 'date-contract';
}

export const analysisConfigs: AnalysisTypeConfig[] = [
  {
    id: 'purpose',
    methodId: 'purpose',
    title: 'Предназначение',
    description: 'Ваша личная матрица судьбы по 12 позициям',
    icon: 'Compass',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Основной треугольник (6 позиций), ключевые характеристики',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Все 12 позиций, диагональ, карма, код успеха, жизненные периоды',
    },
    inputType: 'date',
  },
  {
    id: 'compatibility',
    methodId: 'compatibility',
    title: 'Совместимость',
    description: 'Анализ совместимости двух людей по дате рождения',
    icon: 'Users',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Процент совместимости, аркан союза, краткие выводы',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Полный анализ: гармония, карма, сильные/слабые стороны, рекомендации',
    },
    inputType: 'compatibility',
  },
  {
    id: 'year',
    methodId: 'year',
    title: 'Прогноз на год',
    description: 'Энергия и ключевые темы вашего года',
    icon: 'CalendarDays',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Аркан года, краткое описание энергии',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Детальный прогноз, рекомендации, подходящие профессии, подводные камни',
    },
    inputType: 'date',
  },
  {
    id: 'month',
    methodId: 'month',
    title: 'Прогноз на месяц',
    description: 'Энергетический треугольник месяца',
    icon: 'Calendar',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Треугольник месяца, основной аркан, краткое описание',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Все три энергии, влияющие арканы, детальные рекомендации',
    },
    inputType: 'date',
  },
  {
    id: 'day',
    methodId: 'day',
    title: 'Прогноз на день',
    description: 'Подробный расклад энергий на конкретный день',
    icon: 'Clock',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Ключевые позиции дня, краткий обзор',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Все 12 позиций дня с полными описаниями',
    },
    inputType: 'date',
  },
  {
    id: 'ancestral',
    methodId: 'ancestral',
    title: 'Родовые программы',
    description: 'Кармическая звезда и родовые роли',
    icon: 'Brain',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Рабочие числа, кармическая звезда, роли',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Полные интерпретации всех цифр, глубокий анализ проклятий и ролей',
    },
    inputType: 'date',
  },
  {
    id: 'contract',
    methodId: 'contract',
    title: 'Энергия договора',
    description: 'Энергетический анализ даты заключения договора',
    icon: 'Building',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Вердикт, 4 ключевые позиции',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Все 12 позиций: ресурсы, скрытые мотивы, кармический урок',
    },
    inputType: 'date',
  },
  {
    id: 'name',
    methodId: 'name',
    title: 'Энергия названия',
    description: 'Нумерологический анализ названия или имени',
    icon: 'Type',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Аркан названия, гармоничность, краткая рекомендация',
    },
    professional: null, // только один тариф
    inputType: 'name',
  },
  {
    id: 'finance',
    methodId: 'finance',
    title: 'Финансовый код',
    description: 'Ваш код финансового потенциала',
    icon: 'Wallet',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Талант и ресурс, краткое описание',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Все 4 аркана, миссия, блоки, профессии, детальные рекомендации',
    },
    inputType: 'date',
  },
];

export function getAnalysisConfig(id: string): AnalysisTypeConfig | undefined {
  return analysisConfigs.find(c => c.id === id);
}

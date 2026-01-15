import { useState } from "react";
import { Header } from "@/components/Header";
import { Calendar } from "@/components/ui/calendar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { reduceToSingleDigit, numberDescriptions } from "@/lib/numerology";
import { ru } from "date-fns/locale";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Calculate day code numbers
  const getDayNumbers = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const mindNumber = reduceToSingleDigit(day);
    const actionNumber = reduceToSingleDigit(month);
    const realizationNumber = reduceToSingleDigit(year);
    const totalNumber = reduceToSingleDigit(day + month + year);

    return { mindNumber, actionNumber, realizationNumber, totalNumber };
  };

  const dayNumbers = selectedDate ? getDayNumbers(selectedDate) : null;

  const getDayInterpretation = (number: number, type: string) => {
    const info = numberDescriptions[number];
    if (!info) return "";

    const interpretations: Record<string, Record<number, string>> = {
      mind: {
        1: "Сегодня день для лидерства и инициативы. Проявите решительность, начните новые проекты. Время действовать самостоятельно.",
        2: "День для сотрудничества и дипломатии. Уделите внимание партнёрствам, слушайте интуицию. Хорошо для переговоров.",
        3: "Творческий день! Выражайте себя, общайтесь, делитесь идеями. Отличное время для презентаций и обучения.",
        4: "День для практических дел и организации. Займитесь планированием, структурируйте задачи. Создавайте фундамент.",
        5: "День перемен и приключений! Будьте гибкими, исследуйте новое. Отличное время для путешествий и коммуникации.",
        6: "День для семьи и заботы. Уделите внимание близким, создавайте гармонию. Хорошо для творчества и красоты.",
        7: "День для размышлений и анализа. Уединитесь, изучайте, медитируйте. Слушайте свою интуицию.",
        8: "Дисциплина, контроль и проявление силы воли. Приведите в порядок дела, финансы. Время для материализации желаний.",
        9: "День завершений и мудрости. Помогайте другим, делитесь опытом. Отпускайте старое, готовьтесь к новому.",
      },
      action: {
        1: "Действуйте решительно и независимо. Берите ответственность на себя.",
        2: "Действуйте через сотрудничество. Ищите партнёров и союзников.",
        3: "Действуйте творчески. Используйте коммуникацию как инструмент.",
        4: "Действуйте методично. Шаг за шагом к цели.",
        5: "Действуйте гибко. Адаптируйтесь к обстоятельствам.",
        6: "Действуйте с заботой. Создавайте гармонию вокруг.",
        7: "Действуйте обдуманно. Анализируйте перед решением.",
        8: "Действуйте с силой. Проявляйте власть и контроль.",
        9: "Действуйте с мудростью. Служите высшим целям.",
      },
      realization: {
        1: "Реализация через лидерство и инновации.",
        2: "Реализация через партнёрство и поддержку.",
        3: "Реализация через творчество и общение.",
        4: "Реализация через труд и организацию.",
        5: "Реализация через перемены и коммуникацию.",
        6: "Реализация через служение и красоту.",
        7: "Реализация через знания и духовность.",
        8: "Реализация через бизнес и материальный успех.",
        9: "Реализация через мудрость и помощь другим.",
      },
      total: {
        1: "Итог дня направлен на независимость и новые начинания.",
        2: "Итог дня направлен на гармонию и баланс.",
        3: "Итог дня направлен на радость и самовыражение.",
        4: "Итог дня направлен на стабильность и порядок.",
        5: "Итог дня направлен на свободу и опыт.",
        6: "Итог дня направлен на любовь и ответственность.",
        7: "Итог дня направлен на понимание и интроспекцию.",
        8: "Итог дня направлен на достижения и власть.",
        9: "Итог дня направлен на завершение и отпускание.",
      },
    };

    return interpretations[type]?.[number] || info.description;
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div>
              <h2 className="text-lg text-muted-foreground mb-4">
                Выберите дату, на которую хотите посмотреть прогноз
              </h2>
              
              <div className="gradient-card rounded-2xl p-4 border border-border inline-block">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ru}
                  className="rounded-xl"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-lg font-display text-foreground",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-secondary rounded-lg",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                    day: "h-10 w-10 p-0 font-normal rounded-lg hover:bg-secondary transition-colors",
                    day_range_end: "day-range-end",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold",
                    day_today: "bg-secondary text-foreground font-semibold",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_hidden: "invisible",
                  }}
                />
              </div>
            </div>

            {/* Day Code Section */}
            <div>
              <h2 className="text-2xl font-display text-foreground mb-6">
                Код дня
              </h2>
              
              {selectedDate && dayNumbers && (
                <div className="space-y-3">
                  <Accordion type="single" collapsible defaultValue="mind">
                    <AccordionItem value="mind" className="gradient-card rounded-xl border border-border px-4 mb-3">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <span className="text-lg font-display text-primary">
                          {dayNumbers.mindNumber} — Число Ума
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {getDayInterpretation(dayNumbers.mindNumber, "mind")}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="action" className="gradient-card rounded-xl border border-border px-4 mb-3">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <span className="text-lg font-display text-primary">
                          {dayNumbers.actionNumber} — Число Действия
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {getDayInterpretation(dayNumbers.actionNumber, "action")}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="realization" className="gradient-card rounded-xl border border-border px-4 mb-3">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <span className="text-lg font-display text-primary">
                          {dayNumbers.realizationNumber} — Число Реализации
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {getDayInterpretation(dayNumbers.realizationNumber, "realization")}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="total" className="gradient-card rounded-xl border border-border px-4">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <span className="text-lg font-display text-primary">
                          {dayNumbers.totalNumber} — Число Итога
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {getDayInterpretation(dayNumbers.totalNumber, "total")}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;

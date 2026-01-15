import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Calculator, Crown, BookOpen, Bot, Phone, GraduationCap, Hash, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  {
    id: "analysis",
    title: "Разборы",
    description: "Получите подробный цифровой анализ вашей личности, совместимости и ещё много другого!",
    icon: FileText,
    action: "Заказать",
    link: "/",
  },
  {
    id: "calculator",
    title: "Калькулятор",
    description: "Ваш карманный нумеролог, который даст самый подробный анализ любых данностей!",
    icon: Calculator,
    action: "Купить",
    link: "/",
  },
  {
    id: "channel",
    title: "Закрытый Канал",
    description: "Место, в котором есть всё для развития и реализации вашей личности, и даже больше!",
    icon: Crown,
    action: "Начать",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "book",
    title: "Базовая книга",
    description: "Базовое пособие для изучения нумерологической системы.",
    icon: BookOpen,
    action: "Купить",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "ai",
    title: "Нейросеть-помощник",
    description: "Искусственный интеллект, который станет для вас личным экспертом и помощником!",
    icon: Bot,
    action: "Начать",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "consultation",
    title: "Консультация",
    description: "Персональная онлайн-консультация с экспертом, обсуждение всех интересующих вопросов.",
    icon: Phone,
    action: "Записаться",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "school",
    title: "Школа нумерологии",
    description: "Групповые онлайн-занятия для новичков и профессиональных студентов.",
    icon: GraduationCap,
    action: "Записаться",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "alphabet",
    title: "Азбука цифр",
    description: "Ваш алфавит в изучении нумерологической системы.",
    icon: Hash,
    action: "Купить",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "course",
    title: "Онлайн-курс",
    description: "Онлайн-курс для самостоятельного изучения системы нумерологии.",
    icon: Award,
    action: "Записаться",
    link: "https://t.me/galiullin_ruzal",
  },
];

const ProductsPage = () => {
  const handleClick = (link: string) => {
    if (link.startsWith("http")) {
      window.open(link, "_blank");
    } else {
      window.location.href = link;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display text-primary text-center mb-10">
            Продукты и услуги
          </h1>
          
          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group gradient-card rounded-2xl p-6 border border-border transition-all duration-300 cursor-pointer hover:border-primary/30"
                onClick={() => handleClick(product.link)}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <product.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-display text-foreground mb-2">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 min-h-[48px]">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Button
                    className="btn-fill animate-gentle-shake bg-primary text-primary-foreground border-2 border-primary"
                  >
                    {product.action}
                  </Button>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;

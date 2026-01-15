import { Header } from "@/components/Header";
import { StarField } from "@/components/StarField";
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
    gradient: "from-teal-500/30 to-cyan-600/30",
    link: "/",
  },
  {
    id: "calculator",
    title: "Калькулятор",
    description: "Ваш карманный нумеролог, который даст самый подробный анализ любых данностей!",
    icon: Calculator,
    action: "Купить",
    gradient: "from-purple-500/30 to-violet-600/30",
    link: "/",
  },
  {
    id: "channel",
    title: "Закрытый Канал K+ | Капустин+",
    description: "Место, в котором есть всё для развития и реализации вашей личности, и даже больше!",
    icon: Crown,
    action: "Начать",
    gradient: "from-amber-500/30 to-yellow-600/30",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "book",
    title: "Базовая книга",
    description: "Базовое пособие для изучения нумерологической системы KeyTo.",
    icon: BookOpen,
    action: "Купить",
    gradient: "from-emerald-500/30 to-green-600/30",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "ai",
    title: "Нейросеть «Алексей, скажи!»",
    description: "Искусственный интеллект, который станет для вас личным экспертом и помощником!",
    icon: Bot,
    action: "Начать",
    gradient: "from-orange-500/30 to-red-500/30",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "consultation",
    title: "Консультация",
    description: "Персональная онлайн-консультация с экспертом, обсуждение всех интересующих вопросов.",
    icon: Phone,
    action: "Записаться",
    gradient: "from-rose-500/30 to-pink-600/30",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "school",
    title: "Школа KeyTo",
    description: "Групповые онлайн-занятия для новичков и профессиональных студентов.",
    icon: GraduationCap,
    action: "Записаться",
    gradient: "from-fuchsia-500/30 to-purple-600/30",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "alphabet",
    title: "Азбука цифр",
    description: "Ваш алфавит в изучении нумерологической системы KeyTo.",
    icon: Hash,
    action: "Купить",
    gradient: "from-sky-500/30 to-blue-600/30",
    link: "https://t.me/galiullin_ruzal",
  },
  {
    id: "course",
    title: "Курс СПП",
    description: "Онлайн-курс для самостоятельного изучения системы KeyTo.",
    icon: Award,
    action: "Записаться",
    gradient: "from-indigo-500/30 to-purple-600/30",
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
    <div className="min-h-screen relative">
      <StarField />
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-elevated cursor-pointer",
                  "border border-border/30"
                )}
                onClick={() => handleClick(product.link)}
              >
                {/* Background gradient */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-60",
                  product.gradient
                )} />
                
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                <div className="relative z-10">
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-foreground/80 mb-6 min-h-[60px]">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="secondary"
                      className="bg-background/90 hover:bg-background text-foreground"
                    >
                      {product.action}
                    </Button>
                    <ArrowRight className="w-5 h-5 text-foreground/60 group-hover:translate-x-1 transition-transform" />
                  </div>
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

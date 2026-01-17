import { Header } from "@/components/Header";
import { Mail, MessageCircle, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const SupportPage = () => {
  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-display text-primary mb-8 text-center">
          Поддержка
        </h1>

        {/* Contact Section */}
        <section className="max-w-3xl mx-auto mb-12">
          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-display text-foreground">Связаться с нами</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Если у вас есть вопросы или предложения, вы можете связаться с нами через Telegram.
            </p>
            <Button
              onClick={handleTelegramClick}
              className="btn-fill bg-primary hover:bg-primary text-primary-foreground rounded-full border-2 border-primary"
            >
              <Mail className="w-4 h-4 mr-2" />
              Написать в Telegram
            </Button>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="max-w-3xl mx-auto mb-12">
          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-display text-foreground">Политика конфиденциальности</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>
                Мы уважаем вашу конфиденциальность и обязуемся защищать ваши персональные данные.
              </p>
              <h3 className="text-foreground font-medium">Сбор данных</h3>
              <p>
                Мы собираем только те данные, которые вы добровольно предоставляете при использовании нашего сервиса (имя, дата рождения для расчётов).
              </p>
              <h3 className="text-foreground font-medium">Использование данных</h3>
              <p>
                Предоставленные данные используются исключительно для выполнения нумерологических расчётов и не передаются третьим лицам.
              </p>
              <h3 className="text-foreground font-medium">Хранение данных</h3>
              <p>
                Данные обрабатываются локально и не сохраняются на серверах без вашего явного согласия.
              </p>
            </div>
          </div>
        </section>

        {/* Terms of Use */}
        <section className="max-w-3xl mx-auto">
          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-display text-foreground">Условия использования</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <h3 className="text-foreground font-medium">Общие положения</h3>
              <p>
                Используя данный сервис, вы соглашаетесь с настоящими условиями использования.
              </p>
              <h3 className="text-foreground font-medium">Информационный характер</h3>
              <p>
                Результаты нумерологических расчётов носят информационный и развлекательный характер. 
                Они не являются руководством к действию и не заменяют профессиональную консультацию специалиста.
              </p>
              <h3 className="text-foreground font-medium">Ответственность</h3>
              <p>
                Мы не несём ответственности за решения, принятые на основе полученных расчётов. 
                Вся ответственность за использование информации лежит на пользователе.
              </p>
              <h3 className="text-foreground font-medium">Изменения условий</h3>
              <p>
                Мы оставляем за собой право изменять условия использования. 
                Актуальная версия всегда доступна на данной странице.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupportPage;

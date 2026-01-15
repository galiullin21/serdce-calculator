import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronRight, Edit2, History, Lock, Mail, FileText, LogOut, Sun } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [name, setName] = useState("Гость");
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [isEditing, setIsEditing] = useState(false);

  const handleTelegramClick = () => {
    window.open("https://t.me/galiullin_ruzal", "_blank");
  };

  const menuItems = [
    { label: "Сменить пароль", icon: Lock, action: handleTelegramClick },
    { label: "Написать в поддержку", icon: Mail, action: handleTelegramClick },
    { label: "Политика конфиденциальности", icon: FileText, action: handleTelegramClick },
    { label: "Условия использования", icon: FileText, action: handleTelegramClick },
  ];

  return (
    <div className="min-h-screen bg-background warm-pattern">
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <h1 className="text-2xl font-display font-bold text-foreground">Профиль</h1>
            </div>
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <History className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* User Data Card */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">Ваши данные</h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="border-b border-border pb-4">
                <label className="text-sm text-muted-foreground">Ваше имя</label>
                {isEditing ? (
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 bg-background border-border"
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">{name}</p>
                )}
              </div>

              <div className="border-b border-border pb-4">
                <label className="text-sm text-muted-foreground">Дата рождения</label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="mt-1 bg-background border-border"
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">{birthDate}</p>
                )}
              </div>

              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-foreground">Язык</span>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-medium">РУС</span>
                  <span className="text-muted-foreground">ENG</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-foreground">Тема</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Светлая</span>
                  <Sun className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden mb-6">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors ${
                  index !== menuItems.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="text-foreground">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleTelegramClick}
            variant="outline"
            className="w-full h-14 border-primary text-primary font-semibold hover:bg-primary/10"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Выйти
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

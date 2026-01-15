import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { User, Sparkles } from "lucide-react";

const navItems = [
  { label: "Разборы", path: "/" },
  { label: "Календарь", path: "/calendar" },
  { label: "Продукты", path: "/products" },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-xl font-display font-bold text-primary">KEYTO</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative py-1",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Profile */}
        <Link
          to="/profile"
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            location.pathname === "/profile"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
          )}
        >
          <User className="w-5 h-5" />
        </Link>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-center gap-6 pb-3 border-t border-border/20">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "text-xs font-medium transition-colors pt-3",
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

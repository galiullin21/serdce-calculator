import { useState } from "react";
import { numberDescriptions, categoryDescriptions } from "@/lib/numerology";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberCardProps {
  number: number;
  category: "mind" | "action" | "realization" | "total";
  delay?: number;
}

export function NumberCard({ number, category, delay = 0 }: NumberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const numberInfo = numberDescriptions[number];
  const categoryInfo = categoryDescriptions[category];

  if (!numberInfo) return null;

  const categoryColors = {
    mind: "from-blue-500/20 to-purple-500/20 border-blue-500/30",
    action: "from-green-500/20 to-teal-500/20 border-green-500/30",
    realization: "from-orange-500/20 to-yellow-500/20 border-orange-500/30",
    total: "from-primary/20 to-gold-light/20 border-primary/30",
  };

  const categoryIcons = {
    mind: "💭",
    action: "⚡",
    realization: "🎯",
    total: "✨",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border backdrop-blur-sm transition-all duration-500 animate-fade-in overflow-hidden",
        "bg-gradient-to-br",
        categoryColors[category],
        isExpanded ? "shadow-elevated" : "shadow-card hover:shadow-elevated"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Number Circle */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center border-2 border-primary/50 shadow-glow animate-glow-pulse">
                <span className="text-4xl font-display font-bold text-primary number-glow">
                  {number}
                </span>
              </div>
              <span className="absolute -top-1 -right-1 text-2xl">
                {categoryIcons[category]}
              </span>
            </div>

            {/* Title */}
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {categoryInfo.title}
              </p>
              <h3 className="text-2xl font-display font-bold text-foreground">
                {numberInfo.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {numberInfo.planet}
                </span>
              </div>
            </div>
          </div>

          {/* Expand Button */}
          <button className="p-2 rounded-full hover:bg-secondary/50 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Category Description */}
        <p className="mt-4 text-sm text-muted-foreground">
          {categoryInfo.description}
        </p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 animate-fade-in border-t border-border/50 pt-4">
          {/* Main Description */}
          <p className="text-foreground/90 leading-relaxed">
            {numberInfo.description}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Удачный день</p>
              <p className="text-sm font-medium text-foreground">{numberInfo.day}</p>
            </div>
            <div className="bg-card/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Цвет удачи</p>
              <p className="text-sm font-medium text-foreground">{numberInfo.color}</p>
            </div>
          </div>

          {/* Qualities */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Позитивные качества</p>
              <div className="flex flex-wrap gap-2">
                {numberInfo.positive.map((quality) => (
                  <span
                    key={quality}
                    className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs border border-green-500/20"
                  >
                    {quality}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Негативные качества</p>
              <div className="flex flex-wrap gap-2">
                {numberInfo.negative.map((quality) => (
                  <span
                    key={quality}
                    className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs border border-red-500/20"
                  >
                    {quality}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

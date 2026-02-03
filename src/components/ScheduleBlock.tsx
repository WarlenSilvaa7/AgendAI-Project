import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ScheduleBlockProps {
  time: string;
  title: string;
  duration: string;
  category?: "work" | "personal" | "health" | "learning";
}

const categoryStyles = {
  work: "border-l-primary bg-accent/30",
  personal: "border-l-blue-500 bg-blue-50 dark:bg-blue-950/30",
  health: "border-l-success bg-emerald-50 dark:bg-emerald-950/30",
  learning: "border-l-amber-500 bg-amber-50 dark:bg-amber-950/30",
};

export function ScheduleBlock({ time, title, duration, category = "work" }: ScheduleBlockProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border-l-4 transition-all duration-200",
        "hover:shadow-card-hover cursor-pointer animate-fade-in",
        categoryStyles[category]
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-primary">{time}</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{duration}</span>
        </div>
      </div>
      <h4 className="font-medium text-sm">{title}</h4>
    </div>
  );
}

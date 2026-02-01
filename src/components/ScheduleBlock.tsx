import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

interface ScheduleBlockProps {
  id?: string;
  time: string;
  title: string;
  duration: string;
  category?: "work" | "personal" | "health" | "learning";
  completed?: boolean;
  onEdit?: (id?: string) => void;
  onToggle?: (id?: string) => void;
}

const categoryStyles = {
  work: "border-l-primary bg-accent/30",
  personal: "border-l-blue-500 bg-blue-50 dark:bg-blue-950/30",
  health: "border-l-success bg-emerald-50 dark:bg-emerald-950/30",
  learning: "border-l-amber-500 bg-amber-50 dark:bg-amber-950/30",
};

export function ScheduleBlock({ id, time, title, duration, category = "work", completed = false, onEdit, onToggle }: ScheduleBlockProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border-l-4 transition-all duration-200",
        "hover:shadow-card-hover animate-fade-in cursor-default",
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

      {/* Title row: checkbox before title */}
      <div className="flex items-center gap-3 mt-2">
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={!!completed} onCheckedChange={(v) => { if (v !== undefined) { onToggle && onToggle(id); } }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(id);
            }}
            className={cn(
              "font-medium text-sm cursor-pointer hover:underline truncate",
              completed && "line-through text-muted-foreground"
            )}
            title={title}
          >
            {title}
          </h4>
        </div>
      </div>
    </div>
  );
}

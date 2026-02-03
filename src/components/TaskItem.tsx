import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ id, title, completed, time, onToggle, onDelete }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(id), 200);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
        "bg-card border border-border hover:shadow-card-hover",
        completed && "opacity-60",
        isDeleting && "scale-95 opacity-0"
      )}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className={cn(
          "h-5 w-5 rounded-full border-2 transition-all",
          completed && "animate-check-bounce bg-success border-success"
        )}
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium transition-all",
            completed && "line-through text-muted-foreground"
          )}
        >
          {title}
        </p>
        {time && (
          <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

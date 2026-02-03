import { cn } from "@/lib/utils";

interface DaySelectorProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

const days = [
  { id: 0, short: "Dom", full: "Domingo" },
  { id: 1, short: "Seg", full: "Segunda" },
  { id: 2, short: "Ter", full: "Terça" },
  { id: 3, short: "Qua", full: "Quarta" },
  { id: 4, short: "Qui", full: "Quinta" },
  { id: 5, short: "Sex", full: "Sexta" },
  { id: 6, short: "Sáb", full: "Sábado" },
];

export function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  const today = new Date().getDay();

  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {days.map((day) => (
        <button
          key={day.id}
          onClick={() => onSelectDay(day.id)}
          className={cn(
            "flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
            "hover:bg-accent/50",
            selectedDay === day.id
              ? "gradient-primary text-primary-foreground shadow-card"
              : "bg-secondary/50 text-muted-foreground",
            today === day.id && selectedDay !== day.id && "ring-1 ring-primary/30"
          )}
        >
          <span className="block sm:hidden">{day.short}</span>
          <span className="hidden sm:block">{day.full}</span>
        </button>
      ))}
    </div>
  );
}

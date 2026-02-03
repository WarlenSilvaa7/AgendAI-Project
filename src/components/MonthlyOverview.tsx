import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, CheckCircle2, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthlyStats {
  totalTasks: number;
  completedTasks: number;
  bestStreak: number;
  averageCompletion: number;
}

interface MonthlyOverviewProps {
  stats?: MonthlyStats;
}

export function MonthlyOverview({ stats }: MonthlyOverviewProps) {
  const defaultStats: MonthlyStats = {
    totalTasks: 124,
    completedTasks: 98,
    bestStreak: 12,
    averageCompletion: 79,
  };

  const data = stats || defaultStats;
  
  // Generate mock calendar data for the month
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNumber = i + 1;
    const isPast = dayNumber < today.getDate();
    const isToday = dayNumber === today.getDate();
    // Mock completion status (random for demo)
    const completionRate = isPast ? Math.floor(Math.random() * 40) + 60 : 0;
    return { day: dayNumber, isPast, isToday, completionRate };
  });

  const monthName = today.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Calendar className="h-5 w-5 text-primary" />
          Resumo de {monthName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-accent/30 border border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Concluídas</span>
            </div>
            <p className="text-xl font-bold font-display">
              {data.completedTasks}/{data.totalTasks}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-accent/30 border border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Média</span>
            </div>
            <p className="text-xl font-bold font-display">{data.averageCompletion}%</p>
          </div>
          <div className="col-span-2 p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Melhor sequência</span>
            </div>
            <p className="text-xl font-bold font-display text-success">{data.bestStreak} dias</p>
          </div>
        </div>

        {/* Mini Calendar */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Atividade diária</p>
          <div className="grid grid-cols-7 gap-1">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
              <div key={i} className="text-center text-[10px] text-muted-foreground font-medium py-1">
                {day}
              </div>
            ))}
            {/* Empty cells for alignment */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {/* Calendar days */}
            {calendarDays.map(({ day, isPast, isToday, completionRate }) => (
              <div
                key={day}
                className={cn(
                  "aspect-square rounded-md flex items-center justify-center text-[10px] font-medium transition-colors",
                  isToday && "ring-2 ring-primary ring-offset-1",
                  isPast && completionRate === 100 && "bg-success/60 text-success-foreground",
                  isPast && completionRate > 0 && completionRate < 100 && "bg-warning/60 text-warning-foreground",
                  isPast && completionRate === 0 && "bg-destructive/50 text-destructive-foreground",
                  !isPast && !isToday && "bg-secondary/50 text-muted-foreground"
                )}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-success/60" />
              <span>100%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-warning/60" />
              <span>Parcial</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-destructive/50" />
              <span>0%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

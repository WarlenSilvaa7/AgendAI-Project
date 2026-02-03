import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskItem } from "@/components/TaskItem";
import { ScheduleBlock } from "@/components/ScheduleBlock";
import { AIAssistant } from "@/components/AIAssistant";
import { StatsCard } from "@/components/StatsCard";
import { DaySelector } from "@/components/DaySelector";
import { MonthlyOverview } from "@/components/MonthlyOverview";
import { useRoutineAI } from "@/hooks/useRoutineAI";
import { useToast } from "@/hooks/use-toast";
import { 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  Plus,
  Target,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  dayOfWeek?: number;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  duration: string;
  category: "work" | "personal" | "health" | "learning";
  dayOfWeek?: number;
}

const today = new Date().getDay();

const initialTasks: Task[] = [
  { id: "1", title: "Revisar emails importantes", completed: false, time: "09:00", dayOfWeek: today },
  { id: "2", title: "Reunião de planejamento", completed: true, time: "10:00", dayOfWeek: today },
  { id: "3", title: "Exercícios de alongamento", completed: false, time: "12:00", dayOfWeek: today },
  { id: "4", title: "Estudar novo framework", completed: false, time: "14:00", dayOfWeek: today },
];

const initialSchedule: ScheduleItem[] = [
  { id: "1", time: "08:00", title: "Rotina matinal", duration: "45min", category: "personal", dayOfWeek: today },
  { id: "2", time: "09:00", title: "Bloco de foco - Trabalho", duration: "2h", category: "work", dayOfWeek: today },
  { id: "3", time: "12:00", title: "Almoço + Descanso", duration: "1h", category: "personal", dayOfWeek: today },
  { id: "4", time: "14:00", title: "Aprendizado", duration: "1h", category: "learning", dayOfWeek: today },
  { id: "5", time: "17:00", title: "Exercícios físicos", duration: "1h", category: "health", dayOfWeek: today },
];

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [newTask, setNewTask] = useState("");
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const { generateRoutine, isLoading } = useRoutineAI();
  const { toast } = useToast();

  // Filter by selected day
  const filteredSchedule = schedule.filter((s) => s.dayOfWeek === selectedDay || !s.dayOfWeek);
  const filteredTasks = tasks.filter((t) => t.dayOfWeek === selectedDay || !t.dayOfWeek);

  const completedTasks = filteredTasks.filter((t) => t.completed).length;
  const completionRate = Math.round((completedTasks / filteredTasks.length) * 100) || 0;

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        dayOfWeek: selectedDay,
      };
      setTasks((prev) => [...prev, task]);
      setNewTask("");
    }
  };

  const handleAISubmit = async (message: string) => {
    const result = await generateRoutine(message);
    if (result) {
      if (result.tasks && result.tasks.length > 0) {
        const newTasks: Task[] = result.tasks.map((t, i) => ({
          id: `ai-${Date.now()}-${i}`,
          title: t.title,
          completed: false,
          time: t.time,
          dayOfWeek: selectedDay,
        }));
        setTasks((prev) => [...prev, ...newTasks]);
      }

      if (result.schedule && result.schedule.length > 0) {
        const newSchedule: ScheduleItem[] = result.schedule.map((s, i) => ({
          id: `ai-${Date.now()}-${i}`,
          time: s.time,
          title: s.title,
          duration: s.duration,
          category: (s.category as ScheduleItem["category"]) || "work",
          dayOfWeek: selectedDay,
        }));
        setSchedule((prev) => [...prev, ...newSchedule]);
      }

      toast({
        title: "Rotina atualizada! ✨",
        description: result.message || "Novas sugestões foram adicionadas",
      });
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleAISubmit(prompt);
  };

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                <span className="gradient-primary bg-clip-text text-transparent">RotinAI</span>
                <Sparkles className="h-5 w-5 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground capitalize">{today}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Tarefas Hoje"
            value={tasks.length}
            subtitle={`${completedTasks} concluídas`}
            icon={CheckCircle2}
            trend="up"
          />
          <StatsCard
            title="Taxa de Conclusão"
            value={`${completionRate}%`}
            subtitle="Ótimo progresso!"
            icon={Target}
            trend={completionRate >= 50 ? "up" : "down"}
          />
          <StatsCard
            title="Próxima Tarefa"
            value="09:00"
            subtitle="Revisar emails"
            icon={Clock}
            trend="neutral"
          />
          <StatsCard
            title="Sequência"
            value="5 dias"
            subtitle="Continue assim!"
            icon={TrendingUp}
            trend="up"
          />
        </div>

        {/* Day Selector */}
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Schedule */}
          <Card className="lg:col-span-1 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-display">
                <CalendarDays className="h-5 w-5 text-primary" />
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 max-h-[320px] overflow-y-auto">
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((item, index) => (
                    <div key={item.id} style={{ animationDelay: `${index * 50}ms` }}>
                      <ScheduleBlock
                        time={item.time}
                        title={item.title}
                        duration={item.duration}
                        category={item.category}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum item para este dia
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="lg:col-span-1 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-display">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Checklist Diária
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Nova tarefa..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  className="bg-secondary/50"
                />
                <Button size="icon" onClick={handleAddTask} className="gradient-primary shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                      <TaskItem
                        id={task.id}
                        title={task.title}
                        completed={task.completed}
                        time={task.time}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma tarefa para este dia
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="lg:col-span-1 shadow-card border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-display">
                <Sparkles className="h-5 w-5 text-primary" />
                Organizar com IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIAssistant
                onSuggestion={handleQuickPrompt}
                isLoading={isLoading}
                onSubmit={handleAISubmit}
              />
            </CardContent>
          </Card>
        </div>

        {/* Monthly Overview */}
        <MonthlyOverview />
      </main>
    </div>
  );
}

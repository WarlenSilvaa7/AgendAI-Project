import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAssistantProps {
  onSuggestion: (suggestion: string) => void;
  isLoading: boolean;
  onSubmit: (message: string) => void;
}

export function AIAssistant({ onSuggestion, isLoading, onSubmit }: AIAssistantProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSubmit(message);
      setMessage("");
    }
  };

  const quickPrompts = [
    "Organize minha manhã produtiva",
    "Rotina de exercícios diários",
    "Blocos de foco para trabalho",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm">Assistente IA</h3>
          <p className="text-xs text-muted-foreground">Me conte sobre sua rotina</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs h-7 hover:bg-accent hover:text-accent-foreground transition-all"
            onClick={() => onSuggestion(prompt)}
            disabled={isLoading}
          >
            {prompt}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Textarea
          placeholder="Descreva sua rotina ideal ou peça sugestões..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[80px] resize-none pr-12 bg-secondary/50 border-border focus:border-primary transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button
          size="icon"
          className={cn(
            "absolute bottom-2 right-2 h-8 w-8 gradient-primary transition-all",
            !message.trim() && "opacity-50"
          )}
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

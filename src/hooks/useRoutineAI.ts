import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIResponse {
  tasks?: Array<{ title: string; time?: string }>;
  schedule?: Array<{ time: string; title: string; duration: string; category: string }>;
  message?: string;
}

export function useRoutineAI() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRoutine = async (prompt: string): Promise<AIResponse | null> => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("generate-routine", {
        body: { prompt },
      });

      if (response.error) {
        throw new Error(response.error.message || "Erro ao gerar rotina");
      }

      return response.data as AIResponse;
    } catch (error) {
      console.error("AI Error:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível gerar sugestões",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateRoutine, isLoading };
}

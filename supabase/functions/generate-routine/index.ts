import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    const AI_GATEWAY_API_KEY = Deno.env.get("AI_GATEWAY_API_KEY");
    const AI_GATEWAY_URL = Deno.env.get("AI_GATEWAY_URL") || "https://api.example.com/v1/chat/completions";

    if (!AI_GATEWAY_API_KEY) {
      throw new Error("AI_GATEWAY_API_KEY is not configured");
    }

    console.log("Generating routine for prompt:", prompt);

    const systemPrompt = `Você é um assistente especializado em produtividade e organização de rotinas.
Sua tarefa é criar sugestões práticas de tarefas e horários baseado no pedido do usuário.

IMPORTANTE: Responda APENAS com um JSON válido, sem texto adicional.

O formato deve ser:
{
  "tasks": [
    { "title": "Nome da tarefa", "time": "08:00" }
  ],
  "schedule": [
    { "time": "08:00", "title": "Atividade", "duration": "30min", "category": "work|personal|health|learning" }
  ],
  "message": "Uma breve mensagem motivacional (1-2 frases)"
}

Gere de 3-5 tarefas relevantes e 4-6 blocos de horário.
Use horários realistas e categorias apropriadas.`;

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_GATEWAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos esgotados. Adicione créditos na sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response content:", content);

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-routine:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro desconhecido",
        tasks: [],
        schedule: [],
        message: "Não foi possível gerar sugestões. Tente novamente."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

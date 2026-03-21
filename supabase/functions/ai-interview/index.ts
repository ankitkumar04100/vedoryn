import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, interviewType, roleTarget, question, answer, questionsAsked, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let messages: { role: string; content: string }[] = [];

    if (action === "generate_question") {
      messages = [
        {
          role: "system",
          content: `You are an expert interviewer for ${roleTarget} positions. Generate a single ${interviewType} interview question. 
The candidate's profile: Skills: ${(profile?.skills || []).join(', ')}, Level: ${profile?.experience_level || 'beginner'}.
${questionsAsked?.length ? `Questions already asked (DO NOT repeat): ${questionsAsked.join('; ')}` : ''}
Return ONLY the question, nothing else. Make it challenging but appropriate for the level.`
        },
        { role: "user", content: `Generate a ${interviewType} interview question for a ${roleTarget} role.` }
      ];
    } else if (action === "evaluate_answer") {
      messages = [
        {
          role: "system",
          content: `You are an expert interviewer evaluating a candidate's answer. Provide a JSON response with exactly this structure:
{
  "score": <number 1-10>,
  "feedback": "<specific feedback on what was good and what needs improvement>",
  "model_answer": "<a concise ideal answer>",
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<area1>", "<area2>"]
}`
        },
        { role: "user", content: `Question: ${question}\n\nCandidate's Answer: ${answer}\n\nRole: ${roleTarget}\nType: ${interviewType}\n\nEvaluate this answer.` }
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        tools: action === "evaluate_answer" ? [{
          type: "function",
          function: {
            name: "evaluate_interview",
            description: "Evaluate an interview answer",
            parameters: {
              type: "object",
              properties: {
                score: { type: "number", description: "Score from 1-10" },
                feedback: { type: "string" },
                model_answer: { type: "string" },
                strengths: { type: "array", items: { type: "string" } },
                improvements: { type: "array", items: { type: "string" } },
              },
              required: ["score", "feedback", "model_answer", "strengths", "improvements"],
              additionalProperties: false,
            }
          }
        }] : undefined,
        tool_choice: action === "evaluate_answer" ? { type: "function", function: { name: "evaluate_interview" } } : undefined,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI error");
    }

    const data = await response.json();
    
    if (action === "generate_question") {
      const questionText = data.choices?.[0]?.message?.content || "Tell me about yourself and your experience.";
      return new Response(JSON.stringify({ question: questionText.trim() }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      let evaluation;
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        evaluation = JSON.parse(toolCall.function.arguments);
      } else {
        const content = data.choices?.[0]?.message?.content || "{}";
        try { evaluation = JSON.parse(content); } catch { evaluation = { score: 5, feedback: content, model_answer: "", strengths: [], improvements: [] }; }
      }
      return new Response(JSON.stringify(evaluation), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("ai-interview error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

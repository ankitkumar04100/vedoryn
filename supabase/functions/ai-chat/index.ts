import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    if (context === "mentor") {
      systemPrompt = `You are Vedoryn AI Mentor, an expert career advisor and personal coach. You have deep knowledge of:
- Career development strategies for tech, data science, product management, and more
- Interview preparation techniques and behavioral frameworks (STAR method)
- Resume optimization and personal branding
- Skill development roadmaps and learning paths
- Industry trends and job market insights
- Mental health and work-life balance for students

User Profile: ${profile ? `Goal: ${profile.career_goal || 'Not set'}, Skills: ${(profile.skills || []).join(', ') || 'None yet'}, Level: ${profile.experience_level || 'beginner'}, Career Score: ${profile.career_score || 0}` : 'New user'}

Be encouraging, specific, and actionable. Use markdown formatting. Ask follow-up questions when needed. Provide real-world examples and resources.`;
    } else if (context === "interview") {
      systemPrompt = `You are a professional interviewer conducting a realistic job interview. Generate challenging but fair questions based on the role. After each answer, provide:
1. A score out of 10
2. Specific feedback on what was good
3. What could be improved
4. A model answer for reference

Be professional but encouraging. Vary question types: technical, behavioral, situational, and problem-solving.`;
    } else if (context === "scholarship") {
      systemPrompt = `You are a scholarship advisor AI. Help students find and apply for scholarships. Provide real, actionable advice about:
- Finding relevant scholarships based on profile
- Writing compelling applications and SOPs
- Meeting eligibility requirements
- Preparing required documents
Use real scholarship names and organizations when possible.`;
    } else if (context === "roadmap") {
      systemPrompt = `You are a career roadmap generator. Based on the user's goal, skills, and level, create a detailed step-by-step learning roadmap with:
- Specific topics and resources
- Estimated time for each step
- Projects to build
- Skills to acquire
- Milestones and checkpoints
Format as a structured plan with clear progression.`;
    } else {
      systemPrompt = "You are Vedoryn AI, a helpful career intelligence assistant. Be concise, actionable, and encouraging.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

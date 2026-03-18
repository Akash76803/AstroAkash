import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { buildCompatibilityReport } from "../_shared/compatibility-engine.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      throw new Error("Invalid or empty JSON body in request");
    }

    const { user1_birth_data, user2_birth_data } = body;
    
    if (!user1_birth_data || !user2_birth_data) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          required: ["user1_birth_data", "user2_birth_data"]
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const compatibilityReport = await buildCompatibilityReport(user1_birth_data, user2_birth_data);

    return new Response(
      JSON.stringify(compatibilityReport),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    )
  } catch (error: any) {
    console.error("Compatibility Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    )
  }
})

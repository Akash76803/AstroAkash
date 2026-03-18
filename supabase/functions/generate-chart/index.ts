import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { calculateAstrologyData } from "../_shared/astrology-engine.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => {
      throw new Error("Invalid or empty JSON body in request");
    });

    const { date, time, location, ayanamsa } = body;
    
    if (!date || !time || !location) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          received: Object.keys(body),
          required: ["date", "time", "location"]
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const chartCalculations = calculateAstrologyData({
      date,
      time,
      location,
      ayanamsa,
    });

    return new Response(
      JSON.stringify(chartCalculations),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    )
  } catch (error: any) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : JSON.stringify(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Generate Chart Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage || "Unknown error", stack: errorStack }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    )
  }
})

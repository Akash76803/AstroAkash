import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import {
  calculateAstrologyData,
  calculateAyanamsaDegrees,
  calculateTransitAnalysis,
  type LocationInput,
} from "../_shared/astrology-engine.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let body: Record<string, unknown> = {};
    if (req.method === "POST") {
      body = await req.json().catch(() => {
        throw new Error("Invalid JSON body in request");
      });
    }

    const date = typeof body.date === "string" ? body.date : undefined;
    const time = typeof body.time === "string" ? body.time : undefined;
    const location = body.location;
    const ayanamsa = body.ayanamsa === "krishnamurti" ? "krishnamurti" : "lahiri";

    if (date && time && location) {
      const natalData = calculateAstrologyData({
        date,
        time,
        location: location as LocationInput,
        ayanamsa,
      });

      const transitData = calculateTransitAnalysis(
        natalData.planetary_positions,
        natalData.lagnaLongitude,
        natalData.input.ayanamsaDegrees,
      );

      return new Response(
        JSON.stringify({
          input: natalData.input,
          zodiac_placements: natalData.zodiac_placements,
          transit_analysis: transitData,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      )
    }

    const now = new Date();
    const julianDay = now.getTime() / 86400000 + 2440587.5;
    const transitData = calculateTransitAnalysis([], 0, calculateAyanamsaDegrees(julianDay, ayanamsa), now);

    return new Response(
      JSON.stringify(transitData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch planetary transits" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    )
  }
})

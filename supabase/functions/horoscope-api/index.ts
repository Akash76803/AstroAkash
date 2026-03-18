import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let sign: string | null = null;
    let period: string = 'daily';

    if (req.method === 'POST') {
      let body;
      try {
        body = await req.json();
      } catch (e) {
        throw new Error("Invalid JSON body in request");
      }
      sign = body.sign;
      period = body.period || 'daily';
    } else {
      const url = new URL(req.url);
      sign = url.searchParams.get('sign');
      period = url.searchParams.get('period') || 'daily';
    }

    if (!sign) {
      return new Response(
        JSON.stringify({ error: "Zodiac sign is required (e.g., 'aries')" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase environment variables are not set in the Edge Function.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch horoscope from Database
    const { data: horoscope, error } = await supabase
      .from('horoscopes')
      .select(period)
      .eq('zodiac_sign', sign.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("Database query error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!horoscope) {
      return new Response(
        JSON.stringify({ 
          error: `Horoscope not found for sign: ${sign}`,
          hint: "Please ensure your database is seeded with initial_seed.sql." 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 },
      )
    }

    const result = {
      sign: sign,
      period: period,
      horoscope: horoscope[period]
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    )
  } catch (error: any) {
    console.error("Critical Error:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hint: "Check if your database tables are created and seeded with 001_initial_schema.sql and initial_seed.sql." 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    )
  }
})

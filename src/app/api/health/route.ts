import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env/public";

export async function GET() {
  const hasSupabase = isSupabaseConfigured();

  return NextResponse.json({
    status: "ok",
    supabaseConfigured: hasSupabase,
    timestamp: new Date().toISOString(),
  });
}

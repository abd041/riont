export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return url.startsWith("https://") && key.length > 20 && !url.includes("your-project");
}

export function isAppleAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_APPLE_AUTH === "true";
}

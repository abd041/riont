/**
 * Staging / PR preview must always show geist-dark so reviewers
 * see the Modern Dark Tech direction first (Bronze remains for rollback).
 *
 * FORCE_GEIST_DARK=true — local override for the same review experience
 */
export function shouldForceGeistDarkPreset(): boolean {
  if (process.env.FORCE_GEIST_DARK === "true") return true;
  return process.env.VERCEL_ENV === "preview";
}

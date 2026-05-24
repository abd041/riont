export type AuthErrorCode =
  | "VALIDATION"
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_CONFIRMED"
  | "USER_ALREADY_REGISTERED"
  | "WEAK_PASSWORD"
  | "RATE_LIMIT"
  | "OAUTH_FAILED"
  | "UNKNOWN";

export function mapSupabaseAuthError(error: {
  message?: string;
  status?: number;
  code?: string;
}): AuthErrorCode {
  const message = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();

  if (error.status === 429 || code === "over_request_rate_limit") {
    return "RATE_LIMIT";
  }
  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid email or password")
  ) {
    return "INVALID_CREDENTIALS";
  }
  if (message.includes("email not confirmed")) {
    return "EMAIL_NOT_CONFIRMED";
  }
  if (
    message.includes("already registered") ||
    message.includes("user already registered")
  ) {
    return "USER_ALREADY_REGISTERED";
  }
  if (message.includes("password") && message.includes("weak")) {
    return "WEAK_PASSWORD";
  }

  return "UNKNOWN";
}

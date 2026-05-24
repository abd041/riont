export class AuthError extends Error {
  constructor(
    public readonly code: "UNAUTHENTICATED" | "FORBIDDEN",
    message?: string,
  ) {
    super(message ?? code);
    this.name = "AuthError";
  }
}

export class ServiceError extends Error {
  constructor(
    public readonly code:
      | "NOT_FOUND"
      | "FORBIDDEN"
      | "VALIDATION"
      | "CONFLICT"
      | "INTERNAL",
    message?: string,
  ) {
    super(message ?? code);
    this.name = "ServiceError";
  }
}

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; code: ServiceError["code"]; message: string };

import type { AuthErrorCode } from "@/lib/auth/map-auth-error";

export type AuthActionResult =
  | { success: true }
  | { success: false; code: AuthErrorCode };

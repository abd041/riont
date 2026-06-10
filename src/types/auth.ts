import type { UserRole } from "@/lib/domain/enums";

export type StorefrontUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
};

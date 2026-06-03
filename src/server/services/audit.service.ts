import { createAdminClient } from "@/lib/supabase/admin";

export type AuditLogEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorLabel: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

type WriteAuditParams = {
  actorUserId: string;
  actorRole?: "admin" | "customer";
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
};

export async function writeAuditLog(params: WriteAuditParams): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("audit_logs").insert({
      actor_user_id: params.actorUserId,
      actor_role: params.actorRole ?? "admin",
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      metadata: params.metadata ?? null,
    });
  } catch {
    /* non-blocking */
  }
}

export async function listAuditLogs(limit = 80): Promise<AuditLogEntry[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("audit_logs")
    .select(
      `
      id,
      action,
      entity_type,
      entity_id,
      metadata,
      created_at,
      actor_user_id,
      profiles (display_name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const actorIds = [
    ...new Set(
      (data ?? [])
        .map((row) => (row as { actor_user_id: string | null }).actor_user_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const emailById = new Map<string, string>();
  if (actorIds.length > 0) {
    const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 });
    for (const user of authData.users ?? []) {
      if (user.email) emailById.set(user.id, user.email);
    }
  }

  return (data ?? []).map((raw) => {
    const row = raw as {
      id: string;
      action: string;
      entity_type: string;
      entity_id: string;
      metadata: Record<string, unknown> | null;
      created_at: string;
      actor_user_id: string | null;
      profiles:
        | { display_name: string | null }
        | { display_name: string | null }[]
        | null;
    };
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const actorLabel =
      profile?.display_name ??
      (row.actor_user_id ? emailById.get(row.actor_user_id) : null) ??
      "System";

    return {
      id: row.id,
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      actorLabel,
      metadata: row.metadata,
      createdAt: row.created_at,
    };
  });
}

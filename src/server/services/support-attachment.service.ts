import { createAdminClient } from "@/lib/supabase/admin";
import { ServiceError } from "@/lib/domain/errors";

const BUCKET = "support-attachments";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export async function uploadSupportAttachment(
  ticketId: string,
  messageId: string,
  file: File,
): Promise<{ storagePath: string; fileName: string; mimeType: string }> {
  if (file.size > MAX_BYTES) {
    throw new ServiceError("VALIDATION", "Attachment must be 5MB or smaller");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new ServiceError(
      "VALIDATION",
      "Only JPG, PNG, WebP, or PDF files are allowed",
    );
  }

  const admin = createAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const storagePath = `${ticketId}/${messageId}/${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new ServiceError("INTERNAL", "Failed to upload attachment");
  }

  return {
    storagePath,
    fileName: file.name,
    mimeType: file.type,
  };
}

export async function linkAttachmentToMessage(
  messageId: string,
  upload: { storagePath: string; fileName: string; mimeType: string },
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from("support_message_attachments").insert({
    message_id: messageId,
    storage_path: upload.storagePath,
    file_name: upload.fileName,
    mime_type: upload.mimeType,
  });

  if (error) {
    throw new ServiceError("INTERNAL", "Failed to save attachment");
  }
}

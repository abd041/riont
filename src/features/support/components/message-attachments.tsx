import type { SupportMessageAttachment } from "@/types/support";

export function MessageAttachments({
  attachments,
}: {
  attachments: SupportMessageAttachment[];
}) {
  if (attachments.length === 0) return null;

  return (
    <ul className="mt-3 space-y-2">
      {attachments.map((file) => {
        const isImage = file.mimeType?.startsWith("image/");
        return (
          <li key={file.id}>
            {isImage ? (
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={file.fileName}
                  className="max-h-48 rounded-md border border-[var(--border-subtle)]"
                />
              </a>
            ) : (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-400 hover:underline"
              >
                {file.fileName}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

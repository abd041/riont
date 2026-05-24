-- Support ticket message attachments

CREATE TABLE support_message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES support_messages(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_attachments_message ON support_message_attachments (message_id);

ALTER TABLE support_message_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY support_attachments_select_via_ticket ON support_message_attachments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM support_messages sm
      JOIN support_tickets st ON st.id = sm.ticket_id
      WHERE sm.id = message_id
        AND (st.user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
        ))
    )
  );

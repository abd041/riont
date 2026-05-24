-- Support tickets RLS (Week 5)

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY support_tickets_select_own ON support_tickets
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY support_tickets_insert_own ON support_tickets
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY support_messages_select_own ON support_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets t
      WHERE t.id = ticket_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY support_messages_insert_own ON support_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets t
      WHERE t.id = ticket_id AND t.user_id = auth.uid()
    )
    AND sender_type = 'customer'
    AND sender_user_id = auth.uid()
  );

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_updated
  ON support_tickets (user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status_updated
  ON support_tickets (status, updated_at DESC);

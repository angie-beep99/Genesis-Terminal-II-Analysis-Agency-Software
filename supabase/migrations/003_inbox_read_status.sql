-- Add is_read column to inbox_threads for tracking read status
ALTER TABLE inbox_threads ADD COLUMN is_read boolean NOT NULL DEFAULT false;

-- Allow authenticated users to insert inbox_messages for their company
CREATE POLICY "Users can insert inbox_messages for their company"
  ON inbox_messages FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- Allow authenticated users to update inbox_threads for their company (for marking as read)
CREATE POLICY "Users can update their company inbox_threads"
  ON inbox_threads FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

-- Mark first two threads as read, rest unread
UPDATE inbox_threads SET is_read = true
WHERE id IN (
  'eeee0001-0000-0000-0000-000000000001',
  'eeee0002-0000-0000-0000-000000000002'
);

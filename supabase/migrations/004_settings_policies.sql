-- Allow users to update their own company (for settings page)
CREATE POLICY "Users can update their own company"
  ON companies FOR UPDATE
  USING (
    id IN (
      SELECT company_id FROM users WHERE users.id = auth.uid()
    )
  );

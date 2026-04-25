-- Restrictive policies: deny everything for anon & authenticated; service_role bypasses RLS by default.
CREATE POLICY "deny all access to bot state"
  ON public.telegram_bot_state
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny all access to processed callbacks"
  ON public.telegram_processed_callbacks
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- Enable cron + http
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Unschedule prior version if exists (idempotent)
DO $$
BEGIN
  PERFORM cron.unschedule('poll-telegram-updates');
EXCEPTION WHEN OTHERS THEN
  -- ignore
  NULL;
END$$;

SELECT cron.schedule(
  'poll-telegram-updates',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://atjmbprryznwhwsinrtj.supabase.co/functions/v1/telegram-poll',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0am1icHJyeXpud2h3c2lucnRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTM2NzcsImV4cCI6MjA4NzIyOTY3N30.RaIFaeL08v1y8YUMx0GUGQ2xSsMEYju9UOKkTlNZr6U"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
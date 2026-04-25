-- Telegram polling state (singleton)
CREATE TABLE IF NOT EXISTS public.telegram_bot_state (
  id INT PRIMARY KEY CHECK (id = 1),
  update_offset BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.telegram_bot_state (id, update_offset)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.telegram_bot_state ENABLE ROW LEVEL SECURITY;

-- No public policies — only service_role (used by edge functions) can access.

-- Track processed callback queries to avoid double-handling
CREATE TABLE IF NOT EXISTS public.telegram_processed_callbacks (
  callback_id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  action TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_processed_callbacks ENABLE ROW LEVEL SECURITY;
-- No public policies — service_role only.

-- Public view exposing only safe order status fields (no PII)
CREATE OR REPLACE VIEW public.public_order_status
WITH (security_invoker = true)
AS
SELECT
  order_number,
  payment_status,
  order_status,
  payment_method,
  total_amount,
  created_at
FROM public.orders;

GRANT SELECT ON public.public_order_status TO anon, authenticated;
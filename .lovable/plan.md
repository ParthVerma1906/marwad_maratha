## Plan: Stronger manual UPI confirmation (keep current flow, no payment gateway)

You confirmed: stay on the manual UPI → WhatsApp/admin flow (matches the project memory rule). No PhonePe, Razorpay, or card portal will be added. Goal: make admin confirmation faster, less error-prone, and give the customer real-time visibility — without integrating any fintech gateway.

### What changes

1. **Order Success page — customer payment confirmation**
   - Show a copyable UPI ID, amount, and order number prominently.
   - Add an "I have paid — submit UTR / transaction ID" form (12-digit UTR validation).
   - On submit, call a new `submit_payment_reference(order_number, utr)` RPC that writes to `orders.payment_reference` and sets `payment_status = 'awaiting_verification'`.
   - Show a status badge that live-updates via Supabase Realtime (pending → awaiting_verification → confirmed).

2. **Admin OrdersTab — one-click verify**
   - New filter chip: **"Awaiting Verification"** (orders where customer submitted UTR).
   - In the order detail drawer: show submitted UTR, "Mark Paid" and "Reject Payment" buttons.
   - "Mark Paid" → sets `payment_status = 'paid'`, `order_status = 'confirmed'`, records `verified_at` + `verified_by`.
   - "Reject Payment" → resets `payment_status = 'pending'`, adds an admin note, triggers a WhatsApp template link to ping the customer.

3. **Telegram bot — verify from phone**
   - Extend existing `notify-owner-order` payload to include inline buttons: **✅ Mark Paid**, **❌ Reject**, **📞 Call customer**.
   - Existing `telegram-poll` function handles the callback and updates the same fields as the admin UI. (Infra already there — `telegram_processed_callbacks` table exists.)

4. **Checkout — better mobile UPI handoff**
   - Mobile: keep the `upi://` deep link but also show a fallback "Open in PhonePe / GPay / Paytm" button list (just `upi://` — each app intercepts it).
   - Desktop: show UPI QR code (generated client-side with `qrcode` lib, no API) + UPI ID, since `upi://` doesn't work on desktop.
   - Remove the blank-tab `window.open(upi://)` issue by navigating to Order Success first, then on mobile triggering the deep link via `window.location.href` after a short delay.

5. **Database**
   - Add columns to `orders`: `payment_reference text`, `verified_at timestamptz`, `verified_by text`.
   - New RPC `submit_payment_reference(_order_number text, _utr text)` — `SECURITY DEFINER`, `anon` callable, validates 12-digit UTR, only updates rows where `payment_status IN ('pending','awaiting_verification')`.
   - Extend `payment_status` allowed values to include `awaiting_verification`.

### Files to touch

- New migration: columns + RPC + check constraint update
- `src/pages/Checkout.tsx` — mobile/desktop UPI handoff fix + navigate-first
- `src/pages/OrderSuccess.tsx` — UTR submit form, QR code, Realtime status badge
- `src/components/admin/OrdersTab.tsx` — "Awaiting Verification" filter + verify buttons
- `supabase/functions/notify-owner-order/index.ts` — add inline keyboard buttons
- `supabase/functions/telegram-poll/index.ts` — handle Verify/Reject callbacks
- New dep: `qrcode.react` for the desktop QR

### Out of scope

- No PhonePe / Razorpay / Stripe / Paddle integration.
- No automatic UPI reconciliation (would need a payment gateway or bank API access).
- No card payments.

### Why this approach

Matches your project rule: "Payment flow is manual UPI-to-WhatsApp ONLY." The UTR-submission + Realtime + Telegram one-tap verify combo gets ~90% of the speed benefit of a real gateway without onboarding paperwork, GST/merchant requirements, or per-transaction fees.

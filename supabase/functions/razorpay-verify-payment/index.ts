import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { createHmac } from 'node:crypto'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!
    const expected = createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expected !== razorpay_signature) {
      console.warn('[verify-payment] signature mismatch')
      return new Response(JSON.stringify({ error: 'Signature mismatch' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: orderNumber, error } = await admin.rpc('mark_razorpay_paid', {
      _provider_order_id: razorpay_order_id,
      _provider_payment_id: razorpay_payment_id,
      _provider_signature: razorpay_signature,
    })
    if (error) {
      console.error('[verify-payment] mark_paid error', error)
      return new Response(JSON.stringify({ error: 'DB update failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fire-and-forget owner notify
    admin.functions.invoke('notify-owner-order', { body: { order_number: orderNumber, paid: true } })
      .catch((e) => console.error('[verify-payment] notify failed', e))

    return new Response(JSON.stringify({ success: true, order_number: orderNumber }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[verify-payment] error', e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { order_number, amount } = await req.json()
    if (!order_number || typeof amount !== 'number') {
      return new Response(JSON.stringify({ error: 'order_number and amount required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const paise = Math.round(amount * 100)
    if (paise < 100) {
      return new Response(JSON.stringify({ error: 'Amount must be at least ₹1' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const keyId = Deno.env.get('RAZORPAY_KEY_ID')!
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!
    const auth = btoa(`${keyId}:${keySecret}`)

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: paise,
        currency: 'INR',
        receipt: order_number.slice(0, 40),
        notes: { order_number },
      }),
    })
    const rzpJson = await rzpRes.json()
    if (!rzpRes.ok) {
      console.error('[razorpay-create-order] rzp error', rzpJson)
      return new Response(JSON.stringify({ error: 'Razorpay error', details: rzpJson }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Attach provider_order_id to our order
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    await admin.rpc('attach_razorpay_order', {
      _order_number: order_number,
      _provider_order_id: rzpJson.id,
    })

    return new Response(JSON.stringify({
      order_id: rzpJson.id,
      amount: rzpJson.amount,
      currency: rzpJson.currency,
      key_id: keyId,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('[razorpay-create-order] error', e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

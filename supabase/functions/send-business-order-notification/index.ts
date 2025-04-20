
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Replace with Fast2SMS or any real SMS API. This is a DEMO function!
async function sendDemoSms(to: string, message: string) {
  // Replace this with actual SMS provider integration (Fast2SMS, Twilio, etc)
  // For demonstration, we log it.
  console.log(`[SMS] Sent to ${to}: ${message}`);
  // For real SMS, you can use fetch to call the SMS provider's API.
  return { status: "mocked", to, message };
}

interface OrderPayload {
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  amount: number;
  submittedAt: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: OrderPayload = await req.json();

    // Compose email message
    const emailHtml = `
      <h2>New Customer Order</h2>
      <p><strong>Name:</strong> ${body.customer.name}</p>
      <p><strong>Phone:</strong> ${body.customer.phone}</p>
      <p><strong>Email:</strong> ${body.customer.email || "—"}</p>
      <p><strong>Address:</strong> ${body.customer.address}</p>
      <p><strong>Order Placed At:</strong> ${body.submittedAt}</p>
      <h3>Order Items:</h3>
      <ul>
        ${body.items
          .map(
            (item) =>
              `<li>${item.name} x${item.quantity} = ₹${item.quantity * item.price}</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total Amount:</strong> ₹${body.amount}</p>
    `;

    // Send notification email with Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }
    const { Resend } = await import("npm:resend@2.0.0");
    const resend = new Resend(RESEND_API_KEY);

    const toEmail = "durgagurhudyoggondia@gmail.com";
    const sendRes = await resend.emails.send({
      from: "Order Notifications <onboarding@resend.dev>",
      to: [toEmail],
      subject: "New Order Received from Website",
      html: emailHtml,
    });

    // Send SMS notification (demo version)
    const smsMessage = `New order by ${body.customer.name} (Phone: ${body.customer.phone}, ₹${body.amount}) - Check your email for details.`;
    // Use your real business phone number here
    const BUSINESS_PHONE = "+918830257574";
    const smsRes = await sendDemoSms(BUSINESS_PHONE, smsMessage);

    console.log("Sent notification to business owner (email):", sendRes);
    console.log("Sent SMS notification to business owner:", smsRes);

    return new Response(
      JSON.stringify({ message: "Order notification sent!" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending business notification:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

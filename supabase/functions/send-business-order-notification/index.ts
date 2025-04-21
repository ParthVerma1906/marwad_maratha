
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Send SMS to customer (this is a mock function, replace with actual SMS provider)
async function sendCustomerThankYouSms(to: string, message: string) {
  // Replace this with actual SMS provider integration (Fast2SMS, Twilio, etc)
  console.log(`[SMS] Sent to customer ${to}: ${message}`);
  return { status: "mocked", to, message };
}

// Send SMS notification to business
async function sendDemoSms(to: string, message: string) {
  // Replace this with actual SMS provider integration (Fast2SMS, Twilio, etc)
  console.log(`[SMS] Sent to business ${to}: ${message}`);
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
  paymentMode: string;
  paymentDone: boolean;
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
      <p><strong>Payment Mode:</strong> ${body.paymentMode}</p>
      <p><strong>Payment Completed:</strong> ${body.paymentDone ? "Yes" : "No"}</p>
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

    // Send email to business owner
    const toEmail = "durgagurhudyoggondia@gmail.com";
    const sendRes = await resend.emails.send({
      from: "Order Notifications <onboarding@resend.dev>",
      to: [toEmail],
      subject: "New Order Received from Website",
      html: emailHtml,
    });
    console.log("Sent notification to business owner (email):", sendRes);

    // Send SMS notification to business owner
    const smsMessage = `New order by ${body.customer.name} (Phone: ${body.customer.phone}, ₹${body.amount}) - Check your email for details.`;
    const BUSINESS_PHONE = "+918830257574";
    const smsRes = await sendDemoSms(BUSINESS_PHONE, smsMessage);
    console.log("Sent SMS notification to business owner:", smsRes);

    // Send thank you email to customer if email provided
    if (body.customer.email) {
      try {
        const customerEmailHtml = `
          <h2>Thank you for your order, ${body.customer.name}!</h2>
          <p>We've received your order with the following details:</p>
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
          <p><strong>Payment Method:</strong> ${body.paymentMode}</p>
          <p>We'll process your order shortly and contact you for any additional information.</p>
          <p>If you have questions, feel free to contact us.</p>
          <p>Thank you for choosing Marwad Maratha! 😊</p>
        `;

        const customerEmailRes = await resend.emails.send({
          from: "Marwad Maratha <onboarding@resend.dev>",
          to: [body.customer.email],
          subject: "Thank you for your order!",
          html: customerEmailHtml,
        });
        console.log("Sent thank you email to customer:", customerEmailRes);
      } catch (emailErr) {
        console.error("Error sending customer email:", emailErr);
      }
    }

    // Send thank you SMS to customer
    if (body.customer.phone) {
      const itemList = body.items.map(i => `${i.name} x${i.quantity}`).join(", ");
      const paymentMethodMap: { [key: string]: string } = { 
        upi: "UPI / QR Payment", 
        card: "Card Payment", 
        cod: "Pay on Delivery"
      };
      const customerName = body.customer.name || "Customer";
      
      const thankYouMessage = 
        `Dear ${customerName}, thank you for your order at Marwad Maratha! 🙏\n\n` +
        `We've received your order for:\n🛒 ${itemList}\n\n` +
        `Payment Method: ${paymentMethodMap[body.paymentMode]}\n\n` +
        `We'll process your order shortly and contact you for any additional information. ` +
        `If you have questions, feel free to contact us at ${BUSINESS_PHONE}.\n\n` +
        `Thank you for choosing Marwad Maratha! 😊`;
      
      // Send thank you SMS to customer (implement with real SMS provider)
      await sendCustomerThankYouSms(body.customer.phone, thankYouMessage);
    }

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

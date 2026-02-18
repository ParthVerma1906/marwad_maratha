import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function validateOrder(body: unknown): { valid: boolean; error?: string; data?: OrderPayload } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const b = body as Record<string, unknown>;

  // Validate customer
  const customer = b.customer as Record<string, unknown> | undefined;
  if (!customer || typeof customer !== "object") {
    return { valid: false, error: "Missing customer data" };
  }

  const name = typeof customer.name === "string" ? customer.name.trim().slice(0, 100) : "";
  const phone = typeof customer.phone === "string" ? customer.phone.trim().slice(0, 20) : "";
  const email = typeof customer.email === "string" ? customer.email.trim().slice(0, 255) : "";
  const address = typeof customer.address === "string" ? customer.address.trim().slice(0, 500) : "";

  if (!name) return { valid: false, error: "Customer name is required" };
  if (!phone) return { valid: false, error: "Customer phone is required" };
  if (phone && !/^[\d\s\+\-\(\)]{7,20}$/.test(phone)) {
    return { valid: false, error: "Invalid phone number format" };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  if (!address) return { valid: false, error: "Customer address is required" };

  // Validate items
  const items = Array.isArray(b.items) ? b.items : [];
  if (items.length === 0 || items.length > 50) {
    return { valid: false, error: "Order must have between 1 and 50 items" };
  }

  const validatedItems = items.map((item: any) => ({
    id: typeof item.id === "string" ? item.id.slice(0, 50) : "",
    name: typeof item.name === "string" ? item.name.slice(0, 100) : "Unknown",
    price: typeof item.price === "number" && item.price >= 0 && item.price <= 100000 ? item.price : 0,
    quantity: typeof item.quantity === "number" && item.quantity >= 1 && item.quantity <= 100 ? Math.floor(item.quantity) : 1,
  }));

  const amount = typeof b.amount === "number" && b.amount >= 0 && b.amount <= 10000000 ? b.amount : 0;
  const paymentMode = typeof b.paymentMode === "string" && ["upi", "card", "cod"].includes(b.paymentMode) ? b.paymentMode : "cod";
  const paymentDone = typeof b.paymentDone === "boolean" ? b.paymentDone : false;

  return {
    valid: true,
    data: {
      customer: { name, phone, email, address },
      items: validatedItems,
      amount,
      submittedAt: new Date().toISOString(),
      paymentMode,
      paymentDone,
    },
  };
}

interface OrderPayload {
  customer: { name: string; phone: string; email: string; address: string };
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  amount: number;
  submittedAt: string;
  paymentMode: string;
  paymentDone: boolean;
}

// Send SMS to customer (mock - replace with actual SMS provider)
async function sendCustomerThankYouSms(to: string, message: string) {
  console.log(`[SMS] Sent to customer ${to}: ${message}`);
  return { status: "mocked", to, message };
}

// Send SMS notification to business (mock)
async function sendDemoSms(to: string, message: string) {
  console.log(`[SMS] Sent to business ${to}: ${message}`);
  return { status: "mocked", to, message };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    const validation = validateOrder(rawBody);

    if (!validation.valid || !validation.data) {
      return new Response(
        JSON.stringify({ error: validation.error || "Invalid order data" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = validation.data;

    // Compose email with escaped HTML
    const emailHtml = `
      <h2>New Customer Order</h2>
      <p><strong>Name:</strong> ${escapeHtml(body.customer.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(body.customer.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(body.customer.email || "—")}</p>
      <p><strong>Address:</strong> ${escapeHtml(body.customer.address)}</p>
      <p><strong>Order Placed At:</strong> ${escapeHtml(body.submittedAt)}</p>
      <p><strong>Payment Mode:</strong> ${escapeHtml(body.paymentMode)}</p>
      <p><strong>Payment Completed:</strong> ${body.paymentDone ? "Yes" : "No"}</p>
      <h3>Order Items:</h3>
      <ul>
        ${body.items
          .map(
            (item) =>
              `<li>${escapeHtml(item.name)} x${item.quantity} = ₹${item.quantity * item.price}</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total Amount:</strong> ₹${body.amount}</p>
    `;

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
    console.log("Sent notification to business owner (email):", sendRes);

    const BUSINESS_PHONE = "+918830257574";
    const smsMessage = `New order by ${body.customer.name} (Phone: ${body.customer.phone}, ₹${body.amount}) - Check your email for details.`;
    const smsRes = await sendDemoSms(BUSINESS_PHONE, smsMessage);
    console.log("Sent SMS notification to business owner:", smsRes);

    if (body.customer.email) {
      try {
        const customerEmailHtml = `
          <h2>Thank you for your order, ${escapeHtml(body.customer.name)}!</h2>
          <p>We've received your order with the following details:</p>
          <h3>Order Items:</h3>
          <ul>
            ${body.items
              .map(
                (item) =>
                  `<li>${escapeHtml(item.name)} x${item.quantity} = ₹${item.quantity * item.price}</li>`
              )
              .join("")}
          </ul>
          <p><strong>Total Amount:</strong> ₹${body.amount}</p>
          <p><strong>Payment Method:</strong> ${escapeHtml(body.paymentMode)}</p>
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

    if (body.customer.phone) {
      const itemList = body.items.map(i => `${i.name} x${i.quantity}`).join(", ");
      const paymentMethodMap: { [key: string]: string } = {
        upi: "UPI / QR Payment",
        card: "Card Payment",
        cod: "Pay on Delivery"
      };
      const thankYouMessage =
        `Dear ${body.customer.name}, thank you for your order at Marwad Maratha! 🙏\n\n` +
        `We've received your order for:\n🛒 ${itemList}\n\n` +
        `Payment Method: ${paymentMethodMap[body.paymentMode]}\n\n` +
        `We'll process your order shortly and contact you for any additional information. ` +
        `If you have questions, feel free to contact us at ${BUSINESS_PHONE}.\n\n` +
        `Thank you for choosing Marwad Maratha! 😊`;

      await sendCustomerThankYouSms(body.customer.phone, thankYouMessage);
    }

    return new Response(
      JSON.stringify({ message: "Order notification sent!" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending business notification:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to process order" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactRequest = await req.json();

    console.log("Received contact form submission:", { name, email, subject });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error("Missing required fields");
      throw new Error("Missing required fields: name, email, subject, and message are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      throw new Error("Invalid email format");
    }

    // Send notification email to admin/support using Resend API directly
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "IncomeFlow Contact <onboarding@resend.dev>",
        to: ["delivered@resend.dev"], // Replace with your actual support email
        reply_to: email,
        subject: `[Contact Form] ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Contact Form Submission</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 20px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
              </div>
              <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
                <div style="margin-bottom: 16px;">
                  <strong style="color: #6b7280;">From:</strong>
                  <p style="margin: 4px 0 0 0;">${name} &lt;${email}&gt;</p>
                </div>
                <div style="margin-bottom: 16px;">
                  <strong style="color: #6b7280;">Subject:</strong>
                  <p style="margin: 4px 0 0 0;">${subject}</p>
                </div>
                <div style="margin-bottom: 16px;">
                  <strong style="color: #6b7280;">Message:</strong>
                  <div style="margin-top: 8px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                  This message was sent via the IncomeFlow contact form.
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!adminEmailRes.ok) {
      const errorData = await adminEmailRes.json();
      console.error("Failed to send admin email:", errorData);
      throw new Error("Failed to send email");
    }

    console.log("Contact email sent successfully");

    // Send confirmation email to the user
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "IncomeFlow <onboarding@resend.dev>",
        to: [email],
        subject: "We received your message!",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Message Received</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 20px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Thanks for reaching out!</h1>
              </div>
              <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
                <p>Hi ${name},</p>
                <p>We've received your message and will get back to you as soon as possible, typically within 24 hours.</p>
                <p>Here's a copy of your message:</p>
                <div style="margin: 16px 0; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <strong>Subject:</strong> ${subject}<br><br>
                  ${message.replace(/\n/g, '<br>')}
                </div>
                <p>Best regards,<br>The IncomeFlow Team</p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    console.log("Confirmation email sent to user:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

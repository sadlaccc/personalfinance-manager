import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface InviteAcceptedRequest {
  teamOwnerId: string;
  memberEmail: string;
  memberName?: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { teamOwnerId, memberEmail, memberName, role }: InviteAcceptedRequest = await req.json();

    console.log("Sending invite accepted notification to team owner:", teamOwnerId);

    // Get team owner's email from profiles
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: ownerProfile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", teamOwnerId)
      .single();

    if (profileError || !ownerProfile?.email) {
      console.error("Failed to fetch owner profile:", profileError);
      throw new Error("Could not find team owner email");
    }

    const displayName = memberName || memberEmail;
    const ownerName = ownerProfile.full_name || "Team Owner";

    const emailResponse = await resend.emails.send({
      from: "FedhaFlow <noreply@fedhaflow.com>",
      to: [ownerProfile.email],
      subject: `${displayName} has joined your team!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .badge { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: capitalize; }
            .member-card { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Team Member!</h1>
            </div>
            <div class="content">
              <p>Hi ${ownerName},</p>
              <p>Great news! A team member has accepted your invitation to join FedhaFlow.</p>
              
              <div class="member-card">
                <p style="margin: 0; font-weight: 600; font-size: 18px;">${displayName}</p>
                <p style="margin: 5px 0; color: #6b7280;">${memberEmail}</p>
                <span class="badge">${role}</span>
              </div>
              
              <p>They now have access to your team workspace based on their assigned role permissions.</p>
              
              <p style="margin-top: 20px;">
                <a href="https://fedhaflow.lovable.app/business-admin" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  View Team Dashboard
                </a>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FedhaFlow. Smart Budgeting for Everyone.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Invite accepted email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending invite accepted email:", error);
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

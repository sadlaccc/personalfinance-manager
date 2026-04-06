const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';

interface WelcomeRequest {
  email: string;
  fullName: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName }: WelcomeRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Missing email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      console.error('Missing API keys for email');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const name = fullName || 'there';
    const appUrl = 'https://personalfinance-manager.lovable.app';

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'FedhaFlow <onboarding@resend.dev>',
        to: [email],
        subject: `Welcome to FedhaFlow, ${name}! 🎉`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0 0 8px; font-size: 28px;">Welcome to FedhaFlow!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">Smart Budgeting & Savings</p>
              </div>
              <div style="padding: 32px;">
                <p style="color: #374151; font-size: 18px; margin-bottom: 16px; font-weight: 600;">
                  Hi ${name}! 👋
                </p>
                <p style="color: #6b7280; font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
                  Thanks for joining FedhaFlow! You now have access to powerful tools to take control of your finances.
                </p>
                
                <div style="background: #f0fdf4; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                  <p style="color: #166534; font-weight: 600; margin: 0 0 12px; font-size: 15px;">Here's what you can do:</p>
                  <ul style="color: #166534; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
                    <li>Track income from multiple sources</li>
                    <li>Categorize and monitor your expenses</li>
                    <li>Set budgets and savings goals</li>
                    <li>View analytics and trends</li>
                  </ul>
                </div>

                <p style="color: #6b7280; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
                  You're starting with a <strong style="color: #3b82f6;">14-day free trial</strong> of our Pro plan. Explore all features and find what works best for you.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${appUrl}/auth" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Get Started Now
                  </a>
                </div>
              </div>
              <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} FedhaFlow. Smart Budgeting for Everyone.
                </p>
                <p style="color: #9ca3af; font-size: 11px; margin: 8px 0 0;">
                  You received this because you created an account on FedhaFlow.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const result = await response.json();
    console.log('Welcome email result:', JSON.stringify(result));

    if (!response.ok) {
      console.error('Welcome email failed:', result);
      return new Response(
        JSON.stringify({ error: 'Failed to send welcome email', details: result }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

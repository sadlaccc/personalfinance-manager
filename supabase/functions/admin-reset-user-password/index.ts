import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const callerSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user: caller }, error: callerError } = await callerSupabase.auth.getUser();
    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: isAdmin } = await callerSupabase.rpc('has_role', {
      _user_id: caller.id, _role: 'admin',
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const redirectTo = typeof body.redirectTo === 'string' ? body.redirectTo : undefined;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 254) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate redirect URL: must be https (or http+localhost), end with /reset-password,
    // and host must be in the allowlist for known environments.
    const ALLOWED_HOSTS = [
      'localhost',
      '127.0.0.1',
      'personalfinance-manager.lovable.app',
    ];
    const ALLOWED_HOST_SUFFIXES = ['.lovable.app', '.lovableproject.com'];

    if (!redirectTo) {
      return new Response(JSON.stringify({ error: 'Missing redirect URL' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    let parsedRedirect: URL;
    try {
      parsedRedirect = new URL(redirectTo);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid redirect URL' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const isLocal = parsedRedirect.hostname === 'localhost' || parsedRedirect.hostname === '127.0.0.1';
    const protoOk = parsedRedirect.protocol === 'https:' || (isLocal && parsedRedirect.protocol === 'http:');
    const hostOk =
      ALLOWED_HOSTS.includes(parsedRedirect.hostname) ||
      ALLOWED_HOST_SUFFIXES.some((s) => parsedRedirect.hostname.endsWith(s));
    const pathOk = parsedRedirect.pathname.endsWith('/reset-password');
    if (!protoOk || !hostOk || !pathOk) {
      return new Response(JSON.stringify({
        error: `Invalid redirect URL for current environment: ${redirectTo}`,
      }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error: resetError } = await adminSupabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (resetError) {
      console.error('Reset password failed:', resetError);
      return new Response(JSON.stringify({ error: 'Failed to send reset email' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resetAt = new Date().toISOString();
    const { data: targetProfile } = await adminSupabase
      .from('profiles')
      .update({ last_password_reset_at: resetAt })
      .eq('email', email)
      .select('user_id')
      .maybeSingle();

    await adminSupabase.from('admin_audit_log').insert({
      admin_user_id: caller.id,
      target_user_id: targetProfile?.user_id ?? null,
      target_email: email,
      action: 'password_reset',
      details: { redirect_to: redirectTo },
    });

    console.log(`Password reset email sent to ${email} by admin ${caller.id}`);

    return new Response(JSON.stringify({ success: true, last_password_reset_at: resetAt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Unexpected error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

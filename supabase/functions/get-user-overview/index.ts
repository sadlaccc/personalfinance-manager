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
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const callerSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user: caller }, error: callerError } = await callerSupabase.auth.getUser();
    if (callerError || !caller) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { data: isAdmin } = await callerSupabase
      .rpc('has_role', { _user_id: caller.id, _role: 'admin' });
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { userId } = await req.json();
    if (!userId || typeof userId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // Profile
    const { data: profile } = await admin
      .from('profiles')
      .select('user_id, full_name, email, phone, avatar_url, currency, created_at, last_sign_in_at')
      .eq('user_id', userId)
      .maybeSingle();

    // Subscription
    const { data: subscription } = await admin
      .from('subscriptions')
      .select('plan_type, billing_cycle, status, current_period_start, current_period_end, trial_ends_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Roles
    const { data: roles } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    // Aggregated counts (no line items returned)
    const [incomeAgg, expenseAgg, goalsAgg, budgetsAgg, paymentsAgg, teamAgg] = await Promise.all([
      admin.from('income_sources').select('amount', { count: 'exact' }).eq('user_id', userId),
      admin.from('expenses').select('amount', { count: 'exact' }).eq('user_id', userId),
      admin.from('budget_goals').select('target_amount, current_amount', { count: 'exact' }).eq('user_id', userId),
      admin.from('category_budgets').select('budget_amount', { count: 'exact' }).eq('user_id', userId),
      admin.from('payments').select('amount, status', { count: 'exact' }).eq('user_id', userId),
      admin.from('team_members').select('id', { count: 'exact', head: true }).eq('team_owner_id', userId),
    ]);

    const sum = (rows: any[] | null, key: string) =>
      (rows ?? []).reduce((s, r) => s + Number(r[key] ?? 0), 0);

    const overview = {
      profile,
      subscription,
      roles: (roles ?? []).map((r: any) => r.role),
      stats: {
        income: {
          count: incomeAgg.count ?? 0,
          total: sum(incomeAgg.data as any[], 'amount'),
        },
        expenses: {
          count: expenseAgg.count ?? 0,
          total: sum(expenseAgg.data as any[], 'amount'),
        },
        goals: {
          count: goalsAgg.count ?? 0,
          totalTarget: sum(goalsAgg.data as any[], 'target_amount'),
          totalCurrent: sum(goalsAgg.data as any[], 'current_amount'),
        },
        budgets: {
          count: budgetsAgg.count ?? 0,
          total: sum(budgetsAgg.data as any[], 'budget_amount'),
        },
        payments: {
          count: paymentsAgg.count ?? 0,
          totalPaid: ((paymentsAgg.data as any[]) ?? [])
            .filter((p) => p.status === 'success' || p.status === 'completed')
            .reduce((s, p) => s + Number(p.amount ?? 0), 0),
        },
        team: {
          count: teamAgg.count ?? 0,
        },
      },
    };

    return new Response(
      JSON.stringify(overview),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('get-user-overview error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to load user overview' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

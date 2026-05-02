import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface STKPushRequest {
  phone: string;
  amount: number;
  planType: 'starter' | 'pro' | 'business';
  billingCycle: 'monthly' | 'annual';
}

async function getMpesaAccessToken(): Promise<string> {
  const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')!;
  const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')!;
  
  const auth = btoa(`${consumerKey}:${consumerSecret}`);
  
  const response = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('M-Pesa auth error:', errorText);
    throw new Error('Failed to get M-Pesa access token');
  }
  
  const data = await response.json();
  return data.access_token;
}

function generatePassword(): { password: string; timestamp: string } {
  const shortcode = Deno.env.get('MPESA_SHORTCODE')!;
  const passkey = Deno.env.get('MPESA_PASSKEY')!;
  
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = btoa(`${shortcode}${passkey}${timestamp}`);
  
  return { password, timestamp };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub as string;
    const body: STKPushRequest = await req.json();
    const { phone, amount, planType, billingCycle } = body;

    console.log(`Processing M-Pesa payment for user ${userId}, plan: ${planType}, amount: ${amount}`);

    // Format and validate phone number
    if (typeof phone !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    let formattedPhone = phone.replace(/[\s\-()]/g, '');
    if (formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.slice(1);
    }
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    }
    // Must be Kenyan mobile: 254 followed by 7 or 1, then 8 digits
    if (!/^254[17]\d{8}$/.test(formattedPhone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format. Use a valid Kenyan mobile number.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // Validate amount
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || amount > 1000000) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const accessToken = await getMpesaAccessToken();
    const { password, timestamp } = generatePassword();
    const shortcode = Deno.env.get('MPESA_SHORTCODE')!;
    const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`;

    const stkPushPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: `IncomeFlow-${planType}`,
      TransactionDesc: `${planType} plan subscription`,
    };

    console.log('Sending STK Push request...');
    
    const stkResponse = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkPushPayload),
      }
    );

    const stkResult = await stkResponse.json();
    console.log('STK Push response:', JSON.stringify(stkResult));

    if (stkResult.ResponseCode !== '0') {
      console.error('STK Push failed:', stkResult.errorMessage || stkResult.ResponseDescription);
      return new Response(
        JSON.stringify({ error: 'Payment initiation failed. Please try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create pending payment record
    const { error: paymentError } = await supabase.from('payments').insert({
      user_id: userId,
      amount: amount,
      currency: 'KES',
      status: 'pending',
      payment_method: 'mpesa',
      mpesa_checkout_request_id: stkResult.CheckoutRequestID,
      phone_number: formattedPhone,
      description: `${planType} plan - ${billingCycle}`,
    });

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkoutRequestId: stkResult.CheckoutRequestID,
        merchantRequestId: stkResult.MerchantRequestID,
        message: 'Please check your phone for the M-Pesa prompt',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('STK Push error:', error);
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

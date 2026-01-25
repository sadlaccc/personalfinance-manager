import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body: MpesaCallbackBody = await req.json();
    const callback = body.Body.stkCallback;
    
    console.log('M-Pesa callback received:', JSON.stringify(callback));

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;
    const resultDesc = callback.ResultDesc;

    // Find the payment record
    const { data: payment, error: paymentFetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('mpesa_checkout_request_id', checkoutRequestId)
      .single();

    if (paymentFetchError || !payment) {
      console.error('Payment not found:', checkoutRequestId);
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (resultCode === 0) {
      // Payment successful
      let mpesaReceiptNumber = '';
      
      if (callback.CallbackMetadata?.Item) {
        const receiptItem = callback.CallbackMetadata.Item.find(
          item => item.Name === 'MpesaReceiptNumber'
        );
        if (receiptItem) {
          mpesaReceiptNumber = String(receiptItem.Value);
        }
      }

      // Update payment status
      await supabase
        .from('payments')
        .update({
          status: 'completed',
          mpesa_receipt_number: mpesaReceiptNumber,
        })
        .eq('id', payment.id);

      // Parse plan details from description
      const descParts = payment.description?.split(' - ') || [];
      const planType = descParts[0]?.replace(' plan', '').toLowerCase() || 'pro';
      const billingCycle = descParts[1] || 'monthly';

      // Calculate subscription end date
      const now = new Date();
      const periodEnd = new Date(now);
      if (billingCycle === 'annual') {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      // Upsert subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: payment.user_id,
          plan_type: planType,
          billing_cycle: billingCycle,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          mpesa_phone: payment.phone_number,
        }, {
          onConflict: 'user_id',
        });

      if (subError) {
        console.error('Error updating subscription:', subError);
      } else {
        console.log(`Subscription activated for user ${payment.user_id}, plan: ${planType}`);
      }
    } else {
      // Payment failed
      console.log(`Payment failed: ${resultDesc}`);
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);
    }

    return new Response(
      JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Callback processing error:', error);
    return new Response(
      JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

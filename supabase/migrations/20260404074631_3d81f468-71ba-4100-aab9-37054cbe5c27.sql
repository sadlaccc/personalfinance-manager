
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.subscriptions (user_id, plan_type, billing_cycle, status, current_period_start, current_period_end, trial_ends_at)
  VALUES (NEW.id, 'pro', 'monthly', 'trial', now(), now() + interval '14 days', now() + interval '14 days');
  
  RETURN NEW;
END;
$function$;

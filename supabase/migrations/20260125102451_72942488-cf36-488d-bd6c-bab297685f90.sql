-- Add last_sign_in_at column to profiles
ALTER TABLE public.profiles 
ADD COLUMN last_sign_in_at TIMESTAMP WITH TIME ZONE;

-- Add email column to profiles (for admin to see)
ALTER TABLE public.profiles 
ADD COLUMN email TEXT;

-- Create function to update last sign in time
CREATE OR REPLACE FUNCTION public.update_last_sign_in()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET last_sign_in_at = now()
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users for last sign in (note: this fires on session refresh)
CREATE TRIGGER on_auth_user_sign_in
AFTER UPDATE OF last_sign_in_at ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.update_last_sign_in();

-- Sync existing user emails to profiles
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.user_id = u.id;

-- Create function to sync email on profile creation
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET email = NEW.email
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$;

-- Trigger to sync email when user updates their email
CREATE TRIGGER on_auth_user_email_update
AFTER UPDATE OF email ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_email();
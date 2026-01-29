-- Add phone and currency columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'KES';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_currency ON public.profiles(currency);
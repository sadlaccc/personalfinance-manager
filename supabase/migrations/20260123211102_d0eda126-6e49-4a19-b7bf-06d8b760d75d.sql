-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create income_sources table
CREATE TABLE public.income_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('salary', 'freelance', 'investment', 'rental', 'business', 'other')),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly', 'yearly', 'one-time')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on income_sources
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;

-- Income sources policies
CREATE POLICY "Users can view their own income sources" 
ON public.income_sources FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income sources" 
ON public.income_sources FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income sources" 
ON public.income_sources FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own income sources" 
ON public.income_sources FOR DELETE 
USING (auth.uid() = user_id);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('housing', 'utilities', 'food', 'transportation', 'healthcare', 'entertainment', 'shopping', 'debt', 'savings', 'other')),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly', 'yearly', 'one-time')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Expenses policies
CREATE POLICY "Users can view their own expenses" 
ON public.expenses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" 
ON public.expenses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" 
ON public.expenses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" 
ON public.expenses FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_income_sources_updated_at
BEFORE UPDATE ON public.income_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
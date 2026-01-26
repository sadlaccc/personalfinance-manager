-- Create category budgets table for monthly spending limits
CREATE TABLE public.category_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  budget_amount NUMERIC NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, category, month, year)
);

-- Enable RLS
ALTER TABLE public.category_budgets ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own category budgets" 
ON public.category_budgets FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own category budgets" 
ON public.category_budgets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own category budgets" 
ON public.category_budgets FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own category budgets" 
ON public.category_budgets FOR DELETE 
USING (auth.uid() = user_id);

-- Updated at trigger
CREATE TRIGGER update_category_budgets_updated_at
BEFORE UPDATE ON public.category_budgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for efficient queries
CREATE INDEX idx_category_budgets_user_month ON public.category_budgets(user_id, month, year);
-- Add date column to expenses table for tracking when expenses occurred
ALTER TABLE public.expenses 
ADD COLUMN date date NOT NULL DEFAULT CURRENT_DATE;

-- Create index for efficient monthly queries
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_user_date ON public.expenses(user_id, date);
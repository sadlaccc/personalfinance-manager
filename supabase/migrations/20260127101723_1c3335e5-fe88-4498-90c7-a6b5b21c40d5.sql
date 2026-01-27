-- Add date column to income_sources table
ALTER TABLE public.income_sources 
ADD COLUMN date date NOT NULL DEFAULT CURRENT_DATE;

-- Create index for efficient date-based queries
CREATE INDEX idx_income_sources_user_date ON public.income_sources (user_id, date);
-- Allow admins to view all expenses
CREATE POLICY "Admins can view all expenses" 
ON public.expenses 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all income sources
CREATE POLICY "Admins can view all income sources" 
ON public.income_sources 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));
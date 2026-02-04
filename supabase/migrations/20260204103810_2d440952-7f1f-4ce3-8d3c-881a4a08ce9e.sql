-- Allow admins to view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update all subscriptions
CREATE POLICY "Admins can update all subscriptions"
ON public.subscriptions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert subscriptions for any user
CREATE POLICY "Admins can insert subscriptions"
ON public.subscriptions
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
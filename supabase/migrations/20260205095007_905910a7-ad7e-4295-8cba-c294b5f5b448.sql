-- Create team_members table for business plan team management
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_owner_id UUID NOT NULL,
  member_email TEXT NOT NULL,
  member_user_id UUID,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'revoked'))
);

-- Create company_settings table for business customization
CREATE TABLE public.company_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  company_name TEXT,
  company_logo_url TEXT,
  industry TEXT,
  fiscal_year_start INTEGER DEFAULT 1,
  currency TEXT DEFAULT 'KES',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Team members policies: owners can manage their team
CREATE POLICY "Team owners can view their team members"
  ON public.team_members FOR SELECT
  USING (auth.uid() = team_owner_id OR auth.uid() = member_user_id);

CREATE POLICY "Team owners can invite members"
  ON public.team_members FOR INSERT
  WITH CHECK (auth.uid() = team_owner_id);

CREATE POLICY "Team owners can update their team"
  ON public.team_members FOR UPDATE
  USING (auth.uid() = team_owner_id);

CREATE POLICY "Team owners can remove members"
  ON public.team_members FOR DELETE
  USING (auth.uid() = team_owner_id);

-- Company settings policies
CREATE POLICY "Users can view their company settings"
  ON public.company_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their company settings"
  ON public.company_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their company settings"
  ON public.company_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create update trigger for team_members
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create update trigger for company_settings
CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
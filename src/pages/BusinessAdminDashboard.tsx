 import { useQuery } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/contexts/AuthContext';
 import { useSubscription, PLAN_LABELS } from '@/hooks/useSubscription';
 import { getPlanLimits } from '@/lib/planLimits';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { 
   Users, 
   TrendingUp, 
   Download, 
   Mail, 
   Building2,
   Crown,
   RefreshCw,
   BarChart3,
 } from 'lucide-react';
 import { format } from 'date-fns';
 import { toast } from 'sonner';
 import { Navigate } from 'react-router-dom';
 import { InviteTeamMemberDialog } from '@/components/InviteTeamMemberDialog';
 import { CompanySettingsDialog } from '@/components/CompanySettingsDialog';
 import { ManagePermissionsDialog } from '@/components/ManagePermissionsDialog';
 import { SendTeamDigestDialog } from '@/components/SendTeamDigestDialog';
 import { TeamAnalyticsView } from '@/components/TeamAnalyticsView';
 
 export default function BusinessAdminDashboard() {
   const { user } = useAuth();
   const { subscription, isLoading: subLoading } = useSubscription();
 
   // Check if user has business plan
   const isBusinessPlan = subscription?.plan_type === 'business' || subscription?.plan_type === 'enterprise' || subscription?.plan_type === 'team';
 
   // Fetch team members (simulated - in a real app this would be a team_members table)
   const { data: teamStats, isLoading: statsLoading, refetch } = useQuery({
     queryKey: ['business-team-stats', user?.id],
     queryFn: async () => {
       if (!user) return null;
       
       // Get user's own financial data for display
       const [incomeRes, expenseRes, goalsRes] = await Promise.all([
         supabase.from('income_sources').select('*').eq('user_id', user.id),
         supabase.from('expenses').select('*').eq('user_id', user.id),
         supabase.from('budget_goals').select('*').eq('user_id', user.id),
       ]);
 
       const totalIncome = incomeRes.data?.reduce((sum, inc) => sum + Number(inc.amount), 0) || 0;
       const totalExpenses = expenseRes.data?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
       const totalGoals = goalsRes.data?.length || 0;
       const goalsProgress = goalsRes.data?.reduce((sum, g) => sum + (Number(g.current_amount) / Number(g.target_amount) * 100), 0) / (totalGoals || 1);
 
       return {
         totalIncome,
         totalExpenses,
         netIncome: totalIncome - totalExpenses,
         totalGoals,
         goalsProgress: Math.round(goalsProgress),
         incomeCount: incomeRes.data?.length || 0,
         expenseCount: expenseRes.data?.length || 0,
       };
     },
     enabled: !!user && isBusinessPlan,
   });
 
   // Fetch team members count
   const { data: teamMembersCount = 0 } = useQuery({
     queryKey: ['team-members-count', user?.id],
     queryFn: async () => {
       if (!user) return 0;
       const { count, error } = await supabase
         .from('team_members')
         .select('*', { count: 'exact', head: true })
         .eq('team_owner_id', user.id)
         .neq('status', 'revoked');
 
       if (error) return 0;
       return count || 0;
     },
     enabled: !!user && isBusinessPlan,
   });
 
   // Redirect if not on business plan
   if (!subLoading && !isBusinessPlan) {
     return <Navigate to="/dashboard" replace />;
   }
 
    const planLimits = getPlanLimits(subscription?.plan_type || 'starter');
    const maxTeamSize = planLimits.maxUsers;
    const currentTeamSize = teamMembersCount + 1;
 
   const handleExportReport = () => {
     const reportData = [
       ['Business Financial Report', format(new Date(), 'MMMM yyyy')],
       [''],
       ['Metric', 'Value'],
       ['Total Income', `KSh ${teamStats?.totalIncome?.toLocaleString() || 0}`],
       ['Total Expenses', `KSh ${teamStats?.totalExpenses?.toLocaleString() || 0}`],
       ['Net Income', `KSh ${teamStats?.netIncome?.toLocaleString() || 0}`],
       ['Income Sources', teamStats?.incomeCount || 0],
       ['Expense Records', teamStats?.expenseCount || 0],
       ['Budget Goals', teamStats?.totalGoals || 0],
       ['Goals Progress', `${teamStats?.goalsProgress || 0}%`],
     ];
 
     const csvContent = reportData.map(row => row.join(',')).join('\n');
     const blob = new Blob([csvContent], { type: 'text/csv' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `FedhaFlow_Business_Report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
     a.click();
     toast.success('Report exported successfully!');
   };
 
   const isLoading = subLoading || statsLoading;
 
   return (
     <div className="space-y-6 p-4 md:p-6">
       {/* Header */}
       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <div>
           <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
               <Building2 className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-2xl md:text-3xl font-bold text-foreground">Business Dashboard</h1>
               <p className="text-sm text-muted-foreground">
                 Manage your {PLAN_LABELS[subscription?.plan_type || 'business']} account
               </p>
             </div>
           </div>
         </div>
         <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" onClick={() => refetch()}>
             <RefreshCw className="w-4 h-4 mr-2" />
             Refresh
           </Button>
           <Button variant="outline" size="sm" onClick={handleExportReport}>
             <Download className="w-4 h-4 mr-2" />
             Export Report
           </Button>
         </div>
       </div>
 
       {/* Plan Status Card */}
       <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
         <CardContent className="p-4 md:p-6">
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
             <div className="flex items-center gap-4">
               <div className="p-3 rounded-full bg-amber-500/20">
                 <Crown className="w-8 h-8 text-amber-500" />
               </div>
               <div>
                 <h3 className="text-lg font-semibold">{PLAN_LABELS[subscription?.plan_type || 'business']}</h3>
                 <p className="text-sm text-muted-foreground">
                   {subscription?.status === 'active' ? 'Active subscription' : 'Subscription inactive'}
                 </p>
               </div>
             </div>
             <div className="flex items-center gap-4">
               <div className="text-right">
                 <p className="text-sm text-muted-foreground">Team capacity</p>
                 <p className="text-lg font-semibold">{currentTeamSize} / {maxTeamSize === 999 ? '∞' : maxTeamSize}</p>
               </div>
               <Badge variant="outline" className="border-amber-500 text-amber-500">
                 {subscription?.status === 'active' ? 'Active' : subscription?.status || 'Unknown'}
               </Badge>
             </div>
           </div>
         </CardContent>
       </Card>
 
        {/* Tabs for Overview and Analytics */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="gap-2">
              <Users className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Team Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Income</p>
                      <p className="text-lg md:text-xl font-bold text-income mt-1">
                        KSh {isLoading ? '...' : teamStats?.totalIncome?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-income/10">
                      <TrendingUp className="w-4 h-4 text-income" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Expenses</p>
                      <p className="text-lg md:text-xl font-bold text-expense mt-1">
                        KSh {isLoading ? '...' : teamStats?.totalExpenses?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-expense/10">
                      <TrendingUp className="w-4 h-4 text-expense rotate-180" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Net Income</p>
                      <p className={`text-lg md:text-xl font-bold mt-1 ${(teamStats?.netIncome || 0) >= 0 ? 'text-income' : 'text-expense'}`}>
                        KSh {isLoading ? '...' : teamStats?.netIncome?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Goals Progress</p>
                      <p className="text-lg md:text-xl font-bold text-primary mt-1">
                        {isLoading ? '...' : `${teamStats?.goalsProgress || 0}%`}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Management Section */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="w-4 h-4" />
                    Team Members
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {currentTeamSize}/{maxTeamSize === 999 ? '∞' : maxTeamSize} seats used
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Current user as team owner */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {user?.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-[150px]">{user?.email}</p>
                        <p className="text-xs text-muted-foreground">Owner</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      Owner
                    </Badge>
                  </div>

                  <InviteTeamMemberDialog maxTeamSize={maxTeamSize} currentTeamSize={currentTeamSize}>
                    <Button className="w-full" variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </InviteTeamMemberDialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Mail className="w-4 h-4" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline" size="sm" onClick={handleExportReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                  <SendTeamDigestDialog teamStats={teamStats}>
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Digest
                    </Button>
                  </SendTeamDigestDialog>
                  <ManagePermissionsDialog>
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Permissions
                    </Button>
                  </ManagePermissionsDialog>
                  <CompanySettingsDialog>
                    <Button className="w-full justify-start" variant="outline" size="sm">
                      <Building2 className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </CompanySettingsDialog>
                </CardContent>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-3 grid-cols-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{teamStats?.incomeCount || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Income Sources</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{teamStats?.expenseCount || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Expenses</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{teamStats?.totalGoals || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Goals</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <TeamAnalyticsView />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
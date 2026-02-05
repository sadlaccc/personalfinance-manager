 import { useState } from 'react';
 import { useQuery } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/contexts/AuthContext';
 import { useSubscription, PLAN_LABELS } from '@/hooks/useSubscription';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { 
   Users, 
   TrendingUp, 
   Download, 
   Mail, 
   Building2,
   Crown,
   Search,
   RefreshCw,
 } from 'lucide-react';
 import { format } from 'date-fns';
 import { toast } from 'sonner';
 import { Navigate } from 'react-router-dom';
 
 export default function BusinessAdminDashboard() {
   const { user } = useAuth();
   const { subscription, isLoading: subLoading } = useSubscription();
   const [searchTerm, setSearchTerm] = useState('');
 
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
 
   // Redirect if not on business plan
   if (!subLoading && !isBusinessPlan) {
     return <Navigate to="/dashboard" replace />;
   }
 
   const maxTeamSize = subscription?.plan_type === 'business' ? 20 : subscription?.plan_type === 'enterprise' ? 999 : 5;
   const currentTeamSize = 1; // For now, just the owner
 
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
 
       {/* Stats Grid */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Income</p>
                 <p className="text-xl md:text-2xl font-bold text-income mt-1">
                   KSh {isLoading ? '...' : teamStats?.totalIncome?.toLocaleString() || 0}
                 </p>
               </div>
               <div className="p-2 rounded-lg bg-income/10">
                 <TrendingUp className="w-5 h-5 text-income" />
               </div>
             </div>
           </CardContent>
         </Card>
 
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Expenses</p>
                 <p className="text-xl md:text-2xl font-bold text-expense mt-1">
                   KSh {isLoading ? '...' : teamStats?.totalExpenses?.toLocaleString() || 0}
                 </p>
               </div>
               <div className="p-2 rounded-lg bg-expense/10">
                 <TrendingUp className="w-5 h-5 text-expense rotate-180" />
               </div>
             </div>
           </CardContent>
         </Card>
 
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-xs text-muted-foreground uppercase tracking-wider">Net Income</p>
                 <p className={`text-xl md:text-2xl font-bold mt-1 ${(teamStats?.netIncome || 0) >= 0 ? 'text-income' : 'text-expense'}`}>
                   KSh {isLoading ? '...' : teamStats?.netIncome?.toLocaleString() || 0}
                 </p>
               </div>
               <div className="p-2 rounded-lg bg-primary/10">
                 <TrendingUp className="w-5 h-5 text-primary" />
               </div>
             </div>
           </CardContent>
         </Card>
 
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-xs text-muted-foreground uppercase tracking-wider">Goals Progress</p>
                 <p className="text-xl md:text-2xl font-bold text-primary mt-1">
                   {isLoading ? '...' : `${teamStats?.goalsProgress || 0}%`}
                 </p>
               </div>
               <div className="p-2 rounded-lg bg-primary/10">
                 <Users className="w-5 h-5 text-primary" />
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
 
       {/* Team Management Section */}
       <div className="grid gap-6 lg:grid-cols-2">
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Users className="w-5 h-5" />
               Team Members
             </CardTitle>
             <CardDescription>
               Manage your team ({currentTeamSize}/{maxTeamSize === 999 ? '∞' : maxTeamSize} seats used)
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input
                 placeholder="Search team members..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-9"
               />
             </div>
             
             {/* Current user as team owner */}
             <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                   {user?.email?.charAt(0).toUpperCase()}
                 </div>
                 <div>
                   <p className="font-medium">{user?.email}</p>
                   <p className="text-xs text-muted-foreground">Account Owner</p>
                 </div>
               </div>
               <Badge variant="outline" className="border-amber-500 text-amber-500">
                 <Crown className="w-3 h-3 mr-1" />
                 Owner
               </Badge>
             </div>
 
             <Button className="w-full" variant="outline" disabled>
               <Users className="w-4 h-4 mr-2" />
               Invite Team Member (Coming Soon)
             </Button>
           </CardContent>
         </Card>
 
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Mail className="w-5 h-5" />
               Quick Actions
             </CardTitle>
             <CardDescription>
               Common business management tasks
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-3">
             <Button className="w-full justify-start" variant="outline" onClick={handleExportReport}>
               <Download className="w-4 h-4 mr-3" />
               Export Financial Report
             </Button>
             <Button className="w-full justify-start" variant="outline" disabled>
               <Mail className="w-4 h-4 mr-3" />
               Send Team Digest (Coming Soon)
             </Button>
             <Button className="w-full justify-start" variant="outline" disabled>
               <Users className="w-4 h-4 mr-3" />
               Manage Permissions (Coming Soon)
             </Button>
             <Button className="w-full justify-start" variant="outline" disabled>
               <Building2 className="w-4 h-4 mr-3" />
               Company Settings (Coming Soon)
             </Button>
           </CardContent>
         </Card>
       </div>
 
       {/* Summary Cards */}
       <div className="grid gap-4 md:grid-cols-3">
         <Card>
           <CardContent className="p-4 text-center">
             <p className="text-3xl font-bold text-primary">{teamStats?.incomeCount || 0}</p>
             <p className="text-sm text-muted-foreground mt-1">Income Sources</p>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4 text-center">
             <p className="text-3xl font-bold text-primary">{teamStats?.expenseCount || 0}</p>
             <p className="text-sm text-muted-foreground mt-1">Expense Records</p>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4 text-center">
             <p className="text-3xl font-bold text-primary">{teamStats?.totalGoals || 0}</p>
             <p className="text-sm text-muted-foreground mt-1">Budget Goals</p>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }
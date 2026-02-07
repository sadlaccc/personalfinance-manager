import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  Target,
  PieChart,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--income))', 'hsl(var(--expense))', 'hsl(var(--accent))', 'hsl(var(--success))'];

export function TeamAnalyticsView() {
  const { user } = useAuth();

  // Fetch team members with their financial data
  const { data: teamAnalytics, isLoading } = useQuery({
    queryKey: ['team-analytics', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get team members
      const { data: teamMembers, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_owner_id', user.id)
        .eq('status', 'active');

      if (teamError) throw teamError;

      // Get owner's financial data
      const [ownerIncome, ownerExpenses, ownerGoals] = await Promise.all([
        supabase.from('income_sources').select('amount, category').eq('user_id', user.id),
        supabase.from('expenses').select('amount, category').eq('user_id', user.id),
        supabase.from('budget_goals').select('*').eq('user_id', user.id),
      ]);

      // Aggregate owner data
      const ownerTotalIncome = ownerIncome.data?.reduce((sum, i) => sum + Number(i.amount), 0) || 0;
      const ownerTotalExpenses = ownerExpenses.data?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const ownerGoalsProgress = ownerGoals.data?.reduce((sum, g) => {
        const progress = (Number(g.current_amount) / Number(g.target_amount)) * 100;
        return sum + Math.min(progress, 100);
      }, 0) || 0;

      // Calculate category breakdown for expenses
      const expenseByCategory: Record<string, number> = {};
      ownerExpenses.data?.forEach(e => {
        expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + Number(e.amount);
      });

      // Calculate category breakdown for income
      const incomeByCategory: Record<string, number> = {};
      ownerIncome.data?.forEach(i => {
        incomeByCategory[i.category] = (incomeByCategory[i.category] || 0) + Number(i.amount);
      });

      const activeMembers = teamMembers?.length || 0;

      // Member activity data for chart
      const memberData = [
        { name: 'Owner', income: ownerTotalIncome, expenses: ownerTotalExpenses },
        ...Array.from({ length: activeMembers }, (_, i) => ({
          name: `Member ${i + 1}`,
          income: 0, // Placeholder - in production would fetch actual member data
          expenses: 0,
        })),
      ];

      const expensePieData = Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value,
      }));

      const incomePieData = Object.entries(incomeByCategory).map(([name, value]) => ({
        name,
        value,
      }));

      return {
        totalMembers: activeMembers + 1, // +1 for owner
        activeMembers: activeMembers + 1,
        totalIncome: ownerTotalIncome,
        totalExpenses: ownerTotalExpenses,
        netIncome: ownerTotalIncome - ownerTotalExpenses,
        goalsCount: ownerGoals.data?.length || 0,
        avgGoalsProgress: ownerGoals.data?.length ? ownerGoalsProgress / ownerGoals.data.length : 0,
        memberData,
        expensePieData,
        incomePieData,
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Team Size</p>
                <p className="text-lg font-bold">{teamAnalytics?.totalMembers || 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-income/10">
                <TrendingUp className="w-4 h-4 text-income" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Income</p>
                <p className="text-lg font-bold text-income">
                  KSh {(teamAnalytics?.totalIncome || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-expense/10">
                <TrendingDown className="w-4 h-4 text-expense" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="text-lg font-bold text-expense">
                  KSh {(teamAnalytics?.totalExpenses || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-success/10">
                <Wallet className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Net Income</p>
                <p className={`text-lg font-bold ${(teamAnalytics?.netIncome || 0) >= 0 ? 'text-income' : 'text-expense'}`}>
                  KSh {(teamAnalytics?.netIncome || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4" />
            Team Goals Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{teamAnalytics?.goalsCount || 0}</p>
              <p className="text-sm text-muted-foreground">Active Goals</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {Math.round(teamAnalytics?.avgGoalsProgress || 0)}%
              </p>
              <p className="text-sm text-muted-foreground">Avg. Progress</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Expense Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Expense Breakdown
            </CardTitle>
            <CardDescription>Team expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            {teamAnalytics?.expensePieData && teamAnalytics.expensePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={teamAnalytics.expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {teamAnalytics.expensePieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `KSh ${value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Income Breakdown
            </CardTitle>
            <CardDescription>Team income by category</CardDescription>
          </CardHeader>
          <CardContent>
            {teamAnalytics?.incomePieData && teamAnalytics.incomePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={teamAnalytics.incomePieData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }} 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => `KSh ${value.toLocaleString()}`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No income data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Member Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Member Financial Activity</CardTitle>
          <CardDescription>Income vs Expenses comparison by team member</CardDescription>
        </CardHeader>
        <CardContent>
          {teamAnalytics?.memberData && teamAnalytics.memberData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={teamAnalytics.memberData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }} 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => `KSh ${value.toLocaleString()}`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--expense))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No member data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

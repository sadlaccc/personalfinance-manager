import { useMemo } from 'react';
import { format, subDays, startOfDay, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subMonths } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AdminUser } from '@/hooks/useAdminUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Calendar } from 'lucide-react';

interface UserAnalyticsChartsProps {
  users: AdminUser[];
}

export function UserAnalyticsCharts({ users }: UserAnalyticsChartsProps) {
  const dailyData = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    return last30Days.map((day) => {
      const dayStart = startOfDay(day);
      const signups = users.filter((u) => {
        const userDate = startOfDay(new Date(u.created_at));
        return userDate.getTime() === dayStart.getTime();
      }).length;

      return {
        date: format(day, 'MMM d'),
        signups,
        cumulative: 0, // Will be calculated below
      };
    });
  }, [users]);

  // Calculate cumulative signups
  const dailyDataWithCumulative = useMemo(() => {
    let cumulative = users.filter((u) => new Date(u.created_at) < subDays(new Date(), 29)).length;
    return dailyData.map((d) => {
      cumulative += d.signups;
      return { ...d, cumulative };
    });
  }, [dailyData, users]);

  const weeklyData = useMemo(() => {
    const last12Weeks = eachWeekOfInterval({
      start: subDays(new Date(), 83),
      end: new Date(),
    });

    return last12Weeks.map((weekStart, index) => {
      const weekEnd = index < last12Weeks.length - 1 ? last12Weeks[index + 1] : new Date();
      const signups = users.filter((u) => {
        const userDate = new Date(u.created_at);
        return userDate >= weekStart && userDate < weekEnd;
      }).length;

      return {
        date: format(weekStart, 'MMM d'),
        signups,
      };
    });
  }, [users]);

  const monthlyData = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return last6Months.map((monthStart, index) => {
      const monthEnd = index < last6Months.length - 1 ? last6Months[index + 1] : new Date();
      const signups = users.filter((u) => {
        const userDate = new Date(u.created_at);
        return userDate >= monthStart && userDate < monthEnd;
      }).length;

      return {
        date: format(monthStart, 'MMM yyyy'),
        signups,
      };
    });
  }, [users]);

  const totalSignupsLast30Days = dailyData.reduce((sum, d) => sum + d.signups, 0);
  const avgDailySignups = (totalSignupsLast30Days / 30).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Signup Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Users className="h-4 w-4" />
              Last 30 Days
            </div>
            <p className="text-2xl font-bold">{totalSignupsLast30Days}</p>
            <p className="text-xs text-muted-foreground">new signups</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Calendar className="h-4 w-4" />
              Daily Average
            </div>
            <p className="text-2xl font-bold">{avgDailySignups}</p>
            <p className="text-xs text-muted-foreground">signups/day</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <TrendingUp className="h-4 w-4" />
              Total Users
            </div>
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">registered</p>
          </div>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDataWithCumulative}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="signups"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSignups)"
                  name="New Signups"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar
                  dataKey="signups"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Weekly Signups"
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar
                  dataKey="signups"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Monthly Signups"
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

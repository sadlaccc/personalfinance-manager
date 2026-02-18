import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { IncomeStats, IncomeCategory, categoryLabels } from '@/types/income';
import { PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

interface IncomeChartProps {
  stats: IncomeStats;
}

const COLORS: Record<IncomeCategory, string> = {
  salary: '#3b82f6',
  freelance: '#a855f7',
  investment: '#10b981',
  rental: '#f59e0b',
  business: '#ec4899',
  other: '#6b7280',
};

export function IncomeChart({ stats }: IncomeChartProps) {
  const data = Object.entries(stats.byCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: categoryLabels[category as IncomeCategory],
      value: Math.round(value),
      color: COLORS[category as IncomeCategory],
    }));

  if (data.length === 0) {
    return (
      <div className="relative overflow-hidden bg-card border border-border/50 rounded-2xl p-6 text-center shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/10" />
        <div className="relative z-10">
          <div className="bg-gradient-to-br from-primary/15 to-primary/5 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
            <PieChartIcon className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-display font-semibold text-foreground text-sm mb-1">No income data</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Add income sources to see your distribution chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
      <h3 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        Income Distribution
      </h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`KSh ${value.toLocaleString()}`, 'Monthly']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '13px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

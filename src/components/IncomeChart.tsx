import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { IncomeStats, IncomeCategory, categoryLabels } from '@/types/income';

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
      <div className="bg-card border border-border rounded-2xl p-6 h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No income data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4">
        Income Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
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
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

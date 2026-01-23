import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useIncomeStore } from '@/hooks/useIncomeStore';
import { categoryLabels, IncomeCategory } from '@/types/income';
import { TrendingUp, DollarSign, PieChart, Target } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const COLORS: Record<IncomeCategory, string> = {
  salary: '#3b82f6',
  freelance: '#a855f7',
  investment: '#10b981',
  rental: '#f59e0b',
  business: '#ec4899',
  other: '#6b7280',
};

const Analytics = () => {
  const { stats, incomeSources } = useIncomeStore();

  // Category breakdown data
  const categoryData = Object.entries(stats.byCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: categoryLabels[category as IncomeCategory],
      value: Math.round(value),
      fill: COLORS[category as IncomeCategory],
    }))
    .sort((a, b) => b.value - a.value);

  // Monthly projection data (simulated for demo)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const projectionData = months.map((month, index) => ({
    name: month,
    income: index <= currentMonth 
      ? Math.round(stats.totalMonthly * (0.85 + Math.random() * 0.3))
      : Math.round(stats.totalMonthly * (0.95 + Math.random() * 0.1)),
    projected: index > currentMonth,
  }));

  // Income by frequency
  const frequencyData = [
    { name: 'Monthly', count: incomeSources.filter(s => s.frequency === 'monthly').length },
    { name: 'Weekly', count: incomeSources.filter(s => s.frequency === 'weekly').length },
    { name: 'Bi-weekly', count: incomeSources.filter(s => s.frequency === 'biweekly').length },
    { name: 'Yearly', count: incomeSources.filter(s => s.frequency === 'yearly').length },
    { name: 'One-time', count: incomeSources.filter(s => s.frequency === 'one-time').length },
  ].filter(d => d.count > 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-income/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-income" />
            </div>
            <span className="text-sm text-muted-foreground">Monthly Total</span>
          </div>
          <p className="text-2xl font-bold font-display text-foreground">
            ${stats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Yearly Total</span>
          </div>
          <p className="text-2xl font-bold font-display text-foreground">
            ${stats.totalYearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-category-freelance/10 rounded-xl">
              <PieChart className="w-5 h-5 text-category-freelance" />
            </div>
            <span className="text-sm text-muted-foreground">Categories</span>
          </div>
          <p className="text-2xl font-bold font-display text-foreground">
            {categoryData.length}
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-category-rental/10 rounded-xl">
              <Target className="w-5 h-5 text-category-rental" />
            </div>
            <span className="text-sm text-muted-foreground">Avg per Source</span>
          </div>
          <p className="text-2xl font-bold font-display text-foreground">
            ${stats.sourceCount > 0 
              ? Math.round(stats.totalMonthly / stats.sourceCount).toLocaleString() 
              : 0}
          </p>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            Income Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Income']}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4">
            Income by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monthly']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Frequency Distribution */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display font-semibold text-lg text-foreground mb-4">
          Income Frequency Distribution
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;

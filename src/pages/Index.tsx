import { useState } from 'react';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { IncomeCard } from '@/components/IncomeCard';
import { IncomeChart } from '@/components/IncomeChart';
import { AddIncomeDialog } from '@/components/AddIncomeDialog';
import { Button } from '@/components/ui/button';
import { useIncomeStore } from '@/hooks/useIncomeStore';
import { IncomeSource } from '@/types/income';
import { 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Calendar,
  Plus 
} from 'lucide-react';

const Index = () => {
  const { incomeSources, stats, addIncomeSource, updateIncomeSource, deleteIncomeSource } = useIncomeStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null);

  const handleEdit = (income: IncomeSource) => {
    setEditingIncome(income);
    setDialogOpen(true);
  };

  const handleSubmit = (incomeData: Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingIncome) {
      updateIncomeSource(editingIncome.id, incomeData);
      setEditingIncome(null);
    } else {
      addIncomeSource(incomeData);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingIncome(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Monthly Income"
            value={`$${stats.totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            subtitle="All sources combined"
            icon={<DollarSign className="w-6 h-6" />}
            variant="income"
          />
          <StatsCard
            title="Yearly Projection"
            value={`$${stats.totalYearly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            subtitle="Based on current income"
            icon={<TrendingUp className="w-6 h-6" />}
            variant="primary"
          />
          <StatsCard
            title="Income Sources"
            value={stats.sourceCount.toString()}
            subtitle="Active streams"
            icon={<Layers className="w-6 h-6 text-primary" />}
          />
          <StatsCard
            title="This Month"
            value={new Date().toLocaleDateString('en-US', { month: 'long' })}
            subtitle={new Date().getFullYear().toString()}
            icon={<Calendar className="w-6 h-6 text-primary" />}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Income Sources List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Income Sources
                </h2>
                <p className="text-muted-foreground">
                  Manage your earnings from different sources
                </p>
              </div>
              <Button 
                onClick={() => setDialogOpen(true)}
                className="rounded-xl bg-gradient-income hover:opacity-90 transition-opacity gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Income
              </Button>
            </div>

            {incomeSources.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  No income sources yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your income by adding your first source
                </p>
                <Button 
                  onClick={() => setDialogOpen(true)}
                  className="rounded-xl bg-gradient-income hover:opacity-90"
                >
                  Add Your First Income
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {incomeSources.map((income) => (
                  <IncomeCard
                    key={income.id}
                    income={income}
                    onEdit={handleEdit}
                    onDelete={deleteIncomeSource}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Chart Sidebar */}
          <div className="space-y-6">
            <IncomeChart stats={stats} />
            
            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                Quick Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.byCategory)
                  .filter(([_, value]) => value > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, value]) => {
                    const percentage = ((value / stats.totalMonthly) * 100).toFixed(0);
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground capitalize">
                          {category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddIncomeDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        onSubmit={handleSubmit}
        editingIncome={editingIncome}
      />
    </div>
  );
};

export default Index;

import { Wallet, TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-hero p-2.5 rounded-xl shadow-md">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                IncomeFlow
              </h1>
              <p className="text-sm text-muted-foreground">
                Track your earnings
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-income" />
            <span>Personal Finance Dashboard</span>
          </div>
        </div>
      </div>
    </header>
  );
}

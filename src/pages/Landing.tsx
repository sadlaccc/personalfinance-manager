import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { PageTransition } from '@/components/PageTransition';
import {
  Wallet,
  CircleDollarSign,
  LineChart,
  Goal,
  ArrowRight,
  CheckCircle2,
  PieChart,
  Lock,
  Users,
  TrendingUp,
  Sparkles,
  Globe,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.jpg';

const features = [
  {
    icon: Wallet,
    title: 'Income tracking',
    description: 'Salary, freelance, rental, business. All your income in one place.',
  },
  {
    icon: CircleDollarSign,
    title: 'Expenses',
    description: 'Categorize spending and set limits. Know when a category is about to blow.',
  },
  {
    icon: Goal,
    title: 'Savings goals',
    description: 'Pick a target, add funds when you can, watch the bar fill up.',
  },
  {
    icon: LineChart,
    title: 'Analytics',
    description: 'See where the money actually goes. Week, month, or custom range.',
  },
  {
    icon: PieChart,
    title: 'Budgets',
    description: 'A budget per category. Compare plan vs actual. Copy last month forward.',
  },
  {
    icon: Lock,
    title: 'Private by default',
    description: 'Your data is locked to your account. Nothing shared, nothing sold.',
  },
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 'Free',
    cadence: 'forever',
    highlight: false,
    features: ['Up to 5 income sources', 'Up to 20 expenses', 'Basic analytics'],
  },
  {
    name: 'Pro',
    price: '$6',
    cadence: '/ month',
    highlight: true,
    features: ['Unlimited income & expenses', 'Advanced analytics', 'Goals & budgets', 'Exports'],
  },
  {
    name: 'Business',
    price: '$19',
    cadence: '/ month',
    highlight: false,
    features: ['Everything in Pro', 'Up to 10 team members', 'Team analytics', 'Priority support'],
  },
];

function SavingsCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');

  const results = useMemo(() => {
    const income = parseFloat(monthlyIncome) || 0;
    const expenses = parseFloat(monthlyExpenses) || 0;
    const goal = parseFloat(savingsGoal) || 0;
    const monthlySavings = income - expenses;
    const savingsRate = income > 0 ? ((monthlySavings / income) * 100) : 0;
    const monthsToGoal = monthlySavings > 0 && goal > 0 ? Math.ceil(goal / monthlySavings) : 0;
    return { monthlySavings, savingsRate, monthsToGoal };
  }, [monthlyIncome, monthlyExpenses, savingsGoal]);

  const hasInput = monthlyIncome || monthlyExpenses;

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Try the savings math
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Drop in your numbers. See how long until you hit your goal.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Monthly Income</label>
                <Input type="number" placeholder="e.g. 5,000" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Monthly Expenses</label>
                <Input type="number" placeholder="e.g. 3,000" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Savings Goal</label>
                <Input type="number" placeholder="e.g. 50,000" value={savingsGoal} onChange={(e) => setSavingsGoal(e.target.value)} className="rounded-xl" />
              </div>
            </div>

            {hasInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50"
              >
                <div className="text-center">
                  <p className={`text-xl sm:text-2xl font-bold font-display ${results.monthlySavings >= 0 ? 'text-income' : 'text-destructive'}`}>
                    {Math.abs(results.monthlySavings).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {results.monthlySavings >= 0 ? 'Monthly Savings' : 'Monthly Deficit'}
                  </p>
                </div>
                <div className="text-center">
                  <p className={`text-xl sm:text-2xl font-bold font-display ${results.savingsRate >= 20 ? 'text-income' : results.savingsRate >= 0 ? 'text-warning' : 'text-destructive'}`}>
                    {results.savingsRate.toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Savings Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold font-display text-primary">
                    {results.monthsToGoal > 0 ? `${results.monthsToGoal} mo` : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">To Reach Goal</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="text-center mt-6">
            <Link to="/auth">
              <Button size="lg">
                Start Tracking for Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-primary/25 blur-3xl opacity-70" />
          <div className="absolute top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-accent/25 blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] rounded-full bg-income/15 blur-3xl opacity-60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 backdrop-blur px-3 py-1.5 mb-5 text-xs sm:text-sm shadow-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-income animate-pulse" />
                <span className="text-muted-foreground">Now with team plans and multi-currency budgets</span>
              </div>

              <h1 className="font-display text-[2.5rem] sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.05]">
                Know where your{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  money goes.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-7 max-w-lg leading-relaxed">
                A simple place to log income, plan budgets, and watch savings grow. No spreadsheets. No banking logins.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3 mb-7">
                <Link to="/auth" className="w-full sm:w-auto">
                  <Button size="lg" className="h-12 px-7 w-full sm:w-auto shadow-lg shadow-primary/25">
                    Start free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="h-12 px-7 w-full sm:w-auto">See pricing</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {[
                  { icon: ShieldCheck, label: 'No card needed' },
                  { icon: Globe, label: 'Works in your currency' },
                  { icon: Zap, label: 'Phone or laptop' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4 text-income shrink-0" />
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/30 to-accent/30 blur-3xl -z-10" />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10 ring-1 ring-white/5">
                <img
                  src={heroDashboard}
                  alt="FedhaFlow dashboard showing income and expense tracking"
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>

          {/* Honest highlights strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-14 lg:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border/50 bg-border/50"
          >
            {[
              { value: 'Free', label: 'To get started' },
              { value: 'Your currency', label: 'KSh, USD, EUR and more' },
              { value: 'Private', label: 'Locked to your account' },
              { value: 'Yours', label: 'Export anytime' },
            ].map((stat) => (
              <div key={stat.label} className="bg-card/80 backdrop-blur p-5 text-center">
                <p className="font-display text-base sm:text-lg font-bold text-primary">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Features</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              The basics, done well
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              From a single salary to a dozen side hustles. Everything fits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
              >
                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-4 ring-1 ring-primary/10">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-base mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">How it works</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Three steps. That's it.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Sign up', description: 'Email and a password. Sixty seconds.', icon: Users },
              { step: '02', title: 'Add what you have', description: 'Income, expenses, a budget if you want one.', icon: Wallet },
              { step: '03', title: 'Keep going', description: 'Check in weekly. The picture gets clearer.', icon: TrendingUp },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative p-6 rounded-2xl bg-card border border-border/50"
              >
                <span className="absolute top-4 right-5 font-display text-xs font-bold text-primary/30 tracking-wider">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center mb-4 shadow-md">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Savings Calculator */}
      <SavingsCalculator />

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-8 sm:p-14 text-center">
            <div className="absolute inset-0 -z-0 opacity-30">
              <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/30 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent/40 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3">
                Give it a try this weekend.
              </h2>
              <p className="text-primary-foreground/85 mb-6 max-w-md mx-auto text-sm sm:text-base">
                Free to start. Your data stays yours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="h-12 px-7 shadow-lg">
                    Create an account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 h-12 px-7">
                    See plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
    </PageTransition>
  );
}

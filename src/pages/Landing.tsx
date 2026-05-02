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
import heroDashboard from '@/assets/hero-dashboard.png';

const features = [
  {
    icon: Wallet,
    title: 'Income Tracking',
    description: 'Log salary, freelance, rental, and business income. Totals update in real time.',
  },
  {
    icon: CircleDollarSign,
    title: 'Expense Management',
    description: 'Categorize spending, set per-category limits, get notified before you overshoot.',
  },
  {
    icon: Goal,
    title: 'Savings Goals',
    description: 'Set targets with deadlines, add funds as you go, watch progress fill up.',
  },
  {
    icon: LineChart,
    title: 'Analytics',
    description: 'Charts that show where your money goes, by week, month, or custom range.',
  },
  {
    icon: PieChart,
    title: 'Budget Planning',
    description: 'Monthly budgets per category. Compare planned vs actual. Copy across months.',
  },
  {
    icon: Lock,
    title: 'Secure by Default',
    description: 'Row-level security on every table. Your data stays yours.',
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
            Quick Savings Calculator
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Plug in your numbers and see how long it'll take to hit your goal.
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
                <span className="text-muted-foreground">New: Multi-currency budgets &amp; team plans</span>
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>

              <h1 className="font-display text-[2.5rem] sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.05]">
                Track your money.{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Hit your goals.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-7 max-w-lg leading-relaxed">
                A modern personal finance dashboard for income, expenses, budgets and savings. Built for people anywhere in the world.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3 mb-7">
                <Link to="/auth" className="w-full sm:w-auto">
                  <Button size="lg" className="h-12 px-7 w-full sm:w-auto shadow-lg shadow-primary/25">
                    Create Free Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="h-12 px-7 w-full sm:w-auto">View Plans</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {[
                  { icon: ShieldCheck, label: 'No credit card' },
                  { icon: Globe, label: 'Multi-currency' },
                  { icon: Zap, label: 'Any device' },
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

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-14 lg:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border/50 bg-border/50"
          >
            {[
              { value: '40+', label: 'Currencies' },
              { value: '99.9%', label: 'Uptime' },
              { value: 'Unlimited', label: 'Records on Pro' },
              { value: 'GDPR', label: 'Data privacy' },
            ].map((stat) => (
              <div key={stat.label} className="bg-card/80 backdrop-blur p-5 text-center">
                <p className="font-display text-xl sm:text-2xl font-bold text-primary">{stat.value}</p>
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
              Everything you need to run your money
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Simple tools that cover the full picture, from daily spending to long-term goals.
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
              Get started in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Sign up', description: 'Create a free account with your email.', icon: Users },
              { step: '02', title: 'Add your finances', description: 'Log income and expenses. Set budgets.', icon: Wallet },
              { step: '03', title: 'See the big picture', description: 'Track trends, hit goals, stay on budget.', icon: TrendingUp },
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

      {/* Pricing teaser */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Pricing</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              Plans that grow with you
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Start free. Upgrade when you outgrow it. Cancel any time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  tier.highlight
                    ? 'border-primary/60 bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/20'
                    : 'border-border/50 bg-card'
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-0.5 text-[10px] font-semibold text-primary-foreground uppercase tracking-wider shadow">
                    <Sparkles className="w-3 h-3" /> Popular
                  </span>
                )}
                <p className="font-display font-semibold text-lg">{tier.name}</p>
                <div className="mt-2 mb-5">
                  <span className="font-display text-3xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{tier.cadence}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-income shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/pricing">
                  <Button
                    variant={tier.highlight ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {tier.highlight ? 'Get Started' : 'Compare Plans'}
                  </Button>
                </Link>
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
                Ready to take control of your finances?
              </h2>
              <p className="text-primary-foreground/85 mb-6 max-w-md mx-auto text-sm sm:text-base">
                It's free to start. No credit card. No tricks.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="h-12 px-7 shadow-lg">
                    Create Your Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 h-12 px-7">
                    See Plans
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

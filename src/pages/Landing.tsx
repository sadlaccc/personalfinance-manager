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
  Send,
  Linkedin,
  Github,
  Mail,
  PieChart,
  Lock,
  Users,
  TrendingUp
} from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.png';

const features = [
  {
    icon: Wallet,
    title: 'Income Tracking',
    description: 'Log salary, freelance, rental, and business income. See totals update in real time.',
  },
  {
    icon: CircleDollarSign,
    title: 'Expense Management',
    description: 'Categorize spending, set limits per category, and get notified before you overshoot.',
  },
  {
    icon: Goal,
    title: 'Savings Goals',
    description: 'Set targets with deadlines, add funds as you go, and track your progress visually.',
  },
  {
    icon: LineChart,
    title: 'Analytics',
    description: 'Charts that show where your money goes — by week, month, or custom date range.',
  },
  {
    icon: PieChart,
    title: 'Budget Planning',
    description: 'Create monthly budgets per category. Compare planned vs actual. Copy across months.',
  },
  {
    icon: Lock,
    title: 'Secure by Default',
    description: 'Row-level security on every table. Your data is encrypted and never shared.',
  },
];

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
};

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
                <label className="text-sm font-medium text-foreground">Monthly Income (KSh)</label>
                <Input
                  type="number"
                  placeholder="e.g. 80,000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Monthly Expenses (KSh)</label>
                <Input
                  type="number"
                  placeholder="e.g. 50,000"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Savings Goal (KSh)</label>
                <Input
                  type="number"
                  placeholder="e.g. 500,000"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(e.target.value)}
                  className="rounded-xl"
                />
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
                    KSh {Math.abs(results.monthlySavings).toLocaleString()}
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">FedhaFlow</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Track your money.{' '}
                <span className="text-primary">Hit your goals.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                A personal finance dashboard for tracking income, expenses, budgets, and savings — built for how Kenyans actually manage money.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3 mb-8">
                <Link to="/auth">
                  <Button size="lg" className="h-12 px-8">
                    Create Free Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="h-12 px-8">View Plans</Button>
                </Link>
              </div>
              
              <div className="space-y-2">
                {['No credit card required', 'M-Pesa integration', 'Works on any device'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-income shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="rounded-2xl overflow-hidden border border-border/50 shadow-xl">
                <img 
                  src={heroDashboard} 
                  alt="FedhaFlow dashboard showing income and expense tracking" 
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              What you can do with FedhaFlow
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Simple tools that cover the full picture — from daily spending to long-term goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
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
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              Get started in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-3xl mx-auto">
            {[
              { step: '1', title: 'Sign up', description: 'Create a free account with your email.', icon: Users },
              { step: '2', title: 'Add your finances', description: 'Log income and expenses. Set budgets.', icon: Wallet },
              { step: '3', title: 'See the big picture', description: 'Track trends, hit goals, stay on budget.', icon: TrendingUp },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-display font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
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
          <div className="rounded-2xl bg-primary p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-3">
              Ready to take control of your finances?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto text-sm sm:text-base">
              It's free to start. No credit card. No tricks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  Create Your Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8">
                  See Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="col-span-2 sm:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold">FedhaFlow</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Personal finance tools for Kenyans.
              </p>
              <div className="flex items-center gap-2">
                <a href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Github className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-3">Get tips and updates.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email"
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button size="sm" className="shrink-0">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} FedhaFlow. Made in Nairobi.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}

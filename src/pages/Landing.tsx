import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageTransition } from '@/components/PageTransition';
import { 
  Wallet, 
  PiggyBank, 
  BarChart3, 
  Target, 
  Shield, 
  Zap,
  ArrowRight,
  Check
} from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.png';
import savingsIllustration from '@/assets/savings-illustration.png';
import analyticsIllustration from '@/assets/analytics-illustration.png';

const features = [
  {
    icon: Wallet,
    title: 'Track Income',
    description: 'Monitor all your income sources in one place.',
  },
  {
    icon: PiggyBank,
    title: 'Manage Expenses',
    description: 'Keep track of where your money goes.',
  },
  {
    icon: Target,
    title: 'Set Goals',
    description: 'Create savings goals and track progress.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Visualize your financial data with charts.',
  },
];

const benefits = [
  'Free to get started',
  'Secure & private',
  'Real-time sync',
  'Mobile friendly',
];

export default function Landing() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">IncomeFlow</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Sign In
                </Button>
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

      {/* Hero Section */}
      <section className="relative py-10 sm:py-14 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Smart Financial Management
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                Take Control of Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Financial Future
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-lg">
                Track income, manage expenses, and achieve your savings goals with our intuitive personal finance dashboard.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
                <Link to="/auth">
                  <Button size="lg">
                    Start Free Today
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
              
              {/* Benefits */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={heroDashboard} 
                  alt="IncomeFlow Dashboard Preview" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
              {/* Floating elements */}
              <motion.div 
                className="absolute -bottom-4 -left-4 w-20 h-20 rounded-xl overflow-hidden shadow-lg hidden sm:block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={savingsIllustration} alt="Savings" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                className="absolute -top-4 -right-4 w-16 h-16 rounded-xl overflow-hidden shadow-lg hidden sm:block"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={analyticsIllustration} alt="Analytics" className="w-full h-full object-cover" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Powerful features to help you manage your finances effectively.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-4 sm:p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base mb-1">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats + Image Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Join our growing community of users who are taking control of their finances.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-primary">10K+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-primary">$2M+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Tracked</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-primary">4.9</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex justify-center"
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
                <img 
                  src={savingsIllustration} 
                  alt="Savings Growth" 
                  className="relative w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl bg-gradient-to-br from-primary to-accent p-6 sm:p-10 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative">
              <Shield className="w-10 h-10 text-primary-foreground/80 mx-auto mb-4" />
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-primary-foreground mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto text-sm sm:text-base">
                Join thousands of users who are already managing their finances smarter.
              </p>
              <Link to="/auth">
                <Button size="lg" variant="secondary">
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wallet className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm">IncomeFlow</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </nav>
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2024 IncomeFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}

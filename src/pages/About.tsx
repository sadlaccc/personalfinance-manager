import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageTransition } from '@/components/PageTransition';
import { 
  TrendingUp, 
  Users2, 
  Goal, 
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const values = [
  {
    icon: Users2,
    title: 'User-Centric',
    description: 'We build features that our users actually need, not what we think they need.',
  },
  {
    icon: Goal,
    title: 'Simplicity First',
    description: 'Complex finances made simple. No jargon, no clutter, just clarity.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy Matters',
    description: 'Your financial data is yours. We never sell or share your information.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '$2M+', label: 'Tracked Monthly' },
  { value: '50K+', label: 'Goals Achieved' },
  { value: '4.9', label: 'User Rating' },
];

export default function About() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-income flex items-center justify-center shadow-md">
                <TrendingUp className="w-4 h-4 text-income-foreground" />
              </div>
              <span className="font-display font-bold text-lg">FedhaFlow</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/auth">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                FedhaFlow
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We're on a mission to help everyone take control of their finances with simple, 
              powerful tools that make money management accessible to all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-3xl sm:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  FedhaFlow was born from a simple frustration: managing personal finances 
                  shouldn't require a degree in accounting or expensive software.
                </p>
                <p>
                  We started in Nairobi with a clear vision – to create a financial management 
                  tool that's powerful enough for complex needs yet simple enough for anyone to use.
                </p>
                <p>
                  Today, we help thousands of Kenyans track their income, manage expenses, and 
                  achieve their savings goals. Our commitment to simplicity and privacy 
                  remains at the core of everything we do.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="w-32 h-32 rounded-2xl bg-gradient-income flex items-center justify-center shadow-2xl">
                  <TrendingUp className="w-16 h-16 text-income-foreground" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
              Ready to Start?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join our community and take the first step towards financial clarity.
            </p>
            <Link to="/auth">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-income flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-income-foreground" />
              </div>
              <span className="font-display font-semibold text-sm">FedhaFlow</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FedhaFlow. Made in Nairobi 🇰🇪
            </p>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { PageTransition } from '@/components/PageTransition';
import { 
  TrendingUp, 
  Users2, 
  Goal, 
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Wallet,
  Heart,
} from 'lucide-react';

const values = [
  {
    icon: Users2,
    title: 'User-Centric',
    description: 'Every feature starts with real feedback. We build what people actually need.',
  },
  {
    icon: Goal,
    title: 'Simplicity First',
    description: 'No jargon, no clutter. Complex finances presented with clarity.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy Matters',
    description: 'Bank-level encryption. Row-level security. We never sell your data.',
  },
  {
    icon: Heart,
    title: 'Built for Kenya',
    description: 'Designed for Kenyan workflows, including M-Pesa, KSh, and local spending patterns.',
  },
];

export default function About() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/landing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              About FedhaFlow
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're building a personal finance tool that actually makes sense 
              for people in Kenya. Simple, private, and focused on what matters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">
                Why we built this
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Most finance apps are built for markets that don't look like ours. 
                  They don't understand M-Pesa, they price in dollars, and their budgeting 
                  categories don't match how Kenyans actually spend.
                </p>
                <p>
                  FedhaFlow started as a side project to solve a personal problem: tracking 
                  income from multiple sources (salary, freelance, side hustles) alongside
                  everyday expenses in a way that actually made sense.
                </p>
                <p>
                  It grew from there. We added budgets, savings goals, analytics, and 
                  team features. The goal hasn't changed: make personal finance management 
                  accessible and useful for everyday Kenyans.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">What we care about</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="p-5 rounded-2xl bg-card border border-border/50"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <value.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
            Want to try it out?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            FedhaFlow is free to start. Create an account and see if it works for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">Talk to Us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wallet className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-sm">FedhaFlow</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/landing" className="hover:text-foreground transition-colors">Home</Link>
              <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
              <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FedhaFlow
            </p>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}

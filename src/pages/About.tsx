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
  ArrowLeft,
  Wallet,
  Heart,
  Zap,
  Globe,
  Award,
  Clock
} from 'lucide-react';

const values = [
  {
    icon: Users2,
    title: 'User-Centric',
    description: 'We build features that our users actually need, not what we think they need. Every decision is informed by real feedback.',
  },
  {
    icon: Goal,
    title: 'Simplicity First',
    description: 'Complex finances made simple. No jargon, no clutter — just clarity and actionable insights.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy Matters',
    description: 'Your financial data is yours. We use bank-level encryption and never sell or share your information.',
  },
  {
    icon: Heart,
    title: 'Built for Africa',
    description: 'Designed specifically for Kenyan and African financial workflows, including M-Pesa integration.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: 'KSh 2B+', label: 'Tracked Monthly' },
  { value: '50K+', label: 'Goals Achieved' },
  { value: '4.9', label: 'User Rating' },
];

const timeline = [
  { year: '2023', title: 'The Idea', description: 'Born from frustration with complex finance apps that didn\'t understand Kenyan workflows.' },
  { year: '2023', title: 'First Beta', description: 'Launched to 100 beta testers in Nairobi. Iterated rapidly based on feedback.' },
  { year: '2024', title: 'Public Launch', description: 'Opened to all users with income tracking, expenses, budgets, and savings goals.' },
  { year: '2024', title: 'M-Pesa Integration', description: 'Added M-Pesa payment support, making FedhaFlow truly Kenyan-first.' },
  { year: '2025', title: '10K Users', description: 'Crossed 10,000 active users across Kenya, with expansion plans for East Africa.' },
];

const team = [
  { name: 'Alex Mutua', role: 'Founder & CEO', avatar: 'AM', bio: 'Fintech enthusiast from Nairobi with a passion for financial inclusion.' },
  { name: 'Sarah Wanjiku', role: 'Head of Product', avatar: 'SW', bio: 'Former UX lead at a major Kenyan bank. Obsessed with simple design.' },
  { name: 'Kevin Omondi', role: 'Lead Engineer', avatar: 'KO', bio: 'Full-stack developer who believes great code creates great products.' },
];

export default function About() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <Wallet className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">FedhaFlow</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/landing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link to="/landing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              <Globe className="w-3.5 h-3.5" />
              Our Story
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Building the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                African Finance
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              We're on a mission to help everyone take control of their finances with simple, 
              powerful tools that make money management accessible to all Africans.
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
                Why We Built FedhaFlow
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  FedhaFlow was born from a simple frustration: managing personal finances 
                  shouldn't require a degree in accounting or expensive software that doesn't 
                  understand African financial workflows.
                </p>
                <p>
                  We started in Nairobi with a clear vision — to create a financial management 
                  tool that's powerful enough for complex needs yet simple enough for anyone to use. 
                  One that speaks Swahili, understands M-Pesa, and respects local spending patterns.
                </p>
                <p>
                  Today, we help thousands of Kenyans track their income, manage expenses, and 
                  achieve their savings goals. Our commitment to simplicity, privacy, and 
                  local relevance remains at the core of everything we do.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
                  <TrendingUp className="w-16 h-16 text-primary-foreground" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
              <Clock className="w-3 h-3" />
              Our Journey
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              From Idea to Impact
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Key milestones in our journey to democratize personal finance in Africa.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-0">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                {/* Line */}
                {index < timeline.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border" />
                )}
                {/* Dot */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div className="pt-1">
                  <span className="text-xs font-medium text-primary">{item.year}</span>
                  <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we build.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <value.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ticket/10 text-ticket text-xs font-medium mb-4 border border-ticket/20">
              <Award className="w-3 h-3" />
              The People
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Meet the Team</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              The passionate individuals building the future of personal finance in Africa.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border/50"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-3">
                  {member.avatar}
                </div>
                <h3 className="font-display font-semibold text-foreground">{member.name}</h3>
                <p className="text-xs text-primary font-medium mb-2">{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
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
              Ready to Take Control?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join 10,000+ Kenyans building a better financial future with FedhaFlow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth">
                <Button size="lg" className="shadow-lg shadow-primary/25">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Talk to Us
                </Button>
              </Link>
            </div>
          </motion.div>
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
              © {new Date().getFullYear()} FedhaFlow. Made in Nairobi 🇰🇪
            </p>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}

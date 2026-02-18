import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageTransition } from '@/components/PageTransition';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { 
  Wallet, 
  CircleDollarSign, 
  LineChart, 
  Goal, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Send,
  Linkedin,
  Github,
  Mail,
  Zap,
  PieChart,
  TrendingUp,
  Lock,
  Users,
  Smartphone
} from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.png';
import savingsIllustration from '@/assets/savings-illustration.png';
import analyticsIllustration from '@/assets/analytics-illustration.png';

const features = [
  {
    icon: Wallet,
    title: 'Income Tracking',
    description: 'Consolidate salary, freelance, rental, and business income in a unified dashboard with real-time totals.',
    gradient: 'from-primary/15 to-primary/5',
    iconBg: 'bg-primary/10',
  },
  {
    icon: CircleDollarSign,
    title: 'Expense Management',
    description: 'Categorize spending automatically, set category budgets, and get alerts when you\'re approaching limits.',
    gradient: 'from-destructive/15 to-destructive/5',
    iconBg: 'bg-destructive/10',
  },
  {
    icon: Goal,
    title: 'Savings Goals',
    description: 'Set personalized targets with deadlines, track progress visually, and celebrate milestones along the way.',
    gradient: 'from-accent/15 to-accent/5',
    iconBg: 'bg-accent/10',
  },
  {
    icon: LineChart,
    title: 'Smart Analytics',
    description: 'Interactive charts reveal spending patterns, income trends, and actionable insights to optimize your finances.',
    gradient: 'from-ticket/15 to-ticket/5',
    iconBg: 'bg-ticket/10',
  },
  {
    icon: PieChart,
    title: 'Budget Planning',
    description: 'Create monthly budgets per category, compare planned vs actual spending, and copy budgets across months.',
    gradient: 'from-warning/15 to-warning/5',
    iconBg: 'bg-warning/10',
  },
  {
    icon: Lock,
    title: 'Bank-Level Security',
    description: 'Your data is encrypted end-to-end with row-level security. We never share or sell your financial information.',
    gradient: 'from-success/15 to-success/5',
    iconBg: 'bg-success/10',
  },
];

const benefits = [
  { label: 'Free to get started', icon: Zap },
  { label: 'Bank-level security', icon: Shield },
  { label: 'Real-time sync', icon: TrendingUp },
  { label: 'Mobile optimized', icon: Smartphone },
];

const testimonials = [
  {
    name: 'Wanjiku Kamau',
    role: 'Freelance Designer',
    content: 'FedhaFlow imebadilisha jinsi ninavyodhibiti pesa zangu. The analytics are incredibly insightful and the budgeting tools are a game-changer!',
    rating: 5,
    avatar: 'WK',
  },
  {
    name: 'Brian Ochieng',
    role: 'Software Engineer',
    content: 'Finally, a finance app that understands Kenyan workflows. I tracked and saved KSh 50,000 in my first month using the goals feature!',
    rating: 5,
    avatar: 'BO',
  },
  {
    name: 'Faith Njeri',
    role: 'Small Business Owner',
    content: 'The goal-setting feature keeps me motivated. I hit my savings target 2 months early and the expense tracking helped me cut unnecessary costs.',
    rating: 5,
    avatar: 'FN',
  },
  {
    name: 'David Mwangi',
    role: 'Marketing Manager',
    content: 'Simple, beautiful, and effective. The monthly reports give me a clear picture of where every shilling goes.',
    rating: 5,
    avatar: 'DM',
  },
  {
    name: 'Grace Akinyi',
    role: 'Teacher',
    content: 'I recommend FedhaFlow to everyone. The budget planner helps me stay on track, and the mobile experience is seamless.',
    rating: 5,
    avatar: 'GA',
  },
];

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Security', href: '/about' },
    { label: 'Roadmap', href: '/about' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/contact' },
    { label: 'Contact', href: '/contact' },
  ],
  resources: [
    { label: 'Help Center', href: '/contact' },
    { label: 'Community', href: '/blog' },
    { label: 'Guides', href: '/blog' },
    { label: 'API Docs', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy', href: '/about' },
    { label: 'Terms', href: '/about' },
    { label: 'Cookies', href: '/about' },
  ],
};

export default function Landing() {
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
              <span className="font-display font-bold text-lg tracking-tight">FedhaFlow</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
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
      <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                #1 Personal Finance App in Kenya
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Your Money,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-ticket to-accent">
                  Your Rules
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Track every shilling, crush your savings goals, and get smart insights — all in one beautiful dashboard built for Kenyans.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                <Link to="/auth">
                  <Button size="lg" className="shadow-lg shadow-primary/25 h-12 px-8">
                    Start Free Today
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    View Plans
                  </Button>
                </Link>
              </div>
              
              {/* Benefits */}
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit.label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <benefit.icon className="w-3.5 h-3.5 text-accent" />
                    </div>
                    {benefit.label}
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                <img 
                  src={heroDashboard} 
                  alt="FedhaFlow Dashboard Preview showing income tracking, savings goals, and expense categories" 
                  className="w-full h-auto"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
              </div>
              {/* Floating elements */}
              <motion.div 
                className="absolute -bottom-4 -left-4 w-20 h-20 rounded-xl overflow-hidden shadow-lg border border-border/50 hidden sm:block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={savingsIllustration} alt="Savings tracker" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                className="absolute -top-4 -right-4 w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-border/50 hidden sm:block"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img src={analyticsIllustration} alt="Financial analytics" className="w-full h-full object-cover" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 border border-accent/20">
              <Zap className="w-3 h-3" />
              Powerful Features
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Master Your Money</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
              From tracking daily expenses to planning long-term goals, FedhaFlow gives you the tools to make every shilling count.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.08, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-border/50 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 lg:mb-14"
          >
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              No complicated setup. Start managing your finances in under 2 minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { step: '01', title: 'Create Your Account', description: 'Sign up for free with your email. No credit card required to get started.', icon: Users },
              { step: '02', title: 'Add Your Finances', description: 'Log income sources and expenses. Set budgets for each category to stay on track.', icon: Wallet },
              { step: '03', title: 'Watch Your Wealth Grow', description: 'Track progress with smart analytics, hit savings goals, and build financial confidence.', icon: TrendingUp },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center p-6 lg:p-8"
              >
                <div className="text-6xl lg:text-7xl font-display font-bold text-primary/10 absolute top-2 left-1/2 -translate-x-1/2">
                  {item.step}
                </div>
                <div className="relative pt-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 lg:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium mb-4 border border-warning/20">
              <Star className="w-3 h-3 fill-warning" />
              4.9/5 Average Rating
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Loved by Thousands of Kenyans
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base lg:text-lg">
              Real stories from real users who transformed their financial lives with FedhaFlow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative px-4 sm:px-12"
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <motion.div 
                      className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-foreground mb-5 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{testimonial.name}</div>
                          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 hidden sm:flex" />
              <CarouselNext className="right-0 hidden sm:flex" />
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* Stats + Image Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 border border-primary/20">
                <Users className="w-3 h-3" />
                Growing Community
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Trusted by <span className="text-primary">10,000+</span> Users Across Kenya
              </h2>
              <p className="text-muted-foreground mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
                From freelancers in Nairobi to business owners in Mombasa, FedhaFlow is the go-to app for smart money management.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '10K+', label: 'Active Users', color: 'text-primary' },
                  { value: 'KSh 2B+', label: 'Money Tracked', color: 'text-accent' },
                  { value: '4.9★', label: 'App Rating', color: 'text-warning' },
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 lg:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                  >
                    <div className={`font-display text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
              className="relative flex justify-center"
            >
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <img 
                  src={savingsIllustration} 
                  alt="Savings growth illustration with piggy bank and coins" 
                  className="relative w-full h-full object-contain drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            className="relative rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-8 sm:p-12 lg:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Take Control?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
                Join 10,000+ Kenyans who are already saving smarter and spending wiser with FedhaFlow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="shadow-xl h-12 px-8">
                    Start Free — No Card Needed
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8">
                    Compare Plans
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-10 sm:py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg">FedhaFlow</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Smart money management for Kenyans 🇰🇪
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:scale-105">
                  <Send className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:scale-105">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:scale-105">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold text-sm mb-4">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Get the latest tips and updates.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button size="sm" className="shrink-0">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} FedhaFlow. Made with ❤️ in Nairobi 🇰🇪
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.legal.map((link) => (
                <a key={link.label} href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
    </PageTransition>
  );
}

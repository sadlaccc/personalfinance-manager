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
  Mail
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
    icon: CircleDollarSign,
    title: 'Manage Expenses',
    description: 'Keep track of where your money goes.',
  },
  {
    icon: Goal,
    title: 'Set Goals',
    description: 'Create savings goals and track progress.',
  },
  {
    icon: LineChart,
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

const testimonials = [
  {
    name: 'Wanjiku Kamau',
    role: 'Freelance Designer',
    content: 'FedhaFlow imebadilisha jinsi ninavyodhibiti pesa zangu. The analytics are incredibly insightful!',
    rating: 5,
    avatar: 'WK',
  },
  {
    name: 'Brian Ochieng',
    role: 'Software Engineer',
    content: 'Finally, a finance app that makes sense for Kenyans. I saved KSh 50,000 in my first month!',
    rating: 5,
    avatar: 'BO',
  },
  {
    name: 'Faith Njeri',
    role: 'Small Business Owner',
    content: 'The goal-setting feature keeps me motivated. I hit my savings target 2 months early!',
    rating: 5,
    avatar: 'FN',
  },
  {
    name: 'David Mwangi',
    role: 'Marketing Manager',
    content: 'Simple, beautiful, and effective. This is exactly what I needed for personal finance.',
    rating: 5,
    avatar: 'DM',
  },
  {
    name: 'Grace Akinyi',
    role: 'Teacher',
    content: 'I recommend FedhaFlow to everyone. Its so easy to use and the insights are game-changing.',
    rating: 5,
    avatar: 'GA',
  },
];

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Security', href: '#' },
    { label: 'Roadmap', href: '#' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '/contact' },
  ],
  resources: [
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Guides', href: '#' },
    { label: 'API Docs', href: '#' },
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Cookies', href: '#' },
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
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
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
                Smart Financial Management
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Take Control of Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-ticket to-accent">
                  Finances
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Track income, manage expenses, and achieve your savings goals with our intuitive personal finance dashboard.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                <Link to="/auth">
                  <Button size="lg" className="shadow-lg shadow-primary/25 h-12 px-8">
                    Start Free Today
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    View Pricing
                  </Button>
                </Link>
              </div>
              
              {/* Benefits */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-success" />
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
                  alt="FedhaFlow Dashboard Preview" 
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
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base lg:text-lg">
              Powerful features to help you manage your finances effectively.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group p-5 sm:p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base lg:text-lg">
              Join thousands of satisfied users transforming their financial lives.
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
                      className="h-full p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-foreground mb-4 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
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
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            >
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
                Trusted by Thousands
              </h2>
              <p className="text-muted-foreground mb-6 lg:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed">
                Join our growing community of users who are taking control of their finances.
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {[
                  { value: '10K+', label: 'Active Users' },
                  { value: '$2M+', label: 'Tracked' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-3 sm:p-4 lg:p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{stat.value}</div>
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
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80">
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
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
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-6 sm:p-10 lg:p-16 text-center overflow-hidden"
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
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4 sm:mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
              </motion.div>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-foreground/80 mb-6 sm:mb-8 max-w-lg mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
                Join thousands of users who are already managing their finances smarter with IncomeFlow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="shadow-xl h-12 px-8">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8">
                    View Pricing
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
          {/* Main Footer */}
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

            {/* Product */}
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

            {/* Company */}
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

            {/* Resources */}
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

            {/* Newsletter */}
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

          {/* Bottom Footer */}
          <div className="py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} FedhaFlow. Made in Nairobi 🇰🇪
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

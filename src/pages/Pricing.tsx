import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, X, Sparkles, Flame, ArrowRight, HelpCircle, TrendingUp, Crown, Download, Users, Building2, Rocket } from 'lucide-react';
import pricingHero from '@/assets/pricing-hero.png';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageTransition } from '@/components/PageTransition';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const personalPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    description: 'Essential tools for personal finance',
    icon: Flame,
    cta: 'Get Started',
    popular: false,
    gradient: 'from-muted to-muted/50',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 149,
    description: 'For multiple income streams',
    icon: TrendingUp,
    cta: 'Start Free Trial',
    popular: false,
    gradient: 'from-ticket/80 to-ticket/40',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 499,
    description: 'Advanced analytics & reporting',
    icon: Sparkles,
    cta: 'Start Free Trial',
    popular: true,
    gradient: 'from-primary to-accent',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1099,
    description: 'AI-powered complete solution',
    icon: Crown,
    cta: 'Go Premium',
    popular: false,
    gradient: 'from-accent to-primary',
  },
];

const businessPlans = [
  {
    id: 'team',
    name: 'Team',
    price: 2499,
    users: 5,
    description: 'Perfect for small teams',
    icon: Users,
    cta: 'Start Team Trial',
    popular: false,
    gradient: 'from-sky-500 to-blue-600',
    features: ['Up to 5 users', 'Shared dashboard', 'Team analytics', 'Priority support'],
  },
  {
    id: 'business',
    name: 'Business',
    price: 7999,
    users: 20,
    description: 'Growing organizations',
    icon: Building2,
    cta: 'Start Business Trial',
    popular: true,
    gradient: 'from-violet-500 to-purple-600',
    features: ['Up to 20 users', 'Advanced reports', 'Role management', 'API access', 'Dedicated support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    users: 'Unlimited',
    description: 'Custom solutions for large orgs',
    icon: Rocket,
    cta: 'Contact Sales',
    popular: false,
    gradient: 'from-amber-500 to-orange-600',
    features: ['Unlimited users', 'Custom integrations', 'SSO & Security', 'SLA guarantee', 'Dedicated manager'],
  },
];

const features = [
  { name: 'Income sources', starter: '1', plus: '5', pro: 'Unlimited', premium: 'Unlimited' },
  { name: 'Expense tracking', starter: 'Basic', plus: 'Advanced', pro: 'Advanced', premium: 'Advanced' },
  { name: 'Expense categories', starter: '5', plus: '15', pro: 'Unlimited', premium: 'Unlimited' },
  { name: 'Monthly reports', starter: true, plus: true, pro: true, premium: true },
  { name: 'Weekly reports', starter: false, plus: true, pro: true, premium: true },
  { name: 'Savings goals', starter: false, plus: 'Basic', pro: 'Full', premium: 'Full' },
  { name: 'Analytics & charts', starter: false, plus: 'Basic', pro: 'Detailed', premium: 'Detailed' },
  { name: 'Export CSV', starter: false, plus: 'Basic', pro: true, premium: true },
  { name: 'Export PDF Reports', starter: false, plus: false, pro: true, premium: true },
  { name: 'Export Excel (.xlsx)', starter: false, plus: false, pro: false, premium: true },
  { name: 'Bulk Data Export', starter: false, plus: false, pro: false, premium: true },
  { name: 'Budget forecasting AI', starter: false, plus: false, pro: false, premium: true },
  { name: 'Custom widgets', starter: false, plus: false, pro: false, premium: true },
  { name: 'Priority support', starter: false, plus: false, pro: true, premium: true },
];

const faqs = [
  {
    question: 'Is there a free trial?',
    answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Absolutely! Upgrade or downgrade anytime. Changes take effect on your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept M-Pesa, credit/debit cards (Visa, Mastercard), and bank transfers.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use bank-level 256-bit SSL encryption. Your data is always protected.',
  },
  {
    question: 'What is included in business plans?',
    answer: 'Business plans include team management, shared dashboards, role-based access control, and dedicated support for your organization.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Pricing() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-income flex items-center justify-center shadow-lg shadow-primary/25">
                  <TrendingUp className="w-4 h-4 text-income-foreground" />
                </div>
                <span className="font-display font-bold text-lg">FedhaFlow</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link to="/landing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
              </nav>

              <div className="flex items-center gap-2">
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

        {/* Hero - Compact with Image */}
        <section className="py-8 sm:py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="container mx-auto px-4 sm:px-6 text-center relative"
          >
            <img 
              src={pricingHero} 
              alt="Financial dashboard" 
              className="w-full max-w-lg mx-auto h-32 sm:h-40 object-cover rounded-2xl mb-4 opacity-80"
            />
            <Badge variant="secondary" className="mb-3 px-3 py-1 backdrop-blur-sm bg-secondary/80">
              <Sparkles className="w-3 h-3 mr-1" />
              Simple Pricing
            </Badge>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
              Choose Your Plan
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
              14-day free trial • No credit card required
            </p>
          </motion.div>
        </section>

        {/* Personal Plans */}
        <section className="pb-10 sm:pb-14">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-1">Personal Plans</h2>
              <p className="text-muted-foreground text-sm">For individuals managing personal finances</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto"
            >
              {personalPlans.map((plan) => (
                <motion.div
                  key={plan.name}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`relative rounded-xl border ${
                    plan.popular
                      ? 'border-primary/50 bg-gradient-to-b from-primary/10 via-background/80 to-background/60 shadow-xl shadow-primary/20 lg:scale-[1.03]'
                      : 'border-border/50 bg-card/40 hover:border-primary/40 hover:bg-card/60'
                  } backdrop-blur-xl p-4 sm:p-5 flex flex-col transition-all duration-300`}
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
                  
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 px-2.5 py-0.5 text-[10px] backdrop-blur-sm">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="relative flex items-center gap-2.5 mb-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg ring-1 ring-white/10`}>
                      <plan.icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold leading-tight">{plan.name}</h3>
                      <p className="text-[11px] text-muted-foreground leading-tight">{plan.description}</p>
                    </div>
                  </div>

                  <div className="relative mb-4">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs text-muted-foreground">KSh</span>
                      <span className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{plan.price}</span>
                      <span className="text-muted-foreground text-xs">/mo</span>
                    </div>
                  </div>

                  {(plan.id === 'pro' || plan.id === 'premium') && (
                    <div className="relative flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-accent/10 border border-accent/20 w-fit">
                      <Download className="w-3 h-3 text-accent" />
                      <span className="text-[10px] font-medium text-accent">
                        {plan.id === 'premium' ? 'Full Export Suite' : 'PDF & CSV Export'}
                      </span>
                    </div>
                  )}

                  <Link to="/auth" className="relative w-full mt-auto">
                    <Button
                      className={`w-full text-sm ${plan.popular ? 'shadow-lg shadow-primary/25 ring-1 ring-primary/20' : 'ring-1 ring-border/50'}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="sm"
                    >
                      {plan.cta}
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Business Plans */}
        <section className="py-10 sm:py-14 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <Badge variant="secondary" className="mb-3 px-3 py-1">
                <Building2 className="w-3 h-3 mr-1" />
                For Teams
              </Badge>
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-1">Business Plans</h2>
              <p className="text-muted-foreground text-sm">Collaborative finance management for organizations</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
            >
              {businessPlans.map((plan) => (
                <motion.div
                  key={plan.name}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`relative rounded-xl border ${
                    plan.popular
                      ? 'border-violet-500/50 bg-gradient-to-b from-violet-500/10 via-background/80 to-background/60 shadow-xl shadow-violet-500/20'
                      : 'border-border/50 bg-card/40 hover:border-primary/40 hover:bg-card/60'
                  } backdrop-blur-xl p-5 sm:p-6 flex flex-col transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg px-2.5 py-0.5 text-[10px]">
                        Best Value
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                      <plan.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    {plan.price ? (
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs text-muted-foreground">KSh</span>
                        <span className="text-3xl font-bold">{plan.price.toLocaleString()}</span>
                        <span className="text-muted-foreground text-xs">/mo</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold">Custom Pricing</span>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {typeof plan.users === 'number' ? `Up to ${plan.users} users` : 'Unlimited users'}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.id === 'enterprise' ? '/contact' : '/auth'} className="w-full">
                    <Button
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="sm"
                    >
                      {plan.cta}
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Feature Comparison - Compact */}
        <section className="py-10 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6"
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-1">Compare Personal Features</h2>
              <p className="text-muted-foreground text-sm">See what's included in each plan</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto overflow-x-auto"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="w-[180px] text-xs">Feature</TableHead>
                    {personalPlans.map((plan) => (
                      <TableHead key={plan.id} className="text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <plan.icon className={`w-4 h-4 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="text-xs font-medium">{plan.name}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((feature) => (
                    <TableRow key={feature.name} className="border-border/30">
                      <TableCell className="font-medium text-xs py-2">{feature.name}</TableCell>
                      {(['starter', 'plus', 'pro', 'premium'] as const).map((plan) => {
                        const value = feature[plan];
                        return (
                          <TableCell key={plan} className="text-center py-2">
                            {value === true ? (
                              <CheckCircle2 className="w-4 h-4 text-success mx-auto" />
                            ) : value === false ? (
                              <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                            ) : (
                              <span className="text-xs">{value}</span>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>
        </section>

        {/* FAQ - Compact */}
        <section className="py-10 sm:py-12 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-1">FAQs</h2>
              <p className="text-muted-foreground text-sm">Quick answers to common questions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl mx-auto"
            >
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-lg px-4 data-[state=open]:shadow-sm transition-shadow"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-3">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm pb-3">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* CTA - Compact */}
        <section className="py-10 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-6 sm:p-8 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
              <div className="relative">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-primary-foreground mb-2">
                  Ready to Start?
                </h2>
                <p className="text-primary-foreground/80 mb-5 text-sm max-w-sm mx-auto">
                  Join thousands managing their finances smarter.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link to="/auth">
                    <Button size="sm" variant="secondary" className="shadow-lg">
                      Start Free Trial
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer - Compact */}
        <footer className="py-6 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-income flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-income-foreground" />
                </div>
                <span className="font-display font-bold text-sm">FedhaFlow</span>
              </div>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} FedhaFlow. Made in Nairobi 🇰🇪
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}